import re
# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j import db
from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post
from db_conn.neo4j.models.domain import Domain
from db_conn.neo4j.lib.relation_manager import RelationManager

bp = Blueprint('extension', __name__, url_prefix='/graph/ext')

def compare_post_user_username(post_obj:Post, user_obj:SurfaceUser):
    if hasattr(post_obj, 'writer') and hasattr(user_obj,'username'):
        if post_obj.writer == user_obj.username:
            if not user_obj.posting.is_connected(post_obj):
                user_obj.posting.connect(post_obj)
            return True
    return False 

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
    req_arg['case_id'] = '1' # Fix 

    if req_label == 'SurfaceUser':
        node_id = SurfaceUser.node_exists_url(req['url'])
        if node_id is not None:
            user_obj = SurfaceUser.update_node_properties(node_id, **req_arg)
            if user_obj is False:
                return jsonify({'Error':'Node update Error '}), 500

            post_obj = Post.nodes.first_or_none(writer=node.username)
            if post_obj:
                compare_post_user_username(post_obj=post_obj,user_obj=user_obj) 
        else:
            req_arg['url'] = req['url']
            user_obj = SurfaceUser.create_node(req_arg)
            if not user_obj:
                return jsonify({'Error':'Node creation Error'}), 500
            post_obj = Post.nodes.first_or_none(writer=user_obj.username)
            if post_obj:
                compare_post_user_username(post_obj=post_obj,user_obj=user_obj) 
            
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
        
        # parsing writer from url 
        pattern = r"(?<=\.com\/)[^/]+"
        match = re.search(pattern, req['url'])
        writer = match.group(0) if match else None
        req_arg['writer'] = writer

        if node_id:
            post_obj = Post.update_node_properties(node_id, req_arg)
            if post_obj is False:
                return jsonify({'Error':'Node update Error '}), 500
            user_obj = SurfaceUser.nodes.first_or_none(username=post_obj.writer)
            if user_obj:
                compare_post_user_username(post_obj,user_obj)
        else:
            req_arg['url'] = req['url']
            post_obj = Post.create_node(req_arg)
            if not post_obj:
                return jsonify({'Error':'Node creation Error'}), 500
            user_obj = SurfaceUser.nodes.first_or_none(username=post_obj.writer)
            if user_obj:
                compare_post_user_username(post_obj,user_obj)

    return jsonify({'Message':'Success'}), 200
    
    


