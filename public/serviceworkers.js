const files = [
    "/", 
    "/index.html",
    "/index.js",
    "/offlinedb.js",
    "/styles.css"
];

const cachename = "static-cache-v1";
const datacachename = "data-cache-v1";

self.addEventListener("install", e => {
    e.waitUntil(caches
        .open(cachename)
        .then(cache => {
            return cache.addall(files);
        })
        .catch(error=>{
            console.log(error)
        })
    )
    self.skipWaiting();

})

self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys()
        .then(keylist=>{
            return Promise.all(
                keylist.map(key=>{
                    if (key!==cachename && key !==datacachename) {
                        return caches.delete(key);
                    }
                })
            )
        })
        
    )
    self.clients.claim();
    
})

self.addEventListener("fetch", e => {
   if (e.request.url.includes("/api/")) {
       e.respondWith(
           caches.open(datacachename)
           .then(cache => {
               return fetch(e.request)
                    .then(response => {
                        if (response === 200) {
                            cache.put(e.request.url,  response.clone());
                        }
                        return response;
                    })
                    .catch(error =>{
                        return cache.match(e.request);
                    })
           })
       )
   } else {
       e.respondWith(
           caches.open(cachename)
           .then(cache => {
               return cache.match(e.request)
                    .then(response = {
                        return response || fetch (e.request);
                    })
           })
       )
   }
    
})