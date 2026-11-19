/**
 * 08 · settings.js — المظهر وصفحة الإعدادات ومن نحن
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function applyTheme() {
  const t = S.theme || "auto", dark = t === "dark" || t === "auto" && matchMedia("(prefers-color-scheme:dark)").matches, r = document.documentElement;
  if (t === "auto") r.removeAttribute("data-theme");
  else r.dataset.theme = t;
  r.dataset.eff = dark ? "dark" : "light";
  let m = document.querySelector("meta[name=theme-color]");
  if (!m) {
    m = document.createElement("meta");
    m.name = "theme-color";
    document.head.appendChild(m);
  }
  m.content = dark ? "#0b1220" : "#2563eb";
}
function setTheme(t) {
  S.theme = t;
  save();
  render();
}
try {
  matchMedia("(prefers-color-scheme:dark)").addEventListener("change", applyTheme);
} catch (e) {
}
applyTheme();
const oldSettings = V.settings;
V.settings = function() {
  const h = oldSettings(), k = h.indexOf("</h2>") + 5, cur = S.theme || "auto", o = [["light", "☀️ نهاري"], ["dark", "🌙 ليلي"], ["auto", "🌓 تلقائي"]];
  return h.slice(0, k) + '<div class="card"><div style="font-weight:700;font-size:16px">🎨 المظهر</div><div class="mut" style="margin:4px 0 12px">اختر الوضع النهاري أو الليلي، أو اتبع إعداد جهازك تلقائياً</div><div class="thg">' + o.map((x) => '<button class="tho' + (cur === x[0] ? " on" : "") + `" onclick="setTheme('` + x[0] + `')"><div class="thp ` + x[0] + '"><i></i><i></i></div><span>' + x[1] + "</span></button>").join("") + "</div></div>" + h.slice(k);
};
const IG_URL = "https://share.google/tzw4EuZFfJPABSP7A", oldS2 = V.settings, SVG_FB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z"/></svg>', SVG_IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>';
function aboutCard() {
  const ig = S.ig ? /^https?:/.test(S.ig) ? S.ig : "https://instagram.com/" + S.ig.replace(/^@/, "") : IG_URL;
  return '<div class="card"><div style="font-weight:700;font-size:16px">ℹ️ من نحن</div><div class="mut" style="margin:4px 0 12px">أحمد المخلص · حساباتي على الفيسبوك والإنستقرام</div><div class="thg"><a class="tho" target="_blank" rel="noopener" href="https://share.google/gYVOy9hWrUoo5dllq" style="text-decoration:none"><span class="soc fbk">' + SVG_FB + "</span><span>فيسبوك</span></a>" + (ig ? '<a class="tho" target="_blank" rel="noopener" href="' + E(ig) + '" style="text-decoration:none"><span class="soc igk">' + SVG_IG + "</span><span>إنستقرام</span></a>" : '<button class="tho" onclick="setIg()"><span class="soc igk">' + SVG_IG + "</span><span>إنستقرام</span></button>") + '<a class="tho" target="_blank" rel="noopener" href="https://wa.me/9647737043441" style="text-decoration:none"><span class="soc wak">' + WA + '</span><span style="text-align:center">واتساب<small dir="ltr" style="display:block;text-align:center;font-weight:400;color:var(--mut);font-size:11px">07737043441</small></span></a></div></div>';
}
V.settings = function() {
  const h = oldS2().replace("</h2>", "</h2>" + officeCard()), i = h.indexOf('<div class="tg">');
  return h.slice(0, i) + langCard() + animCard() + pinCard() + aboutCard() + stiles();
};
function setIg() {
  openForm("حساب إنستقرام", [{ k: "u", l: "اسم المستخدم أو الرابط", r: 0, v: S.ig || "" }], (d) => {
    S.ig = (d.u || "").trim();
    LOG("تحديث حساب إنستقرام");
  });
}
V.about = function() {
  const ig = S.ig ? /^https?:/.test(S.ig) ? S.ig : "https://instagram.com/" + S.ig.replace(/^@/, "") : IG_URL, FB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.7V13h2.7v8h3.1z"/></svg>', IG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>';
  return head("من نحن") + '<div class="ab"><div class="av">أ</div><h2 style="justify-content:center;margin:12px 0 4px;font-size:22px">أحمد المخلص</h2><p class="mut" style="margin:10px 8px 18px;line-height:1.9;font-size:14px">حساباتي على الفيسبوك والإنستقرام</p></div><a class="sb fb" target="_blank" rel="noopener" href="https://share.google/gYVOy9hWrUoo5dllq">' + FB + "<div><b>فيسبوك</b><small>Facebook</small></div><span>‹</span></a>" + (ig ? '<a class="sb igr" target="_blank" rel="noopener" href="' + E(ig) + '">' + IG + "<div><b>إنستقرام</b><small>Instagram</small></div><span>‹</span></a>" : '<button class="sb igr" onclick="setIg()">' + IG + "<div><b>إنستقرام</b><small>اضغط لإضافة الحساب</small></div><span>‹</span></button>") + '<a class="sb wk" target="_blank" rel="noopener" href="https://wa.me/9647737043441">' + WA + '<div><b>واتساب</b><small dir="ltr">07737043441</small></div><span>‹</span></a>';
};
