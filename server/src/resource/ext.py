import re
# flaks 
from flask import request, jsonify,Blueprint

from db_conn.neo4j.init import db
from db_conn.neo4j.models import *
from db_conn.neo4j.models.lib.func import format_date_time

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
    if 'created_date' in req_arg:
        req_arg['created_date'] = format_date_time(req_arg['created_date'])
    elif 'regdate' in req_arg:
        req_arg['regdate'] = format_date_time(req_arg['regdate'])

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
        node = None
        url = req.get('url')
        case_id = req.get('case_id')
        data = req.get('data')
        # snap_type = req.get('type')
        node_dict = dict()

        # Create Node 
        for data_node in data:
            req_label = data_node['label']
            keyword = data_node.get('keyword')
            if keyword:
                keyword['url'] = url
                keyword['case_id'] = case_id
                if 'created_date' in keyword:
                    keyword['created_date'] = format_date_time(keyword['created_date'])
                elif 'regdate' in keyword:
                    keyword['regdate'] = format_date_time(keyword['regdate'])
                
                node_check_flag, node = NODE_LIST[req_label].check_node(keyword)
                if node_check_flag is False:
                    node = NODE_LIST[req_label].create_node(keyword)
                
                node_dict[req_label] = node
    
        # Create Relationship 
        if 'Post' in node_dict:
            post_node = node_dict['Post']

            for key, rels in EXTENSION_RELATIONS.items():
                if key in node_dict and node_dict[key]:
                    pos = rels['pos']
                    if pos == "to":
                        status, check_flag = Relationship.check_relationship(to_uid=node_dict[key].uid, from_uid=post_node.uid)
                        if status is True and check_flag is False:
                            post_node.rel_to.connect(node_dict[key], {'label': rels['label']})
                    elif pos =="from":
                        status, check_flag = Relationship.check_relationship(to_uid=post_node.uid, from_uid=node_dict[key].uid)
                        if status is True and check_flag is False:
                            node_dict[key].rel_to.connect(post_node, {'label': rels['label']})
                    else:
                        return jsonify({'Error': 'Invalid extension config'}), 500

        return jsonify({'Message': 'Success'}), 200
    except KeyError as e:
        return jsonify({'Error': f'KeyError: {str(e)}'}), 400

    except Exception as e:
        return jsonify({'Error': f'Error: {str(e)}'}), 500
    

