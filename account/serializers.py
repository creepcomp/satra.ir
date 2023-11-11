from rest_framework.serializers import HyperlinkedModelSerializer
from account.models import User
from django.contrib.auth.models import Group

class GroupSerializer(HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]

class UserSerializer(HyperlinkedModelSerializer):
    groups = GroupSerializer(many=True)
    class Meta:
        model = User
        fields = ["url", "username", "first_name", "last_name", "password", "groups", "is_staff"]
