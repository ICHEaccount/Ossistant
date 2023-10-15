import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel
from db_conn.neo4j.models.domain import Domain
from db_conn.neo4j.models.user import SurfaceUser
from db_conn.neo4j.models.post import Post

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


@bp.route('/createData',methods=['POST'])
def create_data():
    data = request.get_json()
    print(data)
    if check_json_not_null(data) is False:
        print('[-] Invaild Case data')
        return jsonify({'Message':'Invalid data'}),400

    if 'domain' in data:
        try:
            domain = data.get("domain")
            regdate = data.get("regdate")
            status = data.get("status")
            case_id = data.get("case_id")

            new_domain = Domain.create_domain(domain=domain, regdate=regdate, status=status, case_id=case_id)
            #return jsonify({"message": "Domain created successfully.", "domain_uid": new_domain.uid}), 201
            return jsonify({"state":"success"}), 201
        except Exception as e:
            #print(e)
            return jsonify({"state":"fail", "error": str(e)}), 200
        
    elif 'username' in data:
        try:
            username = data.get("username")
            url = data.get("url")
            fake = data.get("fake")
            
            new_user = SurfaceUser.create_node({
            "username": username,
            "url": url,
            "fake": fake
            })
            #return jsonify({"message": "SurfaceUser created successfully.", "user_uid": new_user.uid}), 201
            return jsonify({"state":"success"}), 201
        except Exception as e:
            #print(e)
            #return jsonify({"error": "An error occurred during SurfaceUser data creation.", "details": str(e)}), 200
            return jsonify({"state":"fail", "error": str(e)}), 200
        
    elif 'title' in data:
        try:
            url = data.get("url")
            title = data.get("title")
            content = data.get("content")
            created_date = data.get("created_date")
            post_type = data.get("post_type")

            new_post = Post.create_node({
                "url": url,
                "title": title,
                "content": content,
                "created_date": created_date,
                "post_type": post_type
            })
            return jsonify({"state":"success"}), 201
        except Exception as e:
            return jsonify({"state":"fail", "error": str(e)}), 200



@bp.route('/getData/<string:case_id>',methods=["GET"])
def get_data(case_id):
    if case_id is None:
        return jsonify({"error": "case_id is none"}), 400

    try:
        # case_id를 사용하여 도메인을 조회합니다.
        domains = Domain.nodes.filter(case_id=case_id)
        if domains:
            domain_list=[]
            for domain in domains:
                domain_list.append({"property":domain._json_serializable()})
            # domain_list = [{"property":domain._json_serializable() for domain in domains}]
            return jsonify({"case_id":case_id,"data":{"Domain":domain_list}}), 200
        else:
            return jsonify({"case_id":case_id,"data":{}}), 200
    except Exception as e:
        return jsonify({"error": "도메인 검색 중 오류가 발생했습니다.", "details": str(e)}), 500