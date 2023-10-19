from neomodel import StructuredNode, UniqueIdProperty,StringProperty, BooleanProperty, DateTimeProperty

from ..init import db

class Domain(StructuredNode):
    uid = UniqueIdProperty()
    url = StringProperty()
    domain = StringProperty(unique_index=True)
    regdate = StringProperty()
    status = StringProperty(default="None")
    case_id = StringProperty()

    def __init__(self, *args, **kwargs):
        super(Domain, self).__init__(*args, **kwargs)

    def _json_serializable(self):
        return {
            "domain": self.domain,
            "regdate": self.regdate,
            "status": self.status,
            "case_id": self.case_id
        }


    @classmethod
    def create_node(cls, data):
        node = cls(**data)
        node.save()
        return node


    @classmethod
    def get_all_domains(cls):
        domains = cls.nodes.all()
        return [domain._json_serializable() for domain in domains]

    @classmethod
    def get_domain_by_name(cls, domain):
        return cls.nodes.get(domain=domain)

    @classmethod
    def node_exists_url(cls, url):
        try:
            node = cls.nodes.filter(url=url).first()
            return node.uid
        except cls.DoesNotExist:
            return None

    @classmethod
    def update_node_properties(cls, node_id, **kwargs):
        node = cls.nodes.get_or_none(uid=node_id)
        if node:
            for key, value in kwargs.items():
                setattr(node, key, value)
            node.save()
            return node
        else:
            return False

