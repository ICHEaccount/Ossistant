from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from datetime import datetime
import re
import json
from datetime import datetime
from db_conn.neo4j.init import db
from neo4j import GraphDatabase

bp = Blueprint('timeline', __name__, url_prefix='/timeline')

#@bp.route('/test', methods=['GET'])
@bp.route("/whole/<string:case_id>", methods=["GET"])
def get_data(case_id):
    # 초기 데이터 구조
    data = {
        "Company": [],
        "Person": [],
        "SurfaceUser": [],
        "DarkUser": []
    }

    # 각 노드 유형에 대한 쿼리 실행
    for node_type in data.keys():
        if not case_id:
            jsonify({'Error': 'case_id did not exist'}), 404
        query = (
            f"MATCH (n:{node_type})-[*1..2]-(connected_node) "
            f"WHERE NOT n = connected_node AND n.case_id = '{case_id}' "  # 같은 노드 제외 및 case_id 일치 조건 추가
            "RETURN n AS node, collect(connected_node) AS connected_nodes"
        )
        results, _ = db.cypher_query(query)

        # 결과 처리
        for node, connected_nodes in results:
            node_info = {
                "id": node.id,
                "labels": list(node.labels),
                "properties": node._properties,
                "connected_nodes": []
            }
            # 연결된 노드들의 정보 처리
            for cn in connected_nodes:
                cn_info = {
                    "id": cn.id,
                    "labels": list(cn.labels),
                    "properties": cn._properties
                }
                node_info["connected_nodes"].append(cn_info)

            # 최종 데이터 구조에 추가
            data[node_type].append(node_info)
    # 새로운 데이터 구조를 저장할 변수 초기화
    new_data_structure = {}

    # original_data의 각 key(노드 유형)에 대해 반복
    for node_type, nodes in data.items():
        # 각 노드 유형에 대한 처리 결과를 리스트로 저장
        new_data_structure[node_type] = []
        for node in nodes:
            # 각 노드의 connected_nodes에서 properties만 추출
            properties_list = [connected_node['properties'] for connected_node in node['connected_nodes']]
            # 새로운 connected_nodes 리스트를 새로운 데이터 구조에 추가
            new_node = {
                'connected_nodes': properties_list,
                'id': node['id'],
                'labels': node['labels'],
                'properties': node['properties']
            }
            # 최종 리스트에 노드 추가
            new_data_structure[node_type].append(new_node)

    # JSON 문자열을 파이썬 딕셔너리로 로드
    data_dict = new_data_structure

    # 모든 최상위 키들을 반복하면서 처리 ('Company', 'Person', 'SurfaceUser', 'DarkUser')
    for key in data_dict:
        # 각 리스트 내의 아이템들을 반복
        for item in data_dict[key]:
            # 'id'와 'labels' 키가 있다면 삭제
            if 'id' in item:
                del item['id']
            if 'labels' in item:
                del item['labels']

    for key in data_dict:
        # 각 리스트 내의 아이템들을 반복
        for node in data_dict[key]:
            # properties를 connected_nodes 배열에 추가
            node['connected_nodes'].append(node['properties'])
            # properties 키를 삭제
            del node['properties']

    # 이벤트 카운터 초기화
    event_counter = 1

    # 모든 키에 대해 반복합니다.
    for key in data_dict.keys():
        # 각 키(예: "Company", "DarkUser", ...)에 대한 리스트를 순회합니다.
        for entry in data_dict[key]:
            # connected_nodes 키가 있는지 확인하고 값을 수정합니다.
            if "connected_nodes" in entry:
                for node in entry["connected_nodes"]:
                    node["Event"] = f"Event {event_counter}"
                event_counter += 1  # 다음 이벤트 번호로 업데이트

    all_connected_nodes = []

    # 데이터셋의 각 섹션(Company, DarkUser, 등)을 순회
    for section in data_dict.values():
        # 각 섹션에 있는 모든 연결된 노드들을 순회
        for item in section:
            # connected_nodes 리스트에 있는 모든 딕셔너리를 추출
            all_connected_nodes.extend(item.get('connected_nodes', []))

    data = all_connected_nodes
    # date와 created_date를 regdate로 변환
    for item in data:
        if 'date' in item:
            item['regdate'] = item.pop('date')
        elif 'created_date' in item:
            item['regdate'] = item.pop('created_date')

    # regdate가 있는 딕셔너리만 필터링
    filtered_data = [item for item in data if 'regdate' in item]

    # regdate의 hour 정보를 분리하고, regdate를 날짜만 포함하도록 변환
    for item in filtered_data:
        # regdate로부터 datetime 객체 생성
        regdate_obj = datetime.strptime(item['regdate'], "%Y-%m-%d %H:%M:%S")
        # Hour 정보 추가
        item['Hour'] = regdate_obj.hour
        # regdate를 날짜만 포함하는 datetime.date 객체로 변환
        item['regdate'] = regdate_obj.date()

    # 날짜로 정렬 (오름차순)
    filtered_data.sort(key=lambda x: x['regdate'])

    # regdate를 "YYYY-MM-DD" 형식의 문자열로 변환
    for item in filtered_data:
        item['regdate'] = item['regdate'].strftime("%Y-%m-%d")

    # 결과를 JSON으로 반환

    #return filtered_data
    post_dicts = filtered_data
    return jsonify({'whole_dicts': post_dicts}), 200

