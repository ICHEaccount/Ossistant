import re
# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j.init import db
from db_conn.neo4j.models import *

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
    req_arg['case_id'] = req['case_id']
    req_arg['url'] = req['url']

    # create node 
    if req_label not in NODE_LIST:
        return jsonify({'Error':'Invalid label'}), 404
    
    inp = {'case_id':req_arg['case_id'],'url':req['url']}
    check_status, existed_node = NODE_LIST[req_label].check_node(inp)
    if check_status is True:
        node = NODE_LIST[req_label].update_node_properties(node_id=existed_node.uid, **req_arg)
    elif check_status is False: 
        node = NODE_LIST[req_label].create_node(req_arg)
    
    if node:
        if req_label in AUTO_RELATIONS:
            creation_status, msg = Relationship.create_auto_relationship(node=node,node_label=req_label)
        else:
            return jsonify({'Status':'Success'}), 200
    
    if creation_status is True:
        return jsonify({'Status':msg}), 200
    else:
        return jsonify({'Error':msg}), 500
    
    

@bp.route('/snapshot', methods=['POST'])
def take_snapshot():
    req = request.get_json()
    if not req:
        return jsonify({'Error':'Invalid request'}), 404
    
    try:
        url = req.get('url')
        case_id = req.get('case_id')
        data = req.get('data')

        node_dict = dict()

        # Create Node 
        for data_node in data:
            req_label = data_node['label']
            keyword = data_node.get('keyword')
            if keyword:
                keyword['url'] = url
                keyword['case_id'] = case_id
                node = NODE_LIST[req_label].create_node(keyword)
                node_dict[NODE_LIST[req_label].get_node_name()] = node

        # Create Relationship 
        if 'Post' in node_dict:
            post_node = node_dict['Post']

            for key, rels in EXTENSION_RELATIONS.items():
                if key in node_dict:
                    pos = rels['pos']
                    if pos == "to":
                        post_node.rel_to.connect(node_dict[key], {'label': rels['label']})
                    else:
                        node_dict[key].rel_to.connect(post_node, {'label': rels['label']})

        return jsonify({'Message': 'Success'}), 200
    except KeyError as e:
        return jsonify({'Error': f'KeyError: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'Error': f'Error: {str(e)}'}), 500
    

