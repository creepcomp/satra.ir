from django.urls import path
from . import views, api

urlpatterns = [
    path("", views.index),
    path("evaluation", views.evaluation),
    path("api/get_request", api.get_request),
    path("api/get_requests", api.get_requests),
    path("api/save_request", api.save_request),
    path("api/delete_request", api.delete_request),
    path("api/upload", api.upload),
    path("api/upload_files", api.upload_files),
    path("api/get_evaluation", api.get_evaluation),
    path("api/get_evaluations", api.get_evaluations),
    path("api/create_evaluation", api.create_evaluation),
    path("api/save_evaluation", api.save_evaluation),
    path("api/delete_evaluation", api.delete_evaluation)
]
