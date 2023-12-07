from db_conn.mongo.models import RunModel, CaseModel, ResultModel
from db_conn.neo4j.models import *
from core.setup import setup_tool

from flask import request, jsonify, Blueprint

from .lib.tool_whois import *
from .lib.tool_maigret import *
from .lib.tool_harvester import *
from .lib.tool_btc import *
from .lib.tool_breach import *

from .config.tool_result_config import *

bp = Blueprint('tool', __name__, url_prefix='/tools')

dir_path = ['./reports/', './tools/lib/clone']
for path in dir_path:
    if not os.path.exists(path):
        os.makedirs(path)

try:
    setup_tool()
except Exception as e:
    setup_error = f'Tool setup error. {e}.'

def check_json_not_null(input_json):
    for value in input_json.values():
        if value is None:
            return False
        elif isinstance(value, dict):
            if not check_json_not_null(value):
                return False
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    if not check_json_not_null(item):
                        return False
                elif item is None:
                    return False
    return True


@bp.route('/getToolList', methods=['GET'])
def tool_list():
    try:
        with open('./tools/tool_list.json') as data:
            response = json.load(data)
    except FileNotFoundError as e:
        response = f'{e}. File cannot be found.'
        return jsonify({'Message': response}), 500
    return jsonify(response), 200


@bp.route('/runTools', methods=['POST'])
def run_tool():
    # check requested json
    runtools_requested_json = request.get_json()
    if check_json_not_null(runtools_requested_json) is False:
        print('[-] Invalid Request')
        return jsonify({'Message': 'Invalid request'}), 400

    # parse basic infos from requested json
    case_id = runtools_requested_json['case_id']
    tool_id = runtools_requested_json['tool_id']
    input_node = runtools_requested_json['input_node']

    # If runtools_requested_json has case_id key
    case = CaseModel.objects(case_id=case_id).first()
    if not case:
        return jsonify({'Message': 'Case Not Found'}), 500

    # creating run
    run = CaseModel.create_runs(
        case_id=case_id,
        tool_id=tool_id,
        input_node=input_node,
        status='ready',
        input_value='query'
    )
    if run is None:
        return jsonify({'Message': 'Run Creation Error'}), 500

    # run the requested tool
    if tool_id == '01':  # whois
        try:
            run.input_value = runtools_requested_json['properties'][0]['property'][0]['domain']
        except Exception as e1:
            return jsonify({'Message': 'Invalid domain', 'Code': e1}), 400
        run_id = run_whois(run=run)  # Add case_id

    elif tool_id == '02':  # theHarvester
        try:
            run.input_value = runtools_requested_json['properties'][0]['property'][0]['domain']
            run.save()
            run_id = run_harvester(run=run)
        except Exception as e2:
            return jsonify({'Run theHarvester error': e2}), 400

    elif tool_id == '03':  # maigret
        try:
            run.input_value = runtools_requested_json['properties'][0]['property'][0]['username']
        except Exception as e3:
            return jsonify({'Message': 'Invalid username', 'Code': e3}), 400
        run_id = run_maigret(run)

    elif tool_id == '04':  # BTC.com
        try:
            run.input_value = runtools_requested_json["properties"][0]["property"][0]["wallet"]
            # run.input_node=input_node #btc의 경우 input_node 필드값=지갑주소. input 에 필요값 하나뿐.
        except Exception as e:
            return jsonify({'Message': 'Invalid username', 'Code': e}), 400
        run_id = run_btc(run)

    elif tool_id == '05':  # breachdirectory
        try:
            run.input_value = runtools_requested_json["properties"][0]["property"][0]["breach"]
            # Email Username Domain IP Address 이 4중 아무거나 넣어도 되고 breach 라는 라벨로 넣기로 함
        except Exception as e:
            return jsonify({'Message': 'Invalid username', 'Code': e}), 400
        run_id = run_breach(run)

    else:
        return jsonify({'Message': 'Invalid tool_id'}), 400

    # Responding run_id
    if isinstance(run_id, int):
        return jsonify({'run_id': run_id}), 200
    else:
        return jsonify({'Message': run_id}), 400
    

