from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os
import sys

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

db = SQLAlchemy()
migrate = Migrate()

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Database configuration
    if config_name == 'production':
        app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
    else:
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///gav_rubix.db'
    
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = False
    
    db.init_app(app)
    migrate.init_app(app, db)
    
    # Register blueprints
    from app.routes import admin_bp
    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    
    # Start scheduler for automatic ingestion at 07:00
    from app.services.scheduler_service import SchedulerService
    scheduler = SchedulerService()
    scheduler.start_scheduler(app)
    
    return app

