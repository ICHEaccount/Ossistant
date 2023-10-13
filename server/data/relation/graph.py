from flask import request, jsonify,Blueprint

from db_conn.neo4j import db
from server.db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post
from db_conn.neo4j.models.relationship_manager import RelationshipManager

bp = Blueprint('tool', __name__, url_prefix='/graph/ext')

@bp.route("/node", methods=["GET"])
def get_neo4j_data():
    query = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]-(m)
    RETURN n, r, m
    """
    results, meta = db.cypher_query(query)

    nodes_and_relationships = []
    for row in results:
        n_dict = dict(row[0])
        r_dict = dict(row[1]) if row[1] else None
        m_dict = dict(row[2]) if row[2] else None
        nodes_and_relationships.append({'n': n_dict, 'r': r_dict, 'm': m_dict})
    
    return jsonify(nodes_and_relationships)





