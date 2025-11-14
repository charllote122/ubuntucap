from rest_framework import serializers
from .models import Loan, LoanRepayment, LoanApplication
from apps.users.models import User

class LoanApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanApplication
        fields = ['amount', 'purpose', 'term_days', 'business_age_months', 
                 'existing_loans_count', 'average_monthly_sales']
    
    def validate_amount(self, value):
        if value > 500000:
            raise serializers.ValidationError("Loan amount exceeds maximum limit of 500,000")
        if value < 1000:
            raise serializers.ValidationError("Loan amount must be at least 1,000")
        return value

class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class LoanListSerializer(serializers.ModelSerializer):
    remaining_balance = serializers.ReadOnlyField()
    total_repayable = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    
    class Meta:
        model = Loan
        fields = [
            'id', 'amount', 'purpose', 'status', 'application_date',
            'due_date', 'repaid_amount', 'remaining_balance', 'total_repayable',
            'interest_rate', 'term_days', 'is_overdue'
        ]

class LoanDetailSerializer(serializers.ModelSerializer):
    repayments = LoanRepaymentSerializer(many=True, read_only=True)
    remaining_balance = serializers.ReadOnlyField()
    total_repayable = serializers.ReadOnlyField()
    is_overdue = serializers.ReadOnlyField()
    user_phone = serializers.CharField(source='user.phone_number', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    
    class Meta:
        model = Loan
        fields = '__all__'

class RepaymentCalculationSerializer(serializers.Serializer):
    amount = serializers.DecimalField(max_digits=12, decimal_places=2)
    term_days = serializers.IntegerField(default=30)
    
    def calculate_repayment(self):
        amount = self.validated_data['amount']
        term_days = self.validated_data['term_days']
        interest_rate = 8.5  # Base interest rate
        
        interest_amount = amount * interest_rate / 100
        total_repayable = amount + interest_amount
        daily_repayment = total_repayable / term_days
        
        return {
            'loan_amount': float(amount),
            'term_days': term_days,
            'interest_rate': interest_rate,
            'total_repayable': float(total_repayable),
            'daily_repayment': float(daily_repayment),
            'disbursement_fee': 100.0
        }