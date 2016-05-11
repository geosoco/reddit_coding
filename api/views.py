from django.contrib.auth.models import User, Group
from django.utils import timezone
from django.db.models import Prefetch
from rest_framework import status
from rest_framework import viewsets
import rest_framework_filters as filters
from rest_framework.response import Response
from rest_framework.authentication import (
    SessionAuthentication, BasicAuthentication, TokenAuthentication)
from rest_framework.permissions import IsAuthenticated
import api.serializers as api_serializers
import main.models as main_models
import coding.models as coding_models
import filters as api_filters
from rest_framework_filters import backends
import rest_framework.filters as rf_filters



class TestFilter(backends.DjangoFilterBackend):
    def __init__(self):
        print ">> creating"
        print super(TestFilter, self).__init__
        for base in self.__class__.__bases__:
            print base.__module__, base.__name__
        return super(TestFilter, self).__init__()

    def get_filter_class(self, view, queryset=None):
        print ">> get_filter_class"
        if queryset:
            print queryset.query
        else:
            print "no queryset"
        ret = super(TestFilter, self).get_filter_class(view, queryset)

        if queryset:
            print queryset.query
        else:
            print "no queryset"

        print "\n>> got back", ret
        print "\n>>", ret().get_filters()
        print "\n>>", ret(view.request.query_params, queryset=queryset).qs

        return ret

    def filter_queryset(self, request, queryset, view):
        print ">> filter_queryset"
        return super(TestFilter, self).filter_queryset(
            request, queryset, view)


class DjangoUserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """

    serializer_class = api_serializers.DjangoUserSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (backends.DjangoFilterBackend,)
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


class SubmissionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for Submission
    """
    queryset = main_models.Submission.objects.all()
    serializer_class = api_serializers.SubmissionSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 5
    filter_backends = (backends.DjangoFilterBackend,)
    filter_fields = ("in_set",)



class CommentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for Comment
    """
    queryset = main_models.Comment.objects.all()
    serializer_class = api_serializers.CommentSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 5
    filter_backends = (backends.DjangoFilterBackend,)
    filter_fields = ("root_comment", "article")


class CodeSchemeViewSet(viewsets.ModelViewSet):
    """
    Viewset for code scheme
    """
    queryset = coding_models.CodeScheme.objects.all()
    serializer_class = api_serializers.CodeSchemeSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (backends.DjangoFilterBackend,)


class CodeViewSet(viewsets.ModelViewSet):
    """
    Viewset for code
    """
    queryset = coding_models.Code.objects.all()
    serializer_class = api_serializers.CodeSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (backends.DjangoFilterBackend,)


class SubmissionCodeInstanceViewSet(viewsets.ModelViewSet):
    """
    Viewset for Tweet code instance
    """
    serializer_class = api_serializers.SubmissionCodeInstanceSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (backends.DjangoFilterBackend,)

    def get_queryset(self):
        current_user = self.request.query_params.get("current_user", None)
        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            return coding_models.SubmissionCodeInstance.objects.filter(
                created_by=user.id)
        else:
            return coding_models.SubmissionCodeInstance.objects.all()

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
    serializer_class = api_serializers.CommentCodeInstanceWriteSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    #filter_backends = (TestFilter,)
    filter_backends = (backends.DjangoFilterBackend,)
    filter_class = api_filters.CommentCodeInstanceFilter
    #filter_fields = ("id", "comment_id", "comment", "comment__id")
    queryset = coding_models.CommentCodeInstance.objects.filter(
        deleted_date__isnull=True)

    def get_queryset(self):
        queryset = super(CommentCodeInstanceViewSet, self).get_queryset()
        current_user = self.request.query_params.get("current_user", None)

        if current_user is not None and current_user.lower() == "true":
            user = self.request.user
            return queryset.filter(created_by=user.id)
        else:
            return queryset

#    def get_serializer_class(self):
#        if self.action == 'get':
#            return api_serializers.CommentCodeInstanceSerializer
#        else:
# return api_serializers.CommentCodeInstanceWriteSerializer

    def create(self, request, *args, **kwargs):
        print "create"
        request.data["created_by"] = request.user.id
        return super(CommentCodeInstanceViewSet, self).create(
            request, *args, **kwargs)

    def perform_destroy(self, instance):
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.request.user
            instance.save()

    def delete(self, request, pk, format=None):
        print "delete!!"
        instance = self.get_object(pk)
        if instance is not None:
            instance.deleted_date = timezone.now()
            instance.deleted_by = self.requeset.user
            instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    """
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        print "++"
        print queryset.query

        page = self.paginate_queryset(queryset)
        print "++", page
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        ret = Response(serializer.data)
        print ret
        return ret
    """


class AssignmentViewSet(viewsets.ModelViewSet):
    """
    Viewset for assignment
    """
    serializer_class = api_serializers.AssignmentSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    filter_backends = (backends.DjangoFilterBackend,)

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


class CommentThreadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for a top-level comment and all replies.

    XXX: TODO -- this shouldn't return 100 if no root_comment is specified
    """
    queryset = main_models.Comment.objects.all()
    serializer_class = api_serializers.CommentSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 100
    filter_backends = (backends.DjangoFilterBackend,)
    filter_fields = ("root_comment",)
    #filter_class = api_filters.TweetFilter
    #filter_fields = (
    #    "user", "in_reply_to_user", "in_reply_to_status_id",
    #    "created_ts", "retweeted_status",)  


class CodedCommentThreadViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for a top-level comment and all replies.

    XXX: TODO -- this shouldn't return 100 if no root_comment is specified
    """
    queryset = main_models.Comment.objects.all()
    serializer_class = api_serializers.CommentWithCodesSerializer
    authentication_classes = (SessionAuthentication,
                              BasicAuthentication, TokenAuthentication)
    permission_classes = (IsAuthenticated,)
    page_size = 100
    filter_backends = (backends.DjangoFilterBackend,)
    filter_fields = ("root_comment",)


