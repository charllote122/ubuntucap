import os
import logging
from django.conf import settings

# Set up logger
logger = logging.getLogger(__name__)

class CreditScoringModel:
    def __init__(self):
        self.model = None
        self.features = [
            'avg_monthly_volume',
            'transaction_consistency', 
            'business_age_months',
            'savings_ratio',
            'loan_history_count',
            'default_rate',
            'mpesa_activity_score',
            'customer_rating',
            # NEW M-Pesa features
            'transaction_volume_score',
            'balance_stability_score', 
            'income_regularity_score',
            'has_regular_income',
            'negative_balance_days'
        ]
        self.model_path = os.path.join(settings.BASE_DIR, 'ml_models', 'credit_model.pkl')
        self.load_model()
    
    def load_model(self):
        """Load the trained ML model"""
        try:
            if os.path.exists(self.model_path):
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                logger.info("Credit scoring model loaded successfully")
            else:
                logger.warning("No trained model found. Using rule-based scoring only.")
                self.model = None
        except Exception as e:
            logger.error(f"Error loading model: {e}")
            self.model = None
    
    def predict_credit_score(self, user):
        """Predict credit score using real M-Pesa data"""
        try:
            from apps.ubuntucap.services.mpesa_service import MpesaService
            
            mpesa_service = MpesaService()
            transaction_analysis = mpesa_service.analyze_transaction_patterns(user)
            
            if transaction_analysis:
                # Enhanced scoring with real M-Pesa data
                base_score = self._rule_based_scoring(user)
                mpesa_score = self._calculate_mpesa_score(transaction_analysis)
                
                # Combine scores (70% base + 30% M-Pesa analysis)
                final_score = 0.7 * base_score + 0.3 * mpesa_score
            else:
                # Fallback to basic scoring
                final_score = self._rule_based_scoring(user)
            
            return max(0, min(100, final_score))
            
        except Exception as e:
            logger.error(f"M-Pesa enhanced scoring failed: {e}")
            return self._rule_based_scoring(user)
    
    def _calculate_mpesa_score(self, transaction_analysis):
        """Calculate score based on M-Pesa transaction analysis"""
        try:
            score = 50  # Base M-Pesa score
            
            # Volume scoring
            volume_score = transaction_analysis.get('transaction_volume_score', 0)
            score += volume_score * 20
            
            # Consistency scoring
            consistency_score = transaction_analysis.get('consistency_score', 0)
            score += consistency_score * 15
            
            # Balance stability
            balance_score = transaction_analysis.get('balance_stability_score', 0)
            score += balance_score * 10
            
            # Income regularity
            income_score = transaction_analysis.get('income_regularity_score', 0)
            score += income_score * 5
            
            # Risk penalties
            risk_indicators = transaction_analysis.get('risk_indicators', [])
            score -= len(risk_indicators) * 5
            
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"M-Pesa score calculation failed: {e}")
            return 50
    
    def _extract_features(self, user):
        """Extract enhanced features including M-Pesa data"""
        try:
            profile = user.profile
            
            base_features = {
                'avg_monthly_volume': float(profile.avg_monthly_volume),
                'transaction_consistency': profile.transaction_consistency,
                'business_age_months': user.business_age_months,
                'savings_ratio': profile.savings_ratio,
                'loan_history_count': user.loans.count(),
                'default_rate': self._calculate_default_rate(user),
                'mpesa_activity_score': profile.mpesa_activity_score,
                'customer_rating': profile.customer_rating or 3.0,
                # New M-Pesa features
                'has_regular_income': 1 if profile.has_regular_income else 0,
                'negative_balance_days': profile.negative_balance_days,
                'transaction_count_30d': profile.transaction_count_30d,
                'avg_transaction_amount': float(profile.avg_transaction_amount)
            }
            
            return base_features
        except Exception as e:
            logger.error(f"Error extracting enhanced features: {e}")
            return {feature: 0 for feature in self.features}
    
    def _calculate_default_rate(self, user):
        """Calculate user's default rate"""
        try:
            total_loans = user.loans.count()
            if total_loans == 0:
                return 0.0
            
            defaulted_loans = user.loans.filter(status='defaulted').count()
            return defaulted_loans / total_loans
        except Exception as e:
            logger.error(f"Error calculating default rate: {e}")
            return 0.0
    
    def _rule_based_scoring(self, user):
        """Fallback rule-based scoring"""
        try:
            profile = user.profile
            score = 50  # Base score
            
            # Business age scoring
            if user.business_age_months > 24:
                score += 20
            elif user.business_age_months > 12:
                score += 10
            elif user.business_age_months > 6:
                score += 5
            
            # Transaction volume scoring
            if profile.avg_monthly_volume > 50000:
                score += 15
            elif profile.avg_monthly_volume > 20000:
                score += 10
            elif profile.avg_monthly_volume > 5000:
                score += 5
            
            # Savings ratio scoring
            if profile.savings_ratio > 0.2:
                score += 10
            elif profile.savings_ratio > 0.1:
                score += 5
            
            # Customer rating scoring
            if profile.customer_rating > 4.0:
                score += 10
            elif profile.customer_rating > 3.0:
                score += 5
            
            return max(0, min(100, score))
            
        except Exception as e:
            logger.error(f"Rule-based scoring failed: {e}")
            return 50  # Default score