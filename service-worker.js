// service-worker.js

import { openDB, STORE_NAME } from "./db.js";

//// Screenshot Functionality
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "captureVisibleTab") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.captureVisibleTab(tabs[0].windowId, {}, async function (dataUrl) {
                try {
                    await addScreenshot(dataUrl);
                    sendResponse({ imgSrc: dataUrl });
                } catch (error) {
                    console.error('Failed to save screenshot:', error);
                    sendResponse({ error: 'Failed to save screenshot' });
                }
            });
        });
        return true;  // Required to use sendResponse asynchronously
    }
});

// Function to add a screenshot to the IndexedDB
async function addScreenshot(dataUrl) {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    store.add(dataUrl);
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
            resolve();
        };
        transaction.onerror = (event) => {
            reject(event.target.errorCode);
        };
    });
}
