import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel
from db_conn.neo4j.models.domain import Domain

bp = Blueprint('data', __name__, url_prefix='/data')

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

@bp.route('/')
def hell():
    return 'hello world'

@bp.route('/createData',methods=['POST'])
def create_data():
    data = request.get_json()
    print(data)
    if check_json_not_null(data) is False:
        print('[-] Invaild Case data')
        return jsonify({'Message':'Invalid data'}),400

    try:
        domain = data.get("domain")
        regdate = data.get("regdate")
        status = data.get("status")
        case_id = data.get("case_id")

        new_domain = Domain.create_domain(domain=domain, regdate=regdate, status=status, case_id=case_id)
        return jsonify({"message": "Domain created successfully.", "domain_uid": new_domain.uid}), 201
    except Exception as e:
        print(e)
        return jsonify({"error": "데이터 생성 중 오류가 발생했습니다.", "details": str(e)}), 500


@bp.route('/getData/<string:case_id>',methods=["GET"])
def get_data(case_id):
    if case_id is None:
        return jsonify({"error": "case_id is none"}), 400

    try:
        # case_id를 사용하여 도메인을 조회합니다.
        domains = Domain.nodes.filter(case_id=case_id)
        if domains:
            domain_list = [domain._json_serializable() for domain in domains]
            return jsonify({"case_id":case_id,"data":{"domain":domain_list}}), 200
        else:
            return jsonify({"error": "일치하는 도메인이 없습니다."}), 404
    except Exception as e:
        return jsonify({"error": "도메인 검색 중 오류가 발생했습니다.", "details": str(e)}), 500