from rest_framework.serializers import HyperlinkedModelSerializer, CurrentUserDefault
from .models import Request, Evaluation
from account.serializers import UserSerializer

class EvaluationSerializer(HyperlinkedModelSerializer):
    evaluator = UserSerializer()
    created_by = UserSerializer()
    class Meta:
        model = Evaluation
        fields = "__all__"

class RequestSerializer(HyperlinkedModelSerializer):
    created_by = UserSerializer()
    evaluations = EvaluationSerializer(many=True)
    class Meta:
        model = Request
        fields = "__all__"
