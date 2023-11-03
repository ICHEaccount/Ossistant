import requests
from bs4 import BeautifulSoup

url = 'https://xss.is/threads/90284/'

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
}

res = requests.get(url, headers=headers) 
res.raise_for_status() # 정상 200
soup = BeautifulSoup(res.text, "lxml")

response = requests.get(url, headers=headers)

print(soup.title)


# # 요청이 성공적인지 확인
# if response.status_code == 200:
#     html_doc = response.text

#     # BeautifulSoup 객체 생성
#     soup = BeautifulSoup(html_doc, 'html.parser')

#     # title 태그 추출
#     title = soup.title.string if soup.title else '제목 없음'

#     # 결과를 딕셔너리 형태로 저장
#     result = {'post-title': title}

#     print(result)
# else:
#     print("웹 페이지를 가져오는 데 실패했습니다. 상태 코드:", response.status_code)
