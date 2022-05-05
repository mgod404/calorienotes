from django.db import models
from django.contrib.auth.models import User

class Note(models.Model):
    user = models.ForeignKey(User, related_name='notes', on_delete=models.CASCADE)
    date = models.DateField()
    meals = models.JSONField(blank=True)
    additional_note = models.TextField(max_length=3000, blank=True)

    def __str__(self) -> str:
        return f'{self.user} {self.date}'

class Diary(models.Model):
    user = models.ForeignKey(User, related_name='diary', on_delete=models.CASCADE)
    diary = models.JSONField(blank=True)
    def __str__(self) -> str:
        return f'{self.user}'