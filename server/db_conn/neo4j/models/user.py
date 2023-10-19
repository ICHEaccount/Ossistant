from neomodel import StructuredNode, RelationshipTo, UniqueIdProperty,StringProperty

from .domain import Domain
from .post import Post
from .relationship import Posting, Register

class SurfaceUser(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    fake = StringProperty(default="None")
    case_id = StringProperty()
    # note = StringProperty()

    # Relation
    register = RelationshipTo(Domain, 'REGISTER', model=Register)
    posting = RelationshipTo(Post,'POSTING',model=Posting)

    def _json_serializable(self):
        return {
            "username": self.username,
            "url": self.url,
            "fake": self.fake,
            "case_id": self.case_id
        }
    
    @classmethod
    def create_node(cls, data):
        surface_user = cls(**data)  
        surface_user.save()
        return surface_user

    @classmethod
    def get_all_usernames(cls):
        return [user.username for user in cls.nodes.all()]

    @classmethod
    def get_all_users(cls):
        surface_users = cls.nodes.all()
        return [user._json_serializable() for user in surface_users]

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
            for key, value in kwargs.items():
                setattr(node, key, value)
            node.save()
            return node
        else:
            return False
    

