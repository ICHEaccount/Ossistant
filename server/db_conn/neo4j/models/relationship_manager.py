from neomodel import Relationship
from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.domain import Domain

class RelationshipManager:
    @classmethod
    def register(cls, username, domain_name):
        try:
            existing_user = SurfaceUser.nodes.first_or_none(username=username)
            if existing_user:
                user = existing_user
            else:
                user = SurfaceUser(username=username).save()

            existing_domain = Domain.nodes.first_or_none(domain=domain_name)
            if existing_domain:
                domain = existing_domain
            else:
                domain = Domain(domain_name=domain_name).save()

            rel = Relationship(user, "REGISTER", domain)  # RegisterRel relationship is used here.
            rel.save()

            return True  # Relationship creation successful

        except Exception as e:
            print(f"Error creating relationship: {e!r}")
            return False  # Error occurred
