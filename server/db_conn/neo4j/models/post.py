from neomodel import StringProperty, UniqueIdProperty, DateTimeProperty, IntegerProperty

from ..init import db
from .manager.model_manager import NodeManager
from .base import BaseNode

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
