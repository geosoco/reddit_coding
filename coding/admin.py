from django.contrib import admin
import models

# Register your models here.

class CodeAdmin(admin.ModelAdmin):
    list_display = ('id', 'scheme', 'name', 'description',)
    readonly_fields = ('id', 'scheme', 'name', 'description',)


class CommentCodeInstanceAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'created_date', 'created_by',
        'deleted_date', 'deleted_by',
        'code', 'tweet_id', 'assignment',)

class CodeAdminInline(admin.TabularInline):
    model = models.Code
    can_delete = True
    verbose_name_plural = 'Codes'


class CodeSchemeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description')
    inlines = [CodeAdminInline, ]

class AssignmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'description', 'coder')
    raw_id_fields = ('assigned_users', 'assigned_tweets')


admin.site.register(models.Code, CodeAdmin)
admin.site.register(models.CodeScheme, CodeSchemeAdmin)
admin.site.register(models.CommentCodeInstance, CommentCodeInstanceAdmin)
admin.site.register(models.Assignment, AssignmentAdmin)
