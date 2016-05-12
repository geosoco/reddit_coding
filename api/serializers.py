from django.contrib.auth.models import User, Group
import main.models as main_models
import coding.models as coding_models
from rest_framework import serializers


class DjangoUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class DjangoUserReadOnlySerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id',)
        read_only_fields = ('username',)


class DjangoGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class SubmissionSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    created_ut = serializers.IntegerField()
    created_utc = serializers.DateTimeField(allow_null=True)
    author = serializers.CharField(
        max_length=24,
        allow_blank=True,
        allow_null=True)
    in_set = serializers.NullBooleanField()
    data = serializers.JSONField()

    class Meta:
        model = main_models.Submission
        fields = (
            'id', 'created_ut', 'created_utc', 'author', 'in_set', 'data')


class SimpleSubmissionSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    created_ut = serializers.IntegerField()
    created_utc = serializers.DateTimeField(allow_null=True)
    author = serializers.CharField(
        max_length=24, allow_blank=True, allow_null=True)
    in_set = serializers.NullBooleanField()
    data = serializers.JSONField()

    class Meta:
        model = main_models.Submission
        fields = (
            'id', 'created_ut', 'created_utc', 'author', 'in_set', 'data')


class CommentSerializer(serializers.ModelSerializer):
    id = serializers.CharField()
    created_ut = serializers.IntegerField()
    created_utc = serializers.DateTimeField(allow_null=True)
    author = serializers.CharField()
    data = serializers.JSONField()
    parent_id = serializers.CharField()
    article = serializers.CharField()
    num_children = serializers.IntegerField()
    depth = serializers.IntegerField()
    root_comment = serializers.CharField()
    num_descendants = serializers.IntegerField()
    last_descendant_time_utc = serializers.DateTimeField()
    last_descendant = serializers.CharField()
    cumulative_score = serializers.IntegerField()

    class Meta:
        model = main_models.Comment
        fields = (
            'id', 'created_ut', 'created_utc', 'author', 'data', 'parent_id',
            'article', 'num_children', 'depth', 'root_comment',
            'num_descendants', 'last_descendant_time_utc',
            'last_descendant', 'cumulative_score')



class CodeSerializer(serializers.ModelSerializer):
    scheme = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.CodeScheme.objects.all())

    class Meta:
        model = coding_models.Code
        fields = (
            'id', 'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'scheme', 'name', 'description', 'css_class', 'key'
            )


class MinimalCodeSerializer(serializers.ModelSerializer):

    class Meta:
        model = coding_models.Code
        fields = ('id', 'scheme', 'name', 'css_class')


class CodeSchemeSerializer(serializers.ModelSerializer):
    code_set = CodeSerializer(many=True, read_only=True)

    class Meta:
        model = coding_models.CodeScheme
        fields = (
            'id', 'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'name', 'description', 'mutually_exclusive', 'code_set'
            )
        # read_only_fields = ('codes')


class SubmissionCodeInstanceSerializer(serializers.ModelSerializer):
    code = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.Code.objects.all(), many=False,
        style={'base_template': 'input.html'})
    submission = serializers.PrimaryKeyRelatedField(
        pk_field=serializers.CharField(),
        queryset=main_models.Submission.objects.all(), many=False,
        style={'base_template': 'input.html'})
    assignment = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.Assignment.objects.all(), many=False,
        style={'base_template': 'input.html'},
        allow_null=True)

    class Meta:
        model = coding_models.CommentCodeInstance
        fields = (
            'id', 'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'code', 'submission', 'assignment'
            )


class CommentCodeInstanceWriteSerializer(serializers.ModelSerializer):
    code = MinimalCodeSerializer(
        many=False, read_only=True)    
    code_id = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.Code.objects.all(),
        many=False, source="code")
    comment = serializers.PrimaryKeyRelatedField(
        pk_field=serializers.CharField(),
        queryset=main_models.Comment.objects.all(), many=False,
        style={'base_template': 'input.html'})
    assignment = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.Assignment.objects.all(), many=False,
        style={'base_template': 'input.html'},
        allow_null=True)

    class Meta:
        model = coding_models.CommentCodeInstance
        fields = (
            'id', 'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'code', 'code_id', 'comment', 'assignment'
            )


class CommentCodeInstanceSerializer(serializers.ModelSerializer):
    code = MinimalCodeSerializer(
        many=False, read_only=True)
    comment = serializers.PrimaryKeyRelatedField(
        pk_field=serializers.CharField(),
        queryset=main_models.Comment.objects.all(), many=False,
        style={'base_template': 'input.html'})
    assignment = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.Assignment.objects.all(), many=False,
        style={'base_template': 'input.html'},
        allow_null=True)

    class Meta:
        model = coding_models.CommentCodeInstance
        fields = (
            'id', 'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'code', 'comment', 'assignment'
            )



class CommentWithCodesSerializer(CommentSerializer):
    commentcodeinstance_set = CommentCodeInstanceSerializer(many=True)

    class Meta(CommentSerializer.Meta):
        fields = (
            'id', 'created_ut', 'created_utc', 'author', 'data', 'parent_id',
            'article', 'num_children', 'depth', 'root_comment',
            'num_descendants', 'last_descendant_time_utc',
            'last_descendant', 'cumulative_score', 'commentcodeinstance_set')


class AssignmentSerializer(serializers.ModelSerializer):
    coder = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=False)
    assigned_submissions = SubmissionSerializer(
        many=True, allow_empty=True,
        style={'base_template': 'input.html'})
    assigned_comments = CommentSerializer(
        many=True, allow_empty=True,
        style={'base_template': 'input.html'})
    code_schemes = CodeSchemeSerializer(many=True)

    class Meta:
        model = coding_models.Assignment
        fields = (
            'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'id', 'name', 'description',
            'coder', 'assigned_submissions', 'assigned_comments',
            'code_schemes'
            )


class AssignmentSimpleSerializer(serializers.ModelSerializer):
    coder = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=False)
    assigned_submissions = serializers.PrimaryKeyRelatedField(
        queryset=main_models.Submission.objects.all(),
        many=True,
        allow_empty=True)
    assigned_comments = serializers.PrimaryKeyRelatedField(
        queryset=main_models.Comment.objects.all(),
        many=True,
        allow_empty=True)

    code_schemes = serializers.PrimaryKeyRelatedField(
        queryset=coding_models.CodeScheme.objects.all(),
        many=True)

    class Meta:
        model = coding_models.Assignment
        fields = (
            'created_by', 'created_date', 'deleted_by', 'deleted_date',
            'id', 'name', 'description',
            'coder', 'assigned_submissions', 'assigned_comments',
            'code_schemes'
            )

