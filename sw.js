/**
 * sw.js — العمل بدون إنترنت
 *  - ملفات التطبيق: تُحفظ عند أول تشغيل وتُقدَّم من الذاكرة فوراً ثم تُحدَّث في الخلفية.
 *  - الخط (Google Fonts) ومكتبة Excel (cdnjs): تُحفظ عند أول استخدام.
 *  - غيّر VERSION عند نشر تحديث لإجبار المتصفحات على تنزيل الملفات الجديدة.
 */
const VERSION = 'aqsati-v1.1';
const SHELL = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "style.css",
  "logo.js",
  "01-core.js",
  "02-ui.js",
  "03-pages.js",
  "04-receipts.js",
  "05-payments.js",
  "06-home.js",
  "07-installments.js",
  "08-settings.js",
  "09-debts-form.js",
  "10-backup.js",
  "11-lists.js",
  "12-backup-io.js",
  "13-search.js",
  "14-pin.js",
  "15-filters.js",
  "16-tiles.js",
  "17-i18n.js",
  "18-backup-text.js",
  "animations.js",
  "19-app.js",
  "pwa.js",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png"
];
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(SHELL.map((u) => c.add(u).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === location.origin;
  if (!same && !CDN_HOSTS.includes(url.hostname)) return;

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const nav = req.mode === 'navigate';
    const hit = (await cache.match(req, { ignoreSearch: nav })) || (nav ? await cache.match('index.html') : undefined);
    const net = fetch(req)
      .then((r) => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; })
      .catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || new Response('', { status: 504, statusText: 'Offline' });
  })());
});
