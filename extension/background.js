let globalCaseId = null;

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
        ...Object.values(keywordSubMenus).flat()
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
        let datalist = [];

        if (info.menuItemId === "xss.is"){
            chrome.tabs.sendMessage(tab.id, { command: "getForumInfo" }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    return;
                }
        
                let postData = {
                    label: "Post",
                    keyword: {
                        "writer": response.writer,
                        "created_date": convertDateFormat(response.created_date, 1),
                        "title": response.title,
                        "content": response.content,
                        "registered": response.registered
                    }
                };
                datalist.push(postData);
        
                let darkUserData = {
                    label: "DarkUser",
                    keyword: {
                        "username": response.username,
                        "rank": response.rank,
                        "regdate": convertDateFormat(response.regdate, 2),
                        "post_num": response.post_num,
                        "comment_num": response.comment_num
                    }
                };
                datalist.push(darkUserData);

                sendDataToServer2({ type: "1", case_id: globalCaseId, url: tab.url, data: datalist }).then(() => {
                    console.log('Data has been sent and datalist is now cleared.');
                }).catch(error => {
                    console.error('Failed to send data:', error);
                });
            });
        } else if(info.menuItemId === "naver blog"){
            chrome.tabs.sendMessage(tab.id, { command: "getNaverBlogInfo" }, function(response) {
                if (chrome.runtime.lastError) {
                    console.error("Error:", chrome.runtime.lastError.message);
                    return;
                }

                let postData = {
                    label: "Post",
                    keyword: {
                        "writer": response.writer,
                        "created_date": convertDateFormat(response.created_date, 3),
                        "title": response.title,
                        "content": response.content,
                        "registered": response.registered
                    }
                };

                datalist.push(postData);

                sendDataToServer2({ type: "1", case_id: globalCaseId, url: tab.url, data: datalist }).then(() => {
                    console.log('Data has been sent and datalist is now cleared.');
                }).catch(error => {
                    console.error('Failed to send data:', error);
                });
            });

        } else {
            let selectedText = info.selectionText;
            let siteUrl = tab.url;
        
            let data = { 
                case_id: globalCaseId,
                url: siteUrl };

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


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.caseId) {
        globalCaseId = request.caseId;
        sendResponse({status: "Case ID received: " + globalCaseId});
      }
      return true;
    }
  );


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
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error; 
    });
}

function sendDataToServer2(data) {
    fetch('http://127.0.0.1:5000/graph/ext/snapshot', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        return data;
    })
    .catch((error) => {
        console.error('Error:', error);
        throw error; 
    });
}

function convertDateFormat(dateTimeStr, type) {
    if (type == 1){
        const parts = dateTimeStr.split(' в ');
        const date = parts[0];
        let time = parts[1];
      
        const [day, month, year] = date.split('.');
        const formattedDate = `${year}-${month}-${day}`;
      
        if (!time.includes(':')) {
          time += ':00';
        }
      
        const timeParts = time.split(':');
        if (timeParts.length === 2) {
          time = `${time}:00`;
        }
    
        return `${formattedDate} ${time}`;
    }else if(type == 2){
        const [day, month, year] = dateTimeStr.split('.');
        const formattedDate = `${year}-${month}-${day}`;
        const time = '00:00:00';
        return `${formattedDate} ${time}`;
    }else if(type == 3){
        const parts = dateTimeStr.match(/(\d{4})\. (\d{1,2})\. (\d{1,2})\. (\d{1,2}):(\d{2})/);
        
        //우클릭 막아둔 경우 날짜값을 가져오지 못함, null 반환(ex. naver blog)
        if (parts === null) {
            return parts
        }
        
        const year = parts[1];
        const month = parts[2];
        const day = parts[3];
        const hours = parts[4];
        const minutes = parts[5];
    
        const date = new Date(year, month - 1, day, hours, minutes);
    
        // YYYY-mm-dd HH:MM:SS
        const formattedDate = 
            date.getFullYear() + "-" + 
            ("0" + (date.getMonth() + 1)).slice(-2) + "-" + 
            ("0" + date.getDate()).slice(-2) + " " + 
            ("0" + date.getHours()).slice(-2) + ":" + 
            ("0" + date.getMinutes()).slice(-2) + ":" + 
            "00"; 
    
        return formattedDate;
    }
}


