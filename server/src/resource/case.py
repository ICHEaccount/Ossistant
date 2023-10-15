import datetime

from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel

bp = Blueprint('case', __name__, url_prefix='/case')

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


# @bp.route('/createCase',methods=['POST'])
# def create_case():
#     case = request.get_json()
#     # print(case)
#     if check_json_not_null(case) is False:
#         print('[-] Invaild Case data')
#         return jsonify({'Message':'Invalid data'}),400
    
#     data = {
#         "case_name": case['case_name'],
#         "case_num" : case['case_number'],
#         "investigator" : case['investigator'],
#         "description":case['description'],
#         "created_date": datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%S")
#     }
#     if CaseModel.create(data) is False:
#         print('[-] DB Error')
#         return jsonify({'Message':'DB Insertion Error'}),500
#     return jsonify({'Message':'Success'}),200



@bp.route('/createCase',methods=['POST'])
def create_case():

    case = request.get_json()
    
    if check_json_not_null(case) is False:
        print('[-] Invaild Case data')
        return jsonify({'Message':'Invalid data'}),400
    
    data = {
        "case_name": case['case_name'],
        "case_num" : case['case_number'],
        "investigator" : case['investigator'],
        "description": case['description'],
        "created_date": datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%S")
    }

    caseID=CaseModel.create(data)
    if caseID is False:
        print('[-] DB Error')
        return jsonify({'Message':'DB Insertion Error'}),500
    return jsonify({'Message':'Success', 'case_id' : caseID }),200


@bp.route('/getCaseList')
def getcaselist():
    all_cases = CaseModel.objects().all()

    cases_list = []
    for case in all_cases:
        case_data = {
            "case_id": case.case_id,
            "case_name": case.case_name,
            "case_num": case.case_num,                
            "investigator": case.investigator,
            "description": case.description,
            "created_date": case.created_date
        }
        cases_list.append(case_data)
    return jsonify(cases_list), 200
		#return cases_list, 200


@bp.route('/getCaseInfo/<case_id>')
def get_case(case_id):

    case = CaseModel.objects.get(case_id=case_id)
        
    if case:
        response_data = {
            "case_id": case.case_id,
            "case_name": case.case_name,
            "case_num": case.case_num,
            "investigator": case.investigator,
            "description": case.description,
            "created_date": case.created_date
        }
            
        return jsonify(response_data), 200
    else:
        return jsonify({'Message': f'Case with ID {case_id} not found'}), 404
  
@bp.route('/deleteCase/<case_id>')
def delete_case(case_id):
   
    result = CaseModel.objects(case_id=case_id).delete()
    if result:
        return jsonify({'Message': f'Case with ID {case_id} has been deleted'}), 200
    else:
        return jsonify({'Message': f'Case with ID {case_id} not found'}), 404


@bp.route('/editCase', methods=['POST'])
def edit_case():
    request_data = request.get_json()

    if "case_name" in request_data and "case_number" in request_data and "investigator" in request_data and "description" in request_data:
        caseName = request_data["case_name"]
        caseNum = request_data["case_number"]
        investigator = request_data["investigator"]
        description = request_data["description"]

        case_id = request_data.get("case_id")
        if case_id:
            updated_data = {
                "case_name": caseName,
                "case_num": caseNum,
                "investigator": investigator,
                "description": description
            }

            result = CaseModel.objects(case_id=case_id).update(**updated_data)

            if result['n'] > 0:
                return "Your modification request was processed successfully.", 200
            else:
                return "Case not found for the given case_id.", 404
        else:
            return "Case ID is missing in the request data.", 400
        
    else:
        return "Required field is missing in the request data.", 400
    


