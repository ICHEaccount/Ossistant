from flask import request, jsonify,Blueprint

from db_conn.neo4j.init import db
from db_conn.neo4j.models import *

bp = Blueprint('relation_graph', __name__, url_prefix='/graph')

# Should be change 
# @bp.route("/node/<string:case_id>", methods=["GET"])
# def get_neo4j_data(case_id):
#     query = f"""
#     MATCH (n)
#     WHERE n.case_id = '{case_id}'
#     OPTIONAL MATCH (n)-[r]-(m)
#     RETURN n, labels(n),TYPE(r), PROPERTIES(r), m, r.uid, n.uid, m.uid
#     """
#     pass



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
        if r_type:
            nodes_and_relationships.append({'n': n_dict, 'r': {'id':r_id,'type': r_type, 'properties': r_properties}, 'm': m_dict})
        else:
            nodes_and_relationships.append({'n': n_dict, 'r': None, 'm': m_dict})
    return jsonify(nodes_and_relationships)


def get_node_properties_by_uid(uid):
    query = f"MATCH (n) WHERE n.uid = '{uid}' RETURN labels(n), properties(n)"
    results, _ = db.cypher_query(query)
    preprocessed_data = dict()
    preprocessed_data['type'] = results[0][0][0] if results[0][0] else None
    preprocessed_data.update(results[0][1])
    if results:
        return preprocessed_data
    else:
        return None

@bp.route("/node/<string:uid>", methods=["GET"])
def get_node_properties(uid):
    if uid:
        result = get_node_properties_by_uid(uid)
        # Delete unnecessary value 
        if 'case_id' in result:
            del(result['case_id'])
        if 'label' in result:
            del(result['label'])
        if result != None:
            return jsonify(result)
        else:
            return jsonify({'error': result}), 404
    else:
        return jsonify({'error': 'UID parameter is missing.'}), 400


@bp.route("/node/modify", methods=['POST'])
def modify_node():
    res = request.get_json()
    if not res:
        return jsonify({'error':'Invalid request data'}), 404
    
    node_type = res['type']
    if not node_type:
        return jsonify({'error':'Invalid type'}), 404
    
    data = res.copy()

    del data['uid']
    del data['type']
    
    if node_type == 'Domain':
        node = Domain.update_node_properties(res.get('uid'),**data)
    elif node_type == 'SurfaceUser':
        node = SurfaceUser.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Post':
        node = Post.update_node_properties(res.get('uid'),**data)
    elif node_type == 'DarkUser':
        node = DarkUser.update_node_properties(res.get('uid'),**data)
    elif node_type =='Person':
        node =Person.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Company':
        node = Company.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Comment':
        node = Comment.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Email':
        node = Email.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Wallet':
        node = Wallet.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Phone':
        node = Phone.update_node_properties(res.get('uid'),**data)
    elif node_type == 'Message':
        node = Message.update_node_properties(res.get('uid'),**data)
    else:
        return jsonify({'error':'Invalid type'}), 500
    if node is False:
        return jsonify({'error':'Fail to modify the node'}), 500
    return jsonify({'msg':'success'}), 200
