/**
 * 19 · app.js — العرض الرئيسي والتنقل والأيقونات وتشغيل التطبيق
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function render() {
  document.getElementById("main").innerHTML = V[tab]();
  const tt = TABS.find((t) => t[0] === tab);
  document.getElementById("ttl").textContent = tab === "home" ? "أقساطي" : tt ? tt[2] : tab === "ddetail" ? "تفاصيل الدين" : tab === "gdetail" ? "أقساط العميل" : "تفاصيل القسط";
  document.getElementById("hb").style.visibility = tab === "home" ? "hidden" : "visible";
  document.getElementById("bkh").style.display = SEC.includes(tab) ? "" : "none";
  document.querySelector("header").style.display = tab === "home" ? "none" : "flex";
  {
    const hs = document.getElementById("hsr");
    hs.blur();
    document.getElementById("hsw").style.display = "none";
    hs.dataset.t = "";
    document.getElementById("ttl").style.display = "";
  }
  applyTheme();
  document.body.classList.toggle("hm", tab === "home");
  hdrSearch();
  postRender();
  document.querySelectorAll(".nb .it").forEach((b) => b.classList.toggle("on", b.dataset.t === tab || b.dataset.t === "debts" && tab === "ddetail" || b.dataset.t === "inst" && (tab === "detail" || tab === "gdetail" || tab === "late") || b.dataset.t === "settings" && tab === "about"));
  {
    const lc = lateList().length, lb = document.getElementById("lb");
    lb.textContent = lc > 99 ? "99+" : lc;
    lb.style.display = lc ? "" : "none";
  }
  ;
  {
    const fb = document.querySelector(".nb .fab"), m = FABK[tab] || "inst", c = FABC[m] || COL[m];
    if (fb.dataset.m !== m) {
      fb.dataset.m = m;
      fb.setAttribute("aria-label", FABL[m]);
      fb.style.background = "linear-gradient(135deg," + c[0] + "," + c[1] + ")";
      fb.style.boxShadow = "0 8px 18px " + c[1] + "73";
      fb.classList.remove("pop");
      void fb.offsetWidth;
      fb.classList.add("pop");
    }
  }
  postLang();
}
let PREV = "home";
const SEC = ["pays", "late", "stock", "cust", "emp", "exp", "profit", "stats", "cash", "log", "bak", "about"];
function goBack() {
  go(PREV && PREV !== tab ? PREV : "settings");
}
Object.assign(SI, { inst: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>', debts: '<path d="M20 12V8a2 2 0 0 0-2-2H4a2 2 0 0 0 0 4h16v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6"/><circle cx="16" cy="14" r="1"/>', home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/>', settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1"/>', about: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>' });
const COL = { stock: ["#06b6d4", "#0e7490"], exp: ["#14b8a6", "#0f766e"], pays: ["#0ea5e9", "#0369a1"], late: ["#fb7185", "#e11d48"], stats: ["#60a5fa", "#2563eb"], profit: ["#34d399", "#059669"], cash: ["#818cf8", "#4f46e5"], cust: ["#38bdf8", "#0284c7"], emp: ["#94a3b8", "#475569"], log: ["#fbbf24", "#d97706"], bak: ["#2dd4bf", "#0d9488"], inst: ["#38bdf8", "#0284c7"], debts: ["#22d3ee", "#0e7490"], home: ["#60a5fa", "#2563eb"], settings: ["#94a3b8", "#475569"], about: ["#818cf8", "#4f46e5"] };
const ico = (k, c) => '<span class="sico ' + (c || "") + '" style="background:linear-gradient(135deg,' + COL[k][0] + "," + COL[k][1] + ')"><svg viewBox="0 0 24 24">' + SI[k] + "</svg></span>";
const EMJ = { "➡": '<path d="M5 12h14M13 6l6 6-6 6"/>', "🕘": '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', "✏": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', "🖨": '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>', "📄": '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', "📋": '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', "🗑": '<path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/>', "💳": SI.inst, "📞": '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>', "➕": '<path d="M12 5v14M5 12h14"/>', "🧾": SI.exp, "☰": '<path d="M3 6h18M3 12h18M3 18h18"/>', "🏠": SI.home, "⚙": SI.settings, "🤝": SI.debts, "👥": SI.cust, "👤": '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>', "💼": SI.emp, "📦": SI.stock, "🧩": '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 9h6v6H9z"/>', "🛒": '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>', "％": '<path d="M19 5L5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>', "💲": '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', "💵": '<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>', "👛": SI.debts, "📅": '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>', "🔢": '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>', "✨": '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/>', "🔍": '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>' };
const ER = new RegExp("(" + Object.keys(EMJ).join("|") + ")\\uFE0F?", "g"), ET = new RegExp(ER.source), SEL = "button,a.btn,a.ab,.ff>i,.fc h4>span:first-child,.nb .e";
function iconize(r) {
  const L = [];
  if (r.matches && r.matches(SEL)) L.push(r);
  if (r.querySelectorAll) r.querySelectorAll(SEL).forEach((e) => L.push(e));
  L.forEach((e) => {
    if (ET.test(e.innerHTML)) e.innerHTML = e.innerHTML.replace(ER, (m, k) => '<svg class="ei' + (k === "➡" ? " fl" : "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + EMJ[k] + "</svg>");
  });
}
new MutationObserver((ms) => ms.forEach((m) => m.addedNodes.forEach((n) => {
  if (n.nodeType === 1) iconize(n);
}))).observe(document.body, { childList: true, subtree: true });
iconize(document.body);
const SQT = ["stock", "cust", "emp", "exp", "pays", "late", "log", "profit"], SQV = {};
let SQL = "";
function secSearch() {
  const m = document.getElementById("main");
  if (!m || !SQT.includes(tab)) return;
  if (SQL !== tab) {
    SQV[tab] = "";
    SQL = tab;
  }
  const cards = [...m.children].filter((c) => c.classList.contains("card") && c.querySelector(":scope>.top"));
  if (!cards.length && !SQV[tab]) return;
  const bx = document.createElement("div");
  bx.className = "ssb";
  bx.innerHTML = '<label class="ff" style="margin:0 0 12px"><i>🔍</i><input type="search" placeholder="ابحث..." autocomplete="off"><button type="button" class="cxb" style="display:none">✕</button></label>';
  const h = m.querySelector("h2");
  if (h) h.after(bx);
  else m.prepend(bx);
  const inp = bx.querySelector("input"), cx = bx.querySelector("button");
  inp.value = SQV[tab] || "";
  const apply = () => {
    const q = inp.value.trim().toLowerCase().replace(/,/g, "");
    SQV[tab] = inp.value;
    let n = 0;
    cards.forEach((c) => {
      const ok = !q || c.textContent.toLowerCase().replace(/,/g, "").includes(q);
      c.style.display = ok ? "" : "none";
      if (ok) n++;
    });
    let e = m.querySelector(".sse");
    if (q && !n) {
      if (!e) {
        e = document.createElement("div");
        e.className = "empty sse";
        e.textContent = "لا توجد نتائج مطابقة";
        cards[cards.length - 1].after(e);
      }
    } else if (e) e.remove();
    cx.style.display = inp.value ? "" : "none";
  };
  inp.oninput = apply;
  cx.onclick = () => {
    inp.value = "";
    apply();
    inp.focus();
  };
  apply();
}
function editCust(id) {
  const c = S.cust.find((x) => x.id === id);
  if (!c) return;
  const ins = S.inst.filter((i) => i.cust === id);
  let no = "", gu = "";
  ins.slice().reverse().forEach((i) => {
    if (!no && i.no) no = i.no;
    if (!gu && i.guar) gu = i.guar;
  });
  openForm("تعديل معلومات العميل", [{ k: "name", l: "اسم العميل", v: c.name }, { k: "phone", l: "رقم الهاتف", t: "tel", v: c.phone || "", r: 0 }, { k: "guar", l: "الكفيل", v: gu, r: 0 }, { k: "no", l: "رقم السجل", t: "number", v: no, r: 0 }], (d) => {
    const nm = (d.name || "").trim();
    if (!nm) return false;
    c.name = nm;
    c.phone = (d.phone || "").trim();
    S.debts.forEach((x) => {
      if (x.cust === id) {
        x.name = nm;
        x.phone = c.phone;
      }
    });
    if ((d.guar || "").trim() !== gu) ins.forEach((i) => i.guar = (d.guar || "").trim());
    if (d.no !== "" && +d.no !== +no) ins.forEach((i) => i.no = +d.no);
    LOG("تعديل معلومات العميل: " + nm);
  });
}
const NAV = [];
function navBack(def) {
  const e = NAV.pop();
  if (!e) {
    go(def);
    return;
  }
  tab = e.t;
  if (e.g != null) curG = e.g;
  render();
  scrollTo(0, e.y || 0);
}
function toggleTheme() {
  const r = document.documentElement, dark = r.dataset.eff === "dark";
  r.classList.add("tt");
  S.theme = dark ? "light" : "dark";
  save();
  applyTheme();
  render();
  setTimeout(() => r.classList.remove("tt"), 520);
}
const FABC = { debts: ["#f0931b", "#f0931b"] }, FABK = { stock: "stock", exp: "exp", cust: "cust", emp: "emp", debts: "debts", ddetail: "debts" }, FABL = { inst: "قسط جديد", debts: "دين جديد", stock: "إضافة صنف", exp: "إضافة مصروف", cust: "إضافة عميل", emp: "إضافة موظف" };
document.addEventListener("click", (e) => {
  const a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
  if (!a) return;
  e.preventDefault();
  e.stopPropagation();
  const u = a.href;
  let w = null;
  try {
    w = window.open(u, "_blank");
  } catch (x) {
  }
  if (!w) location.href = u;
}, true);
render();
if (_loadFailed) setTimeout(() => toast("⚠️ تعذّرت قراءة البيانات المحفوظة؛ حُفظت نسخة منها في المتصفح"), 1200);
(function() {
  const s = document.getElementById("spl");
  if (!s) return;
  try {
    const o = (S.office || "").trim(), e = document.getElementById("spo");
    if (o) e.textContent = o;
  } catch (x) {
  }
  const kill = () => {
    if (s.parentNode) s.remove();
  };
  s.addEventListener("click", () => {
    s.classList.add("sp-out");
    setTimeout(kill, 500);
  });
  setTimeout(kill, 5200);
})();
