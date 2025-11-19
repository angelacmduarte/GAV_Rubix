"""
Flask application entry point for migrations
"""
import os
import sys

# Add backend directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models import Theme, DataSource, IngestionRun, TestRun

app = create_app()

@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Theme': Theme, 'DataSource': DataSource, 
            'IngestionRun': IngestionRun, 'TestRun': TestRun}


