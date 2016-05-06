from django.conf.urls import url, include
from rest_framework import routers
from api import views

router = routers.DefaultRouter(trailing_slash=True)
router.register(
    r'sysusers',views.DjangoUserViewSet, base_name="sysusers")
router.register(
    r'sysgroups', views.DjangoGroupViewSet, base_name="sysgroups")
router.register(
    r'comment', views.CommentViewSet, base_name="comment")
router.register(
    r'submission', views.SubmissionViewSet, base_name="submission")
router.register(
    r'codescheme', views.CodeSchemeViewSet, base_name="codescheme")
router.register(
    r'code', views.CodeViewSet, base_name="code")
router.register(
    r'commentcodeinstance',
    views.CommentCodeInstanceViewSet,
    base_name="commentcodeinstance")
router.register(
    r'assignment', views.AssignmentViewSet, base_name="assignment")
router.register(
    r'commentthread', views.CommentThreadViewSet, base_name="commentthread")
router.register(
    r'codedcommentthread',
    views.CodedCommentThreadViewSet,
    base_name="codedcommentthread")

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    url(r'', include(router.urls, namespace='api')),
    url(r'', include(
        'rest_framework.urls', namespace='rest_framework')),
]
