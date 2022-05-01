from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey('auth.User', related_name='notes', on_delete=models.CASCADE)
    date = models.DateField()
    meals = models.JSONField()
    additional_note = models.TextField(max_length=3000)