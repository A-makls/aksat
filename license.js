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
      + '@media(prefers-reduced-motion:reduce){.sc-p i{animation:none}}';
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
    function put(el, k, v) { var n = el.querySelector('[data-k="' + k + '"]'); if (n && n.textContent !== v) n.textContent = v; }
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
      put(el, 'd', p2(d)); put(el, 'h', p2(Math.floor(s % 86400 / 3600))); put(el, 'm', p2(Math.floor(s % 3600 / 60))); put(el, 's', p2(s % 60));
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

  var LOGO = 'icon-192.png';
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
    + '@media(prefers-reduced-motion:reduce){.lk-c,.lk-pulse{animation:none}}';
  document.head.appendChild(ks);
  var ov = document.createElement('div');
  ov.className = 'lk';
  ov.innerHTML = '<div class="lk-w"><img class="lk-logo lk-pulse" alt="" src="' + LOGO + '"></div>';
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
    ov.innerHTML = '<div class="lk-w"><img class="lk-logo" alt="" src="' + LOGO + '">'
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
