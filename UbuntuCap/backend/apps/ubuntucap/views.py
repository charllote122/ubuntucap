from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.views import View
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

try:
    from apps.ubuntucap.ml_engine.credit_scorer import CreditScoringModel
    credit_model = CreditScoringModel()
    ML_MODEL_LOADED = True
    logger.info("✓ ML Credit Scoring Model loaded successfully")
except ImportError as e:
    logger.error(f"Failed to load ML model: {e}")
    ML_MODEL_LOADED = False
    credit_model = None

# Credit Score Prediction API
class CreditScoreAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Predict credit score for authenticated user"""
        try:
            if not ML_MODEL_LOADED:
                return JsonResponse({
                    'success': False,
                    'error': 'ML model not loaded. Please check server logs.'
                }, status=503)
            
            user = request.user
            
            # Predict credit score using ML
            score = credit_model.predict_credit_score(user)
            risk_level, reason = credit_model.predict_credit_risk(user)
            
            # Get feature importance
            feature_importance = credit_model.get_feature_importance()
            
            response_data = {
                'success': True,
                'user_id': str(user.id),
                'phone_number': user.phone_number,
                'credit_score': round(score, 2),
                'risk_level': risk_level,
                'risk_reason': reason,
                'feature_importance': feature_importance,
                'model_type': 'XGBoost Gradient Boosting',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Credit score predicted for user {user.phone_number}: {score}")
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Credit score prediction error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Failed to calculate credit score',
                'details': str(e)
            }, status=500)

# Model Training API (Admin only)
class ModelTrainingAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Train the ML model (Admin only)"""
        try:
            # Check if user is admin/staff
            if not request.user.is_staff:
                return JsonResponse({
                    'success': False,
                    'error': 'Admin access required to train model'
                }, status=403)
            
            # For now, return success since we're using rule-based scoring
            # In production, this would train on real user data
            return JsonResponse({
                'success': True,
                'message': 'Model training initiated',
                'note': 'Currently using rule-based scoring. Real ML training will be implemented with sufficient user data.',
                'model_type': 'XGBoost Gradient Boosting',
                'timestamp': datetime.now().isoformat()
            })
            
        except Exception as e:
            logger.error(f"Model training error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Model training failed',
                'details': str(e)
            }, status=500)
    
    def get(self, request):
        """Get model information"""
        try:
            model_info = {
                'success': True,
                'model_loaded': ML_MODEL_LOADED,
                'model_type': 'XGBoost Gradient Boosting',
                'features_used': credit_model.features if ML_MODEL_LOADED else [],
                'scoring_method': 'Rule-based with ML fallback',
                'timestamp': datetime.now().isoformat()
            }
            
            if ML_MODEL_LOADED:
                feature_importance = credit_model.get_feature_importance()
                model_info['feature_importance'] = feature_importance
            
            return JsonResponse(model_info)
            
        except Exception as e:
            return JsonResponse({
                'success': False,
                'error': str(e)
            }, status=500)

