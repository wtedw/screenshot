// popup.js
import { openDB, clearScreenshots, STORE_NAME } from "./db.js";

document.addEventListener('DOMContentLoaded', async function () {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onerror = (event) => {
        console.error('Failed to retrieve screenshots:', event.target.errorCode);
    };

    request.onsuccess = (event) => {
        const images = event.target.result;
        const gallery = document.getElementById('gallery');
        images.forEach(imgSrc => {
            var img = document.createElement('img');
            img.src = imgSrc;
            gallery.appendChild(img);
        });
    };
});

var galleryDiv = document.getElementById('gallery');
var screenshotButton = document.getElementById('screenshotBtn');
var newSessionButton = document.getElementById('newSessionBtn');

screenshotButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "captureVisibleTab" }, function (response) {
        if (response.imgSrc) {
            var img = document.createElement('img');
            img.src = response.imgSrc;
            // document.body.appendChild(img);

            // Append the image to the gallery
            document.getElementById('gallery').appendChild(img);
        } else {
            console.error('Failed to capture the tab.');
        }
    });
});


newSessionButton.addEventListener('click', function() {
    // Clear all images in the gallery
    while (galleryDiv.firstChild) {
        galleryDiv.removeChild(galleryDiv.firstChild);
    }

    // Call the clearAllScreenshots function to clear IndexedDB
    clearScreenshots().then(() => {
        console.log('Gallery and database cleared successfully.');
    }).catch(error => {
        console.error('Failed to clear database:', error);
    });
});