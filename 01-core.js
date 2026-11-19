/**
 * 01 · core.js — الحالة والتخزين والدوال المساعدة والحسابات
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const K = "aqsat_app_v1";
const DEF = () => ({ cust: [], emp: [], items: [], inst: [], pays: [], exps: [], debts: [], log: [], cash0: 0 });
let S = DEF(), _loadFailed = false;
try {
  const r = localStorage.getItem(K);
  if (r) {
    try {
      S = Object.assign(DEF(), JSON.parse(r));
    } catch (e) {
      _loadFailed = true;
      try {
        localStorage.setItem(K + "_corrupt_" + Date.now(), r);
      } catch (_) {
      }
    }
  }
} catch (e) {
}
let _saveWarned = false;
const save = () => {
  try {
    localStorage.setItem(K, JSON.stringify(S));
    _saveWarned = false;
  } catch (e) {
    if (!_saveWarned) {
      _saveWarned = true;
      setTimeout(() => toast("⚠️ تعذّر حفظ البيانات: مساحة التخزين ممتلئة أو معطّلة"), 0);
    }
  }
};
S.inst.forEach((i, k) => {
  if (!i.no) i.no = k + 1;
});
const nextNo = () => Math.max(0, ...S.inst.map((i) => +i.no || 0)) + 1;
const uid = () => {
  try {
    const a = new Uint32Array(2);
    crypto.getRandomValues(a);
    return a[0].toString(36) + a[1].toString(36);
  } catch (e) {
    return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
  }
};
const E = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const F = (n) => Math.round(Number(n) || 0).toLocaleString("en-US");
const today = () => {
  const d = /* @__PURE__ */ new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
};
const nm = (a, id) => (a.find((x) => x.id === id) || {}).name || "—";
const LOG = (x) => {
  S.log.unshift({ t: (/* @__PURE__ */ new Date()).toLocaleString("ar-EG"), x });
  S.log = S.log.slice(0, 300);
};
let tab = "home";
const TABS = [["home", "🏠", "الرئيسية"], ["settings", "⚙️", "الإعدادات"], ["about", "ℹ️", "من نحن"], ["inst", "🧾", "الأقساط"], ["late", "⏰", "الأقساط المتأخرة"], ["pays", "💵", "التسديدات"], ["debts", "🤝", "الديون"], ["stock", "📦", "المخزن"], ["cust", "👥", "العملاء"], ["emp", "👔", "الموظفون"], ["exp", "💸", "المصروفات"], ["profit", "📈", "الأرباح"], ["stats", "📊", "الإحصائيات"], ["cash", "🏦", "الصندوق"], ["log", "📜", "سجل العمليات"], ["bak", "💾", "النسخة الاحتياطية"]];
let _pinOK = false;
const go = (t) => {
  if (t === "bak" && S.pin && !_pinOK) {
    pinAsk(() => go("bak"));
    return;
  }
  if (t !== "bak") _pinOK = false;
  window.__animGo = true;
  if (t !== tab) PREV = tab;
  NAV.length = 0;
  tab = t;
  render();
  scrollTo(0, 0);
};
const paid = (i) => S.pays.filter((p) => p.inst === i.id).reduce((a, p) => a + p.amt, 0);
const monthly = (i) => i.mon > 0 ? i.mon : (i.total - i.down) / (i.months || 1) || 0;
const debtIn = () => S.debts.filter((d) => d.type === "in").reduce((a, d) => a + d.paid, 0);
const debtOut = () => S.debts.filter((d) => d.type === "out").reduce((a, d) => a + d.paid, 0);
const sum = (a, k) => a.reduce((x, y) => x + (+y[k] || 0), 0);
const cash = () => S.cash0 + sum(S.pays, "amt") + debtIn() - sum(S.exps, "amt") - debtOut();
const profitOf = (i) => i.total > 0 ? (i.total - i.cost) * Math.min(1, paid(i) / i.total) : 0;
const lateList = () => S.inst.map((i) => ({ i, ...late(i) })).filter((x) => x.L > 0).sort((a, b) => b.days - a.days);
