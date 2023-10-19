import json
import re
import whois 

from db_conn.mongo.models import RunModel, CaseModel
from db_conn.neo4j.lib.relation_manager import SurfaceUser, Domain

from flask import request, jsonify,Blueprint

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

def result_response(txt):
    data = json.loads(txt)

    response_data = {
        "run_id": "",
        "state": "completed",
        "result": [
            {
                "domain": {
                    "domain": data.get("domain_name"),
                    "regdate": data.get("creation_date")
                }
            }
        ]
    }
    response_data = json.dumps(response_data)
    print(f'res : {response_data}')
    return response_data

def tool_whois(domain):
    search = whois.whois(domain) 
    print(search)
    result = json.dumps(search, default=str, ensure_ascii=False)  # type(result) is STR
    print(result)
    res = result_response(result)
    print(res)
    # return data for node 
    node_data = {
        'email': search['admin_email'],
        'regdate':search['creation_date'],
        'domain':search['domain_name']
    }
    return node_data


@bp.route('/runTools', methods=['POST'])
def run_tool():
    tool_data = request.get_json()
    if check_json_not_null(tool_data) is False:
        print('[-] Invalid Request')
        return jsonify({'Message': 'Invalid request'}), 400

    tool_id = tool_data['tool_id']
    
    # run the requested tool
    if tool_id == '01':

        # Add to Run(Mongodb) 
        # Need Case_id 
        # If tool_data has case_id key 
        case_id = tool_data['case_id']
        case = CaseModel.objects(case_id=case_id).first()
        if not case:
            return jsonify({'Message':'Case Not Found'}), 500
        
        run = CaseModel.create_runs(case_id=case_id, tool_id=tool_id, status='running')
        if run is None:
            return jsonify({'Message':'Run Creation Error'}), 500
        
        # Execute Tool(whois)
        domain = tool_data['properties'][0]['property'][0]['domain']
        result = tool_whois(domain)
        regdate = result['regdate']
        if regdate: regdate=regdate.strftime('%Y-%m-%d')


        # email to username 
        regex = r'^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}$'
        pattern = re.compile(regex)
        email = result['email']
        match = re.match(pattern, email)
        if match:
            username = match.group(1)
            user = SurfaceUser.nodes.first_or_none(username=username)
            if not user:
                user = SurfaceUser(username=username,case_id=case_id).save()

            domain_obj = Domain.nodes.first_or_none(domain=domain)
            if not domain_obj:
                domain_obj = Domain(domain=domain,regdate=regdate, status=False,case_id=case_id).save()
            else:
                inp_data = {'regdate':regdate}
                domain_obj = Domain.update_node_properties(node_id=domain_obj.uid,**inp_data)

            # Establishing the relationship
            if not user.register.is_connected(domain_obj):
                user.register.connect(domain_obj)
            
            run.status = 'completed'
            run.save()
            return jsonify({'run_id':run.run_id}), 200

    else:
        return jsonify({'Message': 'Invalid tool_id'}), 400
    

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