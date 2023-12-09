chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.command === "getPageUrl") {
        sendResponse({url: window.location.href});
    }

    if (request.command === "createNoteInput") {
        // 선택한 텍스트의 위치를 가져오기
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // 하이라이팅 함수
        highlightSelection(range);

        // 입력창을 포함할 div 생성
        const inputDiv = document.createElement("div");
        inputDiv.style.position = "absolute";
        inputDiv.style.left = `${rect.right}px`;
        inputDiv.style.top = `${rect.bottom + window.scrollY}px`; // 페이지 스크롤 고려



        // textarea 요소 생성
        const textarea = document.createElement("textarea");
        textarea.placeholder = "input memo"; // 기본 텍스트 설정
        textarea.style.width = "200px"; // 크기 조정
        textarea.style.height = "100px"; // 크기 조정
        textarea.style.backgroundColor = "#ffffcc"; // 연한 노랑색 배경
        textarea.style.border = "1px solid #ffd700"; // 테두리 설정
        textarea.style.borderRadius = "8px"; // 둥근 모서리
        textarea.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.2)"; // 그림자 효과
        textarea.style.padding = "10px"; // 내부 여백
        textarea.onclick = function() {
            if (textarea.value === "input memo") {
                textarea.value = "";
            }
        };

        // 체크 버튼 생성 및 설정
        const checkButton = document.createElement("button");
        checkButton.innerText = "✔️"; // 이모지 아이콘 사용
        checkButton.style.position = "absolute";
        checkButton.style.right = "5px";
        checkButton.style.top = "5px";
        checkButton.style.cursor = "pointer";
        checkButton.style.background = "none";
        checkButton.style.border = "none";
        checkButton.style.outline = "none";
        checkButton.style.transition = "transform 0.2s ease";

        // 체크 버튼 클릭 이벤트 핸들러
        checkButton.addEventListener('click', function() {
            sendResponse({note: textarea.value});
            // 아이콘 크기 변경 애니메이션
            checkButton.style.transform = "scale(0.8)";
            setTimeout(function() {
                checkButton.style.transform = "scale(1)";
            }, 200);
        });

        // 메모 아이콘 생성 (span 태그 사용)
        const memoIcon = document.createElement("span");
        memoIcon.textContent = "📝"; // 메모 이모지
        memoIcon.style.display = "none"; // 기본적으로 숨김
        memoIcon.style.position = "absolute";
        memoIcon.style.left = `${rect.right}px`;
        memoIcon.style.top = `${rect.bottom + window.scrollY}px`;
        memoIcon.style.cursor = "pointer";
        memoIcon.style.fontSize = "20px"; // 아이콘 크기 조정

         // textarea 접기/펼치기 기능
         let isCollapsed = false;
         textarea.addEventListener('dblclick', function() {
             if (!isCollapsed) {
                 textarea.style.height = "0";
                 textarea.style.padding = "0";
                 textarea.style.border = "none";
                 memoIcon.style.display = "block";
                 checkButton.style.display = "none";
                 isCollapsed = true;
             } else {
                 textarea.style.height = "100px";
                 textarea.style.padding = "10px";
                 textarea.style.border = "1px solid #ffd700";
                 memoIcon.style.display = "none";
                 checkButton.style.display = "block";
                 isCollapsed = false;
             }
         });
 
         // 메모 아이콘 클릭 시 펼치기
         memoIcon.addEventListener('click', function() {
             if (isCollapsed) {
                 textarea.dispatchEvent(new Event('dblclick'));
             }
         });

        textarea.addEventListener('keydown', function(event) {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault(); // 기본 동작 방지
                sendResponse({note: textarea.value});
            }
        });

        // div에 textarea 추가하고 문서에 div 추가
        inputDiv.appendChild(textarea);
        inputDiv.appendChild(checkButton);
        document.body.appendChild(inputDiv);
        document.body.appendChild(memoIcon);
    }
    
    const krphoneRegex = /01[016789]-\d{3,4}-\d{4}/g;
    const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    
    if (request.command === "getForumInfo") {
        // Post
        const writer = document.querySelector('.message-name .username') ? document.querySelector('.message-name .username').innerText : '';
        const created_date = document.querySelector('.p-description .u-dt') ? document.querySelector('.p-description .u-dt').getAttribute('title').trim() : '';
        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
        const content = document.querySelector('.bbWrapper') ? document.querySelector('.bbWrapper').innerText.trim() : '';
        
        const registered = [];
        const telegramRegex = /t\.me\/[^\s]+/g;
        let match;
        while ((match = telegramRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }

        //DarkUser
        const username = document.querySelector('.message-name .username') ? document.querySelector('.message-name .username').innerText : '';
        const rank = document.querySelector('.message-userDetails strong') ? document.querySelector('.message-userDetails strong').innerText : '';
        const regdate = document.querySelector('.message-userExtras dd') ? document.querySelector('.message-userExtras dd').innerText.trim() : '';
        const dtElements = Array.from(document.querySelectorAll('.message-userExtras dt'));        
        const dtPost = dtElements.find(dt => dt.textContent.includes('Сообщения'));
        const post_num = dtPost ? dtPost.nextElementSibling.innerText : '';
        const dtComment = dtElements.find(dt => dt.textContent.includes('Реакции'));
        const comment_num = dtComment ? dtComment.nextElementSibling.innerText : '';

        console.log("title", title);
        console.log("writer", writer);
        console.log("created_date", created_date);
        console.log("content", content);

        
        sendResponse({ writer, created_date, title, content, username, rank, regdate, post_num, comment_num, registered });
    }else if(request.command === "getNaverBlogInfo"){
        //if (window.self !== window.top && window.parent === window.top) {

        // 첫 번째 요소의 innerText만 사용
            //const writerElements = document.querySelectorAll('.nick .link .pcol2');
            //const writer = writerElements.length > 0 ? writerElements[0].innerText : '';
        const title = document.querySelector('title') ? document.querySelector('title').textContent.trim() : '';
        const writer = document.querySelector('.writer .nick') ? document.querySelector('.writer .nick').innerText : '';
        const created_date = document.querySelector('.se_publishDate.pcol2') ? document.querySelector('.se_publishDate.pcol2').innerText.trim() : '';
        const content = document.querySelector('.se-main-container') ? document.querySelector('.se-main-container').innerText.trim() : '';

        if (title && writer && created_date && content) {
            let phones = []; // 전화번호를 저장할 배열
            let emails = []; // 이메일을 저장할 배열
        
            let match;
            while ((match = krphoneRegex.exec(content)) !== null) {
                phones.push(match[0]);
            }
            while ((match = emailRegex.exec(content)) !== null) {
                emails.push(match[0]);
            }
        
            console.log("title", title);
            console.log("writer", writer);
            console.log("created_date", created_date);
            console.log("content", content);
        
            sendResponse({ writer, created_date, title, content, phones, emails });
        }

    }else if(request.command === "getNaverCafeInfo"){

        // iframe 내부에서만 실행됩니다.
        const title = document.querySelector('.title_area .title_text') ? document.querySelector('.title_area .title_text').textContent.trim() : '';
        const writer = document.querySelector('.nick_box') ? document.querySelector('.nick_box').innerText : '';
        const created_date = document.querySelector('.date') ? document.querySelector('.date').innerText.trim() : '';
        const content = document.querySelector('.article_viewer') ? document.querySelector('.article_viewer').innerText.trim() : '';
    
        console.log("title", title);
        console.log("writer", writer);
        console.log("created_date", created_date);
        console.log("content", content);

        if (title && writer && created_date && content) {
            let phones = []; // 전화번호를 저장할 배열
            let emails = []; // 이메일을 저장할 배열
        
            let match;
            while ((match = krphoneRegex.exec(content)) !== null) {
                phones.push(match[0]);
            }
            while ((match = emailRegex.exec(content)) !== null) {
                emails.push(match[0]);
            }
        
            console.log("title", title);
            console.log("writer", writer);
            console.log("created_date", created_date);
            console.log("content", content);
        
            sendResponse({ writer, created_date, title, content, phones, emails });
        }



    }else if(request.command === "getTelegram"){
        const note = document.querySelectorAll('.bubbles-date-group') ? document.querySelector('.bubbles-date-group').innerText : '';
        sendResponse({note})

    }else if(request.command === "getUrlValue"){
        //proxy 
        torurl = document.getElementById('foreverproxy-u').value;
        sendResponse({torurl})
    }

    return true;

}); 

// 하이라이팅
function highlightSelection(range) {
    const highlightSpan = document.createElement('span');
    highlightSpan.style.backgroundColor = 'pink'; // 하이라이팅 색상 설정
    highlightSpan.classList.add('highlighted-text'); // 필요한 경우 클래스 추가

    try {
        range.surroundContents(highlightSpan);
    } catch (e) {
        console.error('Error in highlighting:', e);
    }
}