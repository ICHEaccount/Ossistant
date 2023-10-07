chrome.runtime.onInstalled.addListener(() => {
    // 상위 메뉴 항목들 생성
    const topMenus = ["keyword", "etc", "snapshot", "layout", "SNS parser"];
    for (let menu of topMenus) {
        chrome.contextMenus.create({
            title: menu,
            contexts: ["selection"],
            id: menu
        });
    }

    // keyword 하위 메뉴 항목들 생성
    const keywordMenus = ["company", "person", "sns", "social"];
    for (let menu of keywordMenus) {
        chrome.contextMenus.create({
            title: menu,
            parentId: "keyword",
            contexts: ["selection"],
            id: menu
        });
    }

    // 각 keyword 하위 메뉴의 더 깊은 하위 항목들 생성
    const keywordSubMenus = {
        "company": ["name", "domain", "number"],
        "person": ["name", "phone#"],
        "sns": ["id", "nickname"],
        "social": ["name", "comment"]
    };

    for (let menu in keywordSubMenus) {
        for (let submenu of keywordSubMenus[menu]) {
            chrome.contextMenus.create({
                title: submenu,
                parentId: menu,
                contexts: ["selection"],
                id: `${menu}_${submenu}`
            });
        }
    }
});

// context menu 항목이 클릭되었을 때 실행되는 리스너입니다.
chrome.contextMenus.onClicked.addListener((info, tab) => {
    const selectedText = info.selectionText;
    const data = {};

    // 선택된 서브메뉴의 id와 함께 선택한 텍스트를 서버로 전송
    const validIds = [
        "company_name", "company_domain", "company_number",
        "person_name", "person_phone#",
        "sns_id", "sns_nickname",
        "social_name", "social_comment"
    ];

    if (validIds.includes(info.menuItemId)) {
        data[info.menuItemId] = selectedText;

        // 서버로 데이터 전송
        fetch('http://127.0.0.1:5000/test', {
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

chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "snapshot") {
        chrome.tabs.sendMessage(tab.id, { action: "simulateSavePage" });
    }
});
