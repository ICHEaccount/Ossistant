from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime
import re
import json
from datetime import datetime
from db_conn.neo4j.init import db
from neo4j import GraphDatabase

bp = Blueprint('timeline', __name__, url_prefix='/timeline')

def post_function():
    queries = [
        "MATCH (d:Domain) RETURN PROPERTIES(d) AS data",
        "MATCH (p:Post) RETURN PROPERTIES(p) AS data",
        "MATCH (s:SurfaceUser) RETURN PROPERTIES(s) AS data"
    ]

    results = []

    for query in queries:
        result, _ = db.cypher_query(query)
        for row in result:
            data = row[0]  # 각 튜플의 첫 번째 요소를 가져옵니다.
            results.append(data)

    username_dict = None
    for item in results:
        if "username" in item:
            username_dict = item
            break

    # username이 있는 경우, 같은 url 또는 domain 값을 가진 딕셔너리에 username 추가
    if username_dict:
        for item in results:
            if item.get("domain") == username_dict.get("url"):
                item["username"] = username_dict.get("username")

    # 결과를 저장할 리스트
    filtered_data_domain = [] # This is domain

    for item in results:
        if 'domain' in item:
            filtered_item = {
                "domain": item["domain"],
                "regdate": item.get("regdate"),
                "status": item.get("status")
            }

            # 'username' 키가 있는지 확인하고, 있다면 그 값을 추가
            if 'username' in item:
                filtered_item["username"] = item["username"]

            filtered_data_domain.append(filtered_item)

    # 데이터셋을 반복하면서 domain 값을 분석하고 domain_name을 추가
    for item in filtered_data_domain:
        domain_value = item.get("domain")
        if domain_value:
            # 정규 표현식을 사용하여 도메인 이름 추출
            match = re.search('(?:https?://)?(?:www\.)?([a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+)', domain_value)
            # match = re.search(r'www\.(.*?)\.', domain_value)
            if match:
                domain_name = match.group(1)
                item["domain_name"] = domain_name

    # 날짜 형식으로 변환
    for item in filtered_data_domain:
        if item["regdate"] :
            item["regdate"] = datetime.strptime(item["regdate"], "%Y-%m-%d").date()

    # 날짜를 기준으로 정렬 (lambda 함수 사용)
    sorted_data = sorted(filtered_data_domain, key=lambda x: x["regdate"])

    # 날짜를 문자열로 다시 변환
    for item in sorted_data:
        if item["regdate"] :
            item["regdate"] = item["regdate"].strftime("%Y-%m-%d")


    return sorted_data


@bp.route('/post', methods=["GET"])
def create_post():
    post = post_function()
    return jsonify({'post_dicts': post}), 200

