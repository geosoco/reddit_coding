# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models
from django.contrib.postgres.fields import JSONField


class Comment(models.Model):
    data = JSONField(blank=True, null=True)
    id = models.CharField(primary_key=True, max_length=8)
    created_ut = models.IntegerField(blank=True, null=True)
    created_utc = models.DateTimeField(blank=True, null=True)
    author = models.CharField(max_length=24, blank=True, null=True)
    parent_id = models.CharField(max_length=8, blank=True, null=True)
    article = models.CharField(max_length=8, blank=True, null=True)
    num_children = models.IntegerField(blank=True, null=True)
    depth = models.IntegerField(blank=True, null=True)
    root_comment = models.CharField(max_length=8, blank=True, null=True)
    num_descendants = models.IntegerField(blank=True, null=True)
    last_descendant_time_utc = models.DateTimeField(blank=True, null=True)
    last_descendant = models.CharField(max_length=8, blank=True, null=True)
    cumulative_score = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'comments'


class Submission(models.Model):
    id = models.CharField(primary_key=True, max_length=8)
    created_ut = models.IntegerField(blank=True, null=True)
    created_utc = models.DateTimeField(blank=True, null=True)
    author = models.CharField(max_length=24, blank=True, null=True)
    in_set = models.NullBooleanField()
    data = JSONField(blank=True, null=True)
    num_children = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'submissions'
