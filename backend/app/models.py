from app import db
from datetime import datetime
from sqlalchemy import Index, CheckConstraint
from sqlalchemy.orm import validates
import re

class Theme(db.Model):
    """Modelo para temas/relatórios configuráveis (Trabalho Híbrido, Health Check, etc.)"""
    __tablename__ = 'themes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), nullable=False, default='draft')  # draft, testing, approved, published
    display_order = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_editor = db.Column(db.String(100), nullable=True)
    
    # Relationships
    data_sources = db.relationship('DataSource', backref='theme', lazy='dynamic', cascade='all, delete-orphan', order_by='DataSource.display_order')
    ingestion_runs = db.relationship('IngestionRun', backref='theme', lazy='dynamic', cascade='all, delete-orphan')
    test_runs = db.relationship('TestRun', backref='theme', lazy='dynamic', cascade='all, delete-orphan')
    
    __table_args__ = (
        CheckConstraint("status IN ('draft', 'testing', 'approved', 'published')", name='check_theme_status'),
        Index('idx_theme_status', 'status'),
        Index('idx_theme_order', 'display_order'),
    )
    
    @validates('status')
    def validate_status(self, key, value):
        allowed = ['draft', 'testing', 'approved', 'published']
        if value not in allowed:
            raise ValueError(f"Status must be one of {allowed}")
        return value
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'status': self.status,
            'display_order': self.display_order,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'last_editor': self.last_editor,
            'data_sources_count': self.data_sources.count()
        }


class DataSource(db.Model):
    """Modelo para fontes de dados SharePoint por tema"""
    __tablename__ = 'data_sources'
    
    id = db.Column(db.Integer, primary_key=True)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id', ondelete='CASCADE'), nullable=False)
    sharepoint_url = db.Column(db.Text, nullable=False)
    source_name = db.Column(db.String(200), nullable=True)  # Nome amigável opcional
    source_type = db.Column(db.String(50), nullable=False, default='sharepoint')
    display_order = db.Column(db.Integer, nullable=False, default=0)
    last_read_at = db.Column(db.DateTime, nullable=True)
    last_file_modified = db.Column(db.DateTime, nullable=True)
    file_path = db.Column(db.Text, nullable=True)  # Caminho completo do arquivo
    sheets_count = db.Column(db.Integer, nullable=True)  # Quantidade de abas detectadas
    rows_count = db.Column(db.Integer, nullable=True)  # Quantidade de linhas total
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_datasource_theme', 'theme_id'),
        Index('idx_datasource_theme_order', 'theme_id', 'display_order'),
        Index('idx_datasource_last_read', 'last_read_at'),
    )
    
    @validates('sharepoint_url')
    def validate_url(self, key, value):
        if not value:
            raise ValueError("SharePoint URL cannot be empty")
        # Basic URL validation
        url_pattern = re.compile(
            r'^https?://'  # http:// or https://
            r'(?:(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,6}\.?|'  # domain...
            r'localhost|'  # localhost...
            r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})'  # ...or ip
            r'(?::\d+)?'  # optional port
            r'(?:/?|[/?]\S+)$', re.IGNORECASE)
        if not url_pattern.match(value):
            raise ValueError("Invalid URL format")
        return value
    
    def to_dict(self):
        return {
            'id': self.id,
            'theme_id': self.theme_id,
            'sharepoint_url': self.sharepoint_url,
            'source_name': self.source_name,
            'source_type': self.source_type,
            'display_order': self.display_order,
            'last_read_at': self.last_read_at.isoformat() if self.last_read_at else None,
            'last_file_modified': self.last_file_modified.isoformat() if self.last_file_modified else None,
            'file_path': self.file_path,
            'sheets_count': self.sheets_count,
            'rows_count': self.rows_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }


