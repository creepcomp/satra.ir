import json
from django.shortcuts import render, redirect
from .models import Request, Evaluation
from account.models import User
from .forms import RequestForm

# Create your views here.

def index(request):
    if request.user.is_authenticated:
        return render(request, "main.html", {
            "groups": [group.name for group in request.user.groups.all()]
        })
    else:
        return redirect("/login")

def evaluation(request):
    evaluation = Evaluation.objects.get(id=request.GET["id"])
    return render(request, "evaluation.html", {"evaluation": evaluation})