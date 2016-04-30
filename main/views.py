from django.views.generic import TemplateView, DetailView
from base.views import LoginRequiredMixin

# Create your views here.

class HomeView(LoginRequiredMixin, TemplateView):

    """Home view."""

    template_name = "base/base.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        return context
