from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views, api
from .views import RequestViewSet, EvaluationViewSet

router = DefaultRouter()
router.register("requests", RequestViewSet)
router.register("evaluations", EvaluationViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("", views.index),
    path("requests", views.requests),
    path("presence", views.presence),
    path("evaluations", views.evaluations),
    path("evaluation", views.evaluation),
    path("users", views.users),
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
