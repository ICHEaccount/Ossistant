chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

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
        const writer = document.querySelector('.nick') ? document.querySelector('.nick').innerText : '';
        const created_date = document.querySelector('.se_publishDate.pcol2') ? document.querySelector('.se_publishDate.pcol2').innerText.trim() : 'why';
        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
        const content = document.querySelector('.se-main-container') ? document.querySelector('.se-main-container').innerText.trim() : '';
        const registered = [];
        const krphoneRegex = /01[016789]-\d{3,4}-\d{4}/g;
        const emailRegex = /[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        
        let match;
        while ((match = krphoneRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }
        while ((match = emailRegex.exec(content)) !== null) {
            registered.push(match[0]);
        }

        sendResponse({writer, created_date, title, content, registered})
    }
}); 