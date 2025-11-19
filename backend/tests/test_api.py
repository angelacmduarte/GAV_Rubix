import pytest
import json
from datetime import datetime
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


@pytest.fixture
def sample_theme(app):
    """Create a sample theme for testing"""
    with app.app_context():
        theme = Theme(
            name='Test Theme',
            description='Test description',
            status='draft',
            display_order=1
        )
        db.session.add(theme)
        db.session.commit()
        theme_id = theme.id  # Store ID before detaching
        db.session.expunge(theme)  # Detach from session
        return {'id': theme_id, 'name': 'Test Theme'}


def test_get_themes_empty(client):
    """Test GET /api/admin/themes returns empty list when no themes exist"""
    response = client.get('/api/admin/themes')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) == 0


def test_create_theme(client):
    """Test POST /api/admin/themes creates a new theme"""
    response = client.post('/api/admin/themes', 
        json={
            'name': 'New Theme',
            'description': 'New theme description',
            'status': 'draft',
            'display_order': 1
        },
        content_type='application/json'
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['name'] == 'New Theme'
    assert data['status'] == 'draft'
    assert 'id' in data


def test_create_theme_duplicate_name(client, sample_theme):
    """Test POST /api/admin/themes rejects duplicate theme names"""
    response = client.post('/api/admin/themes',
        json={
            'name': 'Test Theme',  # Same as sample_theme
            'description': 'Duplicate',
            'status': 'draft'
        },
        content_type='application/json'
    )
    assert response.status_code == 400
    data = json.loads(response.data)
    assert 'error' in data


def test_get_theme_by_id(client, sample_theme):
    """Test GET /api/admin/themes/<id> returns specific theme"""
    response = client.get(f'/api/admin/themes/{sample_theme["id"]}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Test Theme'
    assert 'data_sources' in data


def test_update_theme(client, sample_theme):
    """Test PUT /api/admin/themes/<id> updates theme"""
    response = client.put(f'/api/admin/themes/{sample_theme["id"]}',
        json={
            'name': 'Updated Theme',
            'status': 'published',
            'description': 'Updated description'
        },
        content_type='application/json'
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['name'] == 'Updated Theme'
    assert data['status'] == 'published'


def test_add_data_source_to_theme(client, sample_theme):
    """Test POST /api/admin/themes/<id>/data-sources adds data source"""
    response = client.post(f'/api/admin/themes/{sample_theme["id"]}/data-sources',
        json={
            'sharepoint_url': 'https://example.sharepoint.com/sites/test/file.xlsx',
            'source_name': 'Test Source',
            'display_order': 1
        },
        content_type='application/json'
    )
    assert response.status_code == 201
    data = json.loads(response.data)
    assert data['sharepoint_url'].startswith('https://')
    assert 'read_info' in data
    assert 'sheets' in data['read_info']


def test_get_ingestion_runs(client, sample_theme):
    """Test GET /api/admin/ingestion-runs returns ingestion history"""
    # Create a test ingestion run
    with client.application.app_context():
        run = IngestionRun(
            theme_id=sample_theme['id'],
            trigger_type='manual',
            triggered_by='test@example.com',
            status='success',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            duration_seconds=10.5,
            rows_imported=100
        )
        db.session.add(run)
        db.session.commit()
    
    response = client.get(f'/api/admin/ingestion-runs?theme_id={sample_theme["id"]}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    if len(data) > 0:
        assert data[0]['trigger_type'] in ['automatic', 'manual']


def test_get_system_status(client, sample_theme):
    """Test GET /api/admin/status returns system-wide status"""
    response = client.get('/api/admin/status')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'themes_total' in data
    assert 'themes_published' in data
    assert 'last_automatic_run' in data
    assert 'last_manual_run' in data
    assert 'recent_alerts' in data


def test_trigger_manual_ingestion(client, sample_theme):
    """Test POST /api/admin/ingest triggers manual ingestion"""
    # First, publish the theme
    with client.application.app_context():
        theme = Theme.query.get(sample_theme['id'])
        theme.status = 'published'
        db.session.commit()
    
    response = client.post('/api/admin/ingest',
        json={
            'theme_id': sample_theme['id'],
            'triggered_by': 'test@example.com'
        },
        content_type='application/json'
    )
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'success' in data
    assert 'rows_imported' in data

