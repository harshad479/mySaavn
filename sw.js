self.addEventListener("install", e =>{
    // console.log("Install!");
    e.waitUntil(
        caches.open("static").then(cache =>{
            return cache.addAll(["./", "./src/style.css","./images/logo192.png","./images/logo512.png","./src/main.js"]);
        })
    );
});


self.addEventListener("fetch", e=>{
    // console.log(`Intercepting fetch request for: ${e.request.url}`);
    e.respondWith(
        caches.match(e.request).then(response =>{
            return response || fetch(e.request);
        })
    );
});