"""
Scheduler service for automatic data ingestion at 07:00 daily
"""
import threading
import time
from datetime import datetime, time as dt_time, timedelta
from app import db
from app.models import Theme, DataSource, IngestionRun
from app.services.sharepoint_service import SharePointService
import logging

logger = logging.getLogger(__name__)


class SchedulerService:
    """Service to handle scheduled and manual data ingestion"""
    
    def __init__(self):
        self.sharepoint_service = SharePointService()
        self._running = False
        self._thread = None
        self._lock = threading.Lock()
    
    def start_scheduler(self, app):
        """Start the scheduler thread"""
        if self._running:
            logger.warning("Scheduler already running")
            return
        
        self._running = True
        self._thread = threading.Thread(target=self._scheduler_loop, args=(app,), daemon=True)
        self._thread.start()
        logger.info("Scheduler started")
    
    def stop_scheduler(self):
        """Stop the scheduler thread"""
        self._running = False
        if self._thread:
            self._thread.join(timeout=5)
        logger.info("Scheduler stopped")
    
    def _scheduler_loop(self, app):
        """Main scheduler loop that runs daily at 07:00"""
        target_time = dt_time(7, 0)  # 07:00
        
        while self._running:
            now = datetime.now()
            next_run = datetime.combine(now.date(), target_time)
            
            # If 07:00 already passed today, schedule for tomorrow
            if now.time() >= target_time:
                next_run = datetime.combine((now.date() + timedelta(days=1)), target_time)
            
            wait_seconds = (next_run - now).total_seconds()
            logger.info(f"Next automatic ingestion scheduled for {next_run} (in {wait_seconds:.0f} seconds)")
            
            # Wait until target time
            time.sleep(min(wait_seconds, 86400))  # Max 24 hours
            
            if self._running:
                with app.app_context():
                    self._run_automatic_ingestion()
    
    def _run_automatic_ingestion(self):
        """Execute automatic ingestion for all published themes"""
        logger.info("Starting automatic ingestion at 07:00")
        
        # Check if already running (lock)
        if not self._lock.acquire(blocking=False):
            logger.warning("Ingestion already in progress, skipping this run")
            return
        
        try:
            # Create global ingestion run record
            global_run = IngestionRun(
                trigger_type='automatic',
                status='running',
                started_at=datetime.utcnow()
            )
            db.session.add(global_run)
            db.session.commit()
            
            # Get all published themes
            themes = Theme.query.filter_by(status='published').all()
            total_rows = 0
            errors = []
            
            for theme in themes:
                try:
                    rows = self._ingest_theme_data(theme)
                    total_rows += rows
                except Exception as e:
                    error_msg = f"Theme {theme.name}: {str(e)}"
                    errors.append(error_msg)
                    logger.error(error_msg)
            
            # Update global run
            global_run.completed_at = datetime.utcnow()
            global_run.duration_seconds = (global_run.completed_at - global_run.started_at).total_seconds()
            global_run.rows_imported = total_rows
            global_run.status = 'success' if not errors else 'failed'
            global_run.error_message = '; '.join(errors) if errors else None
            
            db.session.commit()
            logger.info(f"Automatic ingestion completed: {total_rows} rows imported")
            
        except Exception as e:
            logger.error(f"Error in automatic ingestion: {str(e)}")
            if 'global_run' in locals():
                global_run.status = 'failed'
                global_run.error_message = str(e)
                global_run.completed_at = datetime.utcnow()
                db.session.commit()
        finally:
            self._lock.release()
    
    def _ingest_theme_data(self, theme):
        """Ingest data for a single theme"""
        run = IngestionRun(
            theme_id=theme.id,
            trigger_type='automatic',
            status='running',
            started_at=datetime.utcnow()
        )
        db.session.add(run)
        db.session.commit()
        
        total_rows = 0
        
        try:
            for data_source in theme.data_sources.order_by(DataSource.display_order):
                # Read Excel file
                excel_info = self.sharepoint_service.read_excel_sheets(data_source.sharepoint_url)
                file_info = self.sharepoint_service.read_file_metadata(data_source.sharepoint_url)
                
                # Update data source metadata
                data_source.last_read_at = datetime.utcnow()
                data_source.last_file_modified = file_info.get('last_modified')
                data_source.sheets_count = len(excel_info.get('sheets', []))
                data_source.rows_count = excel_info.get('rows_count', 0)
                total_rows += excel_info.get('rows_count', 0)
            
            run.status = 'success'
            run.rows_imported = total_rows
        except Exception as e:
            run.status = 'failed'
            run.error_message = str(e)
            raise
        finally:
            run.completed_at = datetime.utcnow()
            run.duration_seconds = (run.completed_at - run.started_at).total_seconds()
            db.session.commit()
        
        return total_rows
    
    def trigger_manual_ingestion(self, app, theme_id=None, triggered_by=None):
        """
        Trigger manual ingestion (can be for specific theme or all published)
        
        Args:
            app: Flask app instance
            theme_id: Optional theme ID, if None processes all published themes
            triggered_by: User who triggered the update
            
        Returns:
            Dict with ingestion result
        """
        if not self._lock.acquire(blocking=False):
            return {
                'success': False,
                'error': 'Ingestion already in progress. Please wait for current run to complete.'
            }
        
        try:
            with app.app_context():
                if theme_id:
                    theme = Theme.query.get_or_404(theme_id)
                    themes = [theme]
                else:
                    themes = Theme.query.filter_by(status='published').all()
                
                total_rows = 0
                errors = []
                
                for theme in themes:
                    try:
                        rows = self._ingest_theme_data_manual(theme, triggered_by)
                        total_rows += rows
                    except Exception as e:
                        error_msg = f"Theme {theme.name}: {str(e)}"
                        errors.append(error_msg)
                        logger.error(error_msg)
                
                return {
                    'success': len(errors) == 0,
                    'rows_imported': total_rows,
                    'themes_processed': len(themes),
                    'errors': errors if errors else None
                }
        finally:
            self._lock.release()
    
    def _ingest_theme_data_manual(self, theme, triggered_by):
        """Ingest data for a single theme (manual trigger)"""
        run = IngestionRun(
            theme_id=theme.id,
            trigger_type='manual',
            triggered_by=triggered_by,
            status='running',
            started_at=datetime.utcnow()
        )
        db.session.add(run)
        db.session.commit()
        
        total_rows = 0
        
        try:
            for data_source in theme.data_sources.order_by(DataSource.display_order):
                excel_info = self.sharepoint_service.read_excel_sheets(data_source.sharepoint_url)
                file_info = self.sharepoint_service.read_file_metadata(data_source.sharepoint_url)
                
                data_source.last_read_at = datetime.utcnow()
                data_source.last_file_modified = file_info.get('last_modified')
                data_source.sheets_count = len(excel_info.get('sheets', []))
                data_source.rows_count = excel_info.get('rows_count', 0)
                total_rows += excel_info.get('rows_count', 0)
            
            run.status = 'success'
            run.rows_imported = total_rows
        except Exception as e:
            run.status = 'failed'
            run.error_message = str(e)
            raise
        finally:
            run.completed_at = datetime.utcnow()
            run.duration_seconds = (run.completed_at - run.started_at).total_seconds()
            db.session.commit()
        
        return total_rows

