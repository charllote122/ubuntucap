import requests
import json
import hashlib
import hmac
from django.conf import settings
from django.utils import timezone
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)

class PaymentService:
    def __init__(self):
        self.flutterwave_secret = getattr(settings, 'FLUTTERWAVE_SECRET_KEY', 'test_secret')
        self.flutterwave_public = getattr(settings, 'FLUTTERWAVE_PUBLIC_KEY', 'test_public')
        self.base_url = "https://api.flutterwave.com/v3"
    
    def initialize_loan_disbursement(self, user, amount, loan_application):
        """Initialize loan disbursement to user's M-Pesa"""
        try:
            # For development, simulate successful disbursement
            if self.flutterwave_secret == 'test_secret':
                logger.info("🔄 Using mock disbursement for development")
                return {
                    'success': True,
                    'transfer_id': f'mock_transfer_{loan_application.id}',
                    'status': 'success',
                    'reference': f'LOAN_{loan_application.id}',
                    'message': 'Mock disbursement successful'
                }
            
            headers = {
                'Authorization': f'Bearer {self.flutterwave_secret}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "account_bank": "mpesa",
                "account_number": user.phone_number,
                "amount": float(amount),
                "narration": f"Loan disbursement - {loan_application.id}",
                "currency": "KES",
                "reference": f"LOAN_{loan_application.id}_{int(timezone.now().timestamp())}",
                "callback_url": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/api/payments/callback/",
                "debit_currency": "KES"
            }
            
            response = requests.post(
                f"{self.base_url}/transfers",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                transfer_data = response.json()
                logger.info(f"✅ Loan disbursement initiated: {transfer_data['data']['id']}")
                return {
                    'success': True,
                    'transfer_id': transfer_data['data']['id'],
                    'status': transfer_data['data']['status'],
                    'reference': payload['reference']
                }
            else:
                logger.error(f"❌ Transfer failed: {response.text}")
                return {'success': False, 'error': response.text}
                
        except Exception as e:
            logger.error(f"❌ Loan disbursement error: {e}")
            return {'success': False, 'error': str(e)}
    
    def process_repayment(self, user, amount, loan):
        """Process loan repayment from user"""
        try:
            # For development, simulate successful payment
            if self.flutterwave_secret == 'test_secret':
                logger.info("🔄 Using mock repayment for development")
                return {
                    'success': True,
                    'payment_url': 'https://mock-payment.ubuntucap.com/pay',
                    'transaction_id': f'mock_tx_{int(timezone.now().timestamp())}',
                    'message': 'Mock payment initiated'
                }
            
            headers = {
                'Authorization': f'Bearer {self.flutterwave_secret}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                "tx_ref": f"REPAY_{loan.id}_{int(timezone.now().timestamp())}",
                "amount": float(amount),
                "currency": "KES",
                "redirect_url": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/repayment/success/",
                "payment_options": "mpesa",
                "customer": {
                    "email": getattr(user, 'email', 'user@ubuntucap.com'),
                    "phonenumber": user.phone_number,
                    "name": user.business_name
                },
                "customizations": {
                    "title": "UbuntuCap Loan Repayment",
                    "description": f"Repayment for loan {loan.id}",
                    "logo": f"{getattr(settings, 'BASE_URL', 'http://localhost:8000')}/static/logo.png"
                }
            }
            
            response = requests.post(
                f"{self.base_url}/payments",
                headers=headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                payment_data = response.json()
                logger.info(f"✅ Repayment initiated: {payment_data['data']['id']}")
                return {
                    'success': True,
                    'payment_url': payment_data['data']['link'],
                    'transaction_id': payment_data['data']['id']
                }
            else:
                logger.error(f"❌ Repayment failed: {response.text}")
                return {'success': False, 'error': response.text}
                
        except Exception as e:
            logger.error(f"❌ Repayment processing error: {e}")
            return {'success': False, 'error': str(e)}
    
    def verify_transaction(self, transaction_id):
        """Verify transaction status"""
        try:
            if self.flutterwave_secret == 'test_secret':
                return {'status': 'successful', 'amount': 1000, 'currency': 'KES'}
            
            headers = {
                'Authorization': f'Bearer {self.flutterwave_secret}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.base_url}/transactions/{transaction_id}/verify",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()['data']
            else:
                logger.error(f"❌ Transaction verification failed: {response.text}")
                return None
                
        except Exception as e:
            logger.error(f"❌ Transaction verification error: {e}")
            return None
    
    def handle_webhook(self, payload, signature):
        """Handle payment webhooks"""
        try:
            # Verify webhook signature
            if self.flutterwave_secret != 'test_secret':
                secret_hash = hmac.new(
                    getattr(settings, 'FLUTTERWAVE_WEBHOOK_SECRET', '').encode(),
                    json.dumps(payload).encode(),
                    hashlib.sha256
                ).hexdigest()
                
                if signature != secret_hash:
                    logger.error("❌ Invalid webhook signature")
                    return False
            
            event_type = payload.get('event')
            data = payload.get('data')
            
            logger.info(f"🔄 Processing webhook: {event_type}")
            
            if event_type == 'transfer.completed':
                return self._handle_transfer_completed(data)
            elif event_type == 'charge.completed':
                return self._handle_repayment_received(data)
            else:
                logger.info(f"ℹ️  Unhandled webhook event: {event_type}")
                return True
                
        except Exception as e:
            logger.error(f"❌ Webhook handling error: {e}")
            return False
    
    def _handle_transfer_completed(self, data):
        """Handle successful loan disbursement"""
        try:
            reference = data.get('reference', '')
            if reference.startswith('LOAN_'):
                # In a real implementation, you'd update the loan status
                logger.info(f"✅ Loan disbursement completed: {reference}")
                return True
            return False
        except Exception as e:
            logger.error(f"❌ Transfer completion handling error: {e}")
            return False
    
    def _handle_repayment_received(self, data):
        """Handle loan repayment"""
        try:
            amount = data.get('amount', 0)
            customer_phone = data.get('customer', {}).get('phonenumber')
            
            logger.info(f"✅ Repayment received: {amount} from {customer_phone}")
            # In real implementation, update loan balance
            return True
        except Exception as e:
            logger.error(f"❌ Repayment handling error: {e}")
            return False
    
    def test_connection(self):
        """Test Flutterwave API connection"""
        try:
            if self.flutterwave_secret == 'test_secret':
                return {
                    'success': True,
                    'message': '✅ Mock payment service active',
                    'live_mode': False
                }
            
            headers = {
                'Authorization': f'Bearer {self.flutterwave_secret}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.base_url}/transactions/123/test",
                headers=headers,
                timeout=10
            )
            
            # Even if transaction doesn't exist, we check if API is reachable
            if response.status_code in [200, 404]:
                return {
                    'success': True,
                    'message': '✅ Flutterwave API connection successful',
                    'live_mode': True
                }
            else:
                return {
                    'success': False,
                    'message': f'❌ Flutterwave API connection failed: {response.status_code}',
                    'live_mode': True
                }
                
        except Exception as e:
            return {
                'success': False,
                'message': f'❌ Payment service test failed: {e}',
                'live_mode': False
            }
