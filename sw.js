/**
 * sw.js — العمل بدون إنترنت
 *  - ملفات التطبيق: تُحفظ عند أول تشغيل وتُقدَّم من الذاكرة فوراً ثم تُحدَّث في الخلفية.
 *  - الخط (Google Fonts) ومكتبة Excel (cdnjs): تُحفظ عند أول استخدام.
 *  - غيّر VERSION عند نشر تحديث لإجبار المتصفحات على تنزيل الملفات الجديدة.
 *  - Safari يرفض أي استجابة يقدّمها الـ Service Worker وفيها إعادة توجيه (redirected)،
 *    ومنصة الاستضافة تحوّل /index.html إلى / ، لذلك تُنظَّف كل استجابة بـ clean() قبل حفظها أو تقديمها.
 */
async function clean(r) {
  if (!r || !r.redirected) return r;
  const b = await r.blob();
  return new Response(b, { status: r.status, statusText: r.statusText, headers: r.headers });
}
const VERSION = 'aqsati-v2.4';
const SHELL = [
  "./",
  "manifest.webmanifest",
  "license.js",
  "license-config.js",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png"
];
const CDN_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com', 'cdnjs.cloudflare.com'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSION)
      .then((c) => Promise.all(SHELL.map((u) => fetch(u, { cache: 'reload' }).then(clean).then((r) => { if (r && r.ok) return c.put(u, r); }).catch(() => {}))))
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

  if (same && /\/(license-config\.js|license\.js|admin\.html)$/.test(url.pathname)) {
    e.respondWith(fetch(req)
      .then(clean)
      .then((r) => { if (r && r.ok) { const c = r.clone(); caches.open(VERSION).then((ch) => ch.put(req, c)); } return r; })
      .catch(async () => (await caches.match(req)) || new Response('', { status: 504, statusText: 'Offline' })));
    return;
  }

  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const nav = req.mode === 'navigate';
    const hit = await cache.match(req, { ignoreSearch: nav });
    const net = fetch(req)
      .then(clean)
      .then((r) => { if (r && (r.ok || r.type === 'opaque')) cache.put(req, r.clone()); return r; })
      .catch(() => null);
    if (hit) { e.waitUntil(net); return clean(hit); }
    const r = await net;
    if (r) return r;
    return (nav ? await cache.match('./') : null) || new Response('', { status: 504, statusText: 'Offline' });
  })());
});