@bp.route('/getToolState/<string:case_id>', methods=["GET"])
def tool_state(case_id):
    all_run = CaseModel.get_all_runs(case_id=case_id)[1]

    # checking results
    message = None  # Should be None
    for run in all_run:
        if run['tool_id'] == '01':
            message = check_whois(case_id, run['run_id'])
        elif run['tool_id'] == '02':
            message = check_harvester(case_id, run['run_id'])
        elif run['tool_id'] == '03':
            check_maigret(case_id, run['run_id'])
        elif run['tool_id'] == '04':
            continue  # check_btc(case_id, run['run_id'])
        elif run['tool_id'] == '05':
            continue
    if message:
        return jsonify({'Debug': message}), 400

    # making response
    ready = []
    running = []
    completed = []
    error = []

    for run in all_run:
        # adding 'tool_name'
        if run['tool_id'] == '01':
            run['tool_name'] = 'whois'
        elif run['tool_id'] == '02':
            run['tool_name'] = 'theharvester'
        elif run['tool_id'] == '03':
            run['tool_name'] = 'maigret'
        elif run['tool_id'] == '04':
            run['tool_name'] = 'btc'
        elif run['tool_id'] == '05':
            run['tool_name'] = 'breach'
            
        # sorting by status
        if run['status'] == 'ready':
            ready.append(run)
        elif run['status'] == 'running':
            running.append(run)
        elif run['status'] == 'completed':
            completed.append(run)
        elif run['status'] == 'error':
            error.append(run)

    response = {
        "ready": ready,
        "running": running,
        "completed": completed,
        "error": error
    }

    return jsonify(response), 200


@bp.route('/createResultNode', methods=["POST"])
def create_result_node():
    req = request.get_json()
    output_node_list = list() 
    
    error_flag = False 
    error_msg = None 

    # Error handling about response value 
    if not req:
        return jsonify({'Error': 'Empty response error'}), 404
    if not req['case_id']:
        return jsonify({'Error': 'Empty case_id error'}), 404
    if not req['input_node']:
        return jsonify({'Error': 'Empty input_node error'}), 404
    if not req['tool_id']:
        return jsonify({'Error': 'Empty tool_id error'}), 404
    if not req['result_id']:
        return jsonify({'Error': 'Empty result_id error'}), 404
    
    case_id = req['case_id']
    input_node = req['input_node']
    result_id_list = req['result_id']  # list

    update_type = TOOL_RESULT_MATCH[req['tool_id']]['type']
    

    for result_id in result_id_list:
        # Get data from result 
        resnode_obj = ResultModel.objects(result_id=result_id).first()
        resnode_label = resnode_obj.result.get('label')
        resnode_property = resnode_obj.result.get('property')
        resnode_value = resnode_obj.result.get('value')
        resnode_type = resnode_obj.result.get('type')

        # if resnode_obj.created is True:
        #     continue

        # Check node 
        if update_type is UPDATE_PROPERTY:
            
            # check node exist 
            check_flag, existed_node = NODE_LIST[resnode_label].check_node({'case_id' : case_id, 'uid':input_node})
            if check_flag is False:
                error_flag = True
                error_msg = 'Input node did not exist'
                break 

            else:
                if req['tool_id'] == '02':
                    existed_node.registered.append(resnode_obj.result.get(resnode_type))
                else:
                    update_flag, msg =NODE_LIST[resnode_label].update_node_properties(node_id=existed_node.uid, **{resnode_property:resnode_value})

            if update_flag is False:
                error_flag = True 
                error_msg = msg 
                break
            
        else:
            if resnode_property is 'others':
                others_flag, other_msg = NODE_LIST[resnode_label].update_node_properties(node_id=existed_node.uid, **{resnode_property:resnode_value})
                if others_flag is False:
                    error_flag = True
                    error_msg = other_msg
                    break
            else: 
                input_label =  TOOL_RESULT_MATCH[req['tool_id']]['input_label']
                check_flag, existed_node = input_label.check_node({'case_id' : case_id, 'uid':input_node})
                if check_flag is False:
                    error_flag = True
                    error_msg = 'Input node did not exist'
                    break 

                check_flag, node = NODE_LIST[resnode_label].check_node({'case_id' : case_id, resnode_property:resnode_value})
                if check_flag is False:
                    node = NODE_LIST[resnode_label].create_node({'case_id' : case_id, resnode_property:resnode_value})

                # Make relationship 
                check_rel_dup_flag, rel_flag = Relationship.check_relationship(from_uid=existed_node.uid, to_uid=node.uid, is_label=True, label='OSINT_TOOL')
                if check_rel_dup_flag == True and rel_flag == False:
                    existed_node.rel_to.connect(node, {'label': 'OSINT_TOOL'})
                if input_label in AUTO_RELATIONS:
                    auto_rel_flag, msg = Relationship.create_auto_relationship(case_id=case_id, node=node, node_label=resnode_label)

                output_node_list.append(node.uid)

        # set mongoDB
        resnode_obj.created = True 
        resnode_obj.save()

            
    if error_flag is True:
        return jsonify({'Error':error_msg}), 500 
    if update_type == UPDATE_PROPERTY:
        return jsonify({'node_id':[input_node]}), 200
    return jsonify({'node_id':output_node_list}), 200 
        




