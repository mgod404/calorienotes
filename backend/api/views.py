import datetime

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .serializers import DiarySerializer, MealslistSerializer, NoteSerializer, UserSerializer
from .models import Note, Diary


class RetrieveUpdateNotes(generics.RetrieveUpdateAPIView):
    serializer_class = NoteSerializer
    lookup_field = 'user'
    permissions_classes = [IsAuthenticated]

    def get_queryset(self):
        return Note.objects.filter(user=self.request.user.id)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        filter_kwargs = {
            'date': datetime.date(
                self.kwargs['year'],
                self.kwargs['month'],
                self.kwargs['day']
                )
            }
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj


class CreateNotes(generics.CreateAPIView):
    serializer_class = NoteSerializer
    queryset = Note.objects.all()
    permission_classes = []

    def perform_create(self, serializer):
        #This code is to ensure the users can only create notes for themselves
        serializer.validated_data['user'] = self.request.user
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        #Check for duplicates
        try: 
            obj = Note.objects.get(user=request.user, date=serializer.validated_data['date'])
            return Response(status=status.HTTP_409_CONFLICT)
        except Note.DoesNotExist:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CreateDiary(generics.CreateAPIView):
    serializer_class = DiarySerializer
    queryset = Diary.objects.all()
    permission_classes = []

    def perform_create(self, serializer):
        #This code is to ensure the users can only create notes for themselves
        serializer.validated_data['user'] = self.request.user
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        #Check for duplicates
        try: 
            obj = Diary.objects.get(user=request.user)
            return Response(status=status.HTTP_409_CONFLICT)
        except Diary.DoesNotExist:
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class RetrieveUpdateDiary(generics.RetrieveUpdateAPIView):
    serializer_class = DiarySerializer
    permissions_classes = []

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user.id)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        filter_kwargs = {'user': self.request.user.id}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

class RetrieveUpdateMealslist(generics.RetrieveUpdateAPIView):
    serializer_class = MealslistSerializer
    permissions_classes = []

    def get_queryset(self):
        return Diary.objects.filter(user=self.request.user.id)

    def get_object(self):
        queryset = self.filter_queryset(self.get_queryset())

        filter_kwargs = {'user': self.request.user.id}
        obj = get_object_or_404(queryset, **filter_kwargs)
        self.check_object_permissions(self.request, obj)
        return obj

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
