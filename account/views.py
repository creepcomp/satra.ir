from django.shortcuts import render, redirect
from django.contrib import auth


# Create your views here.

def login(request):
    return render(request, "login.html")

def logout(request):
    auth.logout(request)
    return redirect("/")