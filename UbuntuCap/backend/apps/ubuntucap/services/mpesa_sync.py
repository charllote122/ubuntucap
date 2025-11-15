import requests
import base64
from datetime import datetime, timedelta
from django.conf import settings
from django.utils import timezone
import logging
import json
import random
from decimal import Decimal

logger = logging.getLogger(__name__)

class MpesaService:
    def __init__(self):
        self.consumer_key = getattr(settings, 'MPESA_CONSUMER_KEY', 'test_consumer_key')
        self.consumer_secret = getattr(settings, 'MPESA_CONSUMER_SECRET', 'test_secret')
        self.base_url = getattr(settings, 'MPESA_BASE_URL', 'https://sandbox.safaricom.co.ke')
    
    def get_access_token(self):
        """Get OAuth token from M-Pesa"""
        try:
            # For development, return a mock token
            # In production, implement actual M-Pesa OAuth
            return "mock_access_token_12345"
                
        except Exception as e:
            logger.error(f"Error getting access token: {e}")
            return None
    
    def get_transaction_history(self, user, days=90):
        """
        Get user's M-Pesa transaction history
        Note: This uses a mock implementation for development
        """
        try:
            from apps.users.models import MpesaTransaction
            
            # Generate realistic mock transactions
            transactions = self._generate_mock_transactions(user, days)
            
            # Update user profile with analyzed data
            self._update_user_profile_from_transactions(user, transactions)
            
            return transactions
            
        except Exception as e:
            logger.error(f"Error getting transaction history: {e}")
            return []
    
    def _generate_mock_transactions(self, user, days):
        """Generate realistic mock transactions for development"""
        from apps.users.models import MpesaTransaction
        
        transactions = []
        now = timezone.now()
        
        # Base transaction count based on user's business profile
        base_transactions = 45  # Average of 15 transactions per month
        
        for i in range(base_transactions):
            transaction_date = now - timedelta(days=random.randint(0, days))
            
            # Vary amount based on user's business type
            if user.business_type == 'Retail':
                base_amount = 2500
            elif user.business_type == 'Wholesale':
                base_amount = 8000
            else:
                base_amount = 1500
                
            amount = Decimal(random.uniform(base_amount * 0.3, base_amount * 2.5))
            
            # More realistic transaction types based on business
            if random.random() < 0.6:  # 60% receive money (income)
                transaction_type = 'receive_money'
            else:
                transaction_type = random.choice(['send_money', 'pay_bill', 'buy_goods'])
            
            transaction = MpesaTransaction(
                user=user,
                transaction_id=f"MPE{random.randint(1000000000, 9999999999)}",
                transaction_type=transaction_type,
                amount=amount,
                balance_after=Decimal(random.uniform(5000, 50000)),
                sender="254700000000" if transaction_type == 'receive_money' else user.phone_number,
                receiver=user.phone_number if transaction_type == 'receive_money' else "254711000000",
                description=f"Payment for {user.business_type} business" if transaction_type == 'receive_money' else f"Business expense: {transaction_type.replace('_', ' ')}",
                transaction_time=transaction_date,
                is_high_risk=random.random() < 0.03  # 3% chance of high risk
            )
            transactions.append(transaction)
        
        return transactions
    
    def _update_user_profile_from_transactions(self, user, transactions):
        """Analyze transactions and update user profile"""
        try:
            from apps.users.models import UserProfile
            
            profile, created = UserProfile.objects.get_or_create(user=user)
            
            if not transactions:
                return
            
            # Calculate key metrics
            total_amount = sum(t.amount for t in transactions)
            transaction_count = len(transactions)
            avg_amount = total_amount / transaction_count if transaction_count > 0 else 0
            
            # Count transactions by type
            receive_count = len([t for t in transactions if t.transaction_type == 'receive_money'])
            send_count = len([t for t in transactions if t.transaction_type in ['send_money', 'pay_bill', 'buy_goods']])
            
            # Calculate consistency (ratio of receive transactions)
            income_consistency = receive_count / transaction_count if transaction_count > 0 else 0
            
            # Update profile
            profile.avg_monthly_volume = total_amount * (30/90)  # Extrapolate to monthly
            profile.avg_transaction_amount = avg_amount
            profile.transaction_count_90d = transaction_count
            profile.transaction_count_30d = int(transaction_count / 3)
            profile.transaction_consistency = income_consistency
            profile.income_consistency_score = income_consistency
            profile.has_regular_income = income_consistency > 0.5  # Regular if >50% are incoming
            
            # Calculate savings ratio (simplified - income vs expenses)
            if receive_count > 0:
                total_income = sum(t.amount for t in transactions if t.transaction_type == 'receive_money')
                total_expenses = sum(t.amount for t in transactions if t.transaction_type != 'receive_money')
                if total_income > 0:
                    profile.savings_ratio = max(0, (total_income - total_expenses) / total_income)
            
            # Set activity level
            if profile.transaction_count_30d >= 40:
                profile.mpesa_activity_level = 'very_high'
            elif profile.transaction_count_30d >= 25:
                profile.mpesa_activity_level = 'high'
            elif profile.transaction_count_30d >= 15:
                profile.mpesa_activity_level = 'medium'
            else:
                profile.mpesa_activity_level = 'low'
            
            profile.mpesa_last_sync = timezone.now()
            profile.save()
            
            # Save transactions to database
            for transaction in transactions:
                try:
                    transaction.save()
                except:
                    pass  # Skip if transaction already exists
            
            logger.info(f"Updated profile for {user.phone_number} with {transaction_count} transactions")
            
        except Exception as e:
            logger.error(f"Error updating profile from transactions: {e}")
    
    def analyze_credit_worthiness(self, user):
        """Analyze user's M-Pesa history for loan qualification"""
        try:
            profile = user.profile
            
            analysis = {
                'transaction_volume_score': self._calculate_volume_score(float(profile.avg_monthly_volume)),
                'transaction_frequency_score': self._calculate_frequency_score(profile.transaction_count_30d),
                'consistency_score': profile.income_consistency_score,
                'balance_stability_score': self._calculate_stability_score(user),
                'savings_capacity_score': min(1.0, profile.savings_ratio),
                'risk_indicators': self._identify_risk_indicators(user),
                'recommended_loan_limit': self._calculate_loan_limit(user),
                'qualification_status': self._check_qualification(user)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing credit worthiness: {e}")
            return None
    
    def _calculate_volume_score(self, monthly_volume):
        """Score based on transaction volume"""
        if monthly_volume > 100000: return 1.0
        elif monthly_volume > 50000: return 0.8
        elif monthly_volume > 25000: return 0.6
        elif monthly_volume > 10000: return 0.4
        else: return 0.2
    
    def _calculate_frequency_score(self, monthly_transactions):
        """Score based on transaction frequency"""
        if monthly_transactions >= 40: return 1.0
        elif monthly_transactions >= 25: return 0.8
        elif monthly_transactions >= 15: return 0.6
        elif monthly_transactions >= 8: return 0.4
        else: return 0.2
    
    def _calculate_stability_score(self, user):
        """Score based on transaction pattern stability"""
        profile = user.profile
        score = 0.5  # Base score
        
        # Add points for regular income
        if profile.has_regular_income:
            score += 0.3
        
        # Add points for good consistency
        if profile.income_consistency_score > 0.7:
            score += 0.2
        
        return min(1.0, score)
    
    def _identify_risk_indicators(self, user):
        """Identify potential risk factors from M-Pesa data"""
        profile = user.profile
        risks = []
        
        if profile.avg_monthly_volume < 5000:
            risks.append('low_transaction_volume')
        
        if profile.transaction_count_30d < 5:
            risks.append('low_transaction_frequency')
        
        if profile.income_consistency_score < 0.3:
            risks.append('irregular_income_pattern')
        
        if profile.savings_ratio < 0:
            risks.append('negative_savings_trend')
        
        return risks
    
    def _calculate_loan_limit(self, user):
        """Calculate recommended loan limit based on M-Pesa activity"""
        profile = user.profile
        base_limit = float(profile.avg_monthly_volume) * 0.3  # 30% of monthly volume
        
        # Adjust based on transaction frequency
        frequency_multiplier = min(2.0, profile.transaction_count_30d / 20)
        
        # Adjust based on consistency
        consistency_multiplier = profile.income_consistency_score * 1.5
        
        final_limit = base_limit * frequency_multiplier * consistency_multiplier
        
        return min(100000, max(1000, final_limit))  # Cap between 1,000 and 100,000
    
    def _check_qualification(self, user):
        """Check if user qualifies for loans based on M-Pesa history"""
        profile = user.profile
        risks = self._identify_risk_indicators(user)
        
        # Basic qualification criteria
        if (profile.avg_monthly_volume >= 10000 and 
            profile.transaction_count_30d >= 8 and 
            profile.income_consistency_score >= 0.4 and
            len(risks) <= 2):
            return 'qualified'
        elif len(risks) >= 4:
            return 'not_qualified'
        else:
            return 'limited_qualification'