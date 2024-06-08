// utils.js

const dbName = "screenshotsDB";
const STORE_NAME = "screenshots";

// Function to open a connection to the IndexedDB
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, 1);

        request.onerror = (event) => {
            console.error('Database error:', event.target.errorCode);
            reject(event.target.errorCode);
        };

        request.onupgradeneeded = (event) => {
            let db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result);
        };
    });
}

// Function to clear all screenshots from the store
function clearScreenshots() {
    return new Promise((resolve, reject) => {
        openDB().then(db => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const clearRequest = store.clear();

            clearRequest.onsuccess = () => {
                console.log('All screenshots have been deleted.');
                resolve();
            };

            clearRequest.onerror = (event) => {
                console.error('Error clearing the store:', event.target.errorCode);
                reject(event.target.errorCode);
            };

            transaction.oncomplete = () => {
                db.close();
            };
        }).catch(error => {
            reject(error);
        });
    });
}

// Export the openDB function so it can be imported by other scripts
export { openDB, clearScreenshots, STORE_NAME };
