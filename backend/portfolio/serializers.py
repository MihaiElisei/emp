from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import *


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    class Meta:
        model = get_user_model()
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'password', 'profile_picture', 'profile_image'
        )
        extra_kwargs = {
            'password': {'write_only': True},
            'email': {'required': True},
        }

    def validate_password(self, value):
        validate_password(value)
        return value

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}".strip()

    def get_profile_image(self, obj):
        request = self.context.get("request")

        # Prefer Google profile picture if available
        if hasattr(obj, 'socialaccount_set') and obj.socialaccount_set.exists():
            google_account = obj.socialaccount_set.filter(provider='google').first()
            if google_account and 'picture' in google_account.extra_data:
                return google_account.extra_data['picture']

        # Fallback to uploaded profile_picture
        if obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url) if request else obj.profile_picture.url

        return None

    def create(self, validated_data):
        """Create a new user instance with a securely hashed password."""
        password = validated_data.pop('password')
        profile_picture = validated_data.pop('uploaded_profile_picture', None)

        user = get_user_model()(**validated_data)
        user.set_password(password)

        # Save user instance first
        user.save()

        # If a profile picture was uploaded, save it
        if profile_picture:
            user.profile_picture = profile_picture
            user.save()

        return user

    def update(self, instance, validated_data):
        """Update user profile including username and profile image."""
        profile_picture = validated_data.pop('uploaded_profile_picture', None)

        # Update user fields (except profile_image)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If a new profile image was uploaded, save it
        if profile_picture:
            # Check if the current profile image is different and delete the old one
            if instance.profile_picture and instance.profile_picture != profile_picture:
                instance.profile_picture.delete(save=False)  # Delete the old image without saving it again

            # Assign the new profile picture
            instance.profile_picture = profile_picture

        # Save the updated instance
        instance.save()
        return instance


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['is_superuser'] = user.is_superuser

        return token


class SimpleAuthorSerializer(serializers.ModelSerializer):
    """Serializer for displaying author information in a simplified format."""

    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'full_name', 'profile_picture')

    full_name = serializers.SerializerMethodField()
    profile_picture = serializers.SerializerMethodField()

    def get_full_name(self, obj):
        """Return the full name of the user."""
        return f"{obj.first_name} {obj.last_name}".strip()
    
    def get_profile_picture(self, obj):
        """ 
        Returns the profile picture from the User model if available,
        otherwise falls back to Google profile picture if the user authenticated with Google.
        """
        request = self.context.get("request")

        # Check if the user has a profile picture
        if obj.profile_picture:
            return request.build_absolute_uri(obj.profile_picture.url) if request else obj.profile_picture.url

        # If no profile picture, check for Google account picture
        if hasattr(obj, 'socialaccount_set') and obj.socialaccount_set.exists():
            google_account = obj.socialaccount_set.filter(provider='google').first()
            if google_account and 'picture' in google_account.extra_data:
                return google_account.extra_data['picture']

        # No image found
        return None
    
class CommentSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer(read_only=True)
    content_object = serializers.SerializerMethodField()  
    class Meta:
        model = Comment
        fields = "__all__"
        read_only_fields = ["id", "author", "created_at"]

    def get_content_object(self, obj):
        """Returns a more human-readable reference to the related object."""
        if isinstance(obj.content_object, Article):
            return {"type": "article", "title": obj.content_object.title, "id": obj.object_id}
        elif isinstance(obj.content_object, Project):
            return {"type": "project", "title": obj.content_object.title, "id": obj.object_id}
        return None

class ProjectSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer(read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = "__all__"

class ArticleSerializer(serializers.ModelSerializer):
    author = SimpleAuthorSerializer(read_only=True)
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = "__all__"
        extra_kwargs = {"author": {"read_only": True}}

class CertificatesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificates
        fields = '__all__'  