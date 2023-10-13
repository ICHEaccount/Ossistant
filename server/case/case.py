import sys
import os 
import json
import datetime

# flaks 
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
    try:
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
    except PyMongoError as e:
        print(f'Error while retrieving all cases: {e}')
        return jsonify({'Message': 'Error while retrieving all cases'}), 500
    

@bp.route('/getCaseInfo/<int:case_id>')
def get_case(case_id):
    try:
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
    except PyMongoError as e:
        print(f'Error while retrieving case: {e}')
        return jsonify({'Message': 'Error while retrieving case'}), 500

@bp.route('/deleteCase/<int:case_id>')
def delete_case(case_id):
    try:
        result = CaseModel.objects(case_id=case_id).delete()

        if result:
            return jsonify({'Message': f'Case with ID {case_id} has been deleted'}), 200
        else:
            return jsonify({'Message': f'Case with ID {case_id} not found'}), 404
    except PyMongoError as e:
        print(f'Error while deleting case: {e}')
        return jsonify({'Message': 'Error while deleting case'}), 500


@bp.route('/editCase', methods=['POST'])
def edit_case():
    request_data = request.get_json()

    if "case_name" in request_data and "case_number" in request_data and "investigator" in request_data and "description" in request_data:
        caseName = request_data["case_name"]
        caseNum = request_data["case_number"]
        investigator = request_data["investigator"]
        description = request_data["description"]

        try:
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
        except PyMongoError as e:
            print(f'Error while updating case: {e}')
            return jsonify({'Message': 'Error while updating case'}), 500
    else:
        return "Required field is missing in the request data.", 400
