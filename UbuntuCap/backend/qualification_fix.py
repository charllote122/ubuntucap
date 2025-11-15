import re

with open('apps/ubuntucap/services/mpesa_service.py', 'r') as f:
    content = f.read()

# Replace the _check_qualification method
new_qualification_method = '''def _check_qualification(self, user):
        """Check if user qualifies for loans based on M-Pesa history"""
        profile = user.profile
        risks = self._identify_risk_indicators(user)
        
        # Enhanced qualification criteria
        if (float(profile.avg_monthly_volume) >= 5000 and 
            profile.transaction_count_30d >= 5 and 
            profile.income_consistency_score >= 0.3 and
            len(risks) <= 3):
            return 'qualified'
        elif len(risks) >= 5:
            return 'not_qualified'
        else:
            return 'limited_qualification\''''

# Use regex to replace the method
pattern = r'def _check_qualification\(self, user\):.*?return \'limited_qualification\''
content = re.sub(pattern, new_qualification_method, content, flags=re.DOTALL)

with open('apps/ubuntucap/services/mpesa_service.py', 'w') as f:
    f.write(content)

print("✅ Qualification criteria improved")
