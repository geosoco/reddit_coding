from django.core.management.base import BaseCommand, CommandError
from main.models import Comment, Submission
from django.db import transaction
from django.utils import timezone
from datetime import datetime
import pytz

class TreeNode(object):
    """
    """

    def __init__(self, id, obj):
        self.id = id
        self.obj = obj
        self.children = []
        self.num_descendants = None
        self.last_descendant_id = id
        self.last_descendant_date = None
        self.depth = 0
        self.cumulative_score = 0
        self.root_comment_id = None
        self.score = 0
        if obj is not None:
            self.last_descendant_date = obj.created_utc
            self.score = self.obj.data['score']



    def add(self, node):
        # increment depth
        node.depth = self.depth + 1
        # set the root comment id
        if self.obj is None:
            node.root_comment_id = node.id
        else:
            node.root_comment_id = self.id
        # increment score
        self.cumulative_score += node.obj.data['score']

        self.children.append(node)

    def num_children(self):
        return len(self.children)

    def count_descendants(self):
        if self.num_descendants is None:
            self.num_descendants = len(self.children) + sum(
                map(lambda x: x.count_descendants(), self.children))

        return self.num_descendants

    def calc_nums(self):
        self.cumulative_score = self.score
        for c in self.children:
            ldi, ldd, cs = c.calc_nums()
            # see if some value is newer than what we already have
            if (self.last_descendant_date is None or
                    ldd > self.last_descendant_date):
                self.last_descendant_date = ldd
                self.last_descendant_id = ldi
            # add cumulative score
            self.cumulative_score += cs
            

        self.num_descendants = self.count_descendants()
        # return both
        return (
            self.last_descendant_id,
            self.last_descendant_date,
            self.cumulative_score)


def print_node(node, indent=0):
    obj = node.obj
    print "%s%s - [sc:%d cr:%s, nc:%d, nd:%d, ldid:%s, ldd:%s, d:%s, cs:%d, rc:%s]" % (
        "  " * indent,
        node.id.strip(),
        node.score,
        obj.created_utc if obj is not None else None,
        len(node.children),
        node.num_descendants,
        node.last_descendant_id,
        node.last_descendant_date,
        node.depth,
        node.cumulative_score,
        node.root_comment_id
    )
    for c in node.children:
        print_node(c, indent+2)


def build_tree(root_id, comments):
    root = TreeNode(root_id, None)
    tree_map = {root_id: root}
    missing_parents = []
    num_orphaned = 0

    for c in comments:
        node = TreeNode(c.id, c)
        tree_map[c.id] = node
        # find parent node
        parent_id = c.parent_id or c.article
        try:
            parent = tree_map[parent_id]
            parent.add(node)
        except KeyError:
            # possibly orphaned node
            missing_parents.append(node)
            root.add(node)

    # try missing again
    for c in missing_parents:
        if c.obj.parent_id in tree_map:
            parent = tree_map[c.obj.parent_id]
            parent.add(c)
        else:
            print "orphaned"
            num_orphaned += 1
            root.add(c)

    ldi, ldd, cs = root.calc_nums()

    return tree_map


@transaction.atomic
def update_nodes(tree_map):
    for node in tree_map.values():
        obj = node.obj
        if obj is not None:
            obj.created_utc = datetime.utcfromtimestamp(
                obj.created_ut).replace(tzinfo=pytz.utc)
            obj.num_children = len(node.children)
            obj.depth = node.depth
            obj.root_comment = node.root_comment_id
            obj.num_descendants = node.num_descendants
            obj.last_descendant_time_utc = timezone.make_aware(
                node.last_descendant_date,
                timezone.utc)
            obj.last_descendant = node.last_descendant_id
            obj.cumulative_score = node.cumulative_score
            obj.save()


class Command(BaseCommand):
    help = 'calculates and adds database columns for comment depth'

    def handle(self, *args, **options):
        in_set_subs = list(Submission.objects.filter(
                in_set=True, data__num_comments__gt=0
            ).values_list(
                'id', flat=True
            ))

        for idx, id in enumerate(in_set_subs):
            comments = list(
                Comment.objects.filter(article=id).order_by('id')
                )

            tree_map = build_tree(id, comments)
            update_nodes(tree_map)

            print "%d/%d" % (idx, len(in_set_subs))


