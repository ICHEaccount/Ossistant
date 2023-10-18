from neomodel import StructuredNode, UniqueIdProperty,StringProperty, DateTimeProperty, IntegerProperty

from ..init import db

class Post(StructuredNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    title = StringProperty()
    writer = StringProperty()
    content = StringProperty()
    # created_date = StringProperty()
    created_date = DateTimeProperty()
    post_type = StringProperty()
    case_id = StringProperty()

    def __init__(self, *args, **kwargs):
        super(Post, self).__init__(*args, **kwargs)

    def _json_serializable(self):
        return {
            "url": self.url,
            "title": self.title,
            "writer": self.writer,
            "content": self.content,
            "created_date": self.created_date,
            "post_type": self.post_type,
            "case_id": self.case_id
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
    def update_node_properties(cls, node_id, **kwargs):
        node = cls.nodes.get_or_none(uid=node_id)
        if node:
            try:
                for key, value in kwargs.items():
                    setattr(node, key, value)
                node.save()
                return node
            except Exception as e:
                print(f"An error occurred during node update: {e}")
                return False
        else:
            print("Node does not exist.")
            return False

