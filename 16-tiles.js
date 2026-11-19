/**
 * 16 · tiles.js — أيقونات وأقسام الإعدادات
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const SI = { stock: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>', exp: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>', pays: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>', late: '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/>', stats: '<path d="M18 20V10M12 20V4M6 20v-6"/>', profit: '<path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/>', cash: '<path d="M3 21h18M5 21V10M9 21V10M15 21V10M19 21V10M12 3L2 9h20z"/>', cust: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>', emp: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>', log: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', bak: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>' };
function stiles() {
  const L = lateList(), T = [["stock", "المخزن", "#06b6d4", "#0e7490", S.items.length + " صنف"], ["exp", "المصروفات", "#14b8a6", "#0f766e", S.exps.length + " مصروف"], ["pays", "التسديدات", "#0ea5e9", "#0369a1", S.pays.length + " دفعة"], ["late", "الأقساط المتأخرة", "#fb7185", "#e11d48", L.length + " قسط متأخر"], ["stats", "الإحصائيات", "#60a5fa", "#2563eb", "ملخص وتحليلات"], ["profit", "الأرباح", "#34d399", "#059669", "الأرباح المحققة"], ["cash", "الصندوق", "#818cf8", "#4f46e5", "الرصيد " + F(cash()) + " د.ع"], ["cust", "العملاء", "#38bdf8", "#0284c7", S.cust.length + " عميل"], ["emp", "الموظفون", "#94a3b8", "#475569", S.emp.length + " موظف"], ["log", "سجل العمليات", "#fbbf24", "#d97706", "آخر العمليات"], ["bak", "النسخة الاحتياطية", "#2dd4bf", "#0d9488", "تصدير واستعادة البيانات"]];
  return '<div class="mut" style="margin:6px 4px 10px;font-weight:700">الأقسام</div>' + T.map((t) => `<div class="rv srow" data-d="d" onclick="go('` + t[0] + `')"><div class="sico" style="background:linear-gradient(135deg,` + t[2] + "," + t[3] + ')"><svg viewBox="0 0 24 24">' + SI[t[0]] + '</svg></div><div class="stx"><b>' + t[1] + "</b><small>" + t[4] + '</small></div><span class="chv">‹</span></div>').join("");
}
let _ro = null, _ly = scrollY, _up = false;
addEventListener("scroll", () => {
  _up = scrollY < _ly;
  _ly = scrollY;
}, { passive: true });
function setupReveal() {
  if (_ro) _ro.disconnect();
  const els = [...document.querySelectorAll(".rv")];
  if (!("IntersectionObserver" in window)) {
    els.forEach((e) => e.classList.add("in"));
    return;
  }
  _ro = new IntersectionObserver((es) => es.forEach((e) => {
    const t = e.target;
    if (e.isIntersecting) {
      t.style.transitionDelay = Math.min(els.indexOf(t) % 4, 3) * 50 + "ms";
      t.classList.add("in");
    } else {
      t.style.transitionDelay = "0ms";
      t.dataset.d = e.boundingClientRect.top < 0 ? "u" : "d";
      t.classList.remove("in");
    }
  }), { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  els.forEach((e) => _ro.observe(e));
}
function postRender() {
  document.getElementById("main").dataset.t = tab;
  secSearch();
  const fb = document.getElementById("fb");
  if (tab === "debts" && fSt === "late") fSt = "all";
  if (fb) {
    fb.style.display = tab === "inst" || tab === "debts" ? "flex" : "none";
    fbUpd();
  }
  const m = document.querySelector(".fm");
  if (m) m.remove();
  if (tab === "settings") setTimeout(setupReveal, 30);
}
