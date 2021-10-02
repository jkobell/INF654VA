
self.addEventListener('install', function(event){
    //log the install fires event
    console.log(`serviceWorker event fired: ${event.type}`);
});


self.addEventListener('activate', function(event){
    //log the activate fires event
    console.log(`serviceWorker event fired: ${event.type}`);
});

self.addEventListener('fetch', function(event){
    //log the fetch fires event when a resource is requested by browser
    console.log(`serviceWorker fetch event fired for resource: ${event.request.url}`);
    event.respondWith(fetch(event.request));
});