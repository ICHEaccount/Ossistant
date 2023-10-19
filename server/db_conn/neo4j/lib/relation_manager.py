from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post
from db_conn.neo4j.models.domain import Domain


class RelationManager:

    @classmethod
    def post_contain_user(cls,username) -> bool:
        user_obj = SurfaceUser.nodes.first_or_none(username=username)
        post_obj = Post.nodes.first_or_none(writer=username)
        flag = False 
        if user_obj is not None and post_obj is not None:
            if user_obj.username == post_obj.writer:
                return True

        if flag == True:
            if not user_obj.posting.is_connected(post_obj):
                user_obj.posting.connect(post_obj)
        return flag 
                




    