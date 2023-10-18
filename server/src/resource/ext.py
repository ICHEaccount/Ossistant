# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j import db
from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post
from db_conn.neo4j.models.domain import Domain
from db_conn.neo4j.lib.relation_manager import RelationManager

bp = Blueprint('extension', __name__, url_prefix='/graph/ext')

@bp.route('/create',methods=["POST"])
def create_node():
    req = request.get_json()
    print(req)
    if not req:
        return jsonify({'Error':'Invalid request'}), 404
    
    req_label = req['label']
    if not req_label:
        return jsonify({'Error':'Invalid request'}), 404
    
    keys = list(req['keyword'].keys())
    req_arg = {keys[0]: req['keyword'][keys[0]]}
    
    if req_label == 'SurfaceUser':
        node_id = SurfaceUser.node_exists_url(req['url'])
        if node_id is not None:
            node = SurfaceUser.update_node_properties(node_id, **req_arg)
            if node is False:
                return jsonify({'Error':'Node update Error '}), 500
            if hasattr(node, 'username') and node.username is not None:
                RelationManager.post_contain_user(node.username)
        else:
            req_arg['url'] = req['url']
            node = SurfaceUser.create_node(req_arg)
            if hasattr(node, 'username') and node.username is not None:
                RelationManager.post_contain_user(node.username)
            if not node:
                return jsonify({'Error':'Node creation Error'}), 500
            
    elif req_label == 'Domain':
        node_id = Domain.node_exists_url(req['url'])
        if node_id is not None:
            if Domain.update_node_properties(node_id, **req_arg) is False:
                return jsonify({'Error':'Node update Error '}), 500
        else:
            req_arg['url'] = req['url']
            node = Domain.create_node(req_arg)
            if not node:
                return jsonify({'Error':'Node creation Error'}), 500
            
    elif req_label == 'Post':
        node_id = Post.node_exists_url(req['url'])
        if node_id:
            post_node = Post.update_node_properties(node_id, **req_arg)
            if post_node is False:
                return jsonify({'Error':'Node update Error '}), 500
            if hasattr(post_node, 'writer') and post_node.writer is not None:
                RelationManager.post_contain_user(post_node.writer)
        else:
            req_arg['url'] = req['url']
            post_node = Post.create_node(req_arg)
            if not post_node:
                return jsonify({'Error':'Node creation Error'}), 500
            if hasattr(post_node, 'writer') and post_node.writer is not None:
                RelationManager.post_contain_user(post_node.writer)

    return jsonify({'Message':'Success'}), 200
    
    


