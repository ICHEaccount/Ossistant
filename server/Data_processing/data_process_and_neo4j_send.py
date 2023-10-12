import json
from py2neo import Graph, Node, Relationship

# Neo4j 데이터베이스에 연결
graph = Graph("http://localhost:7474", auth=("neo4j", "icheneo4j"),name="neo4j")

# JSON 파일을 읽어오기
with open("report_beentack8_simple.json", "r", encoding="utf-8") as json_file:
  data = json.load(json_file)
  # null값 삭제 모듈
def remove_null(data):
    if isinstance(data, dict):
        return {k: remove_null(v) for k, v in data.items() if v is not None}
    elif isinstance(data, list):
        return [remove_null(item) for item in data]
    else:
        return data
# 중복 데이터 삭제 모듈
def remove_duplicate_dicts(data):
    unique_data = {}
    seen = set()

    for key, value in data.items():
        # 딕셔너리를 정렬된 JSON 문자열로 변환
        json_str = json.dumps(value, sort_keys=True)

        # 이미 본 JSON 문자열이 아니면 저장하고 seen 집합에 추가
        if json_str not in seen:
            seen.add(json_str)
            unique_data[key] = value

    return unique_data

# 빈 딕셔너리와 None 값을 제거하는 함수 정의
def remove_empty_dicts_and_none(d):
    if not isinstance(d, dict):
        return d
    return {k: remove_empty_dicts_and_none(v) for k, v in d.items() if v is not None and remove_empty_dicts_and_none(v)}

# 데이터 전처리 (중복값 삭제 + null값 삭제)

cleaned_data = remove_null(data)
processed_data = remove_duplicate_dicts(cleaned_data)
data = remove_empty_dicts_and_none(processed_data)

# JSON 객체의 키 값을 배열에 저장
keys_array = list(data.keys())

# for 루프를 사용하여 배열 값 출력
for i in range(len(keys_array)):
    if i < len(keys_array):
        if 'site' in data[keys_array[i]]:
            site_data = data[keys_array[i]]['site']
            data[keys_array[i]].update({f'site-{key}': value for key, value in site_data.items()})
            del data[keys_array[i]]['site']
        if 'status' in data[keys_array[i]]:
            status_data = data[keys_array[i]]['status']
            data[keys_array[i]].update({f'status-{key}': value for key, value in status_data.items()})
            del data[keys_array[i]]['status']
        if 'ids_usernames' in data[keys_array[i]]:
            ids_usernames_data = data[keys_array[i]]['ids_usernames']
            data[keys_array[i]].update({f'ids_usernames-{key}': value for key, value in ids_usernames_data.items()})
            del data[keys_array[i]]['ids_usernames']
        if 'status-ids' in data[keys_array[i]]:
            ids_usernames_data = data[keys_array[i]]['status-ids']
            data[keys_array[i]].update({f'status-ids-{key}': value for key, value in ids_usernames_data.items()})
            del data[keys_array[i]]['status-ids']
    else:
        break

# 각 항목을 []로 묶는 작업 수행
for key, value in data.items():
    data[key] = [value]

# # Neo4j 노드 생성
for category, items in data.items():
 for item in items:
    node = Node(category, **{k: v for k, v in item.items() if v is not None})
 graph.create(node)
# 관계 생성 예시
# Alice와 Bob 간의 "KNOWS" 관계 생성
# alice = graph.nodes.match("Person", name="Alice").first()
# bob = graph.nodes.match("Person", name="Bob").first()
# alice_knows_bob = Relationship(alice, "KNOWS", bob)
# graph.create(alice_knows_bob)
#
# # Bob와 Charlie 간의 "KNOWS" 관계 생성
# charlie = graph.nodes.match("Person", name="Charlie").first()
# bob_knows_charlie = Relationship(bob, "KNOWS", charlie)
# graph.create(bob_knows_charlie)