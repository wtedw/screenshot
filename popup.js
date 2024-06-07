// popup.js
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
