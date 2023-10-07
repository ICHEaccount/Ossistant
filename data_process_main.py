import json

with open('../venv/json_example/example.json', 'r', encoding='utf-8') as json_file:
    data = json.load(json_file)

# 중복된 객체를 삭제하기 위한 함수
def remove_duplicates(data):
    seen = set()
    for key, data_list in data.items():
        result = []
        for item in data_list:
            # 객체를 문자열로 변환하여 중복 여부를 확인합니다.
            item_str = str(item)
            # 이전에 보지 않은 객체인 경우에만 결과에 추가합니다.
            if item_str not in seen:
                seen.add(item_str)
                result.append(item)
        # 중복을 제거한 결과로 기존 데이터를 갱신합니다.
        data[key] = result
# JSON 데이터에서 모든 필드에 있는 null 값을 삭제하는 함수
def remove_all_null(data):
    for key, data_list in data.items():
        for item in data_list:
            item_copy = item.copy()  # 원본 데이터를 수정하지 않도록 복사본을 만듭니다.
            for field_name, field_value in item.items():
                if field_value is None:
                    del item_copy[field_name]
            item.clear()
            item.update(item_copy)

remove_duplicates(data)
remove_all_null(data)
print(data)
with open('../venv/output_data.json', 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=4)
print("JSON 파일 생성")