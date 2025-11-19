from flask import Blueprint, request, jsonify, current_app
from app import db
from app.models import Theme, DataSource, IngestionRun, TestRun, Tribe, Squad
from app.services.sharepoint_service import SharePointService
from app.services.scheduler_service import SchedulerService
from app.services.test_service import TestService
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

admin_bp = Blueprint('admin', __name__)
sharepoint_service = SharePointService()
scheduler_service = SchedulerService()
test_service = TestService()


@admin_bp.route('/themes', methods=['GET'])
def get_themes():
    """List all themes with their data sources"""
    try:
        themes = Theme.query.order_by(Theme.display_order).all()
        result = []
        for theme in themes:
            theme_data = theme.to_dict()
            theme_data['data_sources'] = [ds.to_dict() for ds in theme.data_sources.order_by(DataSource.display_order)]
            result.append(theme_data)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching themes: {str(e)}")
        return jsonify({'error': 'Failed to fetch themes'}), 500


@admin_bp.route('/themes/<int:theme_id>', methods=['GET'])
def get_theme(theme_id):
    """Get a specific theme with details"""
    try:
        theme = Theme.query.get_or_404(theme_id)
        theme_data = theme.to_dict()
        theme_data['data_sources'] = [ds.to_dict() for ds in theme.data_sources.order_by(DataSource.display_order)]
        theme_data['last_ingestion'] = None
        theme_data['last_test'] = None
        
        # Get last ingestion run
        last_ingestion = theme.ingestion_runs.order_by(IngestionRun.started_at.desc()).first()
        if last_ingestion:
            theme_data['last_ingestion'] = last_ingestion.to_dict()
        
        # Get last test run
        last_test = theme.test_runs.order_by(TestRun.started_at.desc()).first()
        if last_test:
            theme_data['last_test'] = last_test.to_dict()
        
        return jsonify(theme_data), 200
    except Exception as e:
        logger.error(f"Error fetching theme {theme_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch theme'}), 500


@admin_bp.route('/themes', methods=['POST'])
def create_theme():
    """Create a new theme"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        # Check if theme with same name exists
        existing = Theme.query.filter_by(name=data['name']).first()
        if existing:
            return jsonify({'error': 'Theme with this name already exists'}), 400
        
        theme = Theme(
            name=data['name'],
            description=data.get('description'),
            status=data.get('status', 'draft'),
            display_order=data.get('display_order', 0),
            last_editor=data.get('last_editor')
        )
        
        db.session.add(theme)
        db.session.commit()
        
        return jsonify(theme.to_dict()), 201
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating theme: {str(e)}")
        return jsonify({'error': 'Failed to create theme'}), 500


@admin_bp.route('/themes/<int:theme_id>', methods=['PUT'])
def update_theme(theme_id):
    """Update a theme"""
    try:
        theme = Theme.query.get_or_404(theme_id)
        data = request.get_json()
        
        if 'name' in data:
            # Check if new name conflicts with existing theme
            existing = Theme.query.filter_by(name=data['name']).first()
            if existing and existing.id != theme_id:
                return jsonify({'error': 'Theme with this name already exists'}), 400
            theme.name = data['name']
        
        if 'description' in data:
            theme.description = data['description']
        
        if 'status' in data:
            theme.status = data['status']
        
        if 'display_order' in data:
            theme.display_order = data['display_order']
        
        if 'last_editor' in data:
            theme.last_editor = data['last_editor']
        
        theme.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(theme.to_dict()), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating theme {theme_id}: {str(e)}")
        return jsonify({'error': 'Failed to update theme'}), 500


@admin_bp.route('/themes/<int:theme_id>', methods=['DELETE'])
def delete_theme(theme_id):
    """Delete a theme (cascade deletes data sources and runs)"""
    try:
        theme = Theme.query.get_or_404(theme_id)
        db.session.delete(theme)
        db.session.commit()
        return jsonify({'message': 'Theme deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting theme {theme_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete theme'}), 500


@admin_bp.route('/themes/<int:theme_id>/data-sources', methods=['POST'])
def add_data_source(theme_id):
    """Add a data source to a theme"""
    try:
        theme = Theme.query.get_or_404(theme_id)
        data = request.get_json()
        
        if not data.get('sharepoint_url'):
            return jsonify({'error': 'sharepoint_url is required'}), 400
        
        # Validate URL format
        validation = sharepoint_service.validate_connection(data['sharepoint_url'])
        if not validation['valid']:
            return jsonify({'error': validation['error']}), 400
        
        # Read file metadata
        file_info = sharepoint_service.read_file_metadata(data['sharepoint_url'])
        excel_info = sharepoint_service.read_excel_sheets(data['sharepoint_url'])
        
        data_source = DataSource(
            theme_id=theme_id,
            sharepoint_url=data['sharepoint_url'],
            source_name=data.get('source_name'),
            source_type=data.get('source_type', 'sharepoint'),
            display_order=data.get('display_order', theme.data_sources.count() + 1),
            file_path=file_info.get('file_path'),
            last_file_modified=file_info.get('last_modified'),
            sheets_count=len(excel_info.get('sheets', [])),
            rows_count=excel_info.get('rows_count', 0),
            last_read_at=datetime.utcnow()
        )
        
        db.session.add(data_source)
        db.session.commit()
        
        result = data_source.to_dict()
        result['read_info'] = {
            'sheets': excel_info.get('sheets', []),
            'rows_count': excel_info.get('rows_count', 0),
            'sheets_detail': excel_info.get('sheets_detail', {})
        }
        
        return jsonify(result), 201
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error adding data source: {str(e)}")
        return jsonify({'error': 'Failed to add data source'}), 500


@admin_bp.route('/data-sources/<int:data_source_id>', methods=['PUT'])
def update_data_source(data_source_id):
    """Update a data source"""
    try:
        data_source = DataSource.query.get_or_404(data_source_id)
        data = request.get_json()
        
        if 'sharepoint_url' in data:
            # Validate new URL
            validation = sharepoint_service.validate_connection(data['sharepoint_url'])
            if not validation['valid']:
                return jsonify({'error': validation['error']}), 400
            
            data_source.sharepoint_url = data['sharepoint_url']
            # Re-read file info
            file_info = sharepoint_service.read_file_metadata(data['sharepoint_url'])
            excel_info = sharepoint_service.read_excel_sheets(data['sharepoint_url'])
            data_source.file_path = file_info.get('file_path')
            data_source.last_file_modified = file_info.get('last_modified')
            data_source.sheets_count = len(excel_info.get('sheets', []))
            data_source.rows_count = excel_info.get('rows_count', 0)
            data_source.last_read_at = datetime.utcnow()
        
        if 'source_name' in data:
            data_source.source_name = data['source_name']
        
        if 'display_order' in data:
            data_source.display_order = data['display_order']
        
        data_source.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify(data_source.to_dict()), 200
    except ValueError as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating data source {data_source_id}: {str(e)}")
        return jsonify({'error': 'Failed to update data source'}), 500


@admin_bp.route('/data-sources/<int:data_source_id>', methods=['DELETE'])
def delete_data_source(data_source_id):
    """Delete a data source"""
    try:
        data_source = DataSource.query.get_or_404(data_source_id)
        db.session.delete(data_source)
        db.session.commit()
        return jsonify({'message': 'Data source deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deleting data source {data_source_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete data source'}), 500


@admin_bp.route('/ingestion-runs', methods=['GET'])
def get_ingestion_runs():
    """Get ingestion run history with optional filters"""
    try:
        theme_id = request.args.get('theme_id', type=int)
        limit = request.args.get('limit', 50, type=int)
        status = request.args.get('status')
        
        query = IngestionRun.query
        
        if theme_id:
            query = query.filter_by(theme_id=theme_id)
        
        if status:
            query = query.filter_by(status=status)
        
        runs = query.order_by(IngestionRun.started_at.desc()).limit(limit).all()
        
        return jsonify([run.to_dict() for run in runs]), 200
    except Exception as e:
        logger.error(f"Error fetching ingestion runs: {str(e)}")
        return jsonify({'error': 'Failed to fetch ingestion runs'}), 500


@admin_bp.route('/test-runs', methods=['GET'])
def get_test_runs():
    """Get test run history with optional filters"""
    try:
        theme_id = request.args.get('theme_id', type=int)
        limit = request.args.get('limit', 50, type=int)
        status = request.args.get('status')
        
        query = TestRun.query
        
        if theme_id:
            query = query.filter_by(theme_id=theme_id)
        
        if status:
            query = query.filter_by(status=status)
        
        runs = query.order_by(TestRun.started_at.desc()).limit(limit).all()
        
        return jsonify([run.to_dict() for run in runs]), 200
    except Exception as e:
        logger.error(f"Error fetching test runs: {str(e)}")
        return jsonify({'error': 'Failed to fetch test runs'}), 500


@admin_bp.route('/status', methods=['GET'])
def get_system_status():
    """Get system-wide status including last automatic run"""
    try:
        # Get last automatic ingestion run
        last_auto = IngestionRun.query.filter_by(
            trigger_type='automatic'
        ).order_by(IngestionRun.started_at.desc()).first()
        
        # Get last manual ingestion run
        last_manual = IngestionRun.query.filter_by(
            trigger_type='manual'
        ).order_by(IngestionRun.started_at.desc()).first()
        
        # Get recent alerts (failed runs)
        recent_failures = IngestionRun.query.filter_by(
            status='failed'
        ).order_by(IngestionRun.started_at.desc()).limit(5).all()
        
        # Count themes
        themes_count = Theme.query.count()
        published_count = Theme.query.filter_by(status='published').count()
        
        return jsonify({
            'last_automatic_run': last_auto.to_dict() if last_auto else None,
            'last_manual_run': last_manual.to_dict() if last_manual else None,
            'recent_alerts': [run.to_dict() for run in recent_failures],
            'themes_total': themes_count,
            'themes_published': published_count
        }), 200
    except Exception as e:
        logger.error(f"Error fetching system status: {str(e)}")
        return jsonify({'error': 'Failed to fetch system status'}), 500


@admin_bp.route('/ingest', methods=['POST'])
def trigger_ingestion():
    """Trigger manual data ingestion"""
    try:
        data = request.get_json() or {}
        theme_id = data.get('theme_id')
        triggered_by = data.get('triggered_by', 'system')
        
        result = scheduler_service.trigger_manual_ingestion(
            current_app._get_current_object(),
            theme_id=theme_id,
            triggered_by=triggered_by
        )
        
        if result['success']:
            return jsonify(result), 200
        else:
            return jsonify(result), 400
    except Exception as e:
        logger.error(f"Error triggering ingestion: {str(e)}")
        return jsonify({'error': 'Failed to trigger ingestion', 'details': str(e)}), 500


@admin_bp.route('/themes/<int:theme_id>/test', methods=['POST'])
def run_test(theme_id):
    """Run automated test for a theme using Playwright"""
    try:
        data = request.get_json() or {}
        test_params = data.get('test_params')
        
        result = test_service.run_automated_test(theme_id, test_params)
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error running test for theme {theme_id}: {str(e)}")
        return jsonify({'error': 'Failed to run test', 'details': str(e)}), 500


@admin_bp.route('/themes/<int:theme_id>/test/manual', methods=['POST'])
def record_manual_test(theme_id):
    """Record manual test confirmation"""
    try:
        data = request.get_json() or {}
        triggered_by = data.get('triggered_by')
        passed = data.get('passed', True)
        notes = data.get('notes')
        
        if not triggered_by:
            return jsonify({'error': 'triggered_by is required'}), 400
        
        result = test_service.record_manual_test(theme_id, triggered_by, passed, notes)
        
        return jsonify(result), 201
    except Exception as e:
        logger.error(f"Error recording manual test: {str(e)}")
        return jsonify({'error': 'Failed to record manual test', 'details': str(e)}), 500


@admin_bp.route('/themes/<int:theme_id>/can-publish', methods=['GET'])
def check_can_publish(theme_id):
    """Check if theme can be published (tests passed)"""
    try:
        result = test_service.can_publish(theme_id)
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error checking publish status: {str(e)}")
        return jsonify({'error': 'Failed to check publish status'}), 500


@admin_bp.route('/themes/<int:theme_id>/publish', methods=['POST'])
def publish_theme(theme_id):
    """Publish a theme (only if tests passed)"""
    try:
        # Check if can publish
        can_publish_result = test_service.can_publish(theme_id)
        
        if not can_publish_result['can_publish']:
            return jsonify({
                'error': 'Cannot publish theme',
                'reason': can_publish_result['reason']
            }), 400
        
        # Update theme status
        theme = Theme.query.get_or_404(theme_id)
        data = request.get_json() or {}
        theme.status = 'published'
        theme.last_editor = data.get('published_by')
        theme.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'theme': theme.to_dict(),
            'message': 'Theme published successfully'
        }), 200
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error publishing theme {theme_id}: {str(e)}")
        return jsonify({'error': 'Failed to publish theme', 'details': str(e)}), 500


@admin_bp.route('/tribes', methods=['GET'])
def get_tribes():
    """List all active tribes with their squads"""
    try:
        include_squads = request.args.get('include_squads', 'false').lower() == 'true'
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        
        query = Tribe.query
        
        if active_only:
            query = query.filter_by(active=True)
        
        tribes = query.order_by(Tribe.display_order).all()
        result = [tribe.to_dict(include_squads=include_squads) for tribe in tribes]
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching tribes: {str(e)}")
        return jsonify({'error': 'Failed to fetch tribes'}), 500


@admin_bp.route('/tribes/<int:tribe_id>', methods=['GET'])
def get_tribe(tribe_id):
    """Get a specific tribe with its squads"""
    try:
        tribe = Tribe.query.get_or_404(tribe_id)
        return jsonify(tribe.to_dict(include_squads=True)), 200
    except Exception as e:
        logger.error(f"Error fetching tribe {tribe_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch tribe'}), 500


@admin_bp.route('/squads', methods=['GET'])
def get_squads():
    """List all active squads, optionally filtered by tribe"""
    try:
        tribe_id = request.args.get('tribe_id', type=int)
        active_only = request.args.get('active_only', 'true').lower() == 'true'
        include_tribe = request.args.get('include_tribe', 'false').lower() == 'true'
        
        query = Squad.query
        
        if tribe_id:
            query = query.filter_by(tribe_id=tribe_id)
        
        if active_only:
            query = query.filter_by(active=True)
        
        squads = query.order_by(Squad.display_order).all()
        result = [squad.to_dict(include_tribe=include_tribe) for squad in squads]
        
        return jsonify(result), 200
    except Exception as e:
        logger.error(f"Error fetching squads: {str(e)}")
        return jsonify({'error': 'Failed to fetch squads'}), 500


@admin_bp.route('/squads/<int:squad_id>', methods=['GET'])
def get_squad(squad_id):
    """Get a specific squad"""
    try:
        squad = Squad.query.get_or_404(squad_id)
        return jsonify(squad.to_dict(include_tribe=True)), 200
    except Exception as e:
        logger.error(f"Error fetching squad {squad_id}: {str(e)}")
        return jsonify({'error': 'Failed to fetch squad'}), 500
