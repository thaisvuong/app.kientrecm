/* Service worker của trang vỏ Kiến Trẻ CM: nhận thông báo đẩy (Web Push) & mở đúng trang khi bấm.
   Máy chủ gửi push không nội dung → hỏi app thông báo mới nhất của máy này rồi hiện lên. */
const APP = 'https://script.google.com/macros/s/AKfycbxKXWv9Jg4KnV2ydW9tXWEsZsJIy1Ai07aHrY-cqF1i0t-RYl7xEcjsv2HuNtLC_7c/exec';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  e.waitUntil((async () => {
    let d = { title: 'Kiến Trẻ CM', body: 'Bạn có thông báo mới', route: '', unread: 0 };
    try {
      if (e.data) { try { d = Object.assign(d, e.data.json()); } catch (x) { d.body = e.data.text(); } }
      else {
        const sub = await self.registration.pushManager.getSubscription();
        if (sub) { const r = await fetch(APP + '?push=1&ep=' + encodeURIComponent(sub.endpoint), { cache: 'no-store' }); const j = await r.json(); if (j && j.title) d = Object.assign(d, j); }
      }
    } catch (x) {}
    try { if (self.navigator.setAppBadge) d.unread ? await self.navigator.setAppBadge(d.unread) : await self.navigator.clearAppBadge(); } catch (x) {}
    await self.registration.showNotification(d.title, { body: d.body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: d.tag || 'kgs', renotify: true, data: { route: d.route || '' } });
  })());
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const route = e.notification.data && e.notification.data.route, url = new URL('./' + (route ? '?page=' + encodeURIComponent(route) : ''), self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(ws => {
    for (const w of ws) { if (w.url.indexOf(self.registration.scope) === 0) { return (w.navigate ? w.navigate(url) : Promise.resolve(w)).then(x => (x || w).focus()); } }
    return self.clients.openWindow(url);
  }));
});
