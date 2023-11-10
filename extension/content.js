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
        const writer = document.querySelectorAll('.nick .link .pcol2')? document.querySelectorAll('.nick .link .pcol2').innerText : '';
        const created_date = document.querySelectorAll('.se_publishDate.pcol2') ? document.querySelectorAll('.se_publishDate.pcol2').innerText.trim() : '';
        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
        const content = document.querySelectorAll('.se-main-container') ? document.querySelectorAll('.se-main-container').innerText.trim() : '';
        const registered = [];
        
        let match;
        while ((match = krphoneRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }
        while ((match = emailRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }

        sendResponse({writer, created_date, title, content, registered})
    }else if(request.command === "getNaverCafeInfo"){
        const writer = document.querySelector('.nick_box') ? document.querySelector('.nick_box').innerText : '';
        const created_date = document.querySelector('.date') ? document.querySelector('.date').innerText.trim() : '';
        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
        const content = document.querySelector('.ContentRenderer') ? document.querySelector('.ContentRenderer').innerText.trim() : '';
        const registered = [];
        
        let match;
        while ((match = krphoneRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }
        while ((match = emailRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }

        sendResponse({username, created_date, title, content, registered})
    }else if(request.command === "getTelegram"){
        const note = document.querySelectorAll('.bubbles-date-group') ? document.querySelector('.bubbles-date-group').innerText : '';
        sendResponse({note})
    }else if(request.command === "getUrlValue"){
        torurl = document.getElementById('foreverproxy-u').value;
        sendResponse({torurl})
    }

}); 