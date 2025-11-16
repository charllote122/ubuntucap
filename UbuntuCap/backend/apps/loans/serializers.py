from rest_framework import serializers
from .models import Loan, LoanRepayment
from apps.users.models import User

class LoanApplicationSerializer(serializers.ModelSerializer):
    max_loan_amount = serializers.SerializerMethodField()
    
    class Meta:
        model = Loan
        fields = ['amount', 'purpose', 'term_days', 'business_type', 'max_loan_amount']
        read_only_fields = ['max_loan_amount']
    
    def get_max_loan_amount(self, obj):
        from .services import CreditScoringService
        user = self.context['request'].user
        return CreditScoringService.calculate_max_loan_amount(user)
    
    def validate_amount(self, value):
        from .services import CreditScoringService
        user = self.context['request'].user
        max_amount = CreditScoringService.calculate_max_loan_amount(user)
        
        if value > max_amount:
            raise serializers.ValidationError(f"Loan amount exceeds maximum limit of {max_amount}")
        if value < 1000:
            raise serializers.ValidationError("Loan amount must be at least 1,000")
        return value
    
    def validate_term_days(self, value):
        if value < 7:
            raise serializers.ValidationError("Loan term must be at least 7 days")
        if value > 365:
            raise serializers.ValidationError("Loan term cannot exceed 365 days")
        return value

class LoanRepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = LoanRepayment
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'paid_date']

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
    amount = serializers.DecimalField(max_digits=12, decimal_places=2, min_value=1000)
    term_days = serializers.IntegerField(default=30, min_value=7, max_value=365)
    
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
            'total_interest': float(interest_amount),
            'disbursement_fee': 100.0
        }