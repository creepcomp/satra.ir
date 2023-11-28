import json
from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class Request(models.Model):
    name = models.CharField(max_length=64, unique=True)
    type = models.PositiveSmallIntegerField()
    media = models.PositiveSmallIntegerField()
    genre = models.PositiveSmallIntegerField()
    ages = models.PositiveSmallIntegerField()
    author = models.CharField(max_length=32, null=True)
    producer = models.CharField(max_length=32, null=True)
    director = models.CharField(max_length=32, null=True)
    description = models.TextField(null=True)
    keywords = models.CharField(max_length=256, null=True)
    status = models.PositiveSmallIntegerField()
    file = models.CharField(max_length=64, null=True)
    files = models.JSONField(null=True)
    working_group_considerations = models.TextField(null=True)
    working_group_users = models.JSONField(null=True)
    working_group_at = models.DateTimeField(null=True)
    council_considerations = models.TextField(null=True)
    council_users = models.JSONField(null=True)
    council_at = models.DateTimeField(null=True)
    final_result = models.TextField(null=True)
    created_by = models.ForeignKey(User, models.CASCADE)
    created_at = models.DateTimeField()

class Evaluation(models.Model):
    request = models.ForeignKey(Request, models.CASCADE)
    evaluator = models.ForeignKey(User, models.CASCADE)
    indicators = models.JSONField(default=json.load(open("config/indicators.json", encoding="utf8")))
    status = models.PositiveSmallIntegerField()
    summary = models.CharField(max_length=256, null=True)
    keywords = models.CharField(max_length=256, null=True)
    description = models.TextField(null=True)
    note = models.CharField(max_length=128, null=True)
    created_by = models.ForeignKey(User, models.CASCADE, related_name="evaluation_created_by")
    created_at = models.DateTimeField()
