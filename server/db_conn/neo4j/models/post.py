from neomodel import StructuredNode, UniqueIdProperty,StringProperty, DateTimeProperty, IntegerProperty

from ..init import db

class Post(StructuredNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    title = StringProperty()
    writer = StringProperty()
    created_date = DateTimeProperty()
    post_type = IntegerProperty()

    def __init__(self, *args, **kwargs):
        super(Post, self).__init__(*args, **kwargs)

    def _json_serializable(self):
        return {
            "url": self.url,
            "title": self.title,
            "writer": self.writer,
            "created_date": self.created_date.isoformat(),
            "post_type": self.post_type,
        }

    @classmethod
    def create_node(cls, data):
        node = cls(**data) 
        node.save()
        return node
    
    @classmethod
    def get_all_posts(cls):
        posts = cls.nodes.all()
        return [post._json_serializable() for post in posts]

    @classmethod
    def get_post_by_url(cls, url):
        return cls.nodes.filter(url=url).first()
    
    @classmethod
    def node_exists_url(cls, url):
        try:
            node = cls.nodes.filter(url=url).first()
            return node.uid
        except cls.DoesNotExist:
            return None
        
    @classmethod
    def update_post_properties(cls, node_id, title=None, writer=None, created_date=None, post_type=None):
        post = cls.nodes.get_or_none(uid=node_id)
        if post:
            post.title = title
            post.writer = writer
            post.created_date = created_date
            post.post_type = post_type
            post.save()
            return True
        else:
            return False 