class IngestionRun(db.Model):
    """Modelo para logs de execuções de ingestão (automática 07h ou manual)"""
    __tablename__ = 'ingestion_runs'
    
    id = db.Column(db.Integer, primary_key=True)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id', ondelete='CASCADE'), nullable=True)  # Null = execução global
    trigger_type = db.Column(db.String(20), nullable=False)  # 'automatic' ou 'manual'
    triggered_by = db.Column(db.String(100), nullable=True)  # Usuário que acionou (se manual)
    status = db.Column(db.String(20), nullable=False)  # 'running', 'success', 'failed'
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    duration_seconds = db.Column(db.Float, nullable=True)
    rows_imported = db.Column(db.Integer, nullable=True)
    changes_detected = db.Column(db.Integer, nullable=True)
    error_message = db.Column(db.Text, nullable=True)
    
    __table_args__ = (
        CheckConstraint("trigger_type IN ('automatic', 'manual')", name='check_trigger_type'),
        CheckConstraint("status IN ('running', 'success', 'failed')", name='check_ingestion_status'),
        Index('idx_ingestion_theme', 'theme_id'),
        Index('idx_ingestion_started', 'started_at'),
        Index('idx_ingestion_status', 'status'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'theme_id': self.theme_id,
            'trigger_type': self.trigger_type,
            'triggered_by': self.triggered_by,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_seconds': self.duration_seconds,
            'rows_imported': self.rows_imported,
            'changes_detected': self.changes_detected,
            'error_message': self.error_message
        }


class TestRun(db.Model):
    """Modelo para logs de testes (Playwright + manual)"""
    __tablename__ = 'test_runs'
    
    id = db.Column(db.Integer, primary_key=True)
    theme_id = db.Column(db.Integer, db.ForeignKey('themes.id', ondelete='CASCADE'), nullable=False)
    test_type = db.Column(db.String(20), nullable=False)  # 'automated' ou 'manual'
    triggered_by = db.Column(db.String(100), nullable=True)
    status = db.Column(db.String(20), nullable=False)  # 'running', 'passed', 'failed'
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime, nullable=True)
    duration_seconds = db.Column(db.Float, nullable=True)
    result_details = db.Column(db.Text, nullable=True)  # JSON ou texto com detalhes
    error_message = db.Column(db.Text, nullable=True)
    
    __table_args__ = (
        CheckConstraint("test_type IN ('automated', 'manual')", name='check_test_type'),
        CheckConstraint("status IN ('running', 'passed', 'failed')", name='check_test_status'),
        Index('idx_test_theme', 'theme_id'),
        Index('idx_test_started', 'started_at'),
        Index('idx_test_status', 'status'),
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'theme_id': self.theme_id,
            'test_type': self.test_type,
            'triggered_by': self.triggered_by,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'duration_seconds': self.duration_seconds,
            'result_details': self.result_details,
            'error_message': self.error_message
        }


class Tribe(db.Model):
    """Modelo para tribos organizacionais"""
    __tablename__ = 'tribes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.Text, nullable=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    squads = db.relationship('Squad', backref='tribe', lazy='dynamic', cascade='all, delete-orphan', order_by='Squad.display_order')
    
    __table_args__ = (
        Index('idx_tribe_active', 'active'),
        Index('idx_tribe_order', 'display_order'),
    )
    
    def to_dict(self, include_squads=False):
        result = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'display_order': self.display_order,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'squads_count': self.squads.filter_by(active=True).count() if include_squads else None
        }
        
        if include_squads:
            result['squads'] = [squad.to_dict() for squad in self.squads.filter_by(active=True).order_by(Squad.display_order)]
        
        return result


class Squad(db.Model):
    """Modelo para squads organizacionais (pertencem a uma tribo)"""
    __tablename__ = 'squads'
    
    id = db.Column(db.Integer, primary_key=True)
    tribe_id = db.Column(db.Integer, db.ForeignKey('tribes.id', ondelete='CASCADE'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    display_order = db.Column(db.Integer, nullable=False, default=0)
    active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    __table_args__ = (
        Index('idx_squad_tribe', 'tribe_id'),
        Index('idx_squad_active', 'active'),
        Index('idx_squad_tribe_order', 'tribe_id', 'display_order'),
    )
    
    def to_dict(self, include_tribe=False):
        result = {
            'id': self.id,
            'tribe_id': self.tribe_id,
            'name': self.name,
            'description': self.description,
            'display_order': self.display_order,
            'active': self.active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_tribe:
            result['tribe'] = self.tribe.to_dict() if self.tribe else None
        
        return result

