from django.urls import path
from . import views
from . import api

urlpatterns = [
    path("login", views.login),
    path("logout", views.logout),
    path("api/login", api.login),
    path("api/get_user", api.get_user),
    path("api/get_users", api.get_users),
    path("api/save_user", api.save_user),
    path("api/delete_user", api.delete_user),
    path("api/get_group", api.get_group),
    path("api/get_groups", api.get_groups),
    path("api/save_group", api.save_group),
    path("api/delete_group", api.delete_group)
]