const staticCache = "Static-Cache-V5";
const dynamicCache = "Dynamic-Cache-V5";

const staticAssets = [
    '/',
    "index.html",
    "manifest.json",
    "/pages/fallback.html",
    "/js/app.js",
    "/js/jquery-3.6.0.min.js",
    "/js/materialize.min.js",
    "/css/main.css",
    "/css/materialize.min.css",
    "/fonts/icon.css",
    "/images/homeIcon192.png",
    "/images/homeIcon512.png",
    "/images/trail_header01.jpg",
    "/images/trail_header2.jpg",
    "/favicon/favicon.ico",
    "/favicon/favicon1.gif"
   ];

//Limit Cache size
const limitCacheSize = (name, size) => {
    caches.open(name).then((cache) => {
        caches.keys().then((keys) => {
            if (keys.length > size) {
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    })
}   

self.addEventListener("install", function(event){
    //log the install fires event
    console.log(`serviceWorker install event fired: ${event.type}`);
    //creates cache if not exist
    event.waitUntil(caches.open(staticCache)
    .then(function(cache){
        console.log("serviceworker is precaching AppShell");
        //adding cache resources to Cache Storage as static resources
        return cache.addAll(staticAssets);
    }));
});


self.addEventListener("activate", function(event){
    //log the activate fires event
    //console.log(`serviceWorker activate event fired: ${event.type}`);
        event.waitUntil(caches.keys().then((keys) => {
            //console.log('Caches.Keys ', keys);
            return Promise.all(keys
                    .filter((key) => key !== staticCache && key !== dynamicCache)
                    .map((key) => caches.delete(key))
            );
        })
    );
});

//------------------
/* self.addEventListener("fetch", function(event){
    //log the fetch fires event when a resource is requested by browser
    console.log(`serviceWorker fetch event fired for resource: ${event.request.url}`);
    event.respondWith(fetch(event.request)
    .catch((error) => {
        // RespondWith failed :(
        console.log(`ServiceWorker event.RespondWith error: ${error})`);
      }));
    //request is the Key, response is the Value
    caches.match(event.request).then(function(response) {
      if (response){
          return response;
      } else {
          return fetch(event.request);
      }      
    });
    //optionally can use concise syntax
    //caches.match(event.request).then((response) => {
    //return response || fetch(event.request);
    //});
}); */

//----------------------------------
self.addEventListener("fetch", event => {
    console.log(`serviceWorker fetch event fired for resource: ${event.request.url}`);
    if (event.request.url.indexOf("firestore.googleapis.com") === -1) {
        event.respondWith(
            caches.match(event.request)
            .then(response => {
                if (response) {
                    console.log('Found ', event.request.url, ' in cache');
                    return response;
                }
                console.log('Network request for ', event.request.url);
                return fetch(event.request)
                .then(fetchRes => {
                    return caches.open(dynamicCache).then(cache => {
                    cache.put(event.request.url, fetchRes.clone());
                    limitCacheSize(dynamicCache, 25);
                    console.log('PUT a clone of ', event.request.url, ' in dynamic cache');
                    return fetchRes; 
                    })
                });
            })
            .catch(() => caches.match("../pages/fallback.html"))
            /* .catch(error => {
                console.log(`ServiceWorker event.RespondWith error: ${error})`);
            }) */
        );
        }
});