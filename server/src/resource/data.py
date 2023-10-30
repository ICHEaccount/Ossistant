from datetime import datetime

# flaks 
from flask import request, jsonify,Blueprint

from db_conn.mongo.init import db 
from db_conn.mongo.models import CaseModel
from db_conn.neo4j.models import *
from db_conn.neo4j.lib.func import delete_node

bp = Blueprint('data', __name__, url_prefix='/data')

# Search function that compare post writer and surfaceuser username 
def compare_post_user_username(post_obj:Post, user_obj:SurfaceUser):
    if post_obj.writer == user_obj.username:
        if not user_obj.posting.is_connected(post_obj):
            user_obj.posting.connect(post_obj)
        return True
    return False
    

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
        elif value is None and value != "null":
            return False
    return True


@bp.route('/createData',methods=['POST'])
def create_data():
    data = request.get_json()

    if not data:
        return jsonify({'error': 'Invalid data'}), 404
    
    if 'case_id' in data and 'Domain' in data:
        try:
            domain_data = data.get("Domain")

            domain = domain_data.get("domain")
            regdate = domain_data.get("regdate")
            status = domain_data.get("status")           
            note = domain_data.get("note")
            new_domain = Domain.create_node({
                'domain':domain,
                'regdate':regdate,
                'status':status,
                "case_id": data.get('case_id'),
                'note':note
            })
            return jsonify({"state":"success"}), 200
        except Exception as e:
            return jsonify({"state":"fail", "error": str(e)}), 200
        
    elif 'case_id' in data and 'SurfaceUser' in data:
        try:
            user_data = data.get("SurfaceUser")
            case_id = data.get("case_id")

            username = user_data.get("username")
            url = user_data.get("url")
            fake = user_data.get("fake")
            new_user = SurfaceUser.create_node({
            "username": username,
            "url": url,
            "fake": fake,
            "case_id": case_id
            })

            post_obj = Post.nodes.first_or_none(writer=username)
            if post_obj:
                compare_post_user_username(post_obj=post_obj,user_obj=new_user) 
            #return jsonify({"message": "SurfaceUser created successfully.", "user_uid": new_user.uid}), 201
            return jsonify({"state":"success"}), 201
        except Exception as e:
            #print(e)
            #return jsonify({"error": "An error occurred during SurfaceUser data creation.", "details": str(e)}), 200
            return jsonify({"state":"fail", "error": str(e)}), 200
        
    elif 'case_id' in data and 'Post' in data:
        try:
            post_data = data.get("Post")
            case_id = data.get("case_id")

            url = post_data.get("url")
            title = post_data.get("title")
            writer = post_data.get("writer")
            content = post_data.get("content")
            created_date = post_data.get("created_date")
            post_type = post_data.get("post_type")
            
            if(created_date):
                created_date = datetime.strptime(created_date, "%Y-%m-%d")         

            new_post = Post.create_node({
                "url": url,
                "title": title,
                "writer":writer,
                "content": content,
                "created_date": created_date,
                "post_type": post_type,
                "case_id": case_id
            })
            if not new_post:
                return jsonify({'state':'Error'}),500
            
            user_obj = SurfaceUser.nodes.first_or_none(username=writer)
            if user_obj:
                compare_post_user_username(new_post,user_obj)
            return jsonify({"state":"success"}), 201
        

        except Exception as e:
            return jsonify({"state":"fail", "error": str(e)}), 400



@bp.route('/getData/<string:case_id>',methods=["GET"])
def get_data(case_id):
    if case_id is None:
        return jsonify({"error": "case_id is none"}), 400

    try:
        # case_id를 사용하여 도메인을 조회합니다.
        domains = Domain.nodes.filter(case_id=case_id)
        users = SurfaceUser.nodes.filter(case_id=case_id)
        posts = Post.nodes.filter(case_id=case_id)

        if not domains and not users and not posts:
            return jsonify({"case_id":case_id,"data":{}}), 200

        domain_list=[]
        user_list=[]
        post_list=[]
        if domains:
            for domain in domains:
                domain_property = domain._json_serializable()
                domain_property.pop("case_id", None)
                domain_dict = {"node_id": str(domain.uid), "property": domain_property}
                domain_list.append(domain_dict)

                #domain_list.append({"node_id": str(domain.element_id), "property":domain._json_serializable()})
            # domain_list = [{"property":domain._json_serializable() for domain in domains}]
        
        if users:
            for user in users:
                user_property = user._json_serializable()
                user_property.pop("case_id", None)
                user_dict = {"node_id": str(user.uid), "property": user_property}
                user_list.append(user_dict)

        if posts:
            for post in posts:
                post_property = post._json_serializable()
                post_property.pop("case_id", None)

                post_dict = {"node_id": str(post.uid), "property": post_property}
                post_list.append(post_dict)


        return jsonify({"case_id":case_id,"data":{"Domain":domain_list, "SurfaceUser":user_list, "Post":post_list}}), 200

    except Exception as e:
        return jsonify({"error": "도메인 검색 중 오류가 발생했습니다.", "details": str(e)}), 500


# Flask 라우트 함수 수정
# Query로 대체 
@bp.route('/deleteData/<string:data_id>', methods=["GET"])
def delete_data(data_id):
    if data_id:
        success = delete_node(data_id)  
        if success is True:
            return jsonify({"message": "Node and relationships deleted successfully"})
        else:
            return jsonify({"message": "Node not found"}), 404  
    else:
        return jsonify({"message": "Data ID not provided"}), 400 


@bp.route('/editData',methods=['POST'])
def edit_data():
    res = request.get_json()
    if not res:
        return jsonify({'error':'Invalid request data'}), 404

    if 'Domain' in res:
        domain_data = res['Domain']
        node = Domain.update_node_properties(res.get('data_id'),**res)
    elif 'SurfaceUser' in res:
        domain_data = res['SurfaceUser']
        node = SurfaceUser.update_node_properties(res.get('data_id'),**res)
    elif 'Post' in res:
        domain_data = res['Post']
        node = Post.update_node_properties(res.get('data_id'),**res)

    elif 'DarkUser' in res:
        domain_data = res['DarkUser']
        node = DarkUser.update_node_properties(res.get('data_id'),**res)
    elif 'Person' in res:
        domain_data = res['Person']
        node =Person.update_node_properties(res.get('data_id'),**res)
    elif 'Company' in res:
        domain_data = res['Company']
        node = Company.update_node_properties(res.get('data_id'),**res)
    elif 'Comment' in res:
        domain_data = res['Comment']
        node = Comment.update_node_properties(res.get('data_id'),**res)
    elif 'Email' in res:
        domain_data = res['Email']
        node = Email.update_node_properties(res.get('data_id'),**res)
    elif 'Wallet' in res:
        domain_data = res['Wallet']
        node = Wallet.update_node_properties(res.get('data_id'),**res)
    elif 'Phone' in res:
        domain_data = res['Phone']
        node = Phone.update_node_properties(res.get('data_id'),**res)
    elif 'Message' in res:
        domain_data = res['Message']
        node = Message.update_node_properties(res.get('data_id'),**res)
    else:
        return jsonify({"state":"fail", "error": str(e)}), 400
    if node is False:
        return jsonify({"state":"fail", "error": str(e)}), 400
    return jsonify({"state":"success"}), 200