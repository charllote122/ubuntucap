from django.contrib import admin
from .models import Loan, LoanRepayment, LoanApplication

@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'purpose', 'status', 'application_date', 'due_date')
    list_filter = ('status', 'business_type')
    search_fields = ('user__phone_number', 'user__email', 'purpose')
    readonly_fields = ('application_date',)

@admin.register(LoanRepayment)
class LoanRepaymentAdmin(admin.ModelAdmin):
    list_display = ('loan', 'amount', 'due_date', 'paid_date', 'status')
    list_filter = ('status',)
    search_fields = ('loan__user__phone_number', 'mpesa_receipt')

@admin.register(LoanApplication)
class LoanApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'amount', 'purpose', 'status', 'applied_date')
    list_filter = ('status',)
    search_fields = ('user__phone_number', 'user__email', 'purpose')