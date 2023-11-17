from rest_framework.serializers import ModelSerializer
from .models import Request, Evaluation

class RequestSerializer(ModelSerializer):
    class Meta:
        model = Request
        fields = "__all__"

class EvaluationSerializer(ModelSerializer):
    request = RequestSerializer(read_only=True)
    class Meta:
        model = Evaluation
        fields = "__all__"
