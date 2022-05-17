import os
from django.db.models.signals import post_delete, post_save, pre_save
from django.core.mail import send_mail
from django.dispatch import receiver
from .models import PasswordResetToken

@receiver(post_save, sender=PasswordResetToken)
def send_email_with_token(sender, instance, **kwargs):
    target_email = instance.user.email
    send_mail(
        'CNotes: Password Reset Token',
        f'Please paste it in your CNotes app. Here is the password reset token: {instance.token}',
        os.environ.get('EMAIL'),
        [target_email],
        fail_silently=False
    )
    return