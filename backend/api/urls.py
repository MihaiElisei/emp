
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from portfolio.views import * 
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),
    path("", include("portfolio.urls")),

    # User Registration API
    path('api/user/register/', user_create, name='user_create'),
    path('api/update-profile/', update_user, name='update_profile'),

    # JWT Authentication endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access & refresh tokens
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token

    # Django REST Framework built-in authentication views
    path('api/auth/', include('rest_framework.urls')),

    # Django-AllAuth URLs for social authentication
    path('api/accounts/', include('allauth.urls')),

    # Google OAuth login callback (handles user authentication after login)
    path('api/callback/', google_login_callback, name='callback'),
    
    # User Profile API (Retrieve & Update authenticated user details)
    path('api/auth/user/', user_detail, name='user_detail'),

    # Google Token Validation API (Checks if a provided Google OAuth token is valid)
    path('api/google/validate_token/', validate_google_token, name='validate_token'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
