import requests
import base64
import json
import logging
from django.conf import settings
from django.utils import timezone

logger = logging.getLogger(__name__)

class RealPaymentService:
    """
    STRICT REAL PAYMENTS ONLY - No mock fallbacks
    System will FAIL completely if credentials are invalid
    """
    
    def __init__(self):
        self.consumer_key = getattr(settings, 'PESAPAL_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'PESAPAL_CONSUMER_SECRET', '')
        
        # Test credentials immediately - SYSTEM BLOCKS IF INVALID
        self.credentials_valid = self._validate_credentials()
        
        if not self.credentials_valid:
            error_msg = """
            🚨 CRITICAL: INVALID PESAPAL CREDENTIALS
            REAL PAYMENTS ARE BLOCKED UNTIL YOU GET VALID CREDENTIALS
            
            IMMEDIATE ACTION REQUIRED:
            1. Email PesaPal: support@pesapal.com (use template provided)
            2. Apply to DPO Group: sales@dpogroup.com  
            3. Apply to Selcom: info@selcom.com
            
            CURRENT CREDENTIALS:
            Consumer Key: rbpmoIN0Dn5o2+ymhWN85VK4pSuOnVrK
            Consumer Secret: mPd/AKquZa4lIwcL7cmFpUf2aGU=
            
            ERROR: Invalid API credentials provided
            """
            logger.error(error_msg)
            raise Exception("INVALID_PESAPAL_CREDENTIALS - System blocked until valid credentials are provided")
        
        logger.info("✅ PesaPal credentials validated - REAL PAYMENT SYSTEM ACTIVE")
    
    def _validate_credentials(self):
        """Test PesaPal credentials - NO MOCK FALLBACK"""
        if not self.consumer_key or not self.consumer_secret:
            logger.error("❌ PesaPal credentials missing in settings")
            return False
        
        # Test both endpoints
        endpoints = [
            "https://pay.pesapal.com/v3/api/Auth/RequestToken",  # Live
            "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken"  # Sandbox
        ]
        
        for endpoint in endpoints:
            try:
                auth_string = f"{self.consumer_key}:{self.consumer_secret}"
                encoded_auth = base64.b64encode(auth_string.encode()).decode()
                
                headers = {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': f'Basic {encoded_auth}'
                }
                
                payload = {
                    "consumer_key": self.consumer_key,
                    "consumer_secret": self.consumer_secret
                }
                
                response = requests.post(endpoint, json=payload, headers=headers, timeout=30)
                
                if response.status_code == 200:
                    logger.info(f"✅ PesaPal credentials VALID for endpoint: {endpoint}")
                    self.active_endpoint = endpoint.replace('/api/Auth/RequestToken', '')
                    return True
                else:
                    logger.warning(f"❌ Endpoint failed: {endpoint} - {response.status_code}")
                    
            except Exception as e:
                logger.warning(f"❌ Endpoint error: {endpoint} - {e}")
                continue
        
        logger.error("💥 ALL PESAPAL ENDPOINTS FAILED - CREDENTIALS ARE INVALID")
        return False
