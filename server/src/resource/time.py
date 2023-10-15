from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime

import json
from datetime import datetime
from neo4j import GraphDatabase

bp = Blueprint('timeline', __name__, url_prefix='/timeline')

def domain_function():
    queries = [
        "MATCH (d:Domain) RETURN d AS data",
        "MATCH (p:Post) RETURN p AS data",
        "MATCH (u:SurfaceUser) RETURN u AS data"
    ]

    results = []
    if not results:
        return None
    # Neo4j 데이터베이스에 연결하고 각 쿼리 실행
    # with GraphDatabase.driver("bolt://127.0.0.1:7687", auth=("neo4j", "icheneo4j")) as driver:
    #     for query in queries:
    #         with driver.session() as session:
    #             result = session.run(query)
    #             results.extend(result.data())

    merged_results = [result['data'] for result in results]
    integrated_results = json.dumps(merged_results, indent=2)
    parsed_data = json.loads(integrated_results)
    data = parsed_data

    domain_dict = next(item for item in data if 'domain' in item)

    for item in data:
        if item.get('type') == 'user' and 'src' in item and item['src'] == domain_dict['domain']:
            domain_dict['keyword'] = item.get('keyword')

    post_src_set = set(item['src'] for item in data if item.get('type') == 'post')

    for item in data:
        if item.get('type') == 'user' and item.get('src') in post_src_set:
            post_item = next((post for post in data if post.get('type') == 'post' and post['src'] == item['src']), None)
            if post_item:
                post_item['keyword'] = item.get('keyword')

    for user_item in data:
        if user_item.get('type') == 'user':
            post_item = next(
                (post for post in data if post.get('type') == 'post' and post['src'] == user_item.get('src')), None)
            if post_item:
                post_item['keyword'] = user_item.get('keyword')

    post_dicts = [item for item in data if item.get('type') == 'post']
    domain_dicts = [item for item in data if 'domain' in item]
    user_dicts = [item for item in data if item.get('type') == 'user']
    return domain_dicts

def post_function():
    queries = [
        "MATCH (d:Domain) RETURN d AS data",
        "MATCH (p:Post) RETURN p AS data",
        "MATCH (u:User) RETURN u AS data"
    ]

    results = []

    # Neo4j 데이터베이스에 연결하고 각 쿼리 실행
    with GraphDatabase.driver("bolt://172.25.0.4:7687", auth=("neo4j", "icheneo4j")) as driver:
        for query in queries:
            with driver.session() as session:
                result = session.run(query)
                results.extend(result.data())

    merged_results = [result['data'] for result in results]
    integrated_results = json.dumps(merged_results, indent=2)
    parsed_data = json.loads(integrated_results)
    data = parsed_data

    domain_dict = next(item for item in data if 'domain' in item)

    for item in data:
        if item.get('type') == 'user' and 'src' in item and item['src'] == domain_dict['domain']:
            domain_dict['keyword'] = item.get('keyword')

    post_src_set = set(item['src'] for item in data if item.get('type') == 'post')

    for item in data:
        if item.get('type') == 'user' and item.get('src') in post_src_set:
            post_item = next((post for post in data if post.get('type') == 'post' and post['src'] == item['src']), None)
            if post_item:
                post_item['keyword'] = item.get('keyword')

    for user_item in data:
        if user_item.get('type') == 'user':
            post_item = next(
                (post for post in data if post.get('type') == 'post' and post['src'] == user_item.get('src')),
                None)
            if post_item:
                post_item['keyword'] = user_item.get('keyword')

    post_dicts = [item for item in data if item.get('type') == 'post']
    domain_dicts = [item for item in data if 'domain' in item]
    for item in domain_dicts:
        if 'regdate' in item:
            item['keyword-post_date'] = item.pop('regdate')

    for item in domain_dicts:
        item['src'] = item.pop('domain')
        item['keyword-post_writer'] = 'Domain'

    combined_dicts = post_dicts + domain_dicts

    # 1. 'keyword-post_date'를 날짜로 변환하고, 시간 정보 제거
    for item in combined_dicts:
        date_str = item.get('keyword-post_date')
        if date_str:
            # 시간 정보가 있는지 확인
            if len(date_str) > 10:
                datetime_obj = datetime.strptime(date_str, '%Y-%m-%d %H:%M')
                item['keyword-post_date'] = datetime_obj.strftime('%Y-%m-%d')  # 시간 정보를 제거한 날짜만 남김

    # 2. 'keyword-post_date' 필드를 기반으로 딕셔너리 정렬
    combined_dicts.sort(key=lambda x: x['keyword-post_date'])

    # 3. 'keyword-post_date' 필드를 문자열로 다시 변환
    for item in combined_dicts:
        if 'keyword-post_date' in item:
            item['keyword-post_date'] = item['keyword-post_date']

    # 4. 'combined_dicts'를 시간 순서로 배치한 후, 다시 DATE 형식의 데이터를 문자열로 변환
    for item in combined_dicts:
        if 'keyword-post_date' in item:
            date_str = item.get('keyword-post_date')
            if date_str:
                datetime_obj = datetime.strptime(date_str, '%Y-%m-%d')
                item['keyword-post_date'] = datetime_obj.strftime('%Y-%m-%d')

    # 'domain' 키를 'src'로 이름 변경

    return combined_dicts

@bp.route('/domain',methods=["GET"])
def create_domain():
    domain = domain_function()
    return jsonify({'domain_dicts':domain}), 200

@bp.route('/post',methods=["GET"])
def create_post():
    post = post_function()
    return jsonify({'post_dicts':post}), 200
