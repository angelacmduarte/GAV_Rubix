import pytest
import sys
import os
from datetime import datetime

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import db, create_app
from app.models import Theme, DataSource, IngestionRun, TestRun


@pytest.fixture
def app():
    """Create application for testing"""
    app = create_app('development')
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
    
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


def test_theme_creation_and_validation(app):
    """Test Theme model creation and status validation"""
    with app.app_context():
        # Test valid theme creation
        theme = Theme(
            name='Trabalho Híbrido',
            description='Relatório de trabalho híbrido',
            status='draft',
            display_order=1
        )
        db.session.add(theme)
        db.session.commit()
        
        assert theme.id is not None
        assert theme.name == 'Trabalho Híbrido'
        assert theme.status == 'draft'
        
        # Test status validation
        with pytest.raises(ValueError):
            theme.status = 'invalid_status'
        
        # Test unique constraint on name
        duplicate = Theme(name='Trabalho Híbrido', status='draft')
        db.session.add(duplicate)
        with pytest.raises(Exception):  # SQLAlchemy raises IntegrityError
            db.session.commit()


def test_datasource_url_validation_and_multiple_sources(app):
    """Test DataSource URL validation and multiple sources per theme"""
    with app.app_context():
        theme = Theme(name='Trabalho Híbrido', status='draft', display_order=1)
        db.session.add(theme)
        db.session.commit()
        
        # Test valid URL
        source1 = DataSource(
            theme_id=theme.id,
            sharepoint_url='https://example.sharepoint.com/sites/test/file.xlsx',
            source_name='Fonte 1',
            display_order=1
        )
        db.session.add(source1)
        db.session.commit()
        
        assert source1.id is not None
        assert source1.sharepoint_url.startswith('https://')
        
        # Test invalid URL - validation happens during object creation
        with pytest.raises(ValueError, match="Invalid URL format"):
            source2 = DataSource(
                theme_id=theme.id,
                sharepoint_url='not-a-valid-url',
                display_order=2
            )
        
        # Test multiple sources per theme (Trabalho Híbrido requirement)
        source2 = DataSource(
            theme_id=theme.id,
            sharepoint_url='https://example.sharepoint.com/sites/test/file2.xlsx',
            display_order=2
        )
        db.session.add(source2)
        db.session.commit()
        
        assert theme.data_sources.count() == 2


def test_ingestion_run_tracking(app):
    """Test IngestionRun model tracks automatic and manual runs"""
    with app.app_context():
        theme = Theme(name='Health Check', status='published', display_order=2)
        db.session.add(theme)
        db.session.commit()
        
        # Test automatic run
        auto_run = IngestionRun(
            theme_id=theme.id,
            trigger_type='automatic',
            status='success',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            duration_seconds=45.5,
            rows_imported=150
        )
        db.session.add(auto_run)
        db.session.commit()
        
        assert auto_run.trigger_type == 'automatic'
        assert auto_run.rows_imported == 150
        
        # Test manual run
        manual_run = IngestionRun(
            theme_id=theme.id,
            trigger_type='manual',
            triggered_by='user@example.com',
            status='success',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            duration_seconds=12.3
        )
        db.session.add(manual_run)
        db.session.commit()
        
        assert manual_run.trigger_type == 'manual'
        assert manual_run.triggered_by == 'user@example.com'
        assert theme.ingestion_runs.count() == 2


def test_test_run_workflow(app):
    """Test TestRun model for automated and manual test tracking"""
    with app.app_context():
        theme = Theme(name='1-1s', status='testing', display_order=3)
        db.session.add(theme)
        db.session.commit()
        
        # Test automated test run
        auto_test = TestRun(
            theme_id=theme.id,
            test_type='automated',
            status='passed',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            duration_seconds=8.2,
            result_details='{"screenshots": 3, "assertions": 15}'
        )
        db.session.add(auto_test)
        db.session.commit()
        
        assert auto_test.test_type == 'automated'
        assert auto_test.status == 'passed'
        
        # Test manual test confirmation
        manual_test = TestRun(
            theme_id=theme.id,
            test_type='manual',
            triggered_by='admin@example.com',
            status='passed',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow()
        )
        db.session.add(manual_test)
        db.session.commit()
        
        assert manual_test.test_type == 'manual'
        assert theme.test_runs.count() == 2

