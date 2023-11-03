from neomodel import StructuredNode, StringProperty,UniqueIdProperty,StructuredRel, RelationshipTo, RelationshipFrom

class NodeRelationship(StructuredRel):
    uid = UniqueIdProperty()
    label = StringProperty()


class BaseNode(StructuredNode):
    __abstract_node__ = True
    rel_to = RelationshipTo("BaseNode","CUSTOM_TO",model=NodeRelationship)
    # rel_from = RelationshipFrom('BaseNode', 'CUSTOM_FROM', model=NodeRelationship)