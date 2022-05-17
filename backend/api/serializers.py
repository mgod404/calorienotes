from datetime import datetime, timezone

from rest_framework import serializers
from rest_framework.validators import UniqueForDateValidator
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import ValidationError
from django.contrib.auth import get_user_model

from .models import Diary, PasswordResetToken

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['diary']

class MealslistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['mealslist']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = get_user_model().objects.create(
            email=validated_data['email'],
            username=validated_data['email'],
            )
        user.set_password(password)
        user.save()
        return user

class PasswordResetTokenSerializer(serializers.ModelSerializer):
    user = serializers.EmailField()
    class Meta:
        model = PasswordResetToken
        fields = ['user']

    def validate(self, data):
        try:
            User.objects.get(email=data['user'])
            return data
        except PasswordResetToken.DoesNotExist:
            raise ValidationError('Account with that email does not exist. Try again.')

    def create(self, validated_data):
        user = User.objects.get(email=validated_data['user'])
        token = PasswordResetTokenGenerator().make_token(user)
        return PasswordResetToken.objects.create(token=token,user=user)


# The serializer throws error "This Field is Required despite filling all fields in post request."
class NewPasswordSerializer(serializers.ModelSerializer):
    password = serializers.CharField(allow_blank=False, write_only=True)
    user = serializers.EmailField(allow_blank=False)
    class Meta:
        model = PasswordResetToken
        fields = ['user', 'token', 'password']

    def validate(self, data):
        try:
            print(data['token'])
            get_token_info = PasswordResetToken.objects.get(user=data['user'], token=data['token'])
            creation_date = get_token_info.date_of_creation
            datetime_now = datetime.now(timezone.utc)
            time_dif = datetime_now - creation_date
            if time_dif.total_seconds() > 600:
                raise ValidationError('Token has expired. Please get a new one.')
            return data
        except PasswordResetToken.DoesNotExist:
            raise ValidationError('Token does not exist.')
