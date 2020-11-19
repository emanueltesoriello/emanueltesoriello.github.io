'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "c8f0e940527a1a88a5532c83c3a21082",
"assets/web/images/desktop_background.jpg": "19285d775ce8400f29ec5946e6f2c035",
"assets/web/images/logo.png": "9a7a49276fe46d5aa6245fb610ae8414",
"assets/web/images/background.jpg": "19285d775ce8400f29ec5946e6f2c035",
"assets/web/images/logo_white.png": "e603a1d272a9bdb155d5a9b4484fb1ca",
"assets/web/images/resetPassword.png": "8addf271497ee5d94fdc539ea0e4fe9f",
"assets/web/images/work_in_progress.png": "8a0805228a9b1b2f97ac1e606175e292",
"assets/web/icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"assets/web/icons/stats_purple.png": "28af9eac300bd4476c7df4bad78de6eb",
"assets/web/icons/shopping_chart_icon.png": "04917aa8d1ede78a0b3c1516ab1bd646",
"assets/web/icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"assets/packages/firebase_login/web/images/desktop_background.jpg": "a6c5c3b8d40d8b06015be3b5d834700f",
"assets/packages/firebase_login/web/images/logo.png": "e2f743f016a1697c13ff7c9bdbc34dce",
"assets/packages/firebase_login/web/icons/stats_purple.png": "28af9eac300bd4476c7df4bad78de6eb",
"assets/packages/firebase_login/web/icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"assets/packages/firebase_login/web/icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/AssetManifest.json": "2e30c2ca32e2bc5299827cdbfbb65add",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/NOTICES": "5a20b7ab0e649445b8a91479e9d3952e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"index.html": "ec6f959563caffe8f4842e6630435bdd",
"/": "ec6f959563caffe8f4842e6630435bdd",
"manifest.json": "63996c4547aa2cfe510cf4ebb31a5dcc",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/stats_purple.png": "28af9eac300bd4476c7df4bad78de6eb",
"icons/shopping_chart_icon.png": "04917aa8d1ede78a0b3c1516ab1bd646",
"images/desktop_background.jpg": "19285d775ce8400f29ec5946e6f2c035",
"images/logo.png": "9a7a49276fe46d5aa6245fb610ae8414",
"images/logo_white.png": "e603a1d272a9bdb155d5a9b4484fb1ca",
"images/background.jpg": "19285d775ce8400f29ec5946e6f2c035",
"images/work_in_progress.png": "8a0805228a9b1b2f97ac1e606175e292",
"images/resetPassword.png": "8addf271497ee5d94fdc539ea0e4fe9f"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list, skip the cache.
  if (!RESOURCES[key]) {
    return event.respondWith(fetch(event.request));
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    return self.skipWaiting();
  }
  if (event.message === 'downloadOffline') {
    downloadOffline();
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey in Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
