"""
Test service for Playwright integration and test run management
"""
from datetime import datetime
from app import db
from app.models import Theme, TestRun
import logging

logger = logging.getLogger(__name__)


class TestService:
    """Service to handle automated and manual test runs"""
    
    def __init__(self):
        pass
    
    def run_automated_test(self, theme_id, test_params=None):
        """
        Run automated test using MCP Playwright
        
        Args:
            theme_id: Theme ID to test
            test_params: Optional dict with test parameters
            
        Returns:
            Dict with test result
        """
        theme = Theme.query.get_or_404(theme_id)
        
        # Create test run record
        test_run = TestRun(
            theme_id=theme_id,
            test_type='automated',
            status='running',
            started_at=datetime.utcnow()
        )
        db.session.add(test_run)
        db.session.commit()
        
        try:
            # TODO: Integrate with MCP Playwright
            # For now, simulate test execution
            result = self._execute_playwright_test(theme, test_params)
            
            test_run.status = 'passed' if result['success'] else 'failed'
            test_run.result_details = str(result.get('details', ''))
            test_run.error_message = result.get('error')
            
            if result['success']:
                logger.info(f"Automated test passed for theme {theme.name}")
            else:
                logger.warning(f"Automated test failed for theme {theme.name}: {result.get('error')}")
            
        except Exception as e:
            test_run.status = 'failed'
            test_run.error_message = str(e)
            logger.error(f"Error running automated test: {str(e)}")
            result = {'success': False, 'error': str(e)}
        finally:
            test_run.completed_at = datetime.utcnow()
            test_run.duration_seconds = (test_run.completed_at - test_run.started_at).total_seconds()
            db.session.commit()
        
        return {
            'test_run_id': test_run.id,
            'status': test_run.status,
            'duration_seconds': test_run.duration_seconds,
            'result': result
        }
    
    def _execute_playwright_test(self, theme, test_params):
        """
        Execute Playwright test via MCP
        
        Args:
            theme: Theme object
            test_params: Test parameters
            
        Returns:
            Dict with test result
        """
        # TODO: Implement actual MCP Playwright call
        # This is a placeholder that simulates test execution
        # In production, this would call the MCP Playwright tool
        
        # Simulate test execution
        import time
        time.sleep(0.1)  # Simulate test duration
        
        # Mock result - in real implementation, this would come from Playwright
        return {
            'success': True,
            'details': {
                'screenshots': 3,
                'assertions': 15,
                'pages_tested': 2
            },
            'error': None
        }
    
    def record_manual_test(self, theme_id, triggered_by, passed=True, notes=None):
        """
        Record a manual test confirmation
        
        Args:
            theme_id: Theme ID
            triggered_by: User who confirmed the test
            passed: Whether the test passed
            notes: Optional notes about the test
            
        Returns:
            Dict with test run info
        """
        theme = Theme.query.get_or_404(theme_id)
        
        test_run = TestRun(
            theme_id=theme_id,
            test_type='manual',
            triggered_by=triggered_by,
            status='passed' if passed else 'failed',
            started_at=datetime.utcnow(),
            completed_at=datetime.utcnow(),
            result_details=notes
        )
        
        db.session.add(test_run)
        db.session.commit()
        
        logger.info(f"Manual test recorded for theme {theme.name} by {triggered_by}: {'passed' if passed else 'failed'}")
        
        return test_run.to_dict()
    
    def can_publish(self, theme_id):
        """
        Check if a theme can be published (has passed tests)
        
        Args:
            theme_id: Theme ID
            
        Returns:
            Dict with can_publish bool and reason
        """
        theme = Theme.query.get_or_404(theme_id)
        
        # Get latest test runs
        latest_automated = theme.test_runs.filter_by(
            test_type='automated'
        ).order_by(TestRun.started_at.desc()).first()
        
        latest_manual = theme.test_runs.filter_by(
            test_type='manual'
        ).order_by(TestRun.started_at.desc()).first()
        
        # Check if tests are required and passed
        if latest_automated and latest_automated.status != 'passed':
            return {
                'can_publish': False,
                'reason': 'Latest automated test did not pass',
                'test_run': latest_automated.to_dict()
            }
        
        # If no tests run yet, require at least one
        if not latest_automated and not latest_manual:
            return {
                'can_publish': False,
                'reason': 'No tests have been run yet'
            }
        
        return {
            'can_publish': True,
            'reason': 'All required tests passed',
            'latest_automated': latest_automated.to_dict() if latest_automated else None,
            'latest_manual': latest_manual.to_dict() if latest_manual else None
        }