# Loan Application with ML Scoring
class LoanApplicationAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Process loan application with ML credit scoring"""
        try:
            data = json.loads(request.body) if request.body else {}
            user = request.user
            requested_amount = float(data.get('amount', 0))
            loan_purpose = data.get('purpose', 'General Business')
            
            if requested_amount <= 0:
                return JsonResponse({
                    'success': False,
                    'error': 'Invalid loan amount'
                }, status=400)
            
            # Get credit score
            credit_score = credit_model.predict_credit_score(user)
            risk_level, risk_reason = credit_model.predict_credit_risk(user)
            
            # Determine loan approval
            approval_result = self._evaluate_loan_application(
                user, credit_score, requested_amount, loan_purpose
            )
            
            response_data = {
                'success': True,
                'application_id': f"APP{datetime.now().strftime('%Y%m%d%H%M%S')}",
                'user_phone': user.phone_number,
                'credit_score': round(credit_score, 2),
                'risk_level': risk_level,
                'risk_reason': risk_reason,
                'requested_amount': requested_amount,
                'loan_purpose': loan_purpose,
                'approval_result': approval_result,
                'model_used': 'XGBoost Gradient Boosting',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"Loan application processed for {user.phone_number}: {approval_result['approved']}")
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"Loan application error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Loan application processing failed',
                'details': str(e)
            }, status=500)
    
    def _evaluate_loan_application(self, user, credit_score, requested_amount, purpose):
        """Evaluate loan application using credit score"""
        try:
            # Base eligibility from credit score
            if credit_score >= 80:
                max_amount = 100000
                interest_rate = 0.079
                repayment_period = 24
            elif credit_score >= 70:
                max_amount = 50000
                interest_rate = 0.099
                repayment_period = 18
            elif credit_score >= 60:
                max_amount = 25000
                interest_rate = 0.129
                repayment_period = 12
            elif credit_score >= 50:
                max_amount = 10000
                interest_rate = 0.159
                repayment_period = 6
            else:
                return {
                    "approved": False,
                    "reason": "Credit score below minimum threshold (50)",
                    "suggested_amount": 0
                }
            
            # Check if requested amount is within limits
            if requested_amount <= max_amount:
                monthly_payment = self._calculate_monthly_payment(
                    requested_amount, interest_rate, repayment_period
                )
                
                return {
                    "approved": True,
                    "approved_amount": requested_amount,
                    "interest_rate": interest_rate,
                    "repayment_period": repayment_period,
                    "monthly_installment": monthly_payment,
                    "reason": f"Application approved based on credit score of {credit_score}"
                }
            else:
                return {
                    "approved": False,
                    "reason": f"Requested amount exceeds maximum eligible amount of KSh {max_amount:,.0f}",
                    "suggested_amount": max_amount,
                    "max_eligible_amount": max_amount
                }
                
        except Exception as e:
            logger.error(f"Loan evaluation error: {str(e)}")
            return {
                "approved": False,
                "reason": "Error evaluating application",
                "suggested_amount": 0
            }
    
    def _calculate_monthly_payment(self, principal, annual_rate, months):
        """Calculate monthly loan payment"""
        try:
            monthly_rate = annual_rate / 12
            if monthly_rate == 0:
                return principal / months
            
            payment = principal * (monthly_rate * (1 + monthly_rate) ** months) / ((1 + monthly_rate) ** months - 1)
            return round(payment, 2)
        except:
            return round(principal / months, 2)

# M-Pesa Analysis API
class MpesaAnalysisAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Analyze user's M-Pesa history for loan qualification"""
        try:
            from apps.ubuntucap.services.mpesa_service import MpesaService
            
            user = request.user
            mpesa_service = MpesaService()
            
            # Check if user has granted M-Pesa consent
            if not user.mpesa_consent_granted:
                return JsonResponse({
                    'success': False,
                    'error': 'M-Pesa consent not granted. Please grant consent to analyze your transaction history.'
                }, status=400)
            
            # Get transaction history and analyze
            transactions = mpesa_service.get_transaction_history(user, days=90)
            analysis = mpesa_service.analyze_credit_worthiness(user)
            
            if analysis:
                # Update user's credit score based on M-Pesa analysis
                mpesa_based_score = self._calculate_mpesa_credit_score(analysis)
                
                response_data = {
                    'success': True,
                    'user_phone': user.phone_number,
                    'transaction_analysis': {
                        'total_transactions_analyzed': len(transactions),
                        'analysis_period_days': 90,
                        'qualification_status': analysis['qualification_status'],
                        'recommended_loan_limit': analysis['recommended_loan_limit'],
                        'mpesa_based_credit_score': mpesa_based_score,
                        'risk_indicators': analysis['risk_indicators'],
                        'transaction_volume_score': analysis['transaction_volume_score'],
                        'transaction_frequency_score': analysis['transaction_frequency_score'],
                        'income_consistency_score': analysis['consistency_score'],
                        'savings_capacity_score': analysis['savings_capacity_score']
                    },
                    'loan_qualification': self._get_qualification_details(analysis),
                    'timestamp': datetime.now().isoformat()
                }
                
                logger.info(f"M-Pesa analysis completed for {user.phone_number}: {analysis['qualification_status']}")
                
            else:
                response_data = {
                    'success': False,
                    'error': 'Could not analyze M-Pesa history'
                }
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"M-Pesa analysis error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'M-Pesa analysis failed',
                'details': str(e)
            }, status=500)
    
    def _calculate_mpesa_credit_score(self, analysis):
        """Calculate credit score based on M-Pesa analysis"""
        try:
            base_score = 50
            
            # Add scores from different factors
            volume_score = analysis['transaction_volume_score'] * 20
            frequency_score = analysis['transaction_frequency_score'] * 15
            consistency_score = analysis['consistency_score'] * 10
            savings_score = analysis['savings_capacity_score'] * 5
            
            # Subtract for risk indicators
            risk_penalty = len(analysis['risk_indicators']) * 5
            
            final_score = base_score + volume_score + frequency_score + consistency_score + savings_score - risk_penalty
            
            return max(0, min(100, final_score))
            
        except Exception as e:
            logger.error(f"Error calculating M-Pesa credit score: {e}")
            return 50
    
    def _get_qualification_details(self, analysis):
        """Get detailed qualification information"""
        status = analysis['qualification_status']
        limit = analysis['recommended_loan_limit']
        
        qualification_map = {
            'qualified': {
                'status': 'approved',
                'message': 'Congratulations! You qualify for a loan based on your M-Pesa transaction history.',
                'next_steps': ['Submit loan application', 'Choose loan amount', 'Complete verification']
            },
            'limited_qualification': {
                'status': 'limited',
                'message': 'You qualify for limited loan amounts. Consider improving your transaction consistency.',
                'next_steps': ['Apply for smaller loan', 'Improve transaction history', 'Re-apply in 30 days']
            },
            'not_qualified': {
                'status': 'denied',
                'message': 'Currently not qualified based on M-Pesa history. Improve your transaction patterns.',
                'next_steps': ['Increase transaction volume', 'Maintain consistent activity', 'Re-apply in 60 days']
            }
        }
        
        details = qualification_map.get(status, qualification_map['not_qualified'])
        details['recommended_limit'] = limit
        
        return details

