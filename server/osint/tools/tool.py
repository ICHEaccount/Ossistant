import os

from db_conn.mongo.models import RunModel, CaseModel
from db_conn.neo4j.models import *
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
        run_id = run_whois(case_id=case_id,run=run) # Add case_id

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
    

@bp.route('/getToolState/<string:case_id>', methods=["GET"])
def tool_state(case_id):
    all_run = CaseModel.get_all_runs(case_id=case_id)[1]

    # checking results
    for run in all_run:
        if run['tool_id'] == '01':
            continue  # check_whois(run['run_id'])
        elif run['tool_id'] == '03':
            check_maigret(case_id, run['run_id'])

    # making response
    ready = []
    running = []
    completed = []
    error = []

    for run in all_run:
        # adding 'tool_name'
        if run['tool_id'] == '01':
            run['tool_name'] = 'whois'
        elif run['tool_id'] == '03':
            run['tool_name'] = 'maigret'
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
