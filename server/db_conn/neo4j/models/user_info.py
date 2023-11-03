from neomodel import StringProperty, UniqueIdProperty
from .manager.model_manager import NodeManager
from .base import BaseNode

@NodeManager
class Email(BaseNode):
    uid = UniqueIdProperty()
    email = StringProperty(unique_index=True)
    fake = StringProperty(default='None')
    email_domain = StringProperty()
    note = StringProperty()
    case_id = StringProperty()

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
    date = StringProperty()
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