from django.db import models
from django.contrib.auth.models import User

class Diary(models.Model):
    user = models.ForeignKey(User, related_name='diary', on_delete=models.CASCADE)
    diary = models.JSONField(blank=True)
    mealslist = models.JSONField(blank=True, default=dict)
    def __str__(self) -> str:
        return f'{self.user}'

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, related_name='password_reset_token', on_delete=models.CASCADE)
    token = models.CharField(max_length=64)
    date_of_creation = models.DateTimeField(auto_now_add=True)