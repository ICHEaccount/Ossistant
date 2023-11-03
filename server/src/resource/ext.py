import re
# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j.init import db
# from db_conn.neo4j.models import *
from db_conn.neo4j.node_config import RELATIONS, NODE_LIST


bp = Blueprint('extension', __name__, url_prefix='/graph/ext')


TO = True
FROM = False

def create_relationship(node1, node_label):
    if node1 is not None and node_label in RELATIONS:
        rels_list = RELATIONS[node_label]
        for rel_info in rels_list:
            pos_flag = TO
            rel_data = rel_info['data']

            pos_key = list(rel_info.keys())[0]
            if pos_key == 'to':
                node2 = rel_info['to'].get_node({rel_data[1]:getattr(node1, rel_data[0])})
            elif pos_key == 'from':
                node2 = rel_info['from'].get_node({rel_data[1]:getattr(node1, rel_data[0])})
                pos_flag = FROM 
            else:
                return False,'Invalid node_config'
                
            if pos_flag is TO and node2 is not None:
                node1.rel_to.connect(node2,{'label':node_label})
            elif pos_flag is FROM and node2 is not None:
                node2.rel_to.connect(node1,{'label':node_label})
            else:
                return True, 'No Relationship'
        return True, 'Success'
    else:
        return False, 'Node does not exist'


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
    req_arg['case_id'] = 'c9041024-77cd-11ee-afc9-0242ac190006' # Hardcoded

    # create node 
    if req_label not in NODE_LIST:
        return jsonify({'Error':'Invalid label'}), 404
    
    inp = {'case_id':req_arg['case_id'],'url':req['url']}
    check_status, existed_node = NODE_LIST[req_label].check_node(inp)
    if check_status is True:
        node = NODE_LIST[req_label].update_node_properties(node_id=existed_node.uid, **req_arg)
    elif check_status is False: 
        node = NODE_LIST[req_label].create_node(req_arg)
    
    if node and req_label in RELATIONS:
        creation_status, msg = create_relationship(node1=node, node_label=req_label)
    
    if creation_status is True:
        return jsonify({'Status':msg}), 200
    else:
        return jsonify({'Error':msg}), 500
    
    



    # if req_label == 'SurfaceUser':
    #     node_id = SurfaceUser.node_exists_url(req['url'])
    #     if node_id is not None:
    #         user_obj = SurfaceUser.update_node_properties(node_id, **req_arg)
    #         if user_obj is False:
    #             return jsonify({'Error':'Node update Error '}), 500

    #         post_obj = Post.nodes.first_or_none(writer=node.username)
    #         if post_obj:
    #             compare_post_user_username(post_obj=post_obj,user_obj=user_obj) 
    #     else:
    #         req_arg['url'] = req['url']
    #         user_obj = SurfaceUser.create_node(req_arg)
    #         if not user_obj:
    #             return jsonify({'Error':'Node creation Error'}), 500
    #         post_obj = Post.nodes.first_or_none(writer=user_obj.username)
    #         if post_obj:
    #             compare_post_user_username(post_obj=post_obj,user_obj=user_obj) 
            
    # elif req_label == 'Domain':
    #     node_id = Domain.node_exists_url(req['url'])
    #     if node_id is not None:
    #         if Domain.update_node_properties(node_id, **req_arg) is False:
    #             return jsonify({'Error':'Node update Error '}), 500
    #     else:
    #         req_arg['url'] = req['url']
    #         node = Domain.create_node(req_arg)
    #         if not node:
    #             return jsonify({'Error':'Node creation Error'}), 500
            
    # elif req_label == 'Post':
    #     node_id = Post.node_exists_url(req['url'])
        
    #     # parsing writer from url 
    #     pattern = r"(?<=\.com\/)[^/]+"
    #     match = re.search(pattern, req['url'])
    #     writer = match.group(0) if match else None
    #     req_arg['writer'] = writer

    #     if node_id:
    #         post_obj = Post.update_node_properties(node_id, req_arg)
    #         if post_obj is False:
    #             return jsonify({'Error':'Node update Error '}), 500
    #         user_obj = SurfaceUser.nodes.first_or_none(username=post_obj.writer)
    #         if user_obj:
    #             compare_post_user_username(post_obj,user_obj)
    #     else:
    #         req_arg['url'] = req['url']
    #         post_obj = Post.create_node(req_arg)
    #         if not post_obj:
    #             return jsonify({'Error':'Node creation Error'}), 500
    #         user_obj = SurfaceUser.nodes.first_or_none(username=post_obj.writer)
    #         if user_obj:
    #             compare_post_user_username(post_obj,user_obj)

    # return jsonify({'Message':'Success'}), 200
    
    


