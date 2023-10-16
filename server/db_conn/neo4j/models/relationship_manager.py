from neomodel import Relationship

from .user import SurfaceUser
from .post import Post
from .domain import Domain
from ..init import db
"""
RelationshipManager
- 노드 간의 관계형을 정의하는 class 

"""
class RelationshipManager:
    @classmethod
    def posting(cls, user: SurfaceUser, post: Post) -> bool:
        try:
            relationship = Relationship(user, "POSTING", post)
            relationship.save()
            return True
        except Exception as e:
            print(f"Error creating the relationship: {str(e)}")
            return False
    
    @classmethod
    def register(cls, domain:Domain, user:SurfaceUser) ->bool:
        try:
            relationship = Relationship(domain, "REGISTER", user)
            relationship.save()
            return True
        except Exception as e:
            print(f"Error creating the relationship: {str(e)}")
            return False
    
