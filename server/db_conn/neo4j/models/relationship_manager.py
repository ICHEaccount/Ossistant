
from neomodel import Relationship

from .user import SurfaceUser
from .post import Post
from ..init import db

class RelationshipManager:
    @classmethod
    def has_blog(cls, user: SurfaceUser, post: Post) -> bool:
        try:
            relationship = Relationship(user, "HAS_BLOG", post)
            relationship.save()
            return True
        except Exception as e:
            print(f"Error creating the relationship: {str(e)}")
            return False

