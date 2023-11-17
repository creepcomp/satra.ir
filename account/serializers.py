from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User, Group

class GroupSerializer(ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"

class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"
    
    def update(self, instance, validated_data):
        if validated_data.get("password"):
            print("OK")
            instance.set_password(validated_data.get("password"))
            validated_data.pop("password")
        return super().update(instance, validated_data)
