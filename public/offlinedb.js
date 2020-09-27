let offlinedb;

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    offlinedb = event.target.result;
    offlinedb.createObjectStore("pending", {autoIncrement: true});
}

request.onsuccess = function(event) {
    offlinedb = event.target.result;
    if (navigator.onLine) {
        checkOnlineDatabase();
    }
}

request.onerror = function(event) {
    
    console.log(event.target.errorcode);
}

function saveRecord(record) {
    const transaction = offlinedb.transaction(["pending"], "readwrite");
    const objectstore  = transaction.objectStore("pending");
    objectstore.add(record);
}

function checkOnlineDatabase() {
    const transaction = offlinedb.transaction(["pending"], "readwrite");
    const objectstore  = transaction.objectStore("pending");
    const getAll = objectstore.getAll();
    getAll.onsuccess = function() {
        if (getAll.result.length > 0){
            fetch ("/api/transaction/bulk", {
                method: "post", 
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*", "Content-Type": "application/json"
                }
            })
            .then(response  =>  response.json().then(() =>{
                const transaction = offlinedb.transaction(["pending"], "readwrite");
                const objectstore  = transaction.objectStore("pending");
                objectstore.clear();
            }))
        }
    }
}
window.addEventListener("online", checkOnlineDatabase);