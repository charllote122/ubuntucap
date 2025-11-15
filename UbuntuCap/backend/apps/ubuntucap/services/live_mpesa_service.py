import requests
import base64
import json
from datetime import datetime
from django.conf import settings
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

class LiveMpesaService:
    def __init__(self):
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', '')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', '')
        self.base_url = getattr(settings, 'MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke')
        
    def get_access_token(self):
        """Get live OAuth token from Safaricom"""
        try:
            auth_string = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_auth = base64.b64encode(auth_string.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_auth}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f'{self.base_url}/oauth/v1/generate?grant_type=client_credentials',
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                token_data = response.json()
                logger.info("✅ Successfully obtained M-Pesa access token")
                return token_data['access_token']
            else:
                logger.error(f"❌ Token request failed: {response.status_code} - {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Error getting access token: {e}")
            return None
    
    def get_transaction_history(self, user, days=90):
        """Fetch real transaction history from M-Pesa"""
        try:
            access_token = self.get_access_token()
            if not access_token:
                logger.warning("⚠️  Could not get access token, using mock data")
                return self._get_fallback_mock_data(user, days)
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            # Note: This is a simplified version. Actual M-Pesa transaction history
            # API requires business-level agreements with Safaricom
            payload = {
                'phone_number': user.phone_number,
                'start_date': (timezone.now() - timezone.timedelta(days=days)).strftime('%Y-%m-%d'),
                'end_date': timezone.now().strftime('%Y-%m-%d')
            }
            
            # Placeholder for actual M-Pesa transaction history endpoint
            response = requests.post(
                f'{self.base_url}/mpesa/transactionhistory/v1/query',
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                logger.info(f"✅ Successfully fetched live M-Pesa data for {user.phone_number}")
                return self._parse_transaction_data(response.json(), user)
            else:
                logger.warning(f"⚠️  Live API failed ({response.status_code}), falling back to mock data")
                return self._get_fallback_mock_data(user, days)
                
        except Exception as e:
            logger.error(f"❌ Live M-Pesa fetch failed: {e}")
            return self._get_fallback_mock_data(user, days)
    
    def _parse_transaction_data(self, api_response, user):
        """Parse real M-Pesa API response"""
        from apps.users.models import MpesaTransaction
        
        transactions = []
        for tx in api_response.get('transactions', []):
            transaction = MpesaTransaction(
                user=user,
                transaction_id=tx.get('transaction_id', f"MPE{tx.get('id', '0000000000')}"),
                transaction_type=self._map_transaction_type(tx.get('type', '')),
                amount=float(tx.get('amount', 0)),
                balance_after=float(tx.get('balance', 0)),
                sender=tx.get('sender', ''),
                receiver=tx.get('receiver', ''),
                description=tx.get('description', 'M-Pesa Transaction'),
                transaction_time=datetime.fromisoformat(tx.get('timestamp', timezone.now().isoformat())),
                is_high_risk=self._assess_risk(tx)
            )
            transactions.append(transaction)
        
        logger.info(f"✅ Parsed {len(transactions)} transactions from M-Pesa API")
        return transactions
    
    def _get_fallback_mock_data(self, user, days):
        """Fallback to mock data when live API fails"""
        from apps.ubuntucap.services.mpesa_service import MpesaService
        mpesa_service = MpesaService()
        logger.info("🔄 Using mock M-Pesa data as fallback")
        return mpesa_service.get_transaction_history(user, days)
    
    def _map_transaction_type(self, mpesa_type):
        """Map M-Pesa transaction types to internal types"""
        type_mapping = {
            'CustomerPayBillOnline': 'pay_bill',
            'CustomerBuyGoodsOnline': 'buy_goods',
            'SalaryPayment': 'receive_money',
            'BusinessPayment': 'send_money',
            'PromotionPayment': 'receive_money',
            'AccountBalance': 'account_balance',
            'UtilityPayment': 'pay_bill'
        }
        return type_mapping.get(mpesa_type, 'other')
    
    def _assess_risk(self, transaction):
        """Assess risk for individual transactions"""
        risk_factors = [
            float(transaction.get('amount', 0)) > 100000,  # Large transactions
            'bet' in transaction.get('description', '').lower(),  # Gambling
            'loan' in transaction.get('description', '').lower(),  # Other loans
            'casino' in transaction.get('description', '').lower(),  # Gambling
        ]
        return any(risk_factors)
    
    def test_connection(self):
        """Test M-Pesa API connection"""
        try:
            token = self.get_access_token()
            if token:
                return {
                    'success': True,
                    'message': '✅ M-Pesa API connection successful',
                    'token_obtained': True
                }
            else:
                return {
                    'success': False,
                    'message': '❌ Failed to obtain M-Pesa access token',
                    'token_obtained': False
                }
        except Exception as e:
            return {
                'success': False,
                'message': f'❌ M-Pesa connection test failed: {e}',
                'token_obtained': False
            }
