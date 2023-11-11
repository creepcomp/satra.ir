import json
from django.http import JsonResponse
from django.contrib.auth import authenticate, login as _login
from account.models import User
from .serializers import UserSerializer
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def login(request):
    data = json.loads(request.body)
    user = authenticate(request, username=data["username"], password=data["password"])
    if user:
        _login(request, user)
        return JsonResponse({"status": "success", "message": "ورود با موفقیت انجام شد."})
    else:
        return JsonResponse({"status": "failed", "message": "نام کاربری / رمز عبور اشتباه است."})

def get_user(request):
    if request.user.is_superuser:
        data = json.loads(request.body or "{}")
        user = User.objects.get(**data)
        user = UserSerializer(user)
        return JsonResponse({"status": "success", "user": user.data})

def get_users(request):
    if request.user.is_superuser:
        data = json.loads(request.body or "{}")
        users = User.objects.filter(**data)
        users = UserSerializer(users, many=True)
        return JsonResponse({"status": "success", "users": users.data})

def save_user(request):
    if request.user.is_superuser:
        data = json.loads(request.body or "{}")
        if "id" in data:
            user = User.objects.get(id=data["id"])
        else:
            user = User.objects.create()
        if "groups" in data:
            user.groups.set(data["groups"])
            del data["groups"]
        if "password" in data:
            user.set_password(data["password"])
            del data["password"]
        for k, v in data.items():
            setattr(user, k, v)
        user.save()
        return JsonResponse({"status": "success", "users": UserSerializer(User.objects, many=True).data})
    
def delete_user(request):
    if request.user.is_superuser:
        data = json.loads(request.body or "{}")
        User.objects.get(id=data["id"]).delete()
        return JsonResponse({"status": "success", "users": UserSerializer(User.objects, many=True).data})
