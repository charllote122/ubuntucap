import os
import django
import sys

sys.path.append('/workspaces/ubuntucap/UbuntuCap/backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ubuntucap.settings')
django.setup()

from apps.ubuntucap.services.mpesa_service import MpesaService
from apps.users.models import User

def fix_mock_transactions():
    """Update the mock transaction generation to fix decimal issues"""
    
    # Find the MpesaService file and update the problematic line
    mpesa_service_path = 'apps/ubuntucap/services/mpesa_service.py'
    
    with open(mpesa_service_path, 'r') as f:
        content = f.read()
    
    # Replace the problematic line that multiplies decimal by float
    old_line = "profile.avg_monthly_volume = total_amount * (30/90)  # Extrapolate to monthly"
    new_line = "profile.avg_monthly_volume = float(total_amount) * (30/90)  # Extrapolate to monthly"
    
    if old_line in content:
        content = content.replace(old_line, new_line)
        with open(mpesa_service_path, 'w') as f:
            f.write(content)
        print("✅ Fixed Decimal/Float issue in MpesaService")
    else:
        print("✅ Line already fixed or not found")

if __name__ == "__main__":
    fix_mock_transactions()
