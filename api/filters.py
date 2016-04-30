import rest_framework_filters as filters
import django.contrib.auth.models as auth_models
import main.models as main_models
import coding.models as coding_models


"""
class TweetMediaSetFilter(filters.FilterSet):
    class Meta:
        model = main_models.Media
        fields = ["id", "media_id", "source_status_id", "expanded_url", 
            "display_url", "media_url", "tweets"]

class TweetFilter(filters.FilterSet):
    in_reply_to_status_id = filters.RelatedFilter(
        "api.filters.TweetFilter",
        name="in_reply_to_status_id")
    retweeted_status = filters.RelatedFilter(
        "api.filters.TweetFilter",
        name="retweeted_status")
    media_set = filters.RelatedFilter(TweetMediaSetFilter, name="media_set")
    media = filters.RelatedFilter(TweetMediaSetFilter, name="media")
    #media_set = filters.AllLookupsFilter(name="media_set")
    #user = filters.AllLookupsFilter(name="user")

    class Meta:
        model = main_models.Tweet
        fields = [
            "user", "in_reply_to_user", "in_reply_to_status_id",
            "created_ts", "retweeted_status", "media_set", "media"]
"""