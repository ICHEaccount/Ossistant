from flask import request, jsonify,Blueprint

from db_conn.neo4j import db
from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post

bp = Blueprint('relation_graph', __name__, url_prefix='/graph')

@bp.route("/node", methods=["GET"])
def get_neo4j_data():
    query = """
    MATCH (n)
    OPTIONAL MATCH (n)-[r]-(m)
    RETURN n, labels(n),TYPE(r), PROPERTIES(r), m, r.uid, n.uid, m.uid
    """
    results, _ = db.cypher_query(query)

    nodes_and_relationships = []
    for row in results:
        n_dict = dict(row[0])
        n_labels = row[1]
        r_type = row[2]
        r_properties = row[3] if row[3] else None
        r_id = row[5]
        m_dict = dict(row[4]) if row[4] else None
        if m_dict is not None:
            m_dict['id'] = row[7] if row[7] else None
        label = n_labels[0] if n_labels else None
        n_dict['label'] = label
        n_dict['id'] = row[6] if row[6] else None
        
        # print(f"r_id : {r_id}, r_type: {r_type}, r_properties: {r_properties}")
        if r_type:
            nodes_and_relationships.append({'n': n_dict, 'r': {'id':r_id,'type': r_type, 'properties': r_properties}, 'm': m_dict})
        else:
            nodes_and_relationships.append({'n': n_dict, 'r': None, 'm': m_dict})
        # print(nodes_and_relationships[:4])
    return jsonify(nodes_and_relationships)

