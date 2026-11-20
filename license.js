(function () {

  // ===== بطاقة حالة الاشتراك في الواجهة الرئيسية =====
  (function () {
    var st = document.createElement('style');
    st.textContent = '.subc{margin:12px 2px 2px;padding:12px 12px 10px;border-radius:18px;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.32);color:#fff;text-align:center;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);box-shadow:0 6px 18px rgba(0,0,0,.12)}'
      + '.subc[hidden]{display:none}.sc-h{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}'
      + '.sc-t{font-size:13px;opacity:.9;font-weight:700}'
      + '.sc-p{display:inline-flex;align-items:center;gap:6px;background:rgba(34,197,94,.22);border:1px solid rgba(134,239,172,.6);color:#dcfce7;border-radius:99px;padding:3px 11px;font-size:12.5px;font-weight:800}'
      + '.sc-p i{width:8px;height:8px;border-radius:50%;background:#4ade80;animation:scp 1.8s infinite}'
      + '.sc-w .sc-p{background:rgba(251,191,36,.25);border-color:rgba(253,224,71,.7);color:#fef3c7}.sc-w .sc-p i{background:#fbbf24}'
      + '.sc-g{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;direction:rtl}'
      + '.sc-g>div{background:rgba(255,255,255,.16);border:1px solid rgba(255,255,255,.28);border-radius:12px;padding:8px 2px}'
      + '.sc-g .n{display:block;font-size:21px;font-weight:800;line-height:1.25;font-variant-numeric:tabular-nums}.sc-g small{display:block;font-size:11.5px;opacity:.85}'
      + '.sc-f{margin-top:9px;font-size:12.5px;opacity:.92}.sc-l{font-size:20px;font-weight:800;padding:6px 0}'
      + '@keyframes scp{0%{box-shadow:0 0 0 0 rgba(74,222,128,.6)}70%,100%{box-shadow:0 0 0 7px rgba(74,222,128,0)}}'
      + '.sc-g .n.tk{animation:sctk .35s ease}@keyframes sctk{from{opacity:.25;transform:translateY(-40%) scale(.9)}}'
      + '@media(prefers-reduced-motion:reduce){.sc-p i,.sc-g .n.tk{animation:none}}';
    document.head.appendChild(st);
    function p2(n) { return (n < 10 ? '0' : '') + n; }
    function ymd0(d) { return d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()); }
    if (/sub-demo/.test(location.hash) && !window.AQSATI_SUB) { var dd0 = new Date(); dd0.setDate(dd0.getDate() + 27); window.AQSATI_SUB = { exp: ymd0(dd0) }; }
    function build(el, S) {
      var life = S.exp === '0';
      el.innerHTML = '<div class="sc-h"><span class="sc-t">حالة الاشتراك</span><span class="sc-p"><i></i><span data-k="p">نشط</span></span></div>'
        + (life ? '<div class="sc-l">اشتراك دائم</div>'
          : '<div class="sc-g"><div><span class="n" data-k="d">00</span><small>يوم</small></div><div><span class="n" data-k="h">00</span><small>ساعة</small></div><div><span class="n" data-k="m">00</span><small>دقيقة</small></div><div><span class="n" data-k="s">00</span><small>ثانية</small></div></div>'
            + '<div class="sc-f">ينتهي: <span dir="ltr" data-k="e"></span></div>');
      var e = el.querySelector('[data-k="e"]'); if (e) e.textContent = S.exp.split('-').reverse().join('/');
      el.setAttribute('data-b', '1');
    }
    function put(el, k, v) {
      var n = el.querySelector('[data-k="' + k + '"]');
      if (n && n.textContent !== v) { n.textContent = v; n.classList.remove('tk'); void n.offsetWidth; n.classList.add('tk'); }
    }
    function countUp(el, v) {
      var t0 = Date.now();
      (function f() {
        var p = Math.min(1, (Date.now() - t0) / 900), e = 1 - Math.pow(1 - p, 3);
        ['d', 'h', 'm', 's'].forEach(function (k) { var n = el.querySelector('[data-k="' + k + '"]'); if (n) n.textContent = p2(Math.round(v[k] * e)); });
        if (p < 1) requestAnimationFrame(f);
      })();
    }
    function tick() {
      var el = document.getElementById('subc'), S = window.AQSATI_SUB;
      if (!el) return;
      if (!S) { el.hidden = true; return; }
      el.hidden = false;
      if (!el.getAttribute('data-b')) build(el, S);
      if (S.exp === '0') return;
      var t = new Date(S.exp + 'T23:59:59') - Date.now();
      if (t <= 0) { if (!window.__subr) { window.__subr = 1; location.reload(); } return; }
      var s = Math.floor(t / 1e3), d = Math.floor(s / 86400);
      var v = { d: d, h: Math.floor(s % 86400 / 3600), m: Math.floor(s % 3600 / 60), s: s % 60 };
      if (!el._cu) { el._cu = 1; if (Date.now() - (window.__cuT || 0) > 30000) { window.__cuT = Date.now(); el._lock = Date.now() + 900; countUp(el, v); } }
      if (el._lock && Date.now() < el._lock) return;
      put(el, 'd', p2(v.d)); put(el, 'h', p2(v.h)); put(el, 'm', p2(v.m)); put(el, 's', p2(v.s));
      var w = d < 7; el.classList.toggle('sc-w', w); put(el, 'p', w ? 'ينتهي قريباً' : 'نشط');
    }
    window.__subTick = tick;
    setInterval(tick, 1000);
  })();

  var C = window.AQSATI_LICENSE, demo = /lock-demo/.test(location.hash);
  if ((!C || !C.publicKey) && !demo) return;
  C = C || {};
  var K = { id: 'aqsati_device_id', code: 'aqsati_license_code', seen: 'aqsati_license_seen' };
  var A = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function g(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function s(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function u8(x) { x = x.replace(/-/g, '+').replace(/_/g, '/'); while (x.length % 4) x += '='; var b = atob(x), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function dev() { var d = g(K.id); if (!d || d.length !== 8) { var r = crypto.getRandomValues(new Uint8Array(8)); d = ''; for (var i = 0; i < 8; i++) d += A[r[i] % 32]; s(K.id, d); } return d; }
  function ymd(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function days(a, b) { return Math.round((new Date(a) - new Date(b)) / 864e5); }

  async function check(code) {
    try {
      if (!window.crypto || !crypto.subtle) return { ok: false, msg: 'يجب فتح التطبيق عبر رابط https' };
      var p = String(code || '').replace(/\s+/g, '').split('.');
      if (p.length !== 2) return { ok: false, msg: 'الرمز غير صحيح' };
      var k = await crypto.subtle.importKey('jwk', C.publicKey, { name: 'ECDSA', namedCurve: 'P-256' }, false, ['verify']);
      var data = u8(p[0]);
      if (!await crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, k, u8(p[1]), data)) return { ok: false, msg: 'الرمز غير صحيح' };
      var o = JSON.parse(new TextDecoder().decode(data)), t = ymd(new Date()), seen = g(K.seen) || t;
      if (o.d !== '*' && o.d !== dev()) return { ok: false, msg: 'هذا الرمز مخصص لجهاز آخر' };
      if (days(seen, t) > 1) return { ok: false, msg: 'تاريخ الجهاز غير صحيح، صحّحه ثم أعد المحاولة' };
      if (o.e !== '0' && days(t, o.e) > 0) return { ok: false, msg: 'انتهت صلاحية الرمز بتاريخ ' + o.e };
      if (t > seen) s(K.seen, t);
      return { ok: true, exp: o.e, left: o.e === '0' ? null : days(o.e, t) };
    } catch (e) { return { ok: false, msg: 'الرمز غير صحيح' }; }
  }

  var LOGO_SVG = "<svg viewBox=\"0 0 300 540\" xmlns=\"http://www.w3.org/2000/svg\" style=\"--d:0s\" aria-hidden=\"true\"><defs><linearGradient id=\"lkg1\" gradientUnits=\"userSpaceOnUse\" x1=\"30\" y1=\"20\" x2=\"260\" y2=\"440\"><stop offset=\"0\" stop-color=\"#fff3c4\"/><stop offset=\".22\" stop-color=\"#f0c95f\"/><stop offset=\".5\" stop-color=\"#d89a2c\"/><stop offset=\".78\" stop-color=\"#eec65c\"/><stop offset=\"1\" stop-color=\"#b8821f\"/></linearGradient><linearGradient id=\"lkg2\" gradientUnits=\"userSpaceOnUse\" x1=\"30\" y1=\"20\" x2=\"260\" y2=\"440\"><stop offset=\"0\" stop-color=\"#9a6a14\"/><stop offset=\"1\" stop-color=\"#5a3705\"/></linearGradient><radialGradient id=\"lkcoin\" cx=\".38\" cy=\".32\" r=\".8\"><stop offset=\"0\" stop-color=\"#fff0b8\"/><stop offset=\".4\" stop-color=\"#e8b94c\"/><stop offset=\"1\" stop-color=\"#9a6516\"/></radialGradient><linearGradient id=\"lkred\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e0453f\"/><stop offset=\".5\" stop-color=\"#a51b1b\"/><stop offset=\"1\" stop-color=\"#5a0b0b\"/></linearGradient><linearGradient id=\"lkshg\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\".5\" stop-color=\"#fff\" stop-opacity=\".95\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient><mask id=\"lkm\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"300\" height=\"540\"><g fill=\"none\" stroke=\"#fff\" stroke-width=\"11\" stroke-linecap=\"round\"><path d=\"M205,97 L150,76 L264,20 L252,146 L219,110\"/><path d=\"M205.0,97.0 L61.6,256.1 A88,88 0 1 0 168.3,237.3\"/><path d=\"M219.0,110.0 L74.2,266.0 A72,72 0 1 0 190.6,281.2\"/><path d=\"M104.5,272.6 A48,48 0 0 1 174.0,325.0\"/><path d=\"M72.1,214.5 A53,62 0 1 1 141.1,133.8\"/><path d=\"M81.5,198.8 A34,44 0 1 1 118.8,129.9\"/><path d=\"M166,315 A39,39 0 1 1 165.99,314.8\"/></g><circle cx=\"127\" cy=\"315\" r=\"31\" fill=\"#fff\"/><path d=\"M116,425 H140 V470 H163 L128,512 L93,470 H116 Z\" fill=\"#fff\"/></mask></defs><g fill=\"none\" stroke-linecap=\"round\" stroke-linejoin=\"miter\" stroke-miterlimit=\"6\"><g stroke=\"url(#lkg2)\" stroke-width=\"14\" transform=\"translate(1.5,2.5)\"><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.0s)\" d=\"M205,97 L150,76 L264,20 L252,146 L219,110\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.25s)\" d=\"M205.0,97.0 L61.6,256.1 A88,88 0 1 0 168.3,237.3\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.4s)\" d=\"M219.0,110.0 L74.2,266.0 A72,72 0 1 0 190.6,281.2\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.8s)\" d=\"M104.5,272.6 A48,48 0 0 1 174.0,325.0\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.6s)\" d=\"M72.1,214.5 A53,62 0 1 1 141.1,133.8\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.75s)\" d=\"M81.5,198.8 A34,44 0 1 1 118.8,129.9\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.95s)\" d=\"M166,315 A39,39 0 1 1 165.99,314.8\"/></g><g stroke=\"url(#lkg1)\" stroke-width=\"10\"><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.0s)\" d=\"M205,97 L150,76 L264,20 L252,146 L219,110\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.25s)\" d=\"M205.0,97.0 L61.6,256.1 A88,88 0 1 0 168.3,237.3\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.4s)\" d=\"M219.0,110.0 L74.2,266.0 A72,72 0 1 0 190.6,281.2\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.8s)\" d=\"M104.5,272.6 A48,48 0 0 1 174.0,325.0\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.6s)\" d=\"M72.1,214.5 A53,62 0 1 1 141.1,133.8\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.75s)\" d=\"M81.5,198.8 A34,44 0 1 1 118.8,129.9\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.95s)\" d=\"M166,315 A39,39 0 1 1 165.99,314.8\"/></g><g stroke=\"#fff6d2\" stroke-width=\"2.2\" transform=\"translate(-1.8,-2)\" opacity=\".85\"><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.0s)\" d=\"M205,97 L150,76 L264,20 L252,146 L219,110\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.25s)\" d=\"M205.0,97.0 L61.6,256.1 A88,88 0 1 0 168.3,237.3\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.4s)\" d=\"M219.0,110.0 L74.2,266.0 A72,72 0 1 0 190.6,281.2\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.8s)\" d=\"M104.5,272.6 A48,48 0 0 1 174.0,325.0\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.6s)\" d=\"M72.1,214.5 A53,62 0 1 1 141.1,133.8\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.75s)\" d=\"M81.5,198.8 A34,44 0 1 1 118.8,129.9\"/><path class=\"lkd\" pathLength=\"1\" style=\"animation-delay:calc(var(--d) + 0.95s)\" d=\"M166,315 A39,39 0 1 1 165.99,314.8\"/></g></g><g class=\"lkc\"><circle cx=\"127\" cy=\"319\" r=\"31\" fill=\"#5a3705\" opacity=\".45\"/><circle cx=\"127\" cy=\"315\" r=\"30\" fill=\"url(#lkcoin)\" stroke=\"#f5dc92\" stroke-width=\"1.5\"/></g><g class=\"lkr\"><path d=\"M116,425 H140 V470 H163 L128,512 L93,470 H116 Z\" fill=\"#2c0505\" transform=\"translate(2,3)\"/><path d=\"M116,425 H140 V470 H163 L128,512 L93,470 H116 Z\" fill=\"url(#lkred)\" stroke=\"#e8645c\" stroke-width=\"2\"/></g><g mask=\"url(#lkm)\"><rect class=\"lks\" x=\"0\" y=\"-20\" width=\"90\" height=\"580\" fill=\"url(#lkshg)\"/></g></svg>";
  var ks = document.createElement('style');
  ks.textContent = '.lk{position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;padding:max(18px,env(safe-area-inset-top)) 18px max(18px,env(safe-area-inset-bottom));overflow:auto;direction:rtl;font-family:Cairo,system-ui,-apple-system,sans-serif;color:#0f172a;background:radial-gradient(circle at 85% 8%,rgba(250,204,21,.18),transparent 38%),radial-gradient(circle at 10% 92%,rgba(56,189,248,.32),transparent 46%),linear-gradient(165deg,#0b1f4d 0%,#0c3a7a 48%,#0284c7 100%)}'
    + '.lk-w{width:100%;max-width:400px;text-align:center;margin:auto}'
    + '.lk-logo{width:92px;height:92px;border-radius:24px;display:block;margin:0 auto 12px;box-shadow:0 0 0 3px rgba(245,196,81,.55),0 14px 34px rgba(0,0,0,.35)}'
    + '.lk-pulse{animation:lkpl 1.3s ease-in-out infinite}'
    + '.lk-n{color:#fff;font-size:27px;font-weight:800;margin:0;letter-spacing:.2px}.lk-s{color:rgba(255,255,255,.78);font-size:13.5px;margin:4px 0 16px}'
    + '.lk-c{background:#fff;border-radius:24px;padding:20px 18px 18px;box-shadow:0 22px 50px rgba(2,6,23,.38);animation:lkup .5s cubic-bezier(.2,.8,.2,1)}'
    + '.lk-h{display:flex;align-items:center;justify-content:center;gap:8px;font-size:18px;font-weight:800;color:#0b1f4d;margin:0 0 4px}'
    + '.lk-p{color:#64748b;font-size:13.5px;margin:0 0 14px;line-height:1.7}.lk-l{font-size:12.5px;color:#64748b;text-align:right;margin-bottom:6px}'
    + '.lk-id{display:flex;align-items:center;gap:8px;background:#f1f5f9;border:1px dashed #94a3b8;border-radius:14px;padding:10px 12px;direction:ltr}'
    + '.lk-id b{flex:1;font:800 25px ui-monospace,Menlo,monospace;letter-spacing:3px;color:#0b1f4d;text-align:center}'
    + '.lk-cp{border:0;border-radius:10px;background:#e0f2fe;color:#0369a1;font-family:inherit;font-size:12.5px;font-weight:700;padding:8px 11px;cursor:pointer;white-space:nowrap}'
    + '.lk-t{width:100%;margin-top:14px;padding:12px;border:1.5px solid #cbd5e1;border-radius:14px;font:13px ui-monospace,Menlo,monospace;direction:ltr;resize:none;background:#f8fafc;color:#0f172a;outline:none}'
    + '.lk-t:focus{border-color:#0284c7;box-shadow:0 0 0 4px rgba(2,132,199,.15)}'
    + '.lk-b{display:block;width:100%;margin-top:10px;border:0;border-radius:14px;padding:13px;font-family:inherit;font-size:16px;font-weight:800;cursor:pointer;transition:transform .15s;text-align:center;text-decoration:none}.lk-b:active{transform:scale(.98)}'
    + '.lk-go{background:linear-gradient(135deg,#f7d56b,#d9a02e);color:#3b2a05;box-shadow:0 8px 18px rgba(217,160,46,.42)}.lk-wa{background:#16a34a;color:#fff;margin-top:12px}'
    + '.lk-m{min-height:22px;margin-top:10px;color:#dc2626;font-size:13.5px;font-weight:700}.lk-f{margin-top:14px;color:rgba(255,255,255,.62);font-size:12px}'
    + '@keyframes lkup{from{opacity:0;transform:translateY(18px)}}@keyframes lkpl{50%{transform:scale(1.06);opacity:.85}}'
    + '.lk-lg{width:66px;height:119px;margin:0 auto 12px;filter:drop-shadow(0 10px 18px rgba(0,0,0,.45))}.lk-lg svg{width:100%;height:100%;overflow:visible}'
    + '.lkd{stroke-dasharray:1;stroke-dashoffset:1;animation:lkdr 1.1s cubic-bezier(.5,0,.2,1) forwards}@keyframes lkdr{to{stroke-dashoffset:0}}'
    + '.lkc{transform-box:fill-box;transform-origin:center;animation:lkpop .6s 1.1s cubic-bezier(.3,1.6,.5,1) both}@keyframes lkpop{from{opacity:0;transform:scale(.3)}}'
    + '.lkr{animation:lkdn .6s 1.4s ease both}@keyframes lkdn{from{opacity:0;transform:translateY(-30px)}}'
    + '.lks{animation:lksh 3.6s ease-in-out 1.9s infinite}@keyframes lksh{0%{transform:translateX(-120px)}55%,100%{transform:translateX(340px)}}'
    + '@media(prefers-reduced-motion:reduce){.lk-c,.lk-pulse{animation:none}.lkd{animation:none;stroke-dashoffset:0}.lkc,.lkr,.lks{animation:none}}';
  document.head.appendChild(ks);
  var ov = document.createElement('div');
  ov.className = 'lk';
  ov.innerHTML = '<div class="lk-w"><div class="lk-lg">' + LOGO_SVG + '</div></div>';
  document.documentElement.appendChild(ov);

  function done(r) {
    window.AQSATI_SUB = { exp: r.exp };
    window.__subTick();
    ov.style.transition = 'opacity .3s';
    ov.style.opacity = '0';
    setTimeout(function () { ov.remove(); }, 300);
    if (r.left !== null && r.left <= 7) {
      var b = document.createElement('div');
      b.textContent = r.left <= 0 ? 'ينتهي الاشتراك اليوم' : 'ينتهي الاشتراك بعد ' + r.left + ' يوم';
      b.style.cssText = 'position:fixed;top:8px;left:50%;transform:translateX(-50%);background:#d97706;color:#fff;padding:8px 16px;border-radius:99px;z-index:2147483646;font:14px Cairo,system-ui,sans-serif';
      document.documentElement.appendChild(b);
      setTimeout(function () { b.remove(); }, 6000);
    }
  }

  function lock(msg) {
    var id = dev(), f = id.slice(0, 4) + '-' + id.slice(4);
    ov.innerHTML = '<div class="lk-w"><div class="lk-lg">' + LOGO_SVG + '</div>'
      + '<h1 class="lk-n">أقساطي وديوني</h1><div class="lk-s">إدارة الأقساط والديون والعملاء</div>'
      + '<div class="lk-c"><h2 class="lk-h"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c9922a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>تفعيل التطبيق</h2>'
      + '<p class="lk-p">أرسل رقم جهازك إلى المسؤول، ثم الصق رمز التفعيل الذي يصلك.</p>'
      + '<div class="lk-l">رقم جهازك</div><div class="lk-id"><button class="lk-cp" id="lcp">نسخ</button><b id="lid"></b></div>'
      + (C.whatsapp ? '<a class="lk-b lk-wa" id="lwa" target="_blank" rel="noopener">💬 طلب التفعيل عبر واتساب</a>' : '')
      + '<textarea class="lk-t" id="lcode" rows="3" placeholder="الصق رمز التفعيل هنا"></textarea>'
      + '<button class="lk-b lk-go" id="lgo">تفعيل التطبيق</button><div class="lk-m" id="lmsg"></div></div>'
      + '<div class="lk-f">أقساطي وديوني • جميع الحقوق محفوظة</div></div>';
    var q = function (x) { return ov.querySelector(x); };
    q('#lid').textContent = f;
    q('#lmsg').textContent = msg || '';
    q('#lcp').onclick = function () { try { navigator.clipboard.writeText(f); } catch (e) {} this.textContent = 'تم النسخ ✓'; };
    if (C.whatsapp) q('#lwa').href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent('أرغب بتفعيل تطبيق الأقساط. رقم جهازي: ' + f);
    q('#lgo').onclick = async function () {
      var c = q('#lcode').value, r = await check(c);
      if (r.ok) { s(K.code, c.replace(/\s+/g, '')); done(r); } else q('#lmsg').textContent = r.msg;
    };
  }

  var saved = g(K.code);
  if (demo) lock('');
  else if (!saved) lock('');
  else check(saved).then(function (r) { r.ok ? done(r) : lock(r.msg); });
})();
