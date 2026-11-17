const CACHE_NAME = 'pig-food-app-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// 安装：预缓存 + 跳过等待，新版本直接激活
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

// 激活：删掉旧缓存，立刻接管页面
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  return self.clients.claim();
});

// 核心策略：优先联网，网络打不开才用缓存（解决更新不刷新！）
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  )
});
