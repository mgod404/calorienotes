from rest_framework import serializers
from rest_framework.validators import UniqueForDateValidator
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth import get_user_model

from .models import Note, Diary

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['diary']

class MealslistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['mealslist']

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = [ 'date', 'meals', 'additional_note']

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(validators=[UniqueValidator(queryset=User.objects.all())])

    class Meta:
        model = User
        fields = ('email', 'password')

    def create(self, validated_data):
        #username is the same as pasword for users
        password = validated_data.pop('password')
        user = get_user_model().objects.create(
            email=validated_data['email'],
            username=validated_data['email'],
            )
        user.set_password(password)
        user.save()
        return user