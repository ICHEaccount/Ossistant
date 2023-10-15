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
        if isinstance(value, dict):
            if not check_json_not_null(value):
                return False
            if "null" in value.values():
                return False
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    if not check_json_not_null(item):
                        return False
                    if "null" in item.values():
                        return False
        elif value is None and value is not "null":
            return False
    return True




@bp.route('/createData',methods=['POST'])
def create_data():
    data = request.get_json()
    print(data)
    #if check_json_not_null(data) is False:
    #    print('[-] Invaild Case data')
    #    return jsonify({'Message':'Invalid data'}),400

    if 'case_id' in data and 'Domain' in data:
        try:
            domain_data = data.get("Domain")
            case_id = data.get("case_id")

            domain = domain_data.get("domain")
            regdate = domain_data.get("regdate")
            status = domain_data.get("status")           
            note = domain_data.get("note")

            new_domain = Domain.create_domain(domain=domain, regdate=regdate, status=status, case_id=case_id)
            #return jsonify({"message": "Domain created successfully.", "domain_uid": new_domain.uid}), 201
            return jsonify({"state":"success"}), 201
        except Exception as e:
            #print(e)
            return jsonify({"state":"fail", "error": str(e)}), 200
        
    elif 'case_id' in data and 'User' in data:
        try:
            user_data = data.get("User")
            case_id = data.get("case_id")

            username = user_data.get("username")
            url = user_data.get("url")
            fake = user_data.get("fake")
                 
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
        
    elif 'case_id' in data and 'Post' in data:
        try:
            post_data = data.get("User")
            case_id = data.get("case_id")

            url = post_data.get("url")
            title = post_data.get("title")
            content = post_data.get("content")
            created_date = post_data.get("created_date")
            post_type = post_data.get("post_type")           

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