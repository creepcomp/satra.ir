from django.shortcuts import render, redirect
from django_filters.rest_framework.backends import DjangoFilterBackend
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import Request, Evaluation
from .serializers import RequestSerializer, EvaluationSerializer

# Create your views here.

class RequestViewSet(ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        params = self.request.query_params
        if params:
            request = Request.objects.filter()
            for key, value in params.items():
                setattr(request, f"{key}__contains", value)
            return request
        return super().get_queryset()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

class EvaluationViewSet(ModelViewSet):
    queryset = Evaluation.objects.all()
    def get_serializer_class(self):
        if self.request.user.is_staff:
            self.queryset = Evaluation.objects.all()
            return EvaluationSerializer
        elif "ارزیاب" in [x.name for x in self.request.user.groups.all()]:
            self.queryset = Evaluation.objects.filter(status=0)
            return EvaluationSerializer
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

def index(request):
    if request.user.is_authenticated:
        if request.user.is_superuser:
            return redirect("/requests")
        else:
            return redirect("/evaluations")
    else:
        return redirect("/login")

def requests(request):
    if request.user.is_authenticated:
        return render(request, "requests.html")
    else:
        return redirect("/login")

def evaluations(request):
    if request.user.is_authenticated:
        return render(request, "evaluations.html")
    else:
        return redirect("/login")
    
def presence(request):
    if request.user.is_authenticated:
        return render(request, "presence.html")
    else:
        return redirect("/login")

def users(request):
    if request.user.is_authenticated:
        return render(request, "users.html")
    else:
        return redirect("/login")

def evaluation(request):
    evaluation = Evaluation.objects.get(id=request.GET["id"])
    return render(request, "evaluation.html", {"evaluation": evaluation})