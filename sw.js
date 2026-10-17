/* Service worker của Kiến Trẻ (kientre-internal.click)
   1. MỞ TỨC THÌ: mọi lần mở trang app (kể cả đường dẫn sâu /tasks/plan…) trả ngay bản giao diện đã cất trên máy, đồng thời tải ngầm bản mới
      cho lần mở sau (stale-while-revalidate). Lần đầu trên máy chưa có bản cất → tải từ mạng như bình thường.
   2. THÔNG BÁO ĐẨY: nhận push → hỏi máy chủ thông báo mới nhất rồi hiện; bấm thông báo mở đúng trang. */
const APP = 'https://script.google.com/macros/s/AKfycbxKXWv9Jg4KnV2ydW9tXWEsZsJIy1Ai07aHrY-cqF1i0t-RYl7xEcjsv2HuNtLC_7c/exec';
const CACHE = 'kt-app-mvcmg9ty';
const SHELL = '/index.html';
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(CACHE).then(c => c.add(new Request(SHELL, { cache: 'no-cache' }))).catch(() => {})); });
self.addEventListener('activate', e => e.waitUntil((async () => {
  const keys = await caches.keys(); await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET' || r.mode !== 'navigate') return;
  const u = new URL(r.url); if (u.origin !== location.origin || /^\/(s\/|share\.html)/.test(u.pathname)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE), hit = await c.match(SHELL);
    const net = fetch(SHELL, { cache: 'no-cache' }).then(res => { if (res.ok) c.put(SHELL, res.clone()); return res; });
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    try { return await net; } catch (x) { return fetch(r); }
  })());
});
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let d = { title: 'Kiến Trẻ', body: 'Bạn có thông báo mới', route: '', unread: 0 };
    try {
      if (e.data) { try { d = Object.assign(d, e.data.json()); } catch (x) { d.body = e.data.text(); } }
      else {
        const sub = await self.registration.pushManager.getSubscription();
        if (sub) { const r = await fetch(APP + '?push=1&ep=' + encodeURIComponent(sub.endpoint), { cache: 'no-store' }); const j = await r.json(); if (j && j.title) d = Object.assign(d, j); }
      }
    } catch (x) {}
    try { if (self.navigator.setAppBadge) d.unread ? await self.navigator.setAppBadge(d.unread) : await self.navigator.clearAppBadge(); } catch (x) {}
    await self.registration.showNotification(d.title, { body: d.body, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png', tag: d.tag || 'kgs', renotify: true, data: { route: d.route || '' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const route = e.notification.data && e.notification.data.route, url = new URL('/' + (route ? '?page=' + encodeURIComponent(route) : ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if (w.url.indexOf(self.registration.scope) === 0) { return (w.navigate ? w.navigate(url) : Promise.resolve(w)).then(x => (x || w).focus()); } }
    return self.clients.openWindow(url);
  }));
});
