
from neomodel import StructuredRel,UniqueIdProperty, Relationship,StringProperty

TO = True
FROM = False

class Posting(StructuredRel):
    uid = UniqueIdProperty()

class Register(StructuredRel):
    uid = UniqueIdProperty()


