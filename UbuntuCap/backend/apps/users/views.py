from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import login
from .models import User, UserProfile
from .serializers import UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        return Response({
            'message': 'User registered successfully',
            'user_id': user.id,
            'phone_number': user.phone_number
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        login(request, user)
        
        return Response({
            'message': 'Login successful',
            'user_id': user.id,
            'phone_number': user.phone_number,
            'full_name': user.get_full_name()
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def user_profile(request):
    try:
        profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        profile = UserProfile.objects.create(user=request.user)
    
    serializer = UserProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['POST'])
def update_mpesa_consent(request):
    consent_granted = request.data.get('mpesa_consent_granted', False)
    mpesa_phone = request.data.get('mpesa_phone_number')
    
    if consent_granted and not mpesa_phone:
        return Response(
            {'error': 'MPesa phone number is required when granting consent'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    request.user.mpesa_consent_granted = consent_granted
    if mpesa_phone:
        request.user.mpesa_phone_number = mpesa_phone
    request.user.save()
    
    return Response({
        'message': 'MPesa consent updated successfully',
        'mpesa_consent_granted': request.user.mpesa_consent_granted,
        'mpesa_phone_number': request.user.mpesa_phone_number
    })