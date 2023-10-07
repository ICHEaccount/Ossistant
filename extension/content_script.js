function simulateSavePage() {
    var evt = new KeyboardEvent('keydown', {
        'keyCode': 83,
        'ctrlKey': true
    });
    document.dispatchEvent(evt);
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "simulateSavePage") {
        simulateSavePage();
    }
});
