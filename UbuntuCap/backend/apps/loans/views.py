from rest_framework import status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from .models import Loan, LoanRepayment
from .serializers import (
    LoanApplicationSerializer, LoanListSerializer, 
    LoanDetailSerializer, LoanRepaymentSerializer,
    RepaymentCalculationSerializer
)
from .services import CreditScoringService

class LoanViewSet(ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Loan.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        if self.action == 'create':
            return LoanApplicationSerializer
        elif self.action == 'list':
            return LoanListSerializer
        return LoanDetailSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Check for existing pending/approved loans
        existing_loan = Loan.objects.filter(
            user=request.user,
            status__in=['pending', 'approved', 'disbursed']
        ).exists()
        
        if existing_loan:
            return Response({
                'success': False,
                'message': 'You have an existing loan application that needs to be completed first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Create loan
            loan = Loan.objects.create(
                user=request.user,
                amount=serializer.validated_data['amount'],
                purpose=serializer.validated_data['purpose'],
                business_type=serializer.validated_data.get('business_type', 'other'),
                term_days=serializer.validated_data.get('term_days', 30),
                status='pending'
            )
            
            # Auto-approve if eligible
            is_eligible, message = CreditScoringService.calculate_loan_eligibility(
                request.user, loan.amount
            )
            
            if is_eligible:
                loan.approve_loan()
                status_msg = 'approved'
            else:
                loan.status = 'rejected'
                loan.save()
                status_msg = 'rejected'
            
            return Response({
                'success': True,
                'loan_id': loan.id,
                'status': loan.status,
                'message': f'Loan application {status_msg}'
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def user_loans(self, request):
        """Get all loans for the authenticated user with optional status filter"""
        status_filter = request.query_params.get('status')
        loans = self.get_queryset()
        
        if status_filter:
            loans = loans.filter(status=status_filter)
        
        page = self.paginate_queryset(loans)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(loans, many=True)
        return Response({
            'success': True,
            'loans': serializer.data
        })
    
    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a loan (admin only)"""
        if not request.user.is_staff:
            return Response({
                'success': False,
                'message': 'Permission denied'
            }, status=status.HTTP_403_FORBIDDEN)
            
        loan = self.get_object()
        success, message = loan.approve_loan()
        
        return Response({
            'success': success,
            'message': message
        })
    
    @action(detail=True, methods=['post'])
    def disburse(self, request, pk=None):
        """Disburse a loan"""
        loan = self.get_object()
        success, message = loan.disburse_loan()
        
        return Response({
            'success': success,
            'message': message
        })
    
    @action(detail=True, methods=['post'])
    def repay(self, request, pk=None):
        """Make a loan repayment"""
        loan = self.get_object()
        amount = request.data.get('amount')
        mpesa_receipt = request.data.get('mpesa_receipt')
        
        if not amount:
            return Response({
                'success': False,
                'message': 'Repayment amount is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            amount = float(amount)
            repayment = loan.add_repayment(amount, mpesa_receipt)
            
            if repayment:
                return Response({
                    'success': True,
                    'message': 'Repayment successful',
                    'remaining_balance': float(loan.remaining_balance)
                })
            else:
                return Response({
                    'success': False,
                    'message': 'Cannot process repayment for this loan'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except ValueError:
            return Response({
                'success': False,
                'message': 'Invalid amount format'
            }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=['get'])
    def calculate_repayment(self, request, pk=None):
        """Calculate repayment schedule for a specific loan"""
        loan = self.get_object()
        
        calculation = {
            'loan_amount': float(loan.amount),
            'term_days': loan.term_days,
            'interest_rate': float(loan.interest_rate),
            'total_repayable': float(loan.total_repayable),
            'daily_repayment': float(loan.total_repayable / loan.term_days),
            'remaining_balance': float(loan.remaining_balance),
            'disbursement_fee': 100.0
        }
        
        return Response({
            'success': True,
            'calculation': calculation
        })
    
    @action(detail=False, methods=['post'])
    def calculate(self, request):
        """Calculate repayment for a hypothetical loan"""
        serializer = RepaymentCalculationSerializer(data=request.data)
        if serializer.is_valid():
            calculation = serializer.calculate_repayment()
            return Response({
                'success': True,
                'calculation': calculation
            })
        return Response({
            'success': False,
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def eligibility(self, request):
        """Check loan eligibility and maximum amount"""
        max_amount = CreditScoringService.calculate_max_loan_amount(request.user)
        is_eligible, message = CreditScoringService.calculate_loan_eligibility(
            request.user, max_amount
        )
        
        return Response({
            'success': True,
            'is_eligible': is_eligible,
            'max_loan_amount': max_amount,
            'message': message
        })

class LoanRepaymentViewSet(ModelViewSet):
    serializer_class = LoanRepaymentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return LoanRepayment.objects.filter(loan__user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        # TODO: Integrate with M-Pesa Daraja API here
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        repayment = serializer.save()
        
        return Response({
            'success': True,
            'message': 'Repayment initiated successfully',
            'repayment_id': repayment.id
        }, status=status.HTTP_201_CREATED)