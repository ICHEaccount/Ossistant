import json
import re
from datetime import datetime
from neo4j import GraphDatabase
# Neo4j 데이터베이스에 연결합니다.


queries = [
    "MATCH (d:Domain) RETURN d AS data",
    "MATCH (p:Post) RETURN p AS data",
    "MATCH (s:SurfaceUser) RETURN s AS data"
]

results = []

# Neo4j 데이터베이스에 연결하고 각 쿼리 실행
with GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "icheneo4j")) as driver:
    for query in queries:
        with driver.session() as session:
            result = session.run(query)
            results.extend(result.data())

merged_results = [result['data'] for result in results]

for i, data_dict in enumerate(merged_results):
    if 'username' in data_dict:
        username = data_dict['username']
        if 'url' in data_dict:
            url = data_dict['url']
            for j, other_dict in enumerate(merged_results):
                if i != j and 'url' in other_dict and 'username' not in other_dict:
                    if other_dict['url'] == url:
                        other_dict['username'] = username

for i, data_dict in enumerate(merged_results):
    if 'username' in data_dict:
        username = data_dict['username']
        if 'url' in data_dict:
            url = data_dict['url']
            for j, other_dict in enumerate(merged_results):
                if i != j and 'domain' in other_dict and 'username' not in other_dict:
                    if other_dict['domain'] == url:
                        other_dict['username'] = username

for data_dict in merged_results:
    if "note" in data_dict:
        del data_dict["note"]

merged_results = [data_dict for data_dict in merged_results if "fake" not in data_dict]

for data_dict in merged_results:
    if 'created_date' in data_dict:
        data_dict['regdate'] = data_dict.pop('created_date')


# 정규 표현식 패턴을 사용하여 HH:MM 형식 제거하고 YYYY-MM-DD로 변환
for data_dict in merged_results:
    if 'regdate' in data_dict:
        date_str = data_dict['regdate']
        date_str = re.sub(r'\s\d{2}:\d{2}', '', date_str)  # HH:MM 부분 제거
        data_dict['regdate'] = date_str

# YYYY-MM-DD 형식으로만 시간 순서대로 딕셔너리 정렬
sorted_results = sorted(merged_results, key=lambda x: datetime.strptime(x['regdate'], '%Y-%m-%d'))

for data_dict in sorted_results:
    if 'domain' in data_dict:
        if 'writer' in data_dict:
            data_dict['writer : domain'] = f"{data_dict['writer']} : {data_dict['domain']}"
        else:
            data_dict['writer : domain'] = data_dict['domain']


print(sorted_results)

# domain_dict = next(item for item in data if 'domain' in item)
#
# for item in data:
#     if item.get('type') == 'user' and 'src' in item and item['src'] == domain_dict['domain']:
#         domain_dict['keyword'] = item.get('keyword')
#
# post_src_set = set(item['src'] for item in data if item.get('type') == 'post')
#
# for item in data:
#     if item.get('type') == 'user' and item.get('src') in post_src_set:
#         post_item = next((post for post in data if post.get('type') == 'post' and post['src'] == item['src']), None)
#         if post_item:
#             post_item['keyword'] = item.get('keyword')
#
# for user_item in data:
#     if user_item.get('type') == 'user':
#         post_item = next((post for post in data if post.get('type') == 'post' and post['src'] == user_item.get('src')), None)
#         if post_item:
#             post_item['keyword'] = user_item.get('keyword')
#
# post_dicts = [item for item in data if item.get('type') == 'post']
# domain_dicts = [item for item in data if 'domain' in item]
# user_dicts = [item for item in data if item.get('type') == 'user']

