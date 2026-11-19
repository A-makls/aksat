/**
 * pwa.js — تسجيل الـ Service Worker (يعمل فقط عند التشغيل عبر http/https وليس file://)
 */
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