# @bp.route('/createResultNode', methods=["POST"])
# def create_result_node():
#     req = request.get_json()
#     error_result_id = None 
#     error_status = None
#     result_node_id_list = list()

#     # Error handling about response value 
#     if not req:
#         return jsonify({'Error': 'Empty response error'}), 404
#     if not req['case_id']:
#         return jsonify({'Error': 'Empty case_id error'}), 404
#     if not req['input_node']:
#         return jsonify({'Error': 'Empty input_node error'}), 404
#     if not req['tool_id']:
#         return jsonify({'Error': 'Empty tool_id error'}), 404
#     if not req['result_id']:
#         return jsonify({'Error': 'Empty result_id error'}), 404
    
#     case_id = req['case_id']
#     input_node = req['input_node']
#     result_id_list = req['result_id']  # list

#     # GET info to create node from result 
#     input_label = TOOL_RESULT_MATCH[req['tool_id']]['input_label']
#     result_node_label = TOOL_RESULT_MATCH[req['tool_id']]['result_label']
#     node_property = TOOL_RESULT_MATCH[req['tool_id']]['property']
#     db_property_name = TOOL_RESULT_MATCH[req['tool_id']]['db_property_name']
#     match_type = TOOL_RESULT_MATCH[req['tool_id']]['type']
#     # if db_property_name is None:
#     #     db_property_name = node_property

#     # Check surfaceUser or darkUser
#     if req['tool_id'] == '03':
#         surface_node = SurfaceUser.get_node({'case_id': case_id, 'uid': input_node})
#         dark_node = DarkUser.get_node({'case_id': case_id, 'uid': input_node})
#         if surface_node and not dark_node:
#             node_result = surface_node
#             input_label = SurfaceUser
#             result_node_label = SurfaceUser
#         elif dark_node and not surface_node:
#             node_result = dark_node
#             input_label = DarkUser
#             result_node_label = DarkUser
#         else:
#             return jsonify({'Error': 'User check error'}), 500
            
#     else:
#         node_result = input_label.get_node({'case_id': case_id, 'uid': input_node})
#         if node_result is None:
#             return jsonify({'Error': 'Invalid input node'}), 500

#     for result_id in result_id_list:
#         result_obj = ResultModel.objects(result_id=result_id).first()

#         # Skip created=True 
#         if result_obj.created is True:
#             continue

#         if not result_obj:
#             error_result_id = result_id
#             break
        
#         # Create node mode 
#         if match_type is CREATE_NODE:
#             if result_node_label is LABEL_DEFINE:
#                 result_node_label = NODE_LIST[result_obj.result.get('type')]

#             if isinstance(db_property_name,list):
#                 check_node_flag, node = result_node_label.check_node({'case_id': case_id, node_property: result_obj.result.get(db_property_name[0]).get(db_property_name[1])})
#             else:
#                 check_node_flag, node = result_node_label.check_node({'case_id': case_id, node_property: result_obj.result.get(db_property_name)})

#             if check_node_flag is False:
#                 node = result_node_label.create_node({'case_id': case_id, node_property: result_obj.result.get(db_property_name)})
            
#             if not node:
#                 error_status = "Node creation error"
#                 break 
#             result_node_id_list.append(node.uid)

#             # Relationship 

#             # Error : DId not work check_relationship 
#             check_rel_dup_flag, rel_flag = Relationship.check_relationship(from_uid=node_result.uid, to_uid=node.uid, is_label=True, label='OSINT_TOOL')
#             if check_rel_dup_flag == True and rel_flag == False:
#                 node_result.rel_to.connect(node, {'label': 'OSINT_TOOL'})
#             if input_label in AUTO_RELATIONS:
#                 auto_rel_flag, msg = Relationship.create_auto_relationship(case_id=case_id, node=node, node_label=result_node_label)
        
#         # Update node mode 
#         elif match_type is UPDATE_PROPERTY:
#             if req['tool_id'] == '02':
#                 node_result.registered.append(result_obj.result.get(db_property_name))
#             else:
#                 # Save in note
#                 node_result.note = result_obj.get('result')
        
#         result_obj.created = True 
#         result_obj.save()
        
#     if error_result_id is not None:
#         return jsonify({'Error': f'Invalid result : {error_result_id}'}), 500
    
#     if error_status is not None:
#         return jsonify({'Error': error_status}), 500
    
#     if match_type is UPDATE_PROPERTY:
#         node_result.save()
#         return jsonify({'node_id': input_node}), 200
        
#     return jsonify({'node_id': result_node_id_list}), 200
