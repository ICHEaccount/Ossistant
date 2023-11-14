chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

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

        const registered = [];
        console.log("title", title)
        console.log("writer", writer);
        console.log("created_date", created_date);
        console.log("content", content);
        let match;
        while ((match = krphoneRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }
        while ((match = emailRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }

        sendResponse({writer, created_date, title, content, registered})
    
    }else if(request.command === "getNaverCafeInfo"){

        if (window.top !== window.self) {
            // iframe 내부에서만 실행됩니다.
            const title = document.querySelector('.title_area .title_text') ? document.querySelector('.title_area .title_text').textContent.trim() : '';
            const writer = document.querySelector('.nick_box') ? document.querySelector('.nick_box').innerText : '';
            const created_date = document.querySelector('.date') ? document.querySelector('.date').innerText.trim() : '';
            const content = document.querySelector('.article_viewer') ? document.querySelector('.article_viewer').innerText.trim() : '';
        
            console.log("title", title);
            console.log("writer", writer);
            console.log("created_date", created_date);
            console.log("content", content);

            let phones = []; // 전화번호를 저장할 배열
            let emails = []; // 이메일을 저장할 배열
        
            let match;
            while ((match = krphoneRegex.exec(content)) !== null) {
                phones.push(match[0]);
            }
            while ((match = emailRegex.exec(content)) !== null) {
                emails.push(match[0]);
            }
    
            sendResponse({writer, created_date, title, content, phones, emails})
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