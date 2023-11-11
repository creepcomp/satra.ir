from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from . import api
from .views import UserViewSet, GroupViewSet

router = DefaultRouter()
router.register("users", UserViewSet)
router.register("groups", GroupViewSet)

urlpatterns = [
    path("login", views.login),
    path("logout", views.logout),
    path("api/login", api.login),
    path("api/", include(router.urls)),
    path("api/get_user", api.get_user),
    path("api/get_users", api.get_users),
    path("api/save_user", api.save_user),
    path("api/delete_user", api.delete_user)
]