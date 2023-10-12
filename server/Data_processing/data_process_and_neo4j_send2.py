import json
from py2neo import Graph, Node, Relationship

# Neo4j 데이터베이스에 연결
graph = Graph("http://localhost:7474", auth=("neo4j", "icheneo4j"),name="neo4j")

# JSON 파일을 읽어오기
with open("test_data.json", "r", encoding="utf-8") as json_file:
  data = json.load(json_file)
  # 중복 데이터 삭제 모듈
  def remove_duplicates(data_ex):
    seen = set()
    for key, data_list in data.items():
        result = []
        for item in data_list:
            item_str = str(item)
            if item_str not in seen:
                seen.add(item_str)
                result.append(item)
        data[key] = result
# null값 삭제 모듈
  def remove_all_null(data_ex2):
    for key, data_list in data.items():
        for item in data_list:
            item_copy = item.copy()  # 원본 데이터를 수정하지 않도록 복사본을 만듭니다.
            for field_name, field_value in item.items():
                if field_value is None:
                    del item_copy[field_name]
            item.clear()
            item.update(item_copy)
# 데이터 전처리 (중복값 삭제 + null값 삭제)
remove_duplicates(data)
remove_all_null(data)

# json파일 전처리 (GraphDB에 올리기 위해 Dictionary 하나로 데이터를 정의)
for company in data["Company"]:
    domain_data = company.pop("Domain", {})
    company.update({f"Domain-{key}": value for key, value in domain_data.items()})

for community in data["Community"]:
    community_data = community.pop("Post", {})
    community.update({f"Post-{key}": value for key, value in community_data.items()})

for SNS in data["SNS"]:
    SNS_data = SNS.pop("Post", {})
    SNS.update({f"Post-{key}": value for key, value in SNS_data.items()})

new_blog_data = []
for blog in data["Blog"]:
    posts = blog.get("Post", [])
    for post in posts:
        new_blog = {
            "Blog-Name": blog.get("Name", ""),
            "Blog-URL": blog.get("URL", ""),
            "Blog-Type": blog.get("type", ""),
        }
        new_blog.update({f"Post-{key}": value for key, value in post.items()})
        new_blog_data.append(new_blog)

data["Blog"] = new_blog_data

for blog in data["Blog"]:
    blog_data = blog.pop("Post-Comment", {})
    blog.update({f"Post-Comment-{key}": value for key, value in blog_data.items()})

# 처리한 데이터 그래프에 저장. (없는 데이터 항목 있어도 나머지 데이터 추가 가능)
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
