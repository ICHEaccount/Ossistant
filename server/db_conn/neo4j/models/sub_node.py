from py2neo import Node
from py2neo.ogm import GraphObject, Property

from ..init import graphdb

class Post(GraphObject):
    url = Property()
    title = Property()
    writer = Property()
    created_date = Property()
    post_type = Property() # need to change(str -> int)

    def __init__(self, url, title, writer, created_date, post_type):
        self._url = url 
        self._title = title
        self._writer = writer
        self._created_date = created_date
        self._post_type = post_type
    
    def get_node_id(self):
        node = graphdb.graph.nodes.get(self.__node__.identity)
        return node.identity
    
    @classmethod
    def inflate(cls, node):
        url = node["url"]
        title = node["title"]
        writer = node["writer"]
        created_date = node["created_date"]
        post_type = node["post_type"]
        return cls(url, title,writer, created_date, post_type)

    def json_serialize(self):
        return {
            "url": self._url,
            "title": self._title,
            "writer": self._writer,
            "created_date": self._created_date,
            "post_type": self._post_type
        }


    def create(self):
        try:
            node = Node("Email", url=self._url,title=self._title,writer=self._writer, created_date=self._created_date, post_type=self._post_type)
            node.caption = self._title
            graphdb.create(node)
            return node 
        except Exception as e:
            print(f"Error creating Email node: {str(e)}")
            return None

    @classmethod
    def get_all_posts(cls) -> list:
        query = "MATCH (su:Post) RETURN su"
        result = graphdb.graph.run(query)

        posts = []
        for record in result:
            post_node = record["su"]
            post = cls.inflate(post_node)
            posts.append(post)

        return posts
    
