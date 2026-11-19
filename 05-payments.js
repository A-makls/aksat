/**
 * 05 · payments.js — الاتصال وتسديد الأقساط وتنسيق حقول المبالغ
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function callPh(ph) {
  const loc = ph.startsWith("964") ? "0" + ph.slice(3) : ph, o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = '<div class="md" style="border-radius:22px;max-width:340px;width:92%;text-align:center"><h3>📞 اتصال</h3><div dir="ltr" style="font-size:26px;font-weight:700;margin:8px 0 14px">' + loc + '</div><a class="btn" style="display:block;text-decoration:none;background:#16a34a;padding:13px;margin-bottom:8px" href="tel:+' + ph + '">اتصال الآن</a><button class="btn" style="width:100%;margin-bottom:8px" id="cp">نسخ الرقم</button><a class="btn" style="display:block;text-decoration:none;background:#25d366;padding:13px;margin-bottom:8px" target="_blank" rel="noopener" href="https://wa.me/' + ph + '">' + WA + ' محادثة واتساب</a><button class="btn ghost" style="width:100%" id="cl">إغلاق</button></div>';
  document.body.appendChild(o);
  o.querySelector("#cl").onclick = () => o.remove();
  o.onclick = (e) => {
    if (e.target === o) o.remove();
  };
  o.querySelector("#cp").onclick = () => {
    copyText(loc);
    toast("تم نسخ الرقم");
  };
}
function payInstDlg(id) {
  const i = S.inst.find((x) => x.id === id), l = late(i), mo = Math.round(Math.min(l.m, l.rem)), ip = "background:#fff;color:#0f172a;margin:0 0 12px";
  if (l.rem <= 0) {
    toast("القسط مسدد بالكامل");
    return;
  }
  const c = S.cust.find((k) => k.id === i.cust) || {}, m = document.createElement("div");
  m.className = "ov";
  m.style.alignItems = "center";
  m.innerHTML = '<form class="md" style="padding:0;border-radius:22px;max-width:380px;width:92%;overflow:auto;max-height:90vh;background:#f1f8ec;color:#0f172a"><div style="background:#6cc644;color:#fff;padding:18px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:18px"><span>تسديد قسط · ' + E(c.name || "") + '</span><span id="x" style="cursor:pointer;font-size:22px">✕</span></div><div style="padding:16px"><div style="background:#fff;border-radius:16px;padding:14px;text-align:center;margin-bottom:12px"><div class="mut">المبلغ المستحق</div><b style="font-size:30px;color:#dc2626">' + F(l.rem) + '</b><div class="mut" style="margin-top:6px">' + E(i.desc) + " · القسط الشهري " + F(l.m) + (l.L > 0 ? ' · <span class="bad">متأخر ' + F(l.L) + "</span>" : "") + '</div></div><input name="amount" type="number" step="any" min="1" max="' + Math.round(l.rem) + '" value="' + mo + '" required placeholder="💳 المبلغ المراد تسديده" style="' + ip + '"><div style="display:flex;gap:8px;margin-bottom:12px"><button type="button" class="btn sm" data-v="' + mo + '" style="background:#fff;color:#16a34a;border:1px solid #6cc644">القسط الشهري</button><button type="button" class="btn sm" data-v="' + Math.round(l.rem) + '" style="background:#fff;color:#16a34a;border:1px solid #6cc644">كامل المتبقي</button></div><div class="mut" style="text-align:center;margin:0 0 12px;font-size:12.5px">سيُسجَّل التسديد بتاريخ اليوم ' + today() + '</div><button class="btn" style="width:100%;background:#6cc644;padding:14px;font-weight:700;border-radius:14px">تسديد</button></div></form>';
  document.body.appendChild(m);
  m.querySelector("#x").onclick = () => m.remove();
  m.onclick = (e) => {
    if (e.target === m) m.remove();
  };
  const f = m.querySelector("form");
  f.querySelectorAll("[data-v]").forEach((b) => b.onclick = () => {
    f.amount.value = b.dataset.v;
    f.amount.dispatchEvent(new Event("input", { bubbles: true }));
  });
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), amt = Math.min(+d.amount, l.rem);
    if (!(amt > 0)) {
      toast("أدخل مبلغاً صحيحاً");
      return;
    }
    S.pays.push({ id: uid(), inst: id, amt, date: today(), note: "قسط" });
    LOG("تسديد " + F(amt) + " - " + i.desc);
    save();
    m.remove();
    render();
    setTimeout(() => receipt(id), 50);
  };
}
const NOCOMMA = ["no", "qty", "months", "q"];
function fmtInp(el) {
  const raw = el.value.replace(/[٠-٩۰-۹]/g, (d) => d.charCodeAt(0) >= 1776 ? d.charCodeAt(0) - 1776 : d.charCodeAt(0) - 1632).replace(/٫/g, ".").replace(/[^\d.]/g, ""), p = raw.split(".");
  p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  el.value = p.length > 1 ? p[0] + "." + p.slice(1).join("") : p[0];
}
function prepInp(el) {
  if (NOCOMMA.includes(el.name)) return;
  el.type = "text";
  el.inputMode = "decimal";
  el.dataset.money = 1;
  el.removeAttribute("step");
  fmtInp(el);
}
new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
  if (n.nodeType === 1) n.querySelectorAll("input[type=number]").forEach(prepInp);
}))).observe(document.body, { childList: true, subtree: true });
document.addEventListener("input", (e) => {
  if (e.target.dataset && e.target.dataset.money) fmtInp(e.target);
});
document.addEventListener("submit", (e) => {
  e.target.querySelectorAll("[data-money]").forEach((i) => {
    i.value = i.value.replace(/,/g, "");
  });
}, true);
