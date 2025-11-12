from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db import transaction
from django.utils import timezone
from .models import LoanApplication, Loan, Repayment
from .serializers import LoanApplicationSerializer, LoanSerializer, RepaymentSerializer
from apps.ml_engine.credit_scorer import CreditScoringModel

@api_view(['POST'])
def apply_for_loan(request):
    data = request.data.copy()
    data['user'] = request.user.id
    
    serializer = LoanApplicationSerializer(data=data)
    
    if serializer.is_valid():
        with transaction.atomic():
            loan_application = serializer.save(user=request.user)
            
            # Calculate credit score using ML model
            ml_engine = CreditScoringModel()
            credit_score = ml_engine.calculate_user_score(request.user)
            
            loan_application.credit_score = credit_score
            loan_application.save()
            
            # Auto-approve if score is high enough
            if credit_score >= 70:
                loan_application.status = LoanApplication.STATUS_APPROVED
                loan_application.decision_reason = "Auto-approved based on credit score"
                loan_application.decision_at = timezone.now()
                loan_application.save()
            
            return Response(
                LoanApplicationSerializer(loan_application).data,
                status=status.HTTP_201_CREATED
            )
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def my_loan_applications(request):
    applications = LoanApplication.objects.filter(user=request.user)
    serializer = LoanApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def my_active_loans(request):
    loans = Loan.objects.filter(
        application__user=request.user,
        status__in=[Loan.STATUS_ACTIVE, Loan.STATUS_DEFAULTED]
    )
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def loan_application_detail(request, application_id):
    try:
        application = LoanApplication.objects.get(
            id=application_id, 
            user=request.user
        )
        serializer = LoanApplicationSerializer(application)
        return Response(serializer.data)
    except LoanApplication.DoesNotExist:
        return Response(
            {'error': 'Loan application not found'},
            status=status.HTTP_404_NOT_FOUND
        )

# Admin views
@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def pending_applications(request):
    applications = LoanApplication.objects.filter(
        status=LoanApplication.STATUS_PENDING
    )
    serializer = LoanApplicationSerializer(applications, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def review_application(request, application_id):
    try:
        application = LoanApplication.objects.get(id=application_id)
        action = request.data.get('action')  # 'approve' or 'reject'
        reason = request.data.get('reason', '')
        
        with transaction.atomic():
            if action == 'approve':
                application.status = LoanApplication.STATUS_APPROVED
                application.decision_reason = reason
                
                # Create the actual loan
                loan = create_loan_from_application(application)
                
            elif action == 'reject':
                application.status = LoanApplication.STATUS_REJECTED
                application.decision_reason = reason
            
            application.reviewed_at = timezone.now()
            application.decision_at = timezone.now()
            application.save()
            
            return Response(LoanApplicationSerializer(application).data)
    
    except LoanApplication.DoesNotExist:
        return Response(
            {'error': 'Loan application not found'},
            status=status.HTTP_404_NOT_FOUND
        )

def create_loan_from_application(application):
    """Helper function to create a loan from an approved application"""
    # Calculate loan terms based on credit score and amount
    interest_rate = calculate_interest_rate(application.credit_score)
    service_fee = calculate_service_fee(application.amount_requested)
    
    total_amount_due = application.amount_requested * (1 + interest_rate / 100)
    amount_disbursed = application.amount_requested - service_fee
    
    loan = Loan.objects.create(
        application=application,
        amount_approved=application.amount_requested,
        interest_rate=interest_rate,
        service_fee=service_fee,
        total_amount_due=total_amount_due,
        amount_disbursed=amount_disbursed,
        due_date=timezone.now().date() + timezone.timedelta(
            days=application.repayment_period_days
        )
    )
    
    return loan

def calculate_interest_rate(credit_score):
    """Calculate interest rate based on credit score"""
    if credit_score >= 80:
        return 5.0  # 5% for excellent credit
    elif credit_score >= 60:
        return 7.5  # 7.5% for good credit
    else:
        return 10.0  # 10% for average credit

def calculate_service_fee(loan_amount):
    """Calculate service fee (2% of loan amount, min 50, max 500)"""
    fee = loan_amount * 0.02
    return max(50, min(fee, 500))