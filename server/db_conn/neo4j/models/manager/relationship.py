
from neomodel import StructuredRel,UniqueIdProperty, Relationship,StringProperty

class Posting(StructuredRel):
    uid = UniqueIdProperty()

class Register(StructuredRel):
    uid = UniqueIdProperty()

class Contain(StructuredRel):
    uid = UniqueIdProperty()
    

class UserDefineRelationship(StructuredRel):
    uid = UniqueIdProperty()
    label = StringProperty()

class Relation:
    
    @classmethod
    def create_relationship(cls, from_node, to_node, label):
        try:
            relationship = UserDefineRelationship(label=label)
            relationship.connect()
            return True, "Success"
        except Exception as e:
            return False, str(e)

    @classmethod
    def delete_node_by_uid(cls, uid_to_delete):
        try:
            UserDefineRelationship.nodes.filter(uid=uid_to_delete).delete()
            return True, "Success"
        except Exception as e:
            return False, f"{e}"

    @classmethod
    def modify_label_by_uid(cls, uid_to_modify, new_label):
        try:
            rels = UserDefineRelationship.nodes.filter(uid=uid_to_modify)
            for rel in rels:
                rel.label = new_label
                rel.save()
            return True, "Success"
        except Exception as e:
            return False, f"{e}"



