from django.db import models
from django.utils.text import slugify
from django.utils import timezone
from django.contrib.auth.models import AbstractUser
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
            if Project.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{uuid.uuid4().hex[:6]}" 
            self.slug = slug

        if not self.is_draft and not self.published_date:
            self.published_date = timezone.now()

        super().save(*args, **kwargs)

    def get_category_display(self):
        """ Get the human-readable category name. """
        return dict(self.PROJECT_CATEGORIES).get(self.category, "Other")