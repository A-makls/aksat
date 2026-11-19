/**
 * 15 · filters.js — تصفية البطاقات وملاحظة الدين
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
let fSt = "all";
const FOPT = [["all", "الكل", "#64748b"], ["active", "النشطة", "#3b82f6"], ["late", "المتأخرة", "#ef4444"], ["done", "المكتملة", "#9aa0a6"]];
const stOf = (i) => {
  const l = late(i);
  return l.rem <= 0 ? "done" : l.L > 0 ? "late" : "active";
};
const dStOf = (a) => a.every((d) => d.paid >= d.amount) ? "done" : "active";
const fMatch = (st) => fSt === "all" || (fSt === "active" ? st !== "done" : st === fSt);
function fCounts() {
  const c = { all: 0, active: 0, late: 0, done: 0 };
  if (tab === "debts") {
    const G = {};
    S.debts.forEach((d) => (G[gk(d)] = G[gk(d)] || []).push(d));
    Object.values(G).forEach((a) => {
      const st = dStOf(a);
      c.all++;
      if (st === "done") c.done++;
      else c.active++;
    });
  } else S.inst.forEach((i) => {
    const st = stOf(i);
    c.all++;
    if (st === "done") c.done++;
    else {
      c.active++;
      if (st === "late") c.late++;
    }
  });
  return c;
}
function fbUpd() {
  const fb = document.getElementById("fb"), o = FOPT.find((x) => x[0] === fSt);
  if (!fb) return;
  document.getElementById("fbt").textContent = o[1];
  fb.classList.toggle("act", fSt !== "all");
}
function fMenu(e) {
  e.stopPropagation();
  const old = document.querySelector(".fm");
  if (old) {
    old.remove();
    return;
  }
  const c = fCounts(), m = document.createElement("div");
  m.className = "fm";
  m.onclick = (ev) => ev.stopPropagation();
  m.innerHTML = FOPT.filter((o) => tab !== "debts" || o[0] !== "late").map((o) => `<button class='fi${fSt === o[0] ? " on" : ""}' onclick="fSet('${o[0]}')"><i style='background:${o[2]}'></i><span>${o[1]}</span><b>${c[o[0]]}</b></button>`).join("");
  document.body.appendChild(m);
  const r = document.getElementById("fb").getBoundingClientRect();
  m.style.top = r.bottom + 8 + "px";
  m.style.left = Math.max(8, Math.min(innerWidth - m.offsetWidth - 8, r.left + r.width / 2 - m.offsetWidth / 2)) + "px";
  m.style.right = "auto";
}
function fSet(k) {
  fSt = k;
  const m = document.querySelector(".fm");
  if (m) m.remove();
  fbUpd();
  const sr = document.getElementById("sr");
  if (sr) sr.innerHTML = (tab === "inst" ? srInst() : srDebts()).rest;
}
document.addEventListener("click", () => {
  const m = document.querySelector(".fm");
  if (m) m.remove();
});
function showNote(id) {
  const d = S.debts.find((x) => x.id === id);
  if (!d) return;
  const o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = `<div class='md' style='border-radius:22px;max-width:340px;width:90%;text-align:center'><div class='ntb'>!</div><h3>ملاحظة الدين</h3>${d.prod ? `<div class='mut' style='margin-bottom:8px'>${E(d.prod)}</div>` : ""}<div style='white-space:pre-wrap;line-height:1.9;font-size:15px;margin-bottom:14px'>${E(d.note)}</div><button class='btn ghost' style='width:100%' id='cl'>إغلاق</button></div>`;
  document.body.appendChild(o);
  o.querySelector("#cl").onclick = () => o.remove();
  o.onclick = (e) => {
    if (e.target === o) o.remove();
  };
}
function editGrp(id) {
  const a0 = S.debts.find((x) => x.id === id);
  if (!a0) return;
  const arr = grp(gk(a0));
  if (arr.length === 1) editDebt(arr[0].id);
  else openDebt(id);
}
