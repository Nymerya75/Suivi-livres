const CACHE='suivi-livres-pwa-v3';
const CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/') || url.pathname.endsWith('/index.html')){
    e.respondWith(fetch(e.request).then(r=>{
      const copy=r.clone(); caches.open(CACHE).then(c=>c.put('./index.html',copy)); return r;
    }).catch(()=>caches.match('./index.html')));
  } else {
    e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request)));
  }
});