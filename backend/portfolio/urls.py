from django.urls import path
from . import views

urlpatterns = [
    path('api/projects/', views.project_list, name='project_list'),
    path('api/create-project/', views.create_project, name='create_project'),
    path('api/projects/<slug:slug>/', views.project_detail, name='project_detail'),
    path('api/projects/id/<int:pk>/', views.project_detail_by_id, name='project_detail_by_id'),
    path('api/update-project/<int:pk>/', views.update_project, name='update_project'),
    path('api/delete-project/<int:pk>/', views.delete_project, name='delete_project'),
    
]