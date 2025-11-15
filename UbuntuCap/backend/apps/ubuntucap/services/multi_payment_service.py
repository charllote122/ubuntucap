import requests
import json
import logging
from django.conf import settings
from django.utils import timezone
from .pesapal_service import PesapalPaymentService

logger = logging.getLogger(__name__)

class MultiPaymentService:
    def __init__(self):
        self.providers = ['pesapal', 'mock']  # PesaPal first, then mock fallback
        self.current_provider = None
        self.pesapal_service = PesapalPaymentService()
        
    def disburse_loan(self, user, amount, loan_application=None):
        """Try PesaPal first, then fallback to mock"""
        # Try PesaPal (your real provider)
        logger.info("🔄 Trying PesaPal for loan disbursement...")
        pesapal_result = self.pesapal_service.disburse_loan(user, amount, loan_application)
        
        if pesapal_result.get('success'):
            self.current_provider = 'pesapal'
            logger.info("✅ Success with PesaPal - REAL PAYMENTS ACTIVE!")
            return pesapal_result
        
        # PesaPal failed, use mock
        logger.info("🔄 PesaPal failed, using mock for development")
        return self._mock_disbursement(user, amount, loan_application)
    
    def collect_repayment(self, user, amount, loan=None):
        """Try PesaPal first, then fallback to mock"""
        # Try PesaPal (your real provider)
        logger.info("🔄 Trying PesaPal for repayment collection...")
        pesapal_result = self.pesapal_service.collect_repayment(user, amount, loan)
        
        if pesapal_result.get('success'):
            self.current_provider = 'pesapal'
            logger.info("✅ Success with PesaPal - REAL PAYMENTS ACTIVE!")
            return pesapal_result
        
        # PesaPal failed, use mock
        logger.info("�� PesaPal failed, using mock for development")
        return self._mock_repayment(user, amount, loan)
    
    def _mock_disbursement(self, user, amount, loan_application):
        """Mock disbursement for development"""
        loan_id = loan_application.id if loan_application else 'manual'
        return {
            'success': True,
            'provider': 'mock',
            'transaction_id': f'mock_disburse_{loan_id}_{int(timezone.now().timestamp())}',
            'message': 'Mock disbursement - PesaPal credentials need verification',
            'instruction': 'Check if PesaPal credentials are for sandbox or live environment'
        }
    
    def _mock_repayment(self, user, amount, loan):
        """Mock repayment for development"""
        loan_id = loan.id if loan else 'manual'
        return {
            'success': True,
            'provider': 'mock', 
            'payment_url': 'https://mock-payment.ubuntucap.com/pay',
            'transaction_id': f'mock_repay_{loan_id}_{int(timezone.now().timestamp())}',
            'message': 'Mock repayment - PesaPal credentials need verification'
        }
    
    def test_connections(self):
        """Test all payment providers"""
        results = {}
        
        # Test PesaPal
        pesapal_test = self.pesapal_service.test_connection()
        results['pesapal'] = pesapal_test
        
        return results
    
    def get_active_provider(self):
        """Get currently active payment provider"""
        return self.current_provider or 'pesapal_configured'
    
    def get_pesapal_status(self):
        """Get detailed PesaPal status"""
        return self.pesapal_service.test_connection()
