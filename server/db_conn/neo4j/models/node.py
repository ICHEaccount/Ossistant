from neomodel import StructuredNode, UniqueIdProperty,StringProperty,IntegerProperty, ArrayProperty
from ..init import db

from .lib.node_manager import NodeManager
from .base import BaseNode

@NodeManager
class Domain(BaseNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    domain = StringProperty(unique_index=True)
    regdate = StringProperty()
    status = StringProperty(default="None")
    case_id = StringProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "domain": self.domain,
            "regdate": self.regdate,
            "status": self.status,
            "note": self.note
        }
    

@NodeManager
class Post(BaseNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    title = StringProperty()
    writer = StringProperty()
    content = StringProperty()
    created_date = StringProperty()
    post_type = StringProperty() # Blog, Cafe ... 
    case_id = StringProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "url": self.url,
            "title": self.title,
            "writer": self.writer,
            "content": self.content,
            "created_date": self.created_date,
            "post_type":self.post_type,
            "note":self.note
        }


@NodeManager
class Comment(BaseNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    name = StringProperty()
    content = StringProperty()
    created_date = StringProperty()
    case_id = StringProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "url": self.url,
            "name": self.name,
            "content": self.content,
            "created_date": self.created_date,
            "note": self.note
        }
    

@NodeManager
class Email(BaseNode):
    uid = UniqueIdProperty()
    email = StringProperty(unique_index=True)
    fake = StringProperty(default='None')
    email_domain = StringProperty()
    note = StringProperty()
    case_id = StringProperty()
    url = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "email": self.email,
            "fake": self.fake,
            "email_domain": self.email_domain,
            "note": self.note
        }

@NodeManager
class Phone(BaseNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    number = StringProperty()
    note = StringProperty()
    case_id = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "number": self.number,
            "note": self.note
        }

@NodeManager
class Message(BaseNode):
    uid = UniqueIdProperty()
    sender = StringProperty(required=True)
    url = StringProperty()
    content = StringProperty()
    note = StringProperty()
    case_id = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "sender": self.sender,
            "date": self.date,
            "content": self.content,
            "note": self.note
        }

@NodeManager
class Wallet(BaseNode):
    uid = UniqueIdProperty()
    wallet = StringProperty(required=True)
    wallet_type = StringProperty()
    note = StringProperty()
    case_id = StringProperty()
    url = StringProperty()
    
    def to_json(self):
        return {
            "uid": self.uid,
            "wallet": self.wallet,
            "wallet_type": self.wallet_type,
            "note": self.note,
        }


@NodeManager
class SurfaceUser(BaseNode):
    uid= UniqueIdProperty()
    username = StringProperty()
    url = StringProperty()
    fake = StringProperty(default="None")
    case_id = StringProperty()
    registered = ArrayProperty(required=False, default=[])
    note = StringProperty()

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
    registered = ArrayProperty(required=False, default=[])
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
    name = StringProperty()
    fake = StringProperty()
    note = StringProperty()
    case_id = StringProperty()
    url = StringProperty()

    def to_json(self):
        return  {
            "uid": self.uid,
            "name": self.name,
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

    def to_json(self):
        return {
            "uid": self.uid,
            "name": self.name,
            "fake": self.fake,
            "business_num": self.business_num,
            "note": self.note
        }


NODE_LIST = {
    'Domain': Domain,
    'SurfaceUser': SurfaceUser,
    'Post': Post,
    'DarkUser': DarkUser,
    'Person': Person,
    'Company': Company,
    'Comment': Comment,
    'Email': Email,
    'Wallet': Wallet,
    'Phone': Phone,
    'Message': Message
}