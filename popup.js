// popup.js
import { openDB, STORE_NAME } from "./db.js";

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
        const gallery = document.querySelector('.gallery');
        images.forEach(imgSrc => {
            var img = document.createElement('img');
            img.src = imgSrc;
            gallery.appendChild(img);
        });
    };
});


var screenshotButton = document.getElementById('screenshotBtn');

screenshotButton.addEventListener('click', function () {
    chrome.runtime.sendMessage({ action: "captureVisibleTab" }, function (response) {
        if (response.imgSrc) {
            var img = document.createElement('img');
            img.src = response.imgSrc;
            // document.body.appendChild(img);

            // Append the image to the gallery
            document.querySelector('.gallery').appendChild(img);
        } else {
            console.error('Failed to capture the tab.');
        }
    });
});
