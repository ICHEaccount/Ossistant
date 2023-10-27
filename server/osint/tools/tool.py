import json
import re
import whois 

from db_conn.mongo.models import RunModel, CaseModel

from flask import request, jsonify,Blueprint

from .lib.tool_whois import run_whois
from .lib.tool_maigret import run_maigret

bp = Blueprint('tool', __name__, url_prefix='/tools')


def check_json_not_null(input):
    for value in input.values():
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

    run = CaseModel.create_runs(case_id=case_id, tool_id=tool_id, status='running')
    if run is None:
        return jsonify({'Message': 'Run Creation Error'}), 500

    # run the requested tool
    if tool_id == '01':  # whois
        domain = runtools_requested_json['properties'][0]['property'][0]['domain']
        if domain is None:
            return jsonify({'Message': 'Invalid domain'}), 400
        run_id = run_whois(case_id, domain, run)  # Execute Tool(whois)
    elif tool_id == '03':
        username = runtools_requested_json['properties'][0]['property'][0]['username']
        if username is None:
            return jsonify({'Message': 'Invalid username'}), 400
        run_id = run_maigret(case_id, username, run)
    else:
        return jsonify({'Message': 'Invalid tool_id'}), 400

    if isinstance(run_id, int):
        return jsonify({'run_id': run_id}), 200
    else:
        return jsonify({'Message': run_id}), 400
    

@bp.route('/getToolState/<int:run_id>',methods=["GET"])
def tool_state(run_id):
    try:
        run = RunModel.objects.get(_id=run_id)
        print(run)
        if run:
            state = run.status
            response_data = {
                "run_id": run_id,
                "state": state
            }
            return jsonify(response_data), 200
        else:
            return jsonify({"error": "Run not found"}, 404)
    except Exception as e:
        return jsonify({"error": str(e)}, 500)