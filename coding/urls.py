from django.conf.urls import url
import coding.views as coding_views

urlpatterns = [
    url(r'^$', coding_views.HomeView.as_view(), name='home'),
]
