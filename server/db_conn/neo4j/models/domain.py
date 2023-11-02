from neomodel import StructuredNode, UniqueIdProperty,StringProperty, BooleanProperty, DateTimeProperty

from ..init import db

from .manager.model_manager import NodeManager

@NodeManager
class Domain(StructuredNode):
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
    