# @bp.route('/whole', methods=["GET"])
# def create_post():
#     post_dicts = get_data()
#     return jsonify({'whole_dicts': post_dicts}), 200

########################################suspect_Timeline################################################

#@bp.route('/test', methods=['GET'])
@bp.route("/suspect/<string:case_id>", methods=["GET"])
def get_surfaceuser_and_connected_nodes(case_id):
    data = []

    # SurfaceUser 노드 가져오기
    surfaceuser_query = (
        f"MATCH (s:SurfaceUser) "
        f"WHERE s.case_id = '{case_id}' "
        "RETURN s"
    )
    surfaceuser_nodes, _ = db.cypher_query(surfaceuser_query)

    # DarkUser 노드 가져오기
    darkuser_query = (
        f"MATCH (d:DarkUser) "
        f"WHERE d.case_id = '{case_id}' "
        "RETURN d"
    )
    darkuser_nodes, _ = db.cypher_query(darkuser_query)

    # 각 SurfaceUser 노드에 대해 연결된 노드 정보 가져오기
    for surfaceuser_node in surfaceuser_nodes:
        surfaceuser_node = surfaceuser_node[0]  # Node 객체 추출
        surfaceuser_properties = {
           "username": surfaceuser_node['username']
            # 다른 SurfaceUser 속성 추가
        }
        surfaceuser_id = surfaceuser_node.id
        connected_nodes_query = (
            f"MATCH (s:SurfaceUser)-[r]->(connected_node) "
            f"WHERE id(s) = {surfaceuser_id} "
            "RETURN type(r) AS relationship_type, properties(connected_node) AS connected_node_properties"
        )
        connected_nodes, _ = db.cypher_query(connected_nodes_query)
        data.append({
            "UserType": "SurfaceUser",
            "UserProperties": surfaceuser_properties,
            "ConnectedNodes": [{"relationship_type": row[0], "connected_node_properties": row[1]} for row in
                               connected_nodes]
        })
    # DarkUser에 대해서도 동일한 작업 수행
    for darkuser_node in darkuser_nodes:
        darkuser_node = darkuser_node[0]
        darkuser_properties = {
            "username": darkuser_node['username']
            # 다른 DarkUser 속성 추가
        }
        darkuser_id = darkuser_node.id
        connected_nodes_query = (
            f"MATCH (d:DarkUser)-[r]->(connected_node) "
            f"WHERE id(d) = {darkuser_id} "
            "RETURN type(r) AS relationship_type, properties(connected_node) AS connected_node_properties"
        )
        connected_nodes, _ = db.cypher_query(connected_nodes_query)
        data.append({
            "UserType": "DarkUser",
            "UserProperties": darkuser_properties,
            "ConnectedNodes": [{"relationship_type": row[0], "connected_node_properties": row[1]} for row in
                               connected_nodes]
        })

    new_data = []

    for item in data:
        user_type = item["UserType"]
        connected_nodes = item["ConnectedNodes"]

        for node in connected_nodes:
            node_properties = node["connected_node_properties"]
            user_properties = item.get("UserProperties", {})  # UserProperties 가져오기
            node_properties["UserType"] = user_type

            # UserProperties에서 username 추출
            username = user_properties.get("username")
            if username:
                node_properties["username"] = username

            # UserProperties 키 삭제
            if "UserProperties" in node_properties:
                del node_properties["UserProperties"]

            new_data.append(node_properties)


    for item in new_data:
        if 'created_date' in item:
            item['regdate'] = item['created_date']
            del item['created_date']
        if 'UserProperties' in item:
            del item['UserProperties']
    filtered_data = [item for item in new_data if 'regdate' in item]

    new_dicts = []

    for item in filtered_data:
        new_dict = {}

        if 'UserType' in item:
            new_dict['UserType'] = item['UserType']
        if 'UserProperties' in item:
            new_dict['UserProperties'] = item['UserProperties']
        if 'case_id' in item:
            new_dict['case_id'] = item['case_id']
        if 'regdate' in item:
            new_dict['regdate'] = item['regdate']
        if 'post_type' in item:
            new_dict['post_type'] = item['post_type']
        if 'title' in item:
            new_dict['title'] = item['title']
        if 'url' in item:
            new_dict['url'] = item['url']
        if 'domain' in item:
            new_dict['domain'] = item['domain']
        if 'status' in item:
            new_dict['status'] = item['status']
        if 'name' in item:
            new_dict['name'] = item['name']
        if 'content' in item:
            new_dict['content'] = item['content']
        if 'username' in item:
            new_dict['username'] = item['username']

        new_dicts.append(new_dict)
    data = new_dicts
    # regdate로 정렬 후 Hour 추가하고 regdate 형식 변경
    for item in data:
        regdate_str = item['regdate']
        regdate_obj = datetime.strptime(regdate_str, '%Y-%m-%d %H:%M:%S')
        item['Hour'] = regdate_obj.hour  # Hour 키에 시간 값 추가

    # regdate 기준으로 정렬
    data.sort(key=lambda x: datetime.strptime(x['regdate'], '%Y-%m-%d %H:%M:%S'))

    # regdate 형식을 'YYYY-MM-DD'로 변경
    for item in data:
        item['regdate'] = item['regdate'][:10]  # YYYY-MM-DD 포맷으로 슬라이싱

    # 데이터 반환
