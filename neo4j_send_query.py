import json
from py2neo import Graph, Node

# Neo4j 데이터베이스에 연결합니다. 필요한 경우 호스트 및 인증 정보를 변경하세요.
graph  = Graph("http://localhost:7474", auth = ("neo4j", "icheneo4j"), name="neo4j")

# JSON 파일을 읽습니다.
with open("../venv/test_data.json", "r", encoding="utf-8") as json_file:
    data = json.load(json_file)

# JSON 데이터를 Neo4j에 저장합니다.
for item in data:
    # 데이터가 문자열이 아니라 딕셔너리로 되어 있는지 확인합니다.
    if isinstance(item, dict):
        # 노드를 생성하고 속성을 추가합니다.
        node = Node("LabelName")  # "LabelName"을 원하는 레이블로 변경하세요.
        for key, value in item.items():
            node[key] = value
     graph.create(node)
    else:
     print(f"Invalid data format: {item}")