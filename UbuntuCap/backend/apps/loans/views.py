from rest_framework import status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from django.db.models import Q
from .models import Loan, LoanRepayment, LoanApplication
from .serializers import (
    LoanApplicationSerializer, LoanListSerializer, 
    LoanDetailSerializer, LoanRepaymentSerializer,
    RepaymentCalculationSerializer
)

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
        
        # Create loan application first
        loan_application = LoanApplication.objects.create(
            user=request.user,
            **serializer.validated_data
        )
        
        # TODO: Integrate with ML credit scoring here
        # For now, auto-approve small loans for demo
        if loan_application.amount <= 10000:
            # Create the actual loan
            loan = Loan.objects.create(
                user=request.user,
                amount=loan_application.amount,
                purpose=loan_application.purpose,
                business_type=request.user.business_type or 'other',
                term_days=loan_application.term_days,
                status='approved'
            )
            
            return Response({
                'success': True,
                'loan_id': loan.id,
                'status': loan.status,
                'message': 'Loan application approved successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            # For larger loans, keep as pending for manual review
            return Response({
                'success': True,
                'application_id': loan_application.id,
                'status': 'pending',
                'message': 'Loan application submitted for review'
            }, status=status.HTTP_201_CREATED)
    
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