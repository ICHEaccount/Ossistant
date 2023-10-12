import json
from py2neo import Graph, Node, Relationship

# Neo4j 데이터베이스에 연결
graph = Graph("http://localhost:7474", auth=("neo4j", "icheneo4j"),name="neo4j")

with open("test_data_3.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

for post in data["Post"]:
    keyword_data = post.pop("keyword", {})
    post.update({f"keyword-{key}": value for key, value in keyword_data.items()})

for category, items in data.items():
 for item in items:
    node = Node(category, **{k: v for k, v in item.items() if v is not None})
    graph.create(node)

