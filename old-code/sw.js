// self.addEventListener("install", e =>{
//     // console.log("Install!");
//     e.waitUntil(
//         caches.open("static").then(cache =>{
//             return cache.addAll(["./", "./src/style.css","./images/logo192.png","./images/logo512.png","./src/main.js"]);
//         })
//     );
// });


// self.addEventListener("fetch", e=>{
//     // console.log(`Intercepting fetch request for: ${e.request.url}`);
//     e.respondWith(
//         caches.match(e.request).then(response =>{
//             return response || fetch(e.request);
//         })
//     );
// });


var cacheName = 'MySaavnApp';
var filesToCache = [
  '/',
  '/index.html',
  './src/style.css',
  './images/logo192.png',
  './images/logo512.png',
  './src/main.js',
  './src/index.js'
];

/* Start the service worker and cache all of the app's content */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

/* Serve cached content when offline */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});