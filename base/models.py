from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User


class CreatedByMixin(models.Model):
	"""
	Mixin to add created by fields to a model.
	"""
    created_date = models.DateTimeField(
        auto_now_add=True, null=True, blank=True)
    created_by = models.ForeignKey(
        User, null=True, blank=True, related_name="%(class)s_created_by")

    class Meta:
        abstract = True


class ModifiedByMixin(models.Model):
	"""
	Mixin to add modified by fields to a model.
	"""
    modified_date = models.DateTimeField(
        auto_now=True, null=True, blank=True)
    modified_by = models.ForeignKey(
        User, null=True, blank=True, related_name="%(class)s_modified_by")

    class Meta:
        abstract = True


class DeletedByMixin(models.Model):
	"""
	Mixin to add deleted by fields to a model.
	"""
    deleted_date = models.DateTimeField(
        auto_now=False, null=True, blank=True)
    deleted_by = models.ForeignKey(
        User, null=True, blank=True, related_name="%(class)s_deleted_by")

    @property
    def deleted(self):
    	"""
    	Helper property to return True if this object has been deleted.
    	"""
        return self.deleted_by is not None

    class Meta:
        abstract = True


class CreateDeleteAuditModel(CreatedByMixin, DeletedByMixin):
	"""
	Mixin to add created and deleted fields to a model
	"""
    class Meta:
        abstract = True


class FullAuditModel(CreatedByMixin, ModifiedByMixin, DeletedByMixin):
	"""
	Mixin to add created, modified, and deleted fields to a model
	"""
    class Meta:
        abstract = True
