from rest_framework import serializers
from .models import LoanApplication, Loan, Repayment

class LoanApplicationSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True)
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    
    class Meta:
        model = LoanApplication
        fields = [
            'id', 'user', 'user_full_name', 'user_phone', 'amount_requested',
            'loan_purpose', 'repayment_period_days', 'status', 'credit_score',
            'decision_reason', 'applied_at', 'reviewed_at', 'decision_at'
        ]
        read_only_fields = [
            'id', 'user', 'status', 'credit_score', 'decision_reason',
            'applied_at', 'reviewed_at', 'decision_at'
        ]
    
    def validate_amount_requested(self, value):
        if value < 100:
            raise serializers.ValidationError("Minimum loan amount is 100 KSh")
        if value > 50000:
            raise serializers.ValidationError("Maximum loan amount is 50,000 KSh for first-time borrowers")
        return value

class LoanSerializer(serializers.ModelSerializer):
    user_full_name = serializers.CharField(source='application.user.get_full_name', read_only=True)
    user_phone = serializers.CharField(source='application.user.phone_number', read_only=True)
    loan_purpose = serializers.CharField(source='application.loan_purpose', read_only=True)
    
    class Meta:
        model = Loan
        fields = [
            'id', 'user_full_name', 'user_phone', 'amount_approved',
            'interest_rate', 'service_fee', 'total_amount_due', 'amount_disbursed',
            'disbursement_date', 'due_date', 'status', 'amount_repaid', 
            'last_repayment_date', 'loan_purpose'
        ]
        read_only_fields = ['id', 'disbursement_date', 'status']

class RepaymentSerializer(serializers.ModelSerializer):
    user_phone = serializers.CharField(source='loan.application.user.phone_number', read_only=True)
    loan_id = serializers.UUIDField(source='loan.id', read_only=True)
    
    class Meta:
        model = Repayment
        fields = [
            'id', 'loan_id', 'user_phone', 'amount', 'mpesa_receipt_number',
            'phone_number', 'transaction_date', 'recorded_at'
        ]
        read_only_fields = ['id', 'recorded_at']