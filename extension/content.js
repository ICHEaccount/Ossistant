chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // if (request.command === "getTitle") {
    //     sendResponse({title: document.title});
    // }

    if (request.command === "getForumInfo") {
        // Post
        //const writer = document.querySelector('') ? document.querySelector('title').innerText : '';
        //const created_date = document.querySelector('title') ? document.querySelector('title').innerText : '';
        const title = document.querySelector('title') ? document.querySelector('title').innerText : '';
        //const content = document.querySelector('title') ? document.querySelector('title').innerText : '';
        
        //DarkUser
        const username = document.querySelector('.message-name .username') ? document.querySelector('.message-name .username').innerText : '';
        const userBanner = document.querySelector('.userBanner--premium') ? document.querySelector('.userBanner--premium').innerText : '';

        sendResponse({ title, username, userBanner });
    }
});
