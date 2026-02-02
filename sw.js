const CACHE_NAME = "mahjong-tenbo-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// インストール時に静的ファイルをキャッシュ
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // addAll だと1個失敗で全部失敗するので、1件ずつtryする
    await Promise.all(
      ASSETS.map(async (url) => {
        try {
          await cache.add(url);
        } catch (e) {
          console.warn("[SW] skip cache:", url, e);
        }
      })
    );

    self.skipWaiting();
  })());
});


// 古いキャッシュ削除
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
});

// 基本は「キャッシュ優先 → なければネット」
self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(res => res || fetch(req))
  );
});
