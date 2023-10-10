from py2neo import Graph
from datetime import datetime

# Neo4j 데이터베이스에 연결합니다.
graph = Graph("bolt://localhost:7687", auth=("neo4j", "icheneo4j"))

# 실행할 Cypher 쿼리를 작성합니다.
cypher_query = """
MATCH (n:Blog) RETURN n LIMIT 25
"""

# 쿼리를 실행하고 결과를 가져옵니다.
result = graph.run(cypher_query)

# 결과를 JSON 형식으로 변환할 리스트를 초기화합니다.
data_list = []

# 결과를 반복하여 데이터를 추출합니다.
for record in result:
    data = dict(record["n"])  # 노드 데이터를 딕셔너리로 변환
    data_list.append(data)

necessary_keys = ["Post-Created_Date", "Blog-Name", "Blog-Type", "Post-Post_URL", "Post-Title"]

# 각 딕셔너리에서 필요한 키를 제외한 모든 키를 삭제합니다.
for record in data_list:
    keys_to_delete = [key for key in record.keys() if key not in necessary_keys]
    for key in keys_to_delete:
        del record[key]

# "Post-Created_Date" 문자열을 날짜 형식으로 변환하고 딕셔너리에 추가합니다.
for record in data_list:
    record['Post-Created_Date'] = datetime.strptime(record['Post-Created_Date'], '%Y-%m-%d %H:%M')

# "Post-Created_Date"을 기준으로 리스트를 정렬합니다.
sorted_data = sorted(data_list, key=lambda x: x['Post-Created_Date'])

# 정렬된 결과를 출력합니다.
for record in sorted_data:
    print(record)