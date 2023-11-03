from neomodel import StructuredNode, ArrayProperty,IntegerProperty, RelationshipTo, UniqueIdProperty,StringProperty

from .domain import Domain
from .post import Post
from .manager.relationship import Posting, Register
from .manager.model_manager import NodeManager
from .base import BaseNode

@NodeManager
class SurfaceUser(BaseNode):
    uid= UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    fake = StringProperty(default="None")
    case_id = StringProperty()
    registered = ArrayProperty()
    note = StringProperty()

    # Relation
    register = RelationshipTo(Domain, 'REGISTER', model=Register)
    posting = RelationshipTo(Post,'POSTING',model=Posting)

    def to_json(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "fake": self.fake,
            "registered": self.registered,
            "note": self.note
        }

@NodeManager    
class DarkUser(BaseNode):
    uid= UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    rank = StringProperty()
    regdate = StringProperty()
    post_num = IntegerProperty()
    comment_num = IntegerProperty()
    case_id = StringProperty()
    registered = ArrayProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "username": self.username,
            "rank": self.rank,
            "regdate": self.regdate,
            "post_num": self.post_num,
            "comment_num": self.comment_num,
            "registered": self.registered,
            "note": self.note
        }

@NodeManager
class Person(BaseNode):
    uid= UniqueIdProperty()
    username = StringProperty()
    fake = StringProperty()
    note = StringProperty()
    case_id = StringProperty()
    url = StringProperty()

    # Relationship 
    is_surface_user = RelationshipTo(SurfaceUser,'IS')
    is_dark_user = RelationshipTo(DarkUser, 'IS')

    def to_json(self):
        return  {
            "uid": self.uid,
            "username": self.username,
            "fake": self.fake,
            "note": self.note
        }



@NodeManager
class Company(BaseNode):
    uid= UniqueIdProperty()
    name = StringProperty()
    fake = StringProperty()
    business_num = StringProperty()
    case_id = StringProperty()
    note = StringProperty()
    url = StringProperty()

    # Relationship 
    belong_to = RelationshipTo(Person, 'BELONG_TO')

    def to_json(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "fake": self.fake,
            "business_num": self.business_num,
            "note": self.note
        }

