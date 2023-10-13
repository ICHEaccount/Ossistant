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


@bp.route('/createCase',methods=['POST'])
def create_case():
    case = request.get_json()
    # print(case)
    if check_json_not_null(case) is False:
        print('[-] Invaild Case data')
        return jsonify({'Message':'Invalid data'}),400
    
    data = {
        "case_name": case['case_name'],
        "case_num" : case['case_number'],
        "investigator" : case['investigator'],
        "description":case['description'],
        "created_date": datetime.datetime.now().strftime("%Y-%m-%d:%H:%M:%S")
    }
    if CaseModel.create(data) is False:
        print('[-] DB Error')
        return jsonify({'Message':'DB Insertion Error'}),500
    return jsonify({'Message':'Success'}),200





