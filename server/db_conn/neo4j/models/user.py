from neomodel import StructuredNode, IntegerProperty, RelationshipTo, UniqueIdProperty,StringProperty

from .domain import Domain
from .post import Post
from .relationship import Posting, Register
from .manager.model_manager import NodeManager


class SurfaceUser(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    fake = StringProperty(default="None")
    # case_id = StringProperty()
    note = StringProperty()

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

@NodeManager    
class DarkUser(StructuredNode):
    uid = UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    rank = StringProperty()
    regdate = StringProperty()
    post_num = IntegerProperty()
    comment_num = IntegerProperty()
    label = StringProperty()
    case_id = StringProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "url": self.url,
            "rank": self.rank,
            "regdate": self.regdate,
            "post_num": self.post_num,
            "comment_num": self.comment_num,
            "label": self.label,
            "case_id": self.case_id,
            "note": self.note
        }


@NodeManager
class Person(StructuredNode):
    #Property
    uid = UniqueIdProperty()
    username = StringProperty()
    fake = StringProperty()
    label = StringProperty()
    note = StringProperty()

    # Relationship 
    is_surface_user = RelationshipTo(SurfaceUser,'IS')
    is_dark_user = RelationshipTo(DarkUser, 'IS')

    def to_json(self):
        return  {
            "uid": self.uid,
            "username": self.username,
            "fake": self.fake,
            "label": self.label,
            "note": self.note
        }



@NodeManager
class Company(StructuredNode):
    uid = UniqueIdProperty()
    name = StringProperty()
    fake = StringProperty()
    business_num = StringProperty()
    phone_num = StringProperty()
    label = StringProperty()
    case_id = StringProperty()
    note = StringProperty()

    # Relationship 
    belong_to = RelationshipTo(Person, 'BELONG_TO')

    def to_json(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "fake": self.fake,
            "business_num": self.business_num,
            "phone_num": self.phone_num,
            "label": self.label,
            "case_id": self.case_id,
            "note": self.note
        }

