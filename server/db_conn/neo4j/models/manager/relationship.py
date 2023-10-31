from neomodel import StructuredRel,UniqueIdProperty, Relationship,StringProperty

class Posting(StructuredRel):
    uid = UniqueIdProperty()

class Register(StructuredRel):
    uid = UniqueIdProperty()

class UserDefinedRelations:
    user_defined = Relationship('UserDefineRelationship', 'USER_DEFINED')

class UserDefineRelationship(StructuredRel):
    uid = UniqueIdProperty()
    label = StringProperty()
