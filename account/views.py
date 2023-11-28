from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User, Group
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser, AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST
from .serializers import UserSerializer, GroupSerializer

# Create your views here.

class UserViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data["password"])
        user.save()
    
    def perform_update(self, serializer):
        user = serializer.save()
        user.set_password(self.request.data["password"])
        user.save()

    @action(["POST"], False, permission_classes=[AllowAny])
    def login(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        if username and password:
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return Response({"message": "ورود با موفقیت انجام شد."})
            return Response({"message": "نام کاربری یا رمز عبور صحیح نمی باشد."}, HTTP_400_BAD_REQUEST)
        return Response({"message": "عدم وجود پارامتر های کافی"}, HTTP_400_BAD_REQUEST)
    
    @action(["POST"], False, permission_classes=[AllowAny])
    def logout(self, request):
        logout(request)
        return Response({"message": "خروج با موفقیت انجام شد."})

class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]
