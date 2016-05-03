from django.conf.urls import patterns, url
import main.views as main_views

urlpatterns = [
    url(r'^$', main_views.HomeView.as_view(), name='home'),
]