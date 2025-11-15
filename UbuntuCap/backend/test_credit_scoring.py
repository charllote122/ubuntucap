import os
import django
import sys

# Add the project directory to Python path
sys.path.append('/workspaces/ubuntucap/UbuntuCap/backend')

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ubuntucap.settings')
django.setup()

from apps.users.models import User, UserProfile
from apps.ubuntucap.ml_engine.credit_scorer import CreditScoringModel
from apps.ubuntucap.services.mpesa_service import MpesaService

def test_credit_scoring():
    print("🧪 Testing Credit Scoring System...")
    
    # Get or create a test user
    try:
        user = User.objects.first()
        if not user:
            print("❌ No users found in database. Please create a user first.")
            return
        
        print(f"✅ Testing with user: {user.phone_number}")
        
        # Test M-Pesa service
        print("\n1. Testing M-Pesa Service...")
        mpesa_service = MpesaService()
        transactions = mpesa_service.get_transaction_history(user)
        print(f"   ✅ Generated {len(transactions)} mock transactions")
        
        # Test credit scoring
        print("\n2. Testing Credit Scoring...")
        credit_model = CreditScoringModel()
        score = credit_model.predict_credit_score(user)
        risk_level, risk_desc = credit_model.predict_credit_risk(user)
        print(f"   ✅ Credit Score: {score}")
        print(f"   ✅ Risk Level: {risk_level}")
        print(f"   ✅ Risk Description: {risk_desc}")
        
        # Test score breakdown
        print("\n3. Testing Score Breakdown...")
        breakdown = credit_model.get_score_breakdown(user)
        print(f"   ✅ Final Score: {breakdown['final_score']}")
        print(f"   ✅ Breakdown: {breakdown}")
        
        # Test M-Pesa analysis
        print("\n4. Testing M-Pesa Analysis...")
        analysis = mpesa_service.analyze_credit_worthiness(user)
        print(f"   ✅ Qualification: {analysis.get('qualification_status', 'N/A')}")
        print(f"   ✅ Recommended Limit: KES {analysis.get('recommended_loan_limit', 0):,.2f}")
        
        print("\n🎉 All tests completed successfully!")
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_credit_scoring()
