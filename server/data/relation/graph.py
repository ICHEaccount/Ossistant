from flask import request, jsonify,Blueprint

from db_conn.neo4j import graphdb
from db_conn.neo4j.models.main_node import SurfaceUser
from db_conn.neo4j.models.sub_node import Post
from db_conn.neo4j.models.relationship_manager import RelationshipManager

bp = Blueprint('tool', __name__, url_prefix='/graph/ext')

@bp.route("/node", methods=["GET"])
def show_all_data():
    query = "MATCH (n) RETURN n LIMIT 10"  # Adjust your Cypher query as needed
    result = graphdb.run(query)
    data = [record[0] for record in result]

    return jsonify(data)
