from django.contrib.auth.decorators import login_required

#
# Mixins
#

class LoginRequiredMixin(object):
    """A mixin that forces a login to view the CBTemplate."""

    @classmethod
    def as_view(cls, **initkwargs):
        view = super(LoginRequiredMixin, cls).as_view(**initkwargs)
        return login_required(view)
