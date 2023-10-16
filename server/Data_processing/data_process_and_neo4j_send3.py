import json
from neo4j import GraphDatabase

# Neo4j 데이터베이스에 연결
uri = "bolt://localhost:7687"
username = "neo4j"
password = "icheneo4j"

def upload_data(tx, data):
    for category, items in data.items():
        for item in items:
            properties = {k: v for k, v in item.items() if v is not None}
            query = f"CREATE (n:{category} $properties)"
            tx.run(query, properties=properties)

with open("test_data_3.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

driver = GraphDatabase.driver(uri, auth=(username, password))
with driver.session() as session:
    session.execute_write(upload_data, data)

driver.close()


# import json
# from py2neo import Graph, Node, Relationship
#
# # Neo4j 데이터베이스에 연결
# graph = Graph("http://localhost:7474", auth=("neo4j", "icheneo4j"),name="neo4j")
#
# with open("test_data_3.json", "r", encoding="utf-8") as json_file:
#     data = json.load(json_file)
#
# for post in data["Post"]:
#     keyword_data = post.pop("keyword", {})
#     post.update({f"keyword-{key}": value for key, value in keyword_data.items()})
#
# for category, items in data.items():
#  for item in items:
#     node = Node(category, **{k: v for k, v in item.items() if v is not None})
#     graph.create(node)

