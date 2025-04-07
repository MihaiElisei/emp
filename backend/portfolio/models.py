from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
from django.utils.translation import gettext_lazy as _
import uuid


class CustomUser(AbstractUser):
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)

    def __str__(self):
        return self.username


class Project(models.Model):

    PROJECT_CATEGORIES = [
        ("web_dev", "Web Development"),
        ("mobile_app", "Mobile App Development"),
        ("ai_ml", "AI & Machine Learning"),
        ("cybersecurity", "Cybersecurity"),
        ("data_science", "Data Science"),
        ("game_dev", "Game Development"),
        ("cloud", "Cloud Computing"),
        ("devops", "DevOps & Automation"),
        ("software", "Software Engineering"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    project_image = models.ImageField(upload_to="projects/", null=True, blank=True)
    technologies = models.JSONField(default=list, blank=True)
    github_link = models.URLField(blank=True, null=True)
    live_demo = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=PROJECT_CATEGORIES, default="other")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_date = models.DateTimeField(null=True, blank=True)
    is_draft = models.BooleanField(default=True)

    class Meta:
        ordering = ["-published_date"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            while Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            self.slug = slug

        if not self.is_draft and not self.published_date:
            self.published_date = timezone.now()

        super().save(*args, **kwargs)

    def get_category_display(self):
        """ Get the human-readable category name. """
        return dict(self.PROJECT_CATEGORIES).get(self.category, "Other")
    
    
class Article(models.Model):
    CATEGORY_CHOICES = [
        ("tech", "Technology"),
        ("programming", "Programming"),
        ("web_dev", "Web Development"),
        ("ai_ml", "Artificial Intelligence & Machine Learning"),
        ("cybersecurity", "Cybersecurity"),
        ("software", "Software Engineering"),
        ("business", "Business & Startups"),
        ("data_science", "Data Science"),
        ("finance", "Finance & Investment"),
        ("design", "UI/UX & Product Design"),
        ("other", "Other"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    article_image = models.ImageField(upload_to="articles/", null=True, blank=True)
    author = models.ForeignKey(CustomUser, on_delete=models.SET_NULL, related_name="articles", null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_date = models.DateTimeField(null=True, blank=True)
    is_draft = models.BooleanField(default=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default="other")

    class Meta:
        ordering = ["-published_date"]

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            while Article.objects.filter(slug=slug).exists():  
                slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"
            self.slug = slug

        if self.is_draft:
            self.published_date = None
        elif not self.published_date:
            self.published_date = timezone.now()

        super().save(*args, **kwargs)
    
    def get_category_display(self):
        """ Get the human-readable category name. """
        return dict(self.CATEGORY_CHOICES).get(self.category, "Other")

    def __str__(self):
        return self.title
    
class Comment(models.Model):
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Parent comment field to support replies
    parent_comment = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)

    def __str__(self):
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"Comment by {self.author} on {self.content_object} - {content_preview}"