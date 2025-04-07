from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Project
from django.utils.translation import gettext_lazy as _
from django.utils.html import format_html


class CustomUserAdmin(UserAdmin):
    def profile_thumbnail(self, obj):
        if obj.profile_picture:
            return format_html(
                '<img src="{}" width="30" height="30" style="object-fit: cover; border-radius: 50px;" />',
                obj.profile_picture.url
            )
        return "—"

    profile_thumbnail.short_description = "Profile"

    list_display = ("username", "first_name", "last_name", "email", "profile_thumbnail", "is_staff", "is_active")
    list_filter = ("is_staff", "is_active", "groups")
    search_fields = ("username", "email", "first_name", "last_name")
    ordering = ("username",)

    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (_("Personal info"), {"fields": ("first_name", "last_name", "email", 'profile_picture')}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )

    add_fieldsets = UserAdmin.add_fieldsets + (
        (None, {
            'fields': ('profile_picture', )
        }),
    )
admin.site.register(CustomUser, CustomUserAdmin)

class ProjectAdmin(admin.ModelAdmin):
    """
    Admin configuration for the Project model.
    Provides list display, search, and filtering options.
    """
    list_display = ('title', 'category', 'is_draft', 'published_date')
    list_filter = ('category', 'is_draft')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    ordering = ('-published_date',)

admin.site.register(Project, ProjectAdmin)