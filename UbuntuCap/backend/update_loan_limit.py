# Read the file
with open('apps/ubuntucap/services/mpesa_service.py', 'r') as f:
    lines = f.readlines()

# Find and replace the loan limit method
new_method = '''    def _calculate_loan_limit(self, user):
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
        
        return min(500000, max(5000, final_limit))  # Cap between 5,000 and 500,000
'''

in_method = False
method_start = -1
method_end = -1
output_lines = []

for i, line in enumerate(lines):
    if 'def _calculate_loan_limit(self, user):' in line:
        in_method = True
        method_start = i
        output_lines.append(new_method)
    elif in_method and line.strip() == '':
        continue
    elif in_method and line.startswith('    def ') and 'def _calculate_loan_limit' not in line:
        method_end = i
        in_method = False
        output_lines.append(line)
    elif not in_method:
        output_lines.append(line)

# Write the updated content
with open('apps/ubuntucap/services/mpesa_service.py', 'w') as f:
    f.writelines(output_lines)

print("✅ Loan limit calculation updated")
