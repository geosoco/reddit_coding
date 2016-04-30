from django.contrib.auth.models import User, Group
from django.utils import timezone
from django.db.models import Prefetch
from rest_framework import status
from rest_framework import filters, viewsets
from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication, BasicAuthentication, TokenAuthentication)
from rest_framework.permissions import IsAuthenticated
import api.serializers as api_serializers
import main.models as main_models
import coding.models as coding_models
import filters as api_filters


class DjangoUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    serializer_class = api_serializers.DjangoUserSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ("id", )

    def get_queryset(self):
        current_user = self.request.query_params.get("current_user", None)
        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            return User.objects.filter(pk=user.id)
        else:
            return User.objects.all()



class DjangoGroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = api_serializers.DjangoGroupSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)


class SubmissionViewSet(viewsets.ModelViewSet):
    """
    Viewset for Submission
    """
    queryset = main_models.Submission.objects.all()
    serializer_class = api_serializers.SubmissionSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 5
    filter_backends = (filters.DjangoFilterBackend,)
    #filter_class = api_filters.TweetFilter
    #filter_fields = (
    #    "user", "in_reply_to_user", "in_reply_to_status_id",
    #    "created_ts", "retweeted_status",)


class CommentViewSet(viewsets.ModelViewSet):
    """
    Viewset for Comment
    """
    queryset = main_models.Comment.objects.all()
    serializer_class = api_serializers.CommentSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 5
    #filter_backends = (filters.DjangoFilterBackend,)
    #filter_class = api_filters.TweetFilter
    #filter_fields = (
    #    "user", "in_reply_to_user", "in_reply_to_status_id",
    #    "created_ts", "retweeted_status",)


class CodeSchemeViewSet(viewsets.ModelViewSet):
    """
    Viewset for code scheme
    """
    queryset = coding_models.CodeScheme.objects.all()
    serializer_class = api_serializers.CodeSchemeSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)


class CodeViewSet(viewsets.ModelViewSet):
    """
    Viewset for code
    """
    queryset = coding_models.Code.objects.all()
    serializer_class = api_serializers.CodeSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)


class SubmissionCodeInstanceViewSet(viewsets.ModelViewSet):
    """
    Viewset for Tweet code instance
    """
    serializer_class = api_serializers.SubmissionCodeInstanceSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)

    def get_queryset(self):
        current_user = self.request.query_params.get("current_user", None)
        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            return coding_models.SubmissionCodeInstanceSerializer.objects.filter(
                created_by=user.id)
        else:
            return coding_models.SubmissionCodeInstanceSerializer.objects.all()

    def create(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return super(SubmissionCodeInstanceViewSet, self).create(
            request, *args, **kwargs)

    def perform_destroy(self, instance):
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.request.user
            instance.save()

    def delete(self, request, pk, format=None):
        instance = self.get_object(pk)
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.requeset.user
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)



class CommentCodeInstanceViewSet(viewsets.ModelViewSet):
    """
    Viewset for Tweet code instance
    """
    serializer_class = api_serializers.CommentCodeInstanceSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)

    def get_queryset(self):
        current_user = self.request.query_params.get("current_user", None)
        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            return coding_models.CommentCodeInstanceSerializer.objects.filter(
                created_by=user.id)
        else:
            return coding_models.CommentCodeInstanceSerializer.objects.all()

    def create(self, request, *args, **kwargs):
        request.data["created_by"] = request.user.id
        return super(CommentCodeInstanceViewSet, self).create(
            request, *args, **kwargs)

    def perform_destroy(self, instance):
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.request.user
            instance.save()

    def delete(self, request, pk, format=None):
        instance = self.get_object(pk)
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.requeset.user
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    Viewset for assignment
    """
    serializer_class = api_serializers.AssignmentSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (filters.DjangoFilterBackend,)

    def get_queryset(self):
        current_user = self.request.query_params.get("current_user", None)
        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            qs = coding_models.Assignment.objects.filter(coder=user.id)
            qs = qs.prefetch_related("assigned_users")
        else:
            qs = coding_models.Assignment.objects.all().prefetch_related(
                "assigned_users")

        return qs
