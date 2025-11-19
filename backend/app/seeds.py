"""
Seed data for initial themes and data sources
Run this after migrations to populate base data
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import db
from app.models import Theme, DataSource, Tribe, Squad


def seed_initial_data():
    """Create initial themes with their data sources"""
    
    themes_data = [
        {
            'name': 'Trabalho Híbrido',
            'description': 'Relatório de trabalho híbrido e presença',
            'status': 'draft',
            'display_order': 1,
            'data_sources': [
                {
                    'sharepoint_url': 'https://example.sharepoint.com/sites/rubix/trabalho-hibrido-1.xlsx',
                    'source_name': 'Fonte Principal - Trabalho Híbrido',
                    'display_order': 1
                },
                {
                    'sharepoint_url': 'https://example.sharepoint.com/sites/rubix/trabalho-hibrido-2.xlsx',
                    'source_name': 'Fonte Secundária - Trabalho Híbrido',
                    'display_order': 2
                }
            ]
        },
        {
            'name': 'Health Check',
            'description': 'Relatório de health check dos times',
            'status': 'draft',
            'display_order': 2,
            'data_sources': [
                {
                    'sharepoint_url': 'https://example.sharepoint.com/sites/rubix/health-check.xlsx',
                    'source_name': 'Health Check Principal',
                    'display_order': 1
                }
            ]
        },
        {
            'name': '1-1s',
            'description': 'Relatório de 1-1s realizados',
            'status': 'draft',
            'display_order': 3,
            'data_sources': [
                {
                    'sharepoint_url': 'https://example.sharepoint.com/sites/rubix/1-1s.xlsx',
                    'source_name': '1-1s Principal',
                    'display_order': 1
                }
            ]
        },
        {
            'name': 'Feedbacks',
            'description': 'Relatório de feedbacks coletados',
            'status': 'draft',
            'display_order': 4,
            'data_sources': [
                {
                    'sharepoint_url': 'https://example.sharepoint.com/sites/rubix/feedbacks.xlsx',
                    'source_name': 'Feedbacks Principal',
                    'display_order': 1
                }
            ]
        }
    ]
    
    for theme_data in themes_data:
        # Check if theme already exists
        existing = Theme.query.filter_by(name=theme_data['name']).first()
        if existing:
            continue
        
        data_sources = theme_data.pop('data_sources', [])
        theme = Theme(**theme_data)
        db.session.add(theme)
        db.session.flush()  # Get theme.id
        
        for ds_data in data_sources:
            ds = DataSource(theme_id=theme.id, **ds_data)
            db.session.add(ds)
    
    db.session.commit()
    print("Theme seed data created successfully!")


def seed_tribes_and_squads():
    """Create initial tribes and squads"""
    
    tribes_data = [
        {
            'name': 'Tribo de Produto',
            'description': 'Tribo responsável por produtos e soluções',
            'display_order': 1,
            'squads': [
                {'name': 'Squad Frontend', 'description': 'Squad de desenvolvimento frontend', 'display_order': 1},
                {'name': 'Squad Backend', 'description': 'Squad de desenvolvimento backend', 'display_order': 2},
                {'name': 'Squad Mobile', 'description': 'Squad de desenvolvimento mobile', 'display_order': 3}
            ]
        },
        {
            'name': 'Tribo de Plataforma',
            'description': 'Tribo responsável por infraestrutura e plataforma',
            'display_order': 2,
            'squads': [
                {'name': 'Squad DevOps', 'description': 'Squad de DevOps e infraestrutura', 'display_order': 1},
                {'name': 'Squad SRE', 'description': 'Squad de Site Reliability Engineering', 'display_order': 2}
            ]
        },
        {
            'name': 'Tribo de Dados',
            'description': 'Tribo responsável por dados e analytics',
            'display_order': 3,
            'squads': [
                {'name': 'Squad Analytics', 'description': 'Squad de analytics e BI', 'display_order': 1},
                {'name': 'Squad Data Engineering', 'description': 'Squad de engenharia de dados', 'display_order': 2}
            ]
        }
    ]
    
    for tribe_data in tribes_data:
        # Check if tribe already exists
        existing = Tribe.query.filter_by(name=tribe_data['name']).first()
        if existing:
            continue
        
        squads = tribe_data.pop('squads', [])
        tribe = Tribe(**tribe_data)
        db.session.add(tribe)
        db.session.flush()  # Get tribe.id
        
        for squad_data in squads:
            squad = Squad(tribe_id=tribe.id, **squad_data)
            db.session.add(squad)
    
    db.session.commit()
    print("Tribes and squads seed data created successfully!")


def seed_all():
    """Seed all initial data"""
    seed_initial_data()
    seed_tribes_and_squads()
    print("All seed data created successfully!")


if __name__ == '__main__':
    from app import create_app
    app = create_app()
    with app.app_context():
        seed_all()

