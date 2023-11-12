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
        // 첫 번째 요소의 innerText만 사용
        //const writerElements = document.querySelectorAll('.nick .link .pcol2');
        //const writer = writerElements.length > 0 ? writerElements[0].innerText : '';
        const writer = document.querySelector('.writer .nick')? document.querySelector('.writer .nick').innerText : '';

        const createDateElements = document.querySelectorAll('.se_publishDate.pcol2');
        const created_date = createDateElements.length > 0 ? createDateElements[0].innerText.trim() : '';

        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';

        const contentElements = document.querySelectorAll('.se-main-container');
        const content = contentElements.length > 0 ? contentElements[0].innerText.trim() : '';

        const registered = [];

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
        const title = document.querySelector('title') ? document.querySelector('title').textContent.trim() : '';
        const writer = document.querySelector('.nick_box') ? document.querySelector('.nick_box').innerText : '';
        
        const created_date = document.querySelector('.date') ? document.querySelector('.date').innerText.trim() : '';

        const content = document.querySelector('.article_viewer') ? document.querySelector('.article_viewer').innerText.trim() : '';
        
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