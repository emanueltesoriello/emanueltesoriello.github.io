'use strict';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "index.html": "b3b60ac7483d6dac855f064ed7d5a69e",
"/": "b3b60ac7483d6dac855f064ed7d5a69e",
"images/signin_image.jpg": "04181ad2157e038242875b1112036dac",
"main.dart.js": "06f6747597aa7b7a50e475f243e9bd42",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/login_signup_btn_icon.png": "9c87f723ba1143aab0ef00fb47a3fa88",
"icons/google_icon.png": "cc94506823ea13c17d20148ea85aa28b",
"icons/Icon-192.png": "7c2e506152d0435457d84afbde8c54ad",
"icons/hide_password.png": "e268ba31ef5d6214da52b7c792acdca2",
"icons/logo.png": "7c2e506152d0435457d84afbde8c54ad",
"icons/logout_icon.png": "738b061ee6f54165eec7245930bcf630",
"icons/show_password.png": "1e79d34c1b0ab6812bf6f676c677ff79",
"icons/Icon-512.png": "7c2e506152d0435457d84afbde8c54ad",
"manifest.json": "4afb6f38521fc6ca9ca42364a0b7fd0a",
"assets/LICENSE": "e9b4cd468d517d00909ce2479af25a07",
"assets/web/images/signin_image.jpg": "04181ad2157e038242875b1112036dac",
"assets/web/icons/login_signup_btn_icon.png": "9c87f723ba1143aab0ef00fb47a3fa88",
"assets/web/icons/google_icon.png": "cc94506823ea13c17d20148ea85aa28b",
"assets/web/icons/Icon-192.png": "7c2e506152d0435457d84afbde8c54ad",
"assets/web/icons/hide_password.png": "e268ba31ef5d6214da52b7c792acdca2",
"assets/web/icons/logo.png": "7c2e506152d0435457d84afbde8c54ad",
"assets/web/icons/logout_icon.png": "738b061ee6f54165eec7245930bcf630",
"assets/web/icons/show_password.png": "1e79d34c1b0ab6812bf6f676c677ff79",
"assets/web/icons/Icon-512.png": "7c2e506152d0435457d84afbde8c54ad",
"assets/AssetManifest.json": "3e32c72f554702d947e2413a1aca44e3",
"assets/FontManifest.json": "01700ba55b08a6141f33e168c4a6c22f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "115e937bb829a890521f72d2e664b632",
"assets/fonts/MaterialIcons-Regular.ttf": "56d3ffdef7a25659eab6a68a3fbfaf16"
};

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheName) {
      return caches.delete(cacheName);
    }).then(function (_) {
      return caches.open(CACHE_NAME);
    }).then(function (cache) {
      return cache.addAll(Object.keys(RESOURCES));
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
