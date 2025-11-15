providers = {
    "DPO Group": {
        "email": "sales@dpogroup.com",
        "website": "https://dpogroup.com",
        "template": """
SUBJECT: API Integration Request - UbuntuCap Fintech Startup

We're UbuntuCap, a fintech startup providing AI-powered credit scoring for African SMEs. 
We need payment processing for loan disbursements and repayments.

Please provide:
1. API documentation
2. Sandbox credentials for testing
3. Onboarding process details

We're ready to integrate immediately.
"""
    },
    "Selcom": {
        "email": "info@selcom.com", 
        "website": "https://selcom.com",
        "template": """
SUBJECT: Merchant Account Application - UbuntuCap

We're UbuntuCap, a digital lending platform for Kenyan SMEs.
We need to process:
- Loan disbursements to customers
- Repayment collections from customers

Please send:
1. API integration guide
2. Sandbox access
3. Commercial terms

We're prepared to go live quickly.
"""
    }
}

print("🚀 APPLY TO THESE PROVIDERS TODAY:\n")
for name, info in providers.items():
    print(f"📧 {name}")
    print(f"Email: {info['email']}")
    print(f"Template: {info['template']}")
    print("-" * 50)
