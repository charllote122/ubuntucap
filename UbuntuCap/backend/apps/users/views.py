from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from .models import User, UserProfile
from .serializers import UserSerializer, UserProfileSerializer, LoginSerializer
import logging

logger = logging.getLogger(__name__)

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
        try:
            print(f"🔵 [RegisterView] Registration attempt: {request.data}")
            
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            
            # Create user with the validated data
            user = serializer.save()
            
            print(f"🟢 [RegisterView] User created successfully: {user.phone_number}")
            
            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            response_data = {
                'user': UserSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
            
            print(f"🟢 [RegisterView] Registration completed for: {user.phone_number}")
            return Response(response_data, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            print(f"🔴 [RegisterView] Registration error: {str(e)}")
            logger.error(f"Registration error: {str(e)}")
            return Response(
                {'error': 'Registration failed. Please check your information.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    try:
        phone_number = request.data.get('phone_number', '').strip()
        password = request.data.get('password', '').strip()
        
        # Debug logging
        logger.info(f"Login attempt - Phone: {phone_number}")
        print(f"🔵 [login_view] Login attempt - Phone: '{phone_number}'")
        
        if not phone_number or not password:
            logger.warning("Missing phone number or password")
            return Response(
                {'error': 'Please provide both phone number and password'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Clean phone number (remove spaces)
        clean_phone = phone_number.replace(' ', '')
        print(f"🔵 [login_view] Clean phone: '{clean_phone}'")
        
        # Use Django's authenticate
        user = authenticate(request, username=clean_phone, password=password)
        print(f"🔵 [login_view] Authenticate result: {user}")
        
        if user is not None and user.is_active:
            refresh = RefreshToken.for_user(user)
            logger.info(f"Successful login for user: {user.phone_number}")
            
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user': UserSerializer(user).data
            }
            
            print(f"🟢 [login_view] Login successful for: {user.phone_number}")
            return Response(response_data)
        
        # If authentication failed
        logger.warning(f"Failed login attempt for phone: {clean_phone}")
        
        # Provide specific error messages
        try:
            user_exists = User.objects.filter(phone_number=clean_phone).exists()
            if user_exists:
                return Response(
                    {'error': 'Invalid password'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            else:
                return Response(
                    {'error': 'Phone number not registered'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
        except Exception:
            return Response(
                {'error': 'Invalid phone number or password'}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        print(f"🔴 [login_view] ERROR: {str(e)}")
        return Response(
            {'error': 'Internal server error'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user.profile