from django.views.generic import TemplateView
from base.views import LoginRequiredMixin

# Create your views here.

class HomeView(LoginRequiredMixin, TemplateView):

    """Home view."""

    template_name = "coding/coding.html"

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        return context
