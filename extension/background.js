chrome.runtime.onInstalled.addListener(() => {

    const keepAlive = () => setInterval(chrome.runtime.getPlatformInfo, 20e3);
    chrome.runtime.onStartup.addListener(keepAlive);
    keepAlive();

    // extension functions
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
    const snapshotSubMenus = ["all", "layout"];
    for (let menu of snapshotSubMenus) {
        chrome.contextMenus.create({
            title: menu,
            parentId: "take snapshot",  // Set the parent Id
            contexts: ["selection"],
            id: menu
        });
    }

    // Under 'using SNS parser'
    chrome.contextMenus.create({
        title: "telegram",
        parentId: "using SNS parser",  // Set the parent Id
        contexts: ["selection"],
        id: "telegram"
    });

    // under keyword
    const keywordSubMenus = {
        "Domain": ["domain", "regdate", "status"],
        "SurfaceUser": ["username", "fake"],
        "Post": ["url", "title", "writer", "content", "creatd_date", "post_type"]
    };

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

    const validIds = [...keywordMenus, ...Object.values(keywordSubMenus).flat()];

    // context menu listener
    chrome.contextMenus.onClicked.addListener((info, tab) => {

        const selectedText = info.selectionText;
        const siteUrl = tab.url;

        let data = { url: siteUrl };
        if (keywordMenus.includes(info.menuItemId)) {
            data.label = info.menuItemId;
            data.keyword = {};  
        } else if (validIds.includes(info.menuItemId)) {
            // search top keyword
            const parentMenu = Object.keys(keywordSubMenus).find(key => keywordSubMenus[key].includes(info.menuItemId));
            
            data.label = parentMenu;
            data.keyword = {
                [info.menuItemId]: selectedText
            };
        }

        if (data.label) {
            // data to server
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
    });
});
