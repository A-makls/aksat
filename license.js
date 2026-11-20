(function () {
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
      return { ok: true, left: o.e === '0' ? null : days(o.e, t) };
    } catch (e) { return { ok: false, msg: 'الرمز غير صحيح' }; }
  }

  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;z-index:2147483647;background:#0f172a;display:flex;align-items:center;justify-content:center;padding:16px;font-family:Cairo,system-ui,sans-serif;direction:rtl;color:#0f172a;overflow:auto';
  document.documentElement.appendChild(ov);
  var B = 'border:0;border-radius:10px;padding:11px;font:700 15px Cairo,system-ui,sans-serif;width:100%;margin-top:8px;cursor:pointer;';

  function done(r) {
    ov.remove();
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
