import json
import os
from .serializers import *
from django.http import JsonResponse

from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from django.contrib.auth.hashers import check_password, make_password
from django.shortcuts import get_object_or_404, redirect

from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser, IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.pagination import PageNumberPagination

from allauth.socialaccount.models import SocialToken, SocialAccount


User = get_user_model()

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10


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
            if "profile_picture" in request.FILES:
                updated_user.profile_picture = request.FILES["profile_picture"]
                updated_user.save()
            
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_user(request):
    user = request.user
    data = request.data
    updated_fields = []

    # Update username if provided
    if "username" in data and data["username"] != user.username:
        user.username = data["username"]
        updated_fields.append("username")

    # Handle profile image update
    if "profile_picture" in request.FILES:
        # Delete old picture if it exists
        if user.profile_picture:
            # Use Django's delete method to remove the file safely
            user.profile_picture.delete(save=False)

        # Save new image
        user.profile_picture = request.FILES["profile_picture"]
        updated_fields.append("profile_picture")

    # Update password if user provides the old and new password
    if "old_password" in data and "new_password" in data:
        if not user.has_usable_password():
            return Response({"error": "Google users cannot change passwords"}, status=status.HTTP_400_BAD_REQUEST)
        if not check_password(data["old_password"], user.password):
            return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)
        user.password = make_password(data["new_password"])
        updated_fields.append("password")

    # Save the updated user instance
    user.save()

    # Return response indicating successful update
    return Response(
        {"message": f"Updated fields: {', '.join(updated_fields)}"}, 
        status=status.HTTP_200_OK
    )

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


# ----------------------------------------
# Create Project API
# ----------------------------------------

@api_view(['POST', 'GET'])
@permission_classes([IsAdminUser])
def create_project(request):
    # Handle GET request to fetch project categories
    if request.method == "GET":
        return Response({"categories": Project.PROJECT_CATEGORIES}, status=status.HTTP_200_OK)

    # Handle POST request to create a new project
    user = request.user

    # Check if the user has proper permissions (this is handled by IsAdminUser in this case)
    if not user.is_staff and not user.is_superuser:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------
# List all Projects
# ----------------------------------------

@api_view(['GET'])
def project_list(request):
    projects = Project.objects.all()
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(projects, request)
    serializer = ProjectSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# ----------------------------------------
# Get Project Detail
# ----------------------------------------

@api_view(["GET"])
def project_detail(request, slug):
    project = get_object_or_404(Project, slug=slug)
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def project_detail_by_id(request, pk):
    project = get_object_or_404(Project, id=pk)
    serializer = ProjectSerializer(project)
    return Response(serializer.data, status=status.HTTP_200_OK)