#     return data
    post_dicts = data
    return jsonify({'suspect_dicts': post_dicts}), 200
#
#
# @bp.route('/suspect', methods=["GET"])
# def create_post():
#     post_dicts = get_surfaceuser_and_connected_nodes()
#     return jsonify({'suspect_dicts': post_dicts}), 200

#####################################################################################################################

########################################Domain_Timeline################################################

#@bp.route('/test', methods=['GET'])
@bp.route("/post/<string:case_id>", methods=["GET"])
def post_function(case_id):
    # 초기 데이터 구조
    data = {
        "Domain": [],
        "Post": []
    }

    # Domain 노드와 연결된 Post 노드에 대한 쿼리 실행
    query = (
        "MATCH (d:Domain)-[*1..2]-(p:Post) "
        f"WHERE NOT d = p AND d.case_id = '{case_id}' "  # 동일 노드 제외 및 case_id 조건 추가
        "RETURN d AS domain_node, p AS post_node"
    )
    results, _ = db.cypher_query(query)

    # 결과 데이터 처리
    for record in results:
        domain_node = record[0]
        post_node = record[1]

        # domain_node가 None이 아닌지 확인
        if domain_node:
            domain_data = dict(domain_node._properties)

            domain_data['domain_registered_date'] = 'Domain_registered'

            # Post 노드 데이터에 Domain의 'domain' 속성 추가
            post_data = dict(post_node._properties)
            post_data['domain'] = domain_data['domain']

            data["Post"].append(post_data)

            # 도메인 노드 데이터가 아직 Domain 리스트에 없으면 추가
            if domain_data not in data["Domain"]:
                data["Domain"].append(domain_data)

    combined_list = data["Domain"] + data["Post"]
    data = combined_list
    # created_date를 regdate로 변경하고, regdate가 있는 딕셔너리만 추출합니다.
    processed_data = []
    for item in data:
        # created_date가 있으면 regdate로 변경
        if 'created_date' in item:
            item['regdate'] = item.pop('created_date')
        # regdate가 있는 딕셔너리만 추출
        if 'regdate' in item:
            processed_data.append(item)

    # regdate의 시간 값을 추출하여 Hour 키를 추가합니다.
    for item in processed_data:
        # datetime 객체를 사용하여 시간을 추출합니다.
        date_time_obj = datetime.strptime(item['regdate'], "%Y-%m-%d %H:%M:%S")
        item['Hour'] = date_time_obj.hour

    # regdate 기준으로 정렬합니다.
    processed_data.sort(key=lambda x: datetime.strptime(x['regdate'], "%Y-%m-%d %H:%M:%S"))

    # regdate 포맷을 변경하고 문자열로 변환합니다.
    for item in processed_data:
        # datetime 객체를 사용하여 날짜만 추출하고 포맷을 변경합니다.
        item['regdate'] = datetime.strptime(item['regdate'], "%Y-%m-%d %H:%M:%S").date().isoformat()

    # 결과를 출력합니다.
#     return processed_data
    post_dicts = processed_data
    return jsonify({'post_dicts': post_dicts}), 200

#
#
# @bp.route('/post', methods=["GET"])
# def create_post():
#    post_dicts = post_function()
#    return jsonify({'post_dicts': post_dicts}), 200

#####################################################################################################################