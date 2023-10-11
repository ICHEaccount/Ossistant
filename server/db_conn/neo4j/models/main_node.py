import re 
from py2neo import  Node
from py2neo.ogm import GraphObject, Property

from ..init import graphdb

class SurfaceUser(GraphObject):
    username = Property()
    url = Property()
    fake = Property()

    def __init__(self, username=None, url=None,fake = False):
        self._username = username
        self._url = url
        self._fake = fake 
    
    def _json_serializable(self):
        return {
            "username": self._username,
            "url": self._url,
            "fake": self._fake,
        }

        
    def get_node_id(self):
        user_node = graphdb.nodes.get(self.__node__.identity)
        return user_node.identity


    def create(self):
        try:
            node = Node("SurfaceUser", username=self._username, url=self._url, fake=self._fake)
            graphdb.create(node)
            return node
        except Exception as e:
            print(f"Error creating SurfaceUser node: {str(e)}")
            return None

    @classmethod
    def _inflate(cls, node):
        username = node["username"]
        url = node["url"]
        fake = node["fake"]
        return cls(username, url,fake)

    @classmethod
    def get_all_usernames(cls) -> list:
        query = "MATCH (su:SurfaceUser) RETURN su.username AS username"
        result = graphdb.graph.run(query)

        usernames = [record["username"] for record in result]
        return usernames
    
    @classmethod
    def get_all_users(cls) -> list:
        query = "MATCH (su:SurfaceUser) RETURN su"
        result = graphdb.run(query)

        surface_users = []
        for record in result:
            surface_user_node = record["su"]
            surface_user = cls._inflate(surface_user_node)
            surface_users.append(surface_user._json_serializable())
        return surface_users

        
    @classmethod
    def node_exists_url(cls, url):
        query = f"MATCH (u:{cls.__name__} {{url: '{url}'}}) RETURN id(u) as node_id"
        try:
            result = graphdb.run(query)
            if result:
                node_ids = [str(record['node_id']) for record in result]
                print(node_ids)
                return node_ids
            else:
                return None
        except Exception as e:
            print(e)
            return None

    @classmethod
    def update_node_properties(cls, node_id, prop_key, prop_data):
        try:
            query = (
                f"MATCH (u) "
                f"WHERE id(u) = {node_id} "
                f"SET u.{prop_key} = '{prop_data}' "
                "RETURN u"
            )

            result = graphdb.run(query)
            return True
        except Exception as e:
            print(f"Error updating SurfaceUser node: {str(e)}")
            return False