
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
    path('user/register/', user_create, name='user_create'),
    path("user-profile/", get_user_profile, name="user-profile"),
    path('update-profile/', update_user, name='update_profile'),

    # JWT Authentication endpoints
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Get access & refresh tokens
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresh access token

    # Django REST Framework built-in authentication views
    path('auth/', include('rest_framework.urls')),

    # Django-AllAuth URLs for social authentication
    path('accounts/', include('allauth.urls')),

    # Google OAuth login callback (handles user authentication after login)
    path('callback/', google_login_callback, name='callback'),
    
    # User Profile API (Retrieve & Update authenticated user details)
    path('auth/user/', user_detail, name='user_detail'),

    # Google Token Validation API (Checks if a provided Google OAuth token is valid)
    path('google/validate_token/', validate_google_token, name='validate_token'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
