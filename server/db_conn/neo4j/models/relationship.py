from neomodel import StructuredRel,UniqueIdProperty

class Posting(StructuredRel):
    uid = UniqueIdProperty()

class Register(StructuredRel):
    uid = UniqueIdProperty()