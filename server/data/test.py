# flaks 
from flask import request, jsonify,Blueprint
from db_conn.neo4j.models.main_node import SurfaceUser
from db_conn.neo4j.models.sub_node import Post
from db_conn.neo4j.models.relationship_manager import RelationshipManager
from db_conn.neo4j import graphdb

bp = Blueprint('test', __name__, url_prefix='/test')

@bp.route('/user',methods=['GET'])
def add_user():

    users = SurfaceUser.get_all_users()
    if not users:
        return jsonify({'Error':'error'}), 500
    return jsonify({'username':users}), 200


# @bp.route("/node", methods=["GET"])
# def get_neo4j_data():
#     query = """
#     MATCH (n)-[r]-(m)
#     RETURN n, r, m
#     """
#     results = graphdb.run(query)

#     data = []
#     for record in results:
#         data.append({
#             "node": dict(record["n"]),
#             "relationship": dict(record["r"]),
#             "related_node": dict(record["m"])
#         })

#     print(data)

#     return jsonify(data)



# def get_graph_data():
#     with driver.session() as session:
#         result = session.run("MATCH (n)-[r]->(m) RETURN n, r, m;")
#         graph_data = {
#             "nodes": [],
#             "edges": []
#         }
#         print(result)
#         for record in result:
#             node = record["n"]
#             node_data = {
#                 "id": node.id,
#                 "labels": list(node.labels),  # Convert frozenset to list
#                 "properties": dict(node)
#             }
#             graph_data["nodes"].append(node_data)
            
#             relationships = record["r"]
#             print(f'rel : {relationships}')
#             for rel in relationships:
#                 edge_data = {
#                     "from": node.id,
#                     "to": rel.end_node.id,
#                     "type": rel.type
#                 }
#                 print(f'edge_data: {edge_data}')
#                 graph_data["edges"].append(edge_data)

#         return graph_data

# # /graph endpoint to send data to the client
# @bp.route("/graph")
# def send_graph_data():
#     graph_data = get_graph_data()
#     print(graph_data)
#     return jsonify(graph_data)