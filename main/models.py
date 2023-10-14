from django.db import models
from account.models import User
from . import config

# Create your models here.

class Request(models.Model):
    name = models.CharField(max_length=64, unique=True)
    type = models.IntegerField(null=True)
    media = models.IntegerField(null=True)
    genre = models.IntegerField(null=True)
    ages = models.IntegerField(null=True)
    author = models.CharField(max_length=32, null=True)
    producer = models.CharField(max_length=32, null=True)
    director = models.CharField(max_length=32, null=True)
    description = models.TextField(null=True)
    keywords = models.CharField(max_length=256, null=True)
    status = models.IntegerField(null=True)
    file = models.CharField(max_length=64, null=True)
    files = models.JSONField(null=True)
    working_group_considerations = models.TextField(null=True)
    working_group_users = models.CharField(max_length=128, null=True)
    working_group_at = models.DateField(null=True)
    council_considerations = models.TextField(null=True)
    council_users = models.CharField(max_length=128, null=True)
    council_at = models.TextField(null=True)
    final_result = models.TextField(null=True)
    created_by = models.ForeignKey(User, models.CASCADE, null=True, editable=False)
    created_at = models.DateField(null=True, auto_now_add=True)

class Evaluation(models.Model):
    request = models.ForeignKey(Request, models.CASCADE)
    evaluator = models.ForeignKey(User, models.CASCADE)
    status = models.IntegerField(default=0)
    description = models.TextField(null=True)
    indicators = models.JSONField(default=config.indicators)
    note = models.CharField(max_length=64, null=True)
    created_by = models.ForeignKey(User, models.CASCADE, related_name="evaluation_created_by", null=True)
    created_at = models.DateField(null=True, auto_now_add=True)
