from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime
import re
import json
from datetime import datetime

from db_conn.neo4j.init import db 

# Neo4j 데이터베이스에 연결합니다.
# app = Flask(__name__)
# CORS(app)

bp = Blueprint('timeline', __name__, url_prefix='/timeline')

DOMAIN = 0 
POST = 1 
SURFACEUSER = 2

def post_function():
    node_status = [False, False, False]
    queries = [
        "MATCH (d:Domain) RETURN PROPERTIES(d)",
        "MATCH (p:Post) RETURN PROPERTIES(p)",
        "MATCH (s:SurfaceUser) RETURN PROPERTIES(s)"
    ]
    result_list = []
    i = 0 
    for query in queries:
        result , _ = db.cypher_query(query)
        if  result[0]:
            node_status[i]= True
        i = i+1
        
        result_list.extend(result[0])

    # Data from graphDB  
    if result_list:
        merged_results = [json.loads(json.dumps(result)) for result in result_list]
        
    
    # Old 
    # results = []

    # # Neo4j 데이터베이스에 연결하고 각 쿼리 실행
    # with GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "icheneo4j")) as driver:
    #     for query in queries:
    #         with driver.session() as session:
    #             result = session.run(query)
    #             results.extend(result.data())

                                                                                                                                                                                                                                                                                                
    # return jsonify({'return':merged_results})

    # SurfaceUser - post 
    # Username dict.url == other dict.url, Add domain 
    for i, data_dict in enumerate(merged_results):
        if 'username' in data_dict:
            username = data_dict['username']
            if 'url' in data_dict:
                url = data_dict['url']
                for j, other_dict in enumerate(merged_results):
                    if i != j and 'url' in other_dict and 'username' not in other_dict:
                        if other_dict['url'] == url:
                            other_dict['username'] = username

    # SurfaceUser - domain 
    for i, data_dict in enumerate(merged_results):
        if 'username' in data_dict:
            username = data_dict['username']
            if 'url' in data_dict:
                url = data_dict['url']
                for j, other_dict in enumerate(merged_results):
                    if i != j and 'domain' in other_dict and 'username' not in other_dict:
                        if other_dict['domain'] == url:
                            other_dict['username'] = username

    # Delete key value(No Visualization)
    for data_dict in merged_results:
        if "note" in data_dict:
            del data_dict["note"]
    
    # Delete fake 
    merged_results = [data_dict for data_dict in merged_results if "fake" not in data_dict]

    # Post - domain 
    # if node_status[POST] is True and node_status[DOMAIN] is True:
    #     for data_dict in merged_results:
    #         if 'created_date' in data_dict:
    #             data_dict['regdate'] = data_dict.pop('created_date')

    #     # 정규 표현식 패턴을 사용하여 HH:MM 형식 제거하고 YYYY-MM-DD로 변환
    #     for data_dict in merged_results:
    #         if 'regdate' in data_dict:
    #             date_dict = data_dict['regdate']
    #             datetime_obj = datetime.strptime(date_dict, '%Y-%m-%d %H:%M:%S')
    #             date_str = datetime_obj.strftime('%Y-%m-%d')
    #             # date_str = re.sub(r'\s\d{2}:\d{2}', '', date_str)  # HH:MM 부분 제거
    #             data_dict['regdate'] = date_str
    #     # YYYY-MM-DD 형식으로만 시간 순서대로 딕셔너리 정렬
    #     sorted_results = sorted(merged_results, key=lambda x: datetime.strptime(x['regdate'], '%Y-%m-%d'))

    #     for data_dict in sorted_results:
    #         if 'domain' in data_dict:
    #             if 'writer' in data_dict:
    #                 data_dict['writer : domain'] = f"{data_dict['writer']} : {data_dict['domain']}"
    #             else:
    #                 data_dict['writer : domain'] = data_dict['domain']

    #         return sorted_results
    return None

@bp.route('/post',methods=["GET"])
def create_post():
    post = post_function()
    return jsonify({'post_dicts':post}), 200

# if __name__ == '__main__':
#     app.run(host = '0.0.0.0', debug=True, port=5011)
