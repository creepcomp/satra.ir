from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.shortcuts import render
from .views import UserViewSet, GroupViewSet

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("groups", GroupViewSet)

urlpatterns = [
    path("login", lambda request: render(request, "login.html")),
    path("api/", include(router.urls)),
]