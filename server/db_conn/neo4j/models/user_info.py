from neomodel import StructuredNode, RelationshipTo, UniqueIdProperty,StringProperty
from .manager.model_manager import NodeManager

@NodeManager
class Email(StructuredNode):
    uid = UniqueIdProperty()
    label = StringProperty()
    email = StringProperty(unique_index=True)
    fake = StringProperty(default='None')
    email_domain = StringProperty()
    note = StringProperty()
    case_id = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "label": self.label,
            "email": self.email,
            "fake": self.fake,
            "email_domain": self.email_domain,
            "note": self.note
        }


@NodeManager
class Phone(StructuredNode):
    uid = UniqueIdProperty()
    label = StringProperty()
    number = StringProperty()
    note = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "number": self.number,
            "note": self.note
        }

@NodeManager
class Message(StructuredNode):
    uid = UniqueIdProperty()
    label = StringProperty()
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
class Wallet(StructuredNode):
    uid = UniqueIdProperty()
    label = StringProperty()
    wallet = StringProperty(required=True)
    wallet_type = StringProperty()
    note = StringProperty()
    case_id = StringProperty()

    def to_json(self):
        return {
            "uid": self.uid,
            "label": self.label,
            "wallet": self.wallet,
            "wallet_type": self.wallet_type,
            "note": self.note,
        }