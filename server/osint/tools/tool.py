import os

from db_conn.mongo.models import RunModel, CaseModel

from flask import request, jsonify, Blueprint

from .lib.tool_whois import *
from .lib.tool_maigret import *

bp = Blueprint('tool', __name__, url_prefix='/tools')

report_dir = './reports/'
if not os.path.exists(report_dir):
    os.makedirs(report_dir)

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

    # If runtools_requested_json has case_id key
    case = CaseModel.objects(case_id=case_id).first()
    if not case:
        return jsonify({'Message': 'Case Not Found'}), 500

    # creating run
    run = CaseModel.create_runs(case_id=case_id, tool_id=tool_id, status='ready', input_value='query')
    if run is None:
        return jsonify({'Message': 'Run Creation Error'}), 500

    # run the requested tool
    if tool_id == '01':  # whois
        try:
            run.input_value = runtools_requested_json['properties'][0]['property'][0]['domain']
        except Exception as e:
            return jsonify({'Message': 'Invalid domain', 'Code': {e}}), 400
        run_id = run_whois(run)

    elif tool_id == '03':  # maigret
        try:
            run.input_value = runtools_requested_json['properties'][0]['property'][0]['username']
        except Exception as e:
            return jsonify({'Message': 'Invalid username', 'Code': {e}}), 400
        run_id = run_maigret(run)

    else:
        return jsonify({'Message': 'Invalid tool_id'}), 400

    # Responding run_id
    if isinstance(run_id, int):
        return jsonify({'run_id': run_id}), 200
    else:
        return jsonify({'Message': run_id}), 400
    

@bp.route('/getToolState', methods=["POST"])
def tool_state():
    # check requested json
    gettoolstate_requested_json = request.get_json()
    if check_json_not_null(gettoolstate_requested_json) is False:
        print('[-] Invalid Request')
        return jsonify({'Message': 'Invalid request'}), 400

    # parse basic infos from requested json
    case_id = gettoolstate_requested_json['case_id']
    run_id = gettoolstate_requested_json['run_id']
    print(f'run_id is run_id')

    # finding run
    try:
        run = RunModel.objects.get(_id=int(run_id))
        if run is None:
            return jsonify({"error": "Run not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # check the tool_id and check the tool
    if run.tool_id == '01':
        message = check_whois(case_id, run)
    elif run.tool_id == '03':
        message = check_maigret(run)
    else:
        message = 'Invalid tool_id.'

    # check the status with message
    if run.status == 'completed':
        response = message
        return jsonify(response), 200
    elif run.status == 'running':
        response = {
            "run_id": run.run_id,
            "state": run.status,
            # "debug": message
        }
        return jsonify(response), 200
    elif run.status == 'ready' or 'error':
        response = {
            "run_id": run.run_id,
            "state": run.status,
            "debug": message
        }
        return jsonify(response), 200
    else:
        return jsonify({"message": "run.status error"}), 400
