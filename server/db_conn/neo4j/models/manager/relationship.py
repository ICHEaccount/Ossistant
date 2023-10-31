
from neomodel import StructuredRel,UniqueIdProperty, Relationship,StringProperty

class Posting(StructuredRel):
    uid = UniqueIdProperty()

class Register(StructuredRel):
    uid = UniqueIdProperty()

class Relation:
    relation = Relationship('UserDefineRelationship', 'USER_DEFINED')

class UserDefineRelationship(StructuredRel):
    uid = UniqueIdProperty() 
    label = StringProperty()