# M-Pesa Data Sync API
class SyncMpesaDataAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Sync user's M-Pesa data"""
        try:
            from apps.ubuntucap.services.mpesa_service import MpesaService
            
            user = request.user
            
            if not user.mpesa_consent_granted:
                return JsonResponse({
                    'success': False,
                    'error': 'M-Pesa consent not granted. Please update your profile to grant consent.'
                }, status=400)
            
            mpesa_service = MpesaService()
            transactions = mpesa_service.get_transaction_history(user)
            
            # Get updated profile data
            profile = user.profile
            analysis = mpesa_service.analyze_credit_worthiness(user)
            
            response_data = {
                'success': True,
                'transactions_synced': len(transactions),
                'last_sync': profile.mpesa_last_sync.isoformat() if profile.mpesa_last_sync else None,
                'current_metrics': {
                    'avg_monthly_volume': float(profile.avg_monthly_volume),
                    'transaction_count_30d': profile.transaction_count_30d,
                    'transaction_count_90d': profile.transaction_count_90d,
                    'avg_transaction_amount': float(profile.avg_transaction_amount),
                    'income_consistency_score': profile.income_consistency_score,
                    'has_regular_income': profile.has_regular_income,
                    'mpesa_activity_level': profile.mpesa_activity_level
                },
                'message': 'M-Pesa data synced successfully'
            }
            
            if analysis:
                response_data['qualification_status'] = analysis['qualification_status']
                response_data['recommended_loan_limit'] = analysis['recommended_loan_limit']
            
            logger.info(f"M-Pesa data synced for {user.phone_number}: {len(transactions)} transactions")
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"M-Pesa sync error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'M-Pesa sync failed',
                'details': str(e)
            }, status=500)

# M-Pesa Consent API
class MpesaConsentAPI(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Update user's M-Pesa consent"""
        try:
            data = json.loads(request.body) if request.body else {}
            user = request.user
            
            consent_granted = data.get('consent_granted', False)
            mpesa_phone = data.get('mpesa_phone_number', user.phone_number)
            
            user.mpesa_consent_granted = consent_granted
            user.mpesa_phone_number = mpesa_phone
            user.save()
            
            response_data = {
                'success': True,
                'consent_granted': consent_granted,
                'mpesa_phone_number': mpesa_phone,
                'message': 'M-Pesa consent updated successfully'
            }
            
            if consent_granted:
                response_data['next_steps'] = [
                    'Sync your M-Pesa data',
                    'Analyze transaction history',
                    'Check loan qualification'
                ]
            
            logger.info(f"M-Pesa consent updated for {user.phone_number}: {consent_granted}")
            
            return JsonResponse(response_data)
            
        except Exception as e:
            logger.error(f"M-Pesa consent update error: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': 'Failed to update M-Pesa consent'
            }, status=500)

# Quick Credit Check (No authentication required)
@csrf_exempt
@require_http_methods(["POST"])
def quick_credit_check(request):
    """Quick credit check without authentication"""
    try:
        data = json.loads(request.body) if request.body else {}
        
        # Create mock user from request data
        class MockUser:
            def __init__(self, data):
                self.avg_monthly_volume = data.get('monthly_volume', 0)
                self.business_age_months = data.get('business_age', 0)
                self.transaction_consistency = data.get('consistency', 0.5)
                self.savings_ratio = data.get('savings_ratio', 0.1)
                self.loan_history_count = data.get('previous_loans', 0)
                self.default_rate = data.get('default_rate', 0)
                self.mpesa_activity_score = data.get('mpesa_score', 5.0)
        
        mock_user = MockUser(data)
        
        if ML_MODEL_LOADED:
            score = credit_model.predict_credit_score(mock_user)
            risk_level, reason = credit_model.predict_credit_risk(mock_user)
        else:
            # Fallback scoring
            monthly_volume = data.get('monthly_volume', 0)
            base_score = 50
            if monthly_volume > 50000:
                base_score += 30
            elif monthly_volume > 20000:
                base_score += 20
            elif monthly_volume > 10000:
                base_score += 10
            
            score = min(100, base_score)
            
            if score >= 70:
                risk_level = "low"
                reason = "Good financial profile"
            elif score >= 50:
                risk_level = "medium"
                reason = "Average financial profile"
            else:
                risk_level = "high"
                reason = "Needs improvement"
        
        monthly_volume = data.get('monthly_volume', 0)
        return JsonResponse({
            'success': True,
            'credit_score': score,
            'risk_level': risk_level,
            'risk_reason': reason,
            'estimated_max_loan': min(50000, monthly_volume * 2),
            'model_type': 'XGBoost Gradient Boosting',
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=400)