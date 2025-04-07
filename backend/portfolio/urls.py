from django.urls import path
from . import views

urlpatterns = [
    path('api/projects/', views.project_list, name='project_list'),
    path('api/create-project/', views.create_project, name='create_project'),
    path('api/projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('api/projects/id/<int:pk>/', views.project_detail_by_id, name='project_detail_by_id'),
    path('api/update-project/<int:pk>/', views.update_project, name='update_project'),
    path('api/delete-project/<int:pk>/', views.delete_project, name='delete_project'),
    
    path('api/articles/', views.article_list, name='article_list'),
    path('api/create-article/', views.create_article, name='create_article'),
    path('api/update-article/<int:pk>/', views.update_article, name='update_article'),
    path('api/articles/id/<int:pk>/', views.article_detail_by_id, name='article_detail_by_id'),
    path("api/articles/<slug:slug>/", views.article_detail, name="article-detail"),
    path('api/delete-article/<int:pk>/', views.delete_article, name='delete_article'),

    path("api/comments/<str:content_type>/<int:object_id>/", views.comment_list_create, name="comment-list-create"),
    path('api/comments/<str:content_type>/<int:object_id>/<int:comment_id>/replies/', views.add_reply, name='add_reply'),
    path('api/comments/<int:comment_id>/replies/', views.get_replies, name='get-replies'),
    path("api/comments/<int:comment_id>/delete/", views.comment_delete, name="comment-delete"),
    path('api/comments/<int:comment_id>/replies/<int:reply_id>/delete/', views.delete_reply, name='delete-reply'),
]