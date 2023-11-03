chrome.runtime.onInstalled.addListener(() => {
    // Keep-alive function for the extension
    const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
    chrome.runtime.onStartup.addListener(keepAlive);
    keepAlive();

    // Create top level context menus
    const topMenus = ["collect clue", "store memo", "take snapshot", "using SNS parser"];
    for (let menu of topMenus) {
        chrome.contextMenus.create({
            title: menu,
            contexts: ["selection"],
            id: menu
        });
    }

    // Under 'collect clue'
    const keywordMenus = ["Domain", "SurfaceUser", "Post"];
    for (let menu of keywordMenus) {
        chrome.contextMenus.create({
            title: menu,
            parentId: "collect clue",
            contexts: ["selection"],
            id: menu
        });
    }

    // Under 'take snapshot'
    const snapshotMenus = ["all", "layout"];
    for (let menu of snapshotMenus) {
        chrome.contextMenus.create({
            title: menu,
            parentId: "take snapshot",
            contexts: ["selection"],
            id: menu
        });
    }

    // Under 'using SNS parser'
    chrome.contextMenus.create({
        title: "telegram",
        parentId: "using SNS parser",
        contexts: ["selection"],
        id: "telegram"
    });

    // Under keyword
    const keywordSubMenus = {
        "Domain": ["domain", "regdate", "status"],
        "SurfaceUser": ["username", "fake"],
        "Post": ["url", "title", "writer", "content", "creatd_date", "post_type"]
    };

    const validIds = keywordMenus.concat(
        ...Object.values(keywordSubMenus).map(subMenuArray => subMenuArray)
    );

    for (let parentMenu in keywordSubMenus) {
        for (let subMenu of keywordSubMenus[parentMenu]) {
            chrome.contextMenus.create({
                title: subMenu,
                parentId: parentMenu,
                contexts: ["selection"],
                id: subMenu
            });
        }
    }

    // Under snapshot
    const snapshotSubMenus = {
        "all": ["null"],
        "layout": ["xss.is", "naver blog", "naver cafe"]
    };

    for (let parentMenu in snapshotSubMenus) {
        for (let subMenu of snapshotSubMenus[parentMenu]) {
            chrome.contextMenus.create({
                title: subMenu,
                parentId: parentMenu,
                contexts: ["selection"],
                id: subMenu
            });
        }
    }

    // Context menu click listener
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (["xss.is", "naver blog", "naver cafe"].includes(info.menuItemId)) {
            chrome.tabs.sendMessage(tab.id, { command: "getForumInfo" }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    return;
                }
    
                let postData = {
                    url: tab.url,
                    label: "Post",
                    keyword: {
                        "writer": response.writer,
                        "created_date": response.create_date,
                        "title": response.title,
                        "content": response.content
                    }
                };
                sendDataToServer(postData);
    
                let darkUserData = {
                    url: tab.url,
                    label: "DarkUser",
                    keyword: {
                        "username": response.username,
                        "rank": response.userBanner,
                        "regdate": response.regdate,
                        "post_num": response.post_num,
                        "comment_num": response.comment_num
                    }
                };
                sendDataToServer(darkUserData);
            });
        } else {
            let selectedText = info.selectionText;
            let siteUrl = tab.url;
        
            let data = { url: siteUrl };

            if (keywordMenus.includes(info.menuItemId)) {
                data.label = info.menuItemId;
                data.keyword = {};  
            } else if (validIds.includes(info.menuItemId)) {
                const parentMenu = Object.keys(keywordSubMenus).find(key => keywordSubMenus[key].includes(info.menuItemId));
                data.label = parentMenu;
                data.keyword = {
                    [info.menuItemId]: selectedText
                };
            }

            if (data.label) {
                sendDataToServer(data);
            }
        }
    });
});

// Helper function to send data to the server
function sendDataToServer(data) {
    fetch('http://127.0.0.1:5000/graph/ext/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
