from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer

@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'UbuntuCap API',
        'endpoints': {
            'auth_register': '/api/auth/register/',
            'auth_login': '/api/auth/login/',
            'auth_profile': '/api/auth/profile/',
            'loans': '/api/loans/',
        }
    })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        user.set_password(request.data.get('password'))
        user.save()
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_view(request):
    phone_number = request.data.get('phone_number')
    password = request.data.get('password')
    
    if not phone_number or not password:
        return Response(
            {'error': 'Please provide both phone number and password'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(phone_number=phone_number, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': UserSerializer(user).data
        })
    
    return Response(
        {'error': 'Invalid phone number or password'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

class ProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
