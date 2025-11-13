from rest_framework import viewsets
from rest_framework.response import Response

class LoanApplicationViewSet(viewsets.ViewSet):
    def list(self, request):
        return Response({"message": "Loans API - Coming soon"})
