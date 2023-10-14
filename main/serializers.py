from rest_framework import serializers
from .models import Request, Evaluation
from account.serializers import UserSerializer

class RequestSerializer(serializers.ModelSerializer):
    created_by = UserSerializer()
    class Meta:
        model = Request
        fields = "__all__"

class EvaluationSerializer(serializers.ModelSerializer):
    request = RequestSerializer()
    evaluator = UserSerializer()
    created_by = UserSerializer()
    class Meta:
        model = Evaluation
        fields = "__all__"
