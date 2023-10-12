from py2neo import Relationship

from .main_node import SurfaceUser
from .sub_node import Post
from ..init import graphdb
# Surface user -> ?
HAS_BLOG = Relationship.type("HAS_BLOG")

class RelationshipManager:

    @classmethod
    def has_blog(cls, user: SurfaceUser, post: Post) -> bool:
        try:
            graphdb.create(HAS_BLOG(user, post))
            return True  
        except Exception as e:
            print(f"Error creating the relationship: {str(e)}")
            return False  