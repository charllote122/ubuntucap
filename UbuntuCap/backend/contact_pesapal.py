def generate_pesapal_email():
    return """
TO: support@pesapal.com
CC: integrations@pesapal.com
SUBJECT: URGENT: API Credentials Activation for Fintech Startup - UbuntuCap

Dear PesaPal Support Team,

I am the founder of UbuntuCap, a fintech startup building AI-powered credit scoring for African SMEs. 

I received the following API credentials but they appear to be invalid:

Consumer Key: rbpmoIN0Dn5o2+ymhWN85VK4pSuOnVrK
Consumer Secret: mPd/AKquZa4lIwcL7cmFpUf2aGU=

When testing, I get: "invalid_api_credentials_provided" error.

REQUEST:
1. Please activate my API credentials
2. Confirm if these are for sandbox or production
3. Provide the correct API endpoints
4. Send any required documentation

OUR BUSINESS:
- Name: UbuntuCap
- Type: AI Credit Scoring & Digital Lending
- Market: Kenyan SMEs
- Stage: Ready for live payments

We're ready to go live and need working credentials urgently. Please advise on next steps.

Thank you,
[Your Name]
Founder, UbuntuCap
Phone: [Your Phone]
Email: [Your Email]
"""

print("📧 Copy and send this email to PesaPal:")
print(generate_pesapal_email())
