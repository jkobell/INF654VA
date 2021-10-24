const staticAssets = [
 '/',
 "/index.html",
 "/pages/about.html",
 "/pages/first-aid.html",
 "/pages/navigation.html",
 "/js/app.js",
 "/js/jquery-3.6.0.min.js",
 "/js/materialize.min.js",
 "/css/main.css",
 "/css/materialize.min.css",
 "/fonts/icon.css",
 "/images/about_page.png",
 "/images/about1.jpg",
 "/images/about2.jpg",
 "/images/homeIcon192.png",
 "/images/homeIcon512.png",
 "/images/trail_header0.jpg",
 "/images/trail_header00.jpg",
 "/images/trail_header1.jpg",
 "/images/trail_header01.jpg",
 "/images/trail_header2.jpg",
];

self.addEventListener("install", function(event){
    //log the install fires event
    console.log(`serviceWorker event fired: ${event.type}`);
    //creates cache if not exist
    event.waitUntil(caches.open("static")
    .then(function(cache){
        console.log("serviceworker is precaching AppShell");
        //adding cache resources to Cache Storage as static resources
        cache.addAll(staticAssets);
    }));
});


self.addEventListener("activate", function(event){
    //log the activate fires event
    console.log(`serviceWorker event fired: ${event.type}`);
});

self.addEventListener("fetch", function(event){
    //log the fetch fires event when a resource is requested by browser
    //console.log(`serviceWorker fetch event fired for resource: ${event.request.url}`);
    event.respondWith(fetch(event.request)
    .catch((error) => {
        // register failed :(
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
});