import pytest
import json
from datetime import datetime
from app import db, create_app
from app.models import Theme, TestRun
from app.services.test_service import TestService


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
        theme_id = theme.id
        db.session.expunge(theme)
        return {'id': theme_id, 'name': 'Test Theme'}


def test_run_automated_test(app, sample_theme):
    """Test automated test execution creates TestRun record"""
    with app.app_context():
        test_service = TestService()
        result = test_service.run_automated_test(sample_theme['id'])
        
        assert 'test_run_id' in result
        assert result['status'] in ['passed', 'failed']
        assert 'duration_seconds' in result
        
        # Verify test run was saved
        test_run = TestRun.query.get(result['test_run_id'])
        assert test_run is not None
        assert test_run.test_type == 'automated'
        assert test_run.theme_id == sample_theme['id']


def test_record_manual_test(app, sample_theme):
    """Test manual test recording"""
    with app.app_context():
        test_service = TestService()
        result = test_service.record_manual_test(
            sample_theme['id'],
            'user@example.com',
            passed=True,
            notes='Manual verification completed'
        )
        
        assert result['test_type'] == 'manual'
        assert result['triggered_by'] == 'user@example.com'
        assert result['status'] == 'passed'


def test_can_publish_without_tests(app, sample_theme):
    """Test can_publish returns False when no tests run"""
    with app.app_context():
        test_service = TestService()
        result = test_service.can_publish(sample_theme['id'])
        
        assert result['can_publish'] == False
        assert 'No tests' in result['reason']


def test_can_publish_after_passed_tests(app, sample_theme):
    """Test can_publish returns True after tests pass"""
    with app.app_context():
        test_service = TestService()
        
        # Run automated test (will pass in mock)
        test_service.run_automated_test(sample_theme['id'])
        
        # Check can publish
        result = test_service.can_publish(sample_theme['id'])
        
        assert result['can_publish'] == True
        assert 'passed' in result['reason'].lower()

