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

  var C = window.AQSATI_LICENSE;
  if (!C || !C.publicKey) return;
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

  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#0f172a;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Cairo,system-ui,sans-serif;direction:rtl;color:#0f172a;overflow:auto';
  document.documentElement.appendChild(ov);
  var B = 'border:0;border-radius:10px;padding:11px;font:700 15px Cairo,system-ui,sans-serif;width:100%;margin-top:8px;cursor:pointer;';

  function done(r) {
    ov.remove();
    window.AQSATI_SUB = { exp: r.exp };
    window.__subTick();
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
    ov.innerHTML = '<div style="background:#fff;border-radius:16px;padding:22px;width:100%;max-width:380px;text-align:center">'
      + '<h2 style="margin:0 0 6px;font-size:20px">التطبيق يحتاج إلى تفعيل</h2>'
      + '<p style="margin:0 0 14px;color:#64748b;font-size:14px">أرسل رقم جهازك للمسؤول ليرسل لك رمز التفعيل.</p>'
      + '<div id="lid" style="font:700 26px monospace;letter-spacing:2px;background:#f1f5f9;border-radius:10px;padding:12px;direction:ltr"></div>'
      + '<button id="lcp" style="' + B + 'background:#e2e8f0;color:#0f172a">نسخ رقم الجهاز</button>'
      + (C.whatsapp ? '<a id="lwa" target="_blank" rel="noopener" style="' + B + 'display:block;background:#16a34a;color:#fff;text-decoration:none;text-align:center">طلب التفعيل عبر واتساب</a>' : '')
      + '<textarea id="lcode" rows="3" placeholder="الصق رمز التفعيل هنا" style="width:100%;margin-top:14px;padding:10px;border:1px solid #e2e8f0;border-radius:10px;font:13px monospace;direction:ltr"></textarea>'
      + '<button id="lgo" style="' + B + 'background:#0f766e;color:#fff">تفعيل</button>'
      + '<div id="lmsg" style="color:#dc2626;font-size:14px;margin-top:8px;min-height:20px"></div></div>';
    var q = function (x) { return ov.querySelector(x); };
    q('#lid').textContent = f;
    q('#lmsg').textContent = msg || '';
    q('#lcp').onclick = function () { try { navigator.clipboard.writeText(f); } catch (e) {} this.textContent = 'تم النسخ'; };
    if (C.whatsapp) q('#lwa').href = 'https://wa.me/' + C.whatsapp + '?text=' + encodeURIComponent('أرغب بتفعيل تطبيق الأقساط. رقم جهازي: ' + f);
    q('#lgo').onclick = async function () {
      var c = q('#lcode').value, r = await check(c);
      if (r.ok) { s(K.code, c.replace(/\s+/g, '')); done(r); } else q('#lmsg').textContent = r.msg;
    };
  }

  var saved = g(K.code);
  if (!saved) lock('');
  else check(saved).then(function (r) { r.ok ? done(r) : lock(r.msg); });
})();
