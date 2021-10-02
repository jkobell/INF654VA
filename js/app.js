//check if navigator.serviceWorker is available
if ("serviceWorker" in navigator) {
    // wrap in event listener - load
    window.addEventListener("load", () => {
    // if available, register serviceWorker
      navigator.serviceWorker.register("/sw.js")
      .then((reg) => {
        // register successful
        console.log(`ServiceWorker registration successful with scope: ${reg.scope})`);
      })
      .catch((error) => {
        // register failed :(
        console.log(`ServiceWorker registration failed with: ${error})`);
      });
    });
}
  //register will fail if not over HTTPS - unless in a development environment
else{
    console.log("Service Worker not available!");
}
  