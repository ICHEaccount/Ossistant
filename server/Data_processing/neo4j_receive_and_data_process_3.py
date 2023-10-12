import json
from py2neo import Graph
from datetime import datetime
from neo4j import GraphDatabase
# Neo4j 데이터베이스에 연결합니다.
graph = Graph("bolt://localhost:7687", auth=("neo4j", "icheneo4j"))

queries = [
    "MATCH (d:Domain) RETURN d AS data",
    "MATCH (p:Post) RETURN p AS data",
    "MATCH (u:User) RETURN u AS data"
]

results = []

# Neo4j 데이터베이스에 연결하고 각 쿼리 실행
with GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "icheneo4j")) as driver:
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
        post_item = next((post for post in data if post.get('type') == 'post' and post['src'] == user_item.get('src')), None)
        if post_item:
            post_item['keyword'] = user_item.get('keyword')

post_dicts = [item for item in data if item.get('type') == 'post']
domain_dicts = [item for item in data if 'domain' in item]
user_dicts = [item for item in data if item.get('type') == 'user']

