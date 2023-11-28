from rest_framework.serializers import ModelSerializer
from .models import Request, Evaluation
from account.serializers import UserSerializer

class RequestSerializer(ModelSerializer):
    created_by = UserSerializer(read_only=True)
    class Meta:
        model = Request
        fields = "__all__"

class EvaluationSerializer(ModelSerializer):
    evaluator = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    request = RequestSerializer(read_only=True)
    class Meta:
        model = Evaluation
        fields = "__all__"
