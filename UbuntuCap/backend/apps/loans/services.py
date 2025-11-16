from apps.users.models import UserProfile

class CreditScoringService:
    @staticmethod
    def calculate_loan_eligibility(user, loan_amount):
        try:
            profile = user.profile
            
            # Basic eligibility checks
            if profile.credit_score < 300:
                return False, "Credit score too low"
            
            if loan_amount > profile.avg_monthly_volume * 0.3 and profile.avg_monthly_volume > 0:
                return False, "Loan amount exceeds 30% of monthly volume"
            
            # Risk assessment
            risk_factors = 0
            if profile.negative_balance_count > 5:
                risk_factors += 1
            if profile.transaction_count_30d < 10:
                risk_factors += 1
            if profile.income_consistency_score < 0.5:
                risk_factors += 1
            if profile.high_risk_transactions > 5:
                risk_factors += 1
            
            if risk_factors >= 2:
                return False, "High risk profile detected"
            
            return True, "Eligible for loan"
            
        except UserProfile.DoesNotExist:
            return False, "User profile not complete"

    @staticmethod
    def calculate_interest_rate(user, loan_amount, term_days):
        base_rate = 8.5  # Base interest rate
        
        # Adjust based on credit score
        profile = user.profile
        if profile.credit_score > 700:
            base_rate -= 2.0
        elif profile.credit_score < 500:
            base_rate += 3.0
            
        # Adjust based on loan amount
        if loan_amount > 50000:
            base_rate += 1.5
            
        # Adjust based on business age
        if user.business_age_months > 24:  # 2+ years in business
            base_rate -= 1.0
            
        return min(15.0, max(5.0, base_rate))  # Cap between 5-15%

    @staticmethod
    def calculate_max_loan_amount(user):
        """Calculate maximum loan amount user can qualify for"""
        try:
            profile = user.profile
            
            # Base on monthly transaction volume
            if profile.avg_monthly_volume > 0:
                max_amount = profile.avg_monthly_volume * 0.3  # 30% of monthly volume
            else:
                max_amount = 5000  # Default for new users
                
            # Adjust based on credit score
            if profile.credit_score > 700:
                max_amount *= 1.5
            elif profile.credit_score < 500:
                max_amount *= 0.5
                
            return min(500000, max(1000, max_amount))  # Cap between 1,000-500,000
            
        except UserProfile.DoesNotExist:
            return 5000  # Default amount for new users