// background.js or service-worker.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Receive message')
    if (request.action === "captureVisibleTab") {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.captureVisibleTab(tabs[0].windowId, {}, function(dataUrl) {
                sendResponse({imgSrc: dataUrl});
            });
        });
        return true;  // Required to use sendResponse asynchronously
    }
});
