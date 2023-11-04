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
    req_arg['case_id'] = 'e28507d2-7ada-11ee-8aef-0242ac190006' # Hardcoded
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
        if req_label in RELATIONS:
            creation_status, msg = Relationship.create_relationship(node=node,node_label=req_label)
        else:
            return jsonify({'Status':'Success'}), 200
    
    if creation_status is True:
        return jsonify({'Status':msg}), 200
    else:
        return jsonify({'Error':msg}), 500
    
    



