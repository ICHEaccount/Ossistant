from datetime import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel
from db_conn.neo4j.models import *
from db_conn.neo4j.lib.func import delete_node

from db_conn.neo4j.node_config import NODE_LIST, RELATIONS

bp = Blueprint('data', __name__, url_prefix='/data')

TO = True 
FROM = False 

@bp.route('/createData',methods=['POST'])
def create_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data'}), 404
    
    if 'case_id' not in data:
        return jsonify({'error': 'Case_id did not exist'}), 404
    
    try:
        node_label = list(data.keys())[1]
        node_data = data.get(node_label) 
        node_data['case_id'] = data['case_id']

        check_status, existed_node = NODE_LIST[node_label].check_node(node_data)
        if check_status is True:
            node1 = existed_node 
        else: 
            node1 = NODE_LIST[node_label].create_node(node_data)

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
                    return jsonify({'Error':'Invalid node_config'}), 404
                
                if pos_flag is TO and node2 is not None:
                    node1.rel_to.connect(node2,{'label':node_label})
                elif pos_flag is FROM and node2 is not None:
                    node2.rel_to.connect(node1,{'label':node_label})
                else:
                    return jsonify({"state": "No Relationship"}), 200
        return jsonify({"state": "success"}), 200
            
    except Exception as e:
        return jsonify({"Error": str(e)}), 400


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
                
            if pos_flag is TO:
                node1.rel_to.connect(node2,{'label':node_label})
            else:
                node2.rel_to.connect(node1,{'label':node_label})
        return True, 'Success'
    else:
        return False, 'Node does not exist'

@bp.route('/getData/<string:case_id>',methods=["GET"])
def get_data(case_id):
    if case_id is None:
        return jsonify({"error": "case_id is none"}), 400

    try:
        inp = dict()
        inp['case_id'] = case_id
        node_data = dict()
        for key, node_obj in NODE_LIST.items():
            list_status, data = node_obj.get_all_nodes_list(case_id=case_id, is_uid=False)
            if list_status is True:
                if data:
                    node_data[key] = data
            else: 
                return jsonify({'Error':data}),500
        inp['data'] = node_data
        return jsonify(inp),200

    except Exception as e:
        return jsonify({"error": "도메인 검색 중 오류가 발생했습니다.", "details": str(e)}), 500

# Flask 라우트 함수 수정
# Query로 대체 
@bp.route('/deleteData/<string:data_id>', methods=["GET"])
def delete_data(data_id):
    if data_id:
        success = delete_node(data_id)  
        if success is True:
            return jsonify({"message": "Node and relationships deleted successfully"})
        else:
            return jsonify({"message": "Node not found"}), 404  
    else:
        return jsonify({"message": "Data ID not provided"}), 400 


@bp.route('/editData',methods=['POST'])
def edit_data():
    res = request.get_json()
    if not res:
        return jsonify({'error':'Invalid request data'}), 404
    
    node_label = list(res.keys())[1]
    if node_label in NODE_LIST:
        update_status, msg = NODE_LIST[node_label].update_node_properties(res.get('data_id'),**res.get(node_label))
        if update_status == True:
            return jsonify({'State':msg}),200
        else:
            return jsonify({'Error':msg}),500

    else:
        return jsonify({'Error':'Invalid node label'}), 404