# ----------------------------------------
# Update Project API
# ----------------------------------------

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_project(request, pk):
    user = request.user
    project = get_object_or_404(Project, id=pk)

    # Check if the user has permission to update the project
    if not user.is_staff and not user.is_superuser:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    # Handle project image deletion if a new image is uploaded
    new_image = request.FILES.get("project_image")
    if new_image:
        if project.project_image and os.path.isfile(project.project_image.path):
            try:
                os.remove(project.project_image.path)
            except Exception as e:
                return Response({"error": f"Failed to delete old image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Serialize the data with partial=True so that not all fields are required
    serializer = ProjectSerializer(project, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------
# Delete Project API
# ----------------------------------------

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_project(request, pk):
    user = request.user
    project = get_object_or_404(Project, id=pk)

    if not user.is_staff and not user.is_superuser:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
    
     # Delete the old image if it exists
    if project.project_image and os.path.isfile(project.project_image.path):
        os.remove(project.project_image.path)

    project.delete()
    return Response({"message": "Project deleted."}, status=status.HTTP_204_NO_CONTENT)


# ----------------------------------------
# Create Article API
# ----------------------------------------

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def create_article(request):

    # If it's a GET request, return categories
    if request.method == "GET":
        return Response({"categories": Article.CATEGORY_CHOICES}, status=status.HTTP_200_OK)

    # Use serializer to validate and save article data
    serializer = ArticleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(author=request.user)  # Set the current user as the author
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# ----------------------------------------
# List all Articles
# ----------------------------------------

@api_view(['GET'])
def article_list(request):
    articles = Article.objects.all()
    paginator = StandardResultsSetPagination()
    result_page = paginator.paginate_queryset(articles, request)
    serializer = ArticleSerializer(result_page, many=True)
    return paginator.get_paginated_response(serializer.data)

# ----------------------------------------
# Get Article Detail
# ----------------------------------------

@api_view(['GET'])
def article_detail(request, slug):
    article = get_object_or_404(Article, slug=slug)
    serializer = ArticleSerializer(article)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def article_detail_by_id(request, pk):
    article = get_object_or_404(Article, id=pk)
    serializer = ArticleSerializer(article)
    return Response(serializer.data, status=status.HTTP_200_OK)

# ----------------------------------------
# Update Article API
# ----------------------------------------


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_article(request, pk):
    """
    Update an article if the user is the author.
    """
    article = get_object_or_404(Article, id=pk)

    # Check if the logged-in user is the author of the article
    if not article.author or article.author != request.user:
        return Response({"error": "You are not authorized to edit this article."}, status=status.HTTP_403_FORBIDDEN)

    # Check if a new image is being uploaded
    new_image = request.FILES.get("article_image")
    if new_image:
        # Delete the old image if it exists
        if article.article_image and os.path.isfile(article.article_image.path):
            try:
                os.remove(article.article_image.path)
            except Exception as e:
                return Response({"error": f"Failed to delete old image: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Serialize the data and validate
    serializer = ArticleSerializer(article, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()  # Save the article (author remains the same)
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------------------
# Delete Article API
# ----------------------------------------

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_article(request, pk):
    article = get_object_or_404(Article, id=pk)

    # Check if the user is the author or staff
    if article.author != request.user and not request.user.is_staff:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    article.delete()  # Perform delete operation
    return Response({"message": "Article deleted."}, status=status.HTTP_204_NO_CONTENT)


# ----------------------------------------
# List and Create Comments
# ----------------------------------------

@api_view(["GET", "POST"])
@permission_classes([IsAuthenticatedOrReadOnly])
def comment_list_create(request, content_type, object_id):
    """Retrieve or create comments for an article or project"""

    content_type = content_type.lower()
    valid_content_types = {"project", "article"}
    if content_type not in valid_content_types:
        return Response({"error": "Invalid content type"}, status=status.HTTP_400_BAD_REQUEST)

    model_class = Project if content_type == "project" else Article
    related_object = get_object_or_404(model_class, id=object_id)

    # Get the ContentType instance for the related object
    model_type = ContentType.objects.get_for_model(model_class)

    if request.method == "GET":
        # Fetch all comments related to the object, with pagination
        comments = Comment.objects.filter(content_type=model_type, object_id=object_id).order_by("-created_at")
        
        # Apply pagination
        paginator = StandardResultsSetPagination()
        result_page = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(result_page, many=True)
        
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # Create a new comment
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user, content_type=model_type, object_id=object_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ----------------------------------------
# Add Reply to Comment
# ----------------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_reply(request, content_type, object_id, comment_id):
    """Add a reply to a comment"""

    content_type = content_type.lower()
    if content_type not in ["project", "article"]:
        return JsonResponse({"error": "Invalid content type"}, status=400)

    model_class = Project if content_type == "project" else Article
    related_object = get_object_or_404(model_class, id=object_id)
    model_type = ContentType.objects.get_for_model(model_class)

    # Retrieve the parent comment efficiently
    parent_comment = get_object_or_404(Comment, id=comment_id, content_type=model_type, object_id=object_id)
    
    reply_content = request.data.get("content")
    if not reply_content:
        return JsonResponse({'error': 'Content is required'}, status=400)

    reply = Comment.objects.create(
        content=reply_content,
        author=request.user,
        content_type=model_type,
        object_id=object_id,
        parent_comment=parent_comment
    )

    # Return the created reply data
    return JsonResponse({
        'id': reply.id,
        'content': reply.content,
        'author': reply.author.username,
        'created_at': reply.created_at.isoformat(),
        'parent_comment': parent_comment.id
    }, status=201)


# ----------------------------------------
# Get All Replies for a Comment
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticatedOrReadOnly])
def get_replies(request, comment_id):
    """Get all replies for a specific comment"""
    
    replies = Comment.objects.filter(parent_comment_id=comment_id).select_related('author').order_by("-created_at")

    if not replies.exists():
        return Response({"detail": "No replies found."}, status=status.HTTP_404_NOT_FOUND)
    
    reply_serializer = CommentSerializer(replies, many=True)
    return Response(reply_serializer.data, status=status.HTTP_200_OK)


# ----------------------------------------
# Delete a Comment
# ----------------------------------------
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def comment_delete(request, comment_id):
    """Delete a comment if the logged-in user is the author"""

    # Fetch the comment and ensure the user is authorized
    comment = get_object_or_404(Comment, id=comment_id)
    if comment.author != request.user:
        return Response({"error": "You are not authorized to delete this comment"}, status=status.HTTP_403_FORBIDDEN)

    comment.delete()
    return Response({"message": "Comment deleted"}, status=status.HTTP_204_NO_CONTENT)


# ----------------------------------------
# Delete a Reply
# ----------------------------------------
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_reply(request, comment_id, reply_id):
    """Delete a reply if the logged-in user is the author"""
    
    # Fetch the comment and the reply
    comment = get_object_or_404(Comment, id=comment_id)
    reply = get_object_or_404(Comment, id=reply_id, parent_comment=comment)

    # Ensure the user is authorized to delete the reply
    if reply.author != request.user:
        return Response({"detail": "You are not authorized to delete this reply."}, status=status.HTTP_403_FORBIDDEN)

    reply.delete()
    return Response({"detail": "Reply deleted successfully."}, status=status.HTTP_204_NO_CONTENT)