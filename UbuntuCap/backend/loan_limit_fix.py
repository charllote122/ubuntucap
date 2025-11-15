# Simple script to replace the loan limit calculation method
import re

with open('apps/ubuntucap/services/mpesa_service.py', 'r') as f:
    content = f.read()

# Replace the _calculate_loan_limit method
old_pattern = r'def _calculate_loan_limit\(self, user\):.*?return min\(100000, max\(1000, final_limit\)\)'
new_method = '''def _calculate_loan_limit(self, user):
        """Calculate recommended loan limit based on M-Pesa activity"""
        profile = user.profile
        base_limit = float(profile.avg_monthly_volume) * 0.5  # 50% of monthly volume
        
        # Adjust based on transaction frequency
        frequency_multiplier = min(3.0, max(0.5, profile.transaction_count_30d / 15))
        
        # Adjust based on consistency
        consistency_multiplier = max(0.5, profile.income_consistency_score * 2.0)
        
        # Adjust based on business age
        business_age_multiplier = min(2.0, max(0.5, user.business_age_months / 12))
        
        final_limit = base_limit * frequency_multiplier * consistency_multiplier * business_age_multiplier
        
        return min(500000, max(5000, final_limit))  # Cap between 5,000 and 500,000'''

# Use regex to replace the method
pattern = r'def _calculate_loan_limit\(self, user\):.*?return min\(100000, max\(1000, final_limit\)\)'
content = re.sub(pattern, new_method, content, flags=re.DOTALL)

with open('apps/ubuntucap/services/mpesa_service.py', 'w') as f:
    f.write(content)

print("✅ Loan limit calculation improved")
