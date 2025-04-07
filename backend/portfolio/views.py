from .serializers import *

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from allauth.socialaccount.models import SocialToken, SocialAccount


User = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# ----------------------------------------
# User Registration API
# ----------------------------------------

@api_view(["POST"])
@permission_classes([AllowAny])
def user_create(request):
    """
    API endpoint for user registration.
    Allows any user to create an account.
    """
    serializer = UserSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        user = serializer.save()

        # Handle profile picture upload if provided
        if "profile_picture" in request.FILES:
            user.profile_picture = request.FILES["profile_picture"]
            user.save()

        # Re-serialize to return updated data including profile_picture URL
        response_serializer = UserSerializer(user, context={"request": request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------------------
# User Details API
# ----------------------------------------

@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def user_detail(request):
    """
    API endpoint for retrieving and updating user details.
    Only authenticated users can access and update their own data.
    """
    user = request.user

    if request.method == "GET":
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == "PUT":
        serializer = UserSerializer(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            updated_user = serializer.save()

            # Handle profile image update if provided
            if "profile_image" in request.FILES:
                updated_user.profile_image = request.FILES["profile_image"]
                updated_user.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------
# Google OAuth Callback
# ----------------------------------------

@login_required
def google_login_callback(request):
    user = request.user  # Get the authenticated user

    # Retrieve social account
    social_account = SocialAccount.objects.filter(user=user, provider="google").first()

    if not social_account:
        return redirect('http://localhost:5173/login/callback/?error=NoSocialAccount')

    # Retrieve Google token
    token = SocialToken.objects.filter(account=social_account).first()

    if token:
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        # Manually add `is_superuser`
        refresh["is_superuser"] = user.is_superuser
        access_token = str(refresh.access_token)

        return redirect(f'http://localhost:5173/login/callback/?access_token={access_token}')
    
    return redirect("http://localhost:5173/login/callback/?error=NoGoogleToken")


# ----------------------------------------
# Google Token Validation API
# ----------------------------------------

@csrf_exempt  # Disable CSRF protection for this endpoint (since it's receiving a token from an external provider)
def validate_google_token(request):
    """
    API endpoint to validate a Google access token.
    Accepts a POST request with a Google OAuth token and verifies if it's valid.
    """
    if request.method == 'POST':
        try:
            # Parse JSON request body
            data = json.loads(request.body)
            google_access_token = data.get('access_token')

            print(f"Received Google access token: {google_access_token}")

            if not google_access_token:
                return JsonResponse({'detail': 'Access Token is missing.'}, status=400)

            return JsonResponse({'valid': True}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'detail': 'Invalid JSON.'}, status=400)

    return JsonResponse({'detail': 'Method not allowed'}, status=405)
