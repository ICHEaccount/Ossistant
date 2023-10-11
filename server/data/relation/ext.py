# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j import graphdb
from db_conn.neo4j.models.main_node import SurfaceUser
from db_conn.neo4j.models.sub_node import Post
from db_conn.neo4j.models.relationship_manager import RelationshipManager

bp = Blueprint('tool', __name__, url_prefix='/graph/ext')


@bp.route('/create',methods=["POST"])
def create_node():
    req = request.get_json()

    if not req:
        return jsonify({'Error':'Invalid request'}), 404
    
    req_label = req['label']
    if not req_label:
        return jsonify({'Error':'Invalid request'}), 404
    
    keys = list(req['keyword'].keys())
    req_arg = {keys[0]: req['keyword'][keys[0]]}

    if req_label == 'SurfaceUser':
        node_id = SurfaceUser.node_exists_url(req['url'])
        if len(node_id)!=0:
            if SurfaceUser.update_node_properties(node_id[0], keys[0], req['keyword'][keys[0]]) is False:
                return jsonify({'Error':'Node update Error '}), 500
        else:
            req_arg['url'] = req['url']
            node = SurfaceUser(**req_arg).create()
            if not node:
                return jsonify({'Error':'Node update Error'}), 500
    elif req_label == 'Domain':
        pass 
    elif req_label == 'Post':
        pass

    return jsonify({'Message':'Success'}), 200
    
    


