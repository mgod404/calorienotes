from datetime import datetime, timezone

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from .serializers import (
    DiarySerializer, 
    MealslistSerializer, 
    PasswordResetTokenSerializer,
    UserSerializer,
    NewPasswordSerializer
)
from .models import Diary, PasswordResetToken


class CreateDiary(generics.CreateAPIView):
    serializer_class = DiarySerializer
    queryset = Diary.objects.all()
    permission_classes = [IsAuthenticated]

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
    permissions_classes = [IsAuthenticated]

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


class ResetPasswordView(generics.CreateAPIView):
    serializer_class = PasswordResetTokenSerializer
    queryset = PasswordResetToken.objects.all()


class NewPasswordView(generics.GenericAPIView):
    serializer_class = NewPasswordSerializer
    def post(self, request):
        data = request.data
        print(data['user'])
        try:
            token_data = PasswordResetToken.objects.get(token=data['token'])
            if token_data.user.email != data['user']:
                return Response({'message': 'Invalid Token. Please get a new one.'}, status=status.HTTP_400_BAD_REQUEST)
            creation_date = token_data.date_of_creation
            datetime_now = datetime.now(timezone.utc)
            time_dif = datetime_now - creation_date
            if time_dif.total_seconds() > 600:
                return Response({'message': 'Token has expired. Please get a new one.'})
            user = User.objects.get(user__email=data['user'])
            user.password = data['password']
            user.save()
            return Response({'message': 'Your password has been changed!'}, status=status.HTTP_200_OK)
        except PasswordResetToken.DoesNotExist:
            return Response({'message': 'Invalid token. Please get a new one.'}, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
