from neomodel import StructuredNode, UniqueIdProperty,StringProperty, BooleanProperty, DateTimeProperty

from ..init import db

class Domain(StructuredNode):
    uid = UniqueIdProperty()
    domain = StringProperty(unique_index=True)
    regdate = DateTimeProperty()
    status = BooleanProperty()

    def __init__(self, *args, **kwargs):
        super(Domain, self).__init__(*args, **kwargs)

    def _json_serializable(self):
        return {
            "domain": self.domain,
            "regdate": self.regdate.isoformat(),
            "status": self.status,
        }

    @classmethod
    def create_node(cls, data):
        surface_user = cls(**data)  
        surface_user.save()
        return surface_user

    @classmethod
    def create_domain(cls, domain, regdate, status):
        domain_node = cls(domain=domain, regdate=regdate, status=status)
        domain_node.save()
        return domain_node

    @classmethod
    def get_all_domains(cls):
        domains = cls.nodes.all()
        return [domain._json_serializable() for domain in domains]

    @classmethod
    def get_domain_by_name(cls, domain):
        return cls.nodes.filter(domain=domain).first()

    @classmethod
    def node_exists_url(cls, url):
        try:
            node = cls.nodes.filter(url=url).first()
            return node.uid
        except cls.DoesNotExist:
            return None

    @classmethod
    def update_domain_properties(cls, node_id, regdate=None, status=None):
        domain = cls.nodes.get_or_none(uid=node_id)
        if domain:
            if regdate is not None:
                domain.regdate = regdate
            if status is not None:
                domain.status = status
            domain.save()
            return True
        else:
            return False

