const testUrl = "http://13.209.168.47"
//const testUrl = "http://127.0.0.1"

let globalCaseId = null; //case_id

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
    const keywordMenus = ["SurfaceUser", "DarkUser", "Company", "Person", "Domain", "Post", "Comment", "Email", "Phone", "Wallet"];
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
        "SurfaceUser": ["username", "fake", "note"],
        "DarkUser": ["username", "rank", "regdate", "note"],
        "Company": ["name", "fake", "business_num", "phone_num", "note"],
        "Person": ["name", "fake", "note"],
        "Domain": ["domain", "regdate", "status", "note"],
        "Post": ["title", "writer", "content", "created_date", "post_type", "note"],
        "Comment": ["name", "content", "created_date", "note"],
        "Email": ["email", "fake", "note"],
        "Phone": ["number", "note"],
        "Message": ["sender", "content", "date", "note"],
        "Wallet": ["wallet", "wallet_type", "note"]
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
                id: parentMenu + "-" + subMenu
            });
        }
    }

    // Under snapshot
    const snapshotSubMenus = {
        "all": ["To be developed"],
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

        chrome.tabs.sendMessage(tab.id, { command: "getPageUrl" }, function(response) {
            const currentURL = response.url;

            if(info.menuItemId.includes("note")){
                chrome.tabs.sendMessage(tab.id, { command: "createNoteInput" }, function(response) {
                    noteValue = response.note;

                    let parts = info.menuItemId.split('-');
                    let parentMenu = parts[0];

                    let data = { 
                        case_id: globalCaseId,
                        url: currentURL,
                        label: parentMenu,
                        keyword: {"note": noteValue} };

                    //console.error("data", JSON.stringify(data));

                    sendDataToServer(data)
                });
            }else if (info.menuItemId === "xss.is"){
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

                    sendDataToServer2({ type: "1", case_id: globalCaseId, url: currentURL, data: datalist }).then(() => {
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

                    let formattedDate = convertDateFormat(response.created_date, 3);

                    let postData = {
                        label: "Post",
                        keyword: {
                            "writer": response.writer,
                            "title": response.title,
                            "content": response.content
                        }
                    };
                    
                    // convertDateFormat 함수가 null을 반환하지 않았다면, created_date를 추가합니다.
                    if (formattedDate !== null) {
                        postData.keyword.created_date = formattedDate;
                    }
                    
                    datalist.push(postData);

                    let SurfaceUserData = {
                        label: "SurfaceUser",
                        keyword: {
                            "username": response.writer
                        }
                    };

                    datalist.push(SurfaceUserData);

                    if (response.emails && Array.isArray(response.emails)) {
                        response.emails.forEach(emailAddress => {
                            let PhoneData = {
                                label: "Email",
                                keyword: {
                                    "email": emailAddress
                                }
                            };
                            datalist.push(PhoneData);
                        });
                    }

                    if (response.phones && Array.isArray(response.phones)) {
                        response.phones.forEach(phoneNumber => {
                            let PhoneData = {
                                label: "Phone",
                                keyword: {
                                    "number": phoneNumber
                                }
                            };
                            datalist.push(PhoneData);
                        });
                    }

                    sendDataToServer2({ type: "1", case_id: globalCaseId, url: currentURL, data: datalist }).then(() => {
                        console.log('Data has been sent and datalist is now cleared.');
                    }).catch(error => {
                        console.error('Failed to send data:', error);
                    });
                });
            } else if(info.menuItemId === "naver cafe"){
                chrome.tabs.sendMessage(tab.id, { command: "getNaverCafeInfo" }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error:", chrome.runtime.lastError.message);
                        return;
                    }

                    let formattedDate = convertDateFormat(response.created_date, 4);

                    let postData = {
                        label: "Post",
                        keyword: {
                            "writer": response.writer,
                            "title": response.title,
                            "content": response.content
                        }
                    };

                    // convertDateFormat 함수가 null을 반환하지 않았다면, created_date를 추가합니다.
                    if (formattedDate !== null) {
                        postData.keyword.created_date = formattedDate;
                    }

                    datalist.push(postData);
                    //console.error("date", JSON.stringify(postData))

                    let SurfaceUserData = {
                        label: "SurfaceUser",
                        keyword: {
                            "username": response.writer
                        }
                    };

                    datalist.push(SurfaceUserData);

                    if (response.emails && Array.isArray(response.emails)) {
                        response.emails.forEach(emailAddress => {
                            let PhoneData = {
                                label: "Email",
                                keyword: {
                                    "email": emailAddress
                                }
                            };
                            datalist.push(PhoneData);
                        });
                    }

                    if (response.phones && Array.isArray(response.phones)) {
                        response.phones.forEach(phoneNumber => {
                            let PhoneData = {
                                label: "Phone",
                                keyword: {
                                    "number": phoneNumber
                                }
                            };
                            datalist.push(PhoneData);
                        });
                    }

                    sendDataToServer2({ type: "1", case_id: globalCaseId, url: currentURL, data: datalist }).then(() => {
                        console.log('Data has been sent and datalist is now cleared.');
                    }).catch(error => {
                        console.error('Failed to send data:', error);
                    });
                });
            } else if(info.menuItemId === "telegram"){
                chrome.tabs.sendMessage(tab.id, { command: "getTelegram" }, function(response) {
                    if (chrome.runtime.lastError) {
                        console.error("Error:", chrome.runtime.lastError.message);
                        return;
                    }

                    //telegram username(@)
                    const atSymbolIndex = tab.url.indexOf('@');
                    const hashSymbolIndex = tab.url.indexOf('/#');
                    let extracted = '';
                    if (atSymbolIndex > hashSymbolIndex) {
                        extracted = tab.url.substring(atSymbolIndex);
                    }

                    let postData = {
                        label: "SurfaceUser",
                        keyword: {
                            "username": extracted,
                            "note": response.note
                        }
                    };

                    datalist.push(postData);

                    sendDataToServer2({ type: "1", case_id: globalCaseId, url: currentURL, data: datalist }).then(() => {
                        console.log('Data has been sent and datalist is now cleared.');
                    }).catch(error => {
                        console.error('Failed to send data:', error);
                    });
                });
            } else {
                console.error("hihi", noteValue); 
                let selectedText = info.selectionText;        
                let data = { 
                    case_id: globalCaseId,
                    url: currentURL };

                let parts = info.menuItemId.split('-');
                let parentMenu = parts[0];
                let subMenu = parts.slice(1).join('-');


                if (keywordMenus.includes(parentMenu)) {
                    // If the parentMenu is one of the top level keywordMenus
                    data.label = parentMenu;
                    data.keyword = { [subMenu]: selectedText };
                } else {
                    // Find the correct parentMenu for subMenus
                    parentMenu = Object.keys(keywordSubMenus).find(key => keywordSubMenus[key].includes(subMenu));
                    if (parentMenu) {
                        data.label = parentMenu;
                        data.keyword = { [subMenu]: selectedText };
                    }
                }

                if (data.label) {
                    sendDataToServer(data);
                }

            }

        });
        

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
    fetch(testUrl+':5000/graph/ext/create', {
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
    fetch(testUrl+':5000/graph/ext/snapshot', {
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
    if (type == 1) {
        const parts = dateTimeStr.split(' в ');
        if (parts.length !== 2) return null;

        const date = parts[0];
        let time = parts[1];

        const dateParts = date.split('.');
        if (dateParts.length !== 3) return null;

        const [day, month, year] = dateParts;
        const formattedDate = `${year}-${month}-${day}`;

        if (!time.includes(':')) {
            time += ':00';
        }

        const timeParts = time.split(':');
        if (timeParts.length === 2) {
            time = `${time}:00`;
        }

        return `${formattedDate} ${time}`;
    } else if (type == 2) {
        const dateParts = dateTimeStr.split('.');
        if (dateParts.length !== 3) return null;

        const [day, month, year] = dateParts;
        const formattedDate = `${year}-${month}-${day}`;
        const time = '00:00:00';
        return `${formattedDate} ${time}`;
    } else if (type == 3) {
        const regex = /(\d{4})\. (\d{1,2})\. (\d{1,2}). (\d{1,2}):(\d{2})/;
        const parts = dateTimeStr.match(regex);
        if (!parts) return null;

        const year = parts[1];
        const month = parts[2];
        const day = parts[3];
        const hours = parts[4];
        const minutes = parts[5];

        const date = new Date(year, month - 1, day, hours, minutes);

        const formattedDate =
            date.getFullYear() + "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + " " +
            ("0" + date.getHours()).slice(-2) + ":" +
            ("0" + date.getMinutes()).slice(-2) + ":" +
            "00";

        return formattedDate;
    }else if (type == 4) {
        const regex = /(\d{4})\.(\d{1,2})\.(\d{1,2}). (\d{1,2}):(\d{2})/;
        const parts = dateTimeStr.match(regex);
        if (!parts) return null;

        const year = parts[1];
        const month = parts[2];
        const day = parts[3];
        const hours = parts[4];
        const minutes = parts[5];

        const date = new Date(year, month - 1, day, hours, minutes);

        const formattedDate =
            date.getFullYear() + "-" +
            ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
            ("0" + date.getDate()).slice(-2) + " " +
            ("0" + date.getHours()).slice(-2) + ":" +
            ("0" + date.getMinutes()).slice(-2) + ":" +
            "00";

        return formattedDate;
    }

    return null;
}