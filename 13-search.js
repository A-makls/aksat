/**
 * 13 · search.js — بحث الترويسة
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function hdrSearch() {
  const h = document.getElementById("hsr"), w = document.getElementById("hsw"), t = document.getElementById("ttl");
  if (!h) return;
  const on = (tab === "inst" || tab === "debts") && (scrollY > 70 || document.activeElement === h);
  if (on) {
    w.style.display = "flex";
    t.style.display = "none";
    document.getElementById("fbt").style.display = "none";
    if (h.dataset.t !== tab) {
      h.value = tab === "inst" ? qI : qD;
      h.dataset.t = tab;
    }
  } else {
    w.style.display = "none";
    t.style.display = "";
    document.getElementById("fbt").style.display = "";
  }
}
function hdrClear() {
  const h = document.getElementById("hsr");
  h.value = "";
  hdrType("");
  h.focus();
}
function hdrType(v) {
  const sr = document.getElementById("sr");
  if (!sr) return;
  if (tab === "inst") {
    qI = v;
    sr.innerHTML = srInst().rest;
  } else if (tab === "debts") {
    qD = v;
    sr.innerHTML = srDebts().rest;
  }
  const m = document.getElementById(tab === "inst" ? "qi" : "qd");
  if (m) m.value = v;
}
addEventListener("scroll", hdrSearch, { passive: true });
