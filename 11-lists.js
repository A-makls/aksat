/**
 * 11 · lists.js — بطاقات الأقساط وتفاصيل العميل وتسديد المجموعات
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const IC_P = '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6z"/></svg>', IC_B = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8h12l1 12H5zM9 8V6a3 3 0 0 1 6 0v2"/></svg>', IC_BELL = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22a2.5 2.5 0 0 0 2.4-2H9.6A2.5 2.5 0 0 0 12 22zm7-6v-5a7 7 0 0 0-5.5-6.8V3.5a1.5 1.5 0 0 0-3 0v.7A7 7 0 0 0 5 11v5l-2 2v1h18v-1z"/></svg>';
function iCard(i, g) {
  const l = late(i), c = S.cust.find((k) => k.id === i.cust) || {}, pc = i.total ? Math.max(0, Math.min(100, l.p / i.total * 100)) : 0, done = l.rem <= 0, lt = l.L > 0 && !done, ph = normPh(c.phone);
  const acts = '<div class="ia" onclick="event.stopPropagation()">' + (done ? "" : `<button class="ab pay" onclick="payInst('` + i.id + `')">💳 تسديد</button>` + (ph ? '<a class="ab wa" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgOf({ i, ...l })) + '">' + WA + " تذكير</a>" : `<button class="ab wa" onclick="toast('أضف رقم هاتف العميل')">` + WA + " تذكير</button>")) + (ph ? `<button class="ab cl" onclick="callPh('` + ph + `')">📞 اتصال</button>` : `<button class="ab cl" onclick="toast('أضف رقم هاتف العميل')">📞 اتصال</button>`) + "</div>";
  const bell = lt ? ph ? '<a class="bl" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgOf({ i, ...l })) + '" onclick="event.stopPropagation()">' + IC_BELL + "</a>" : `<button class="bl" onclick="event.stopPropagation();toast('أضف رقم هاتف العميل')">` + IC_BELL + "</button>" : "";
  return '<div class="iw' + (lt ? " lt2" : "") + (done ? " dn2" : "") + `" onclick="openInst('` + i.id + `')">` + (lt ? '<div class="al"><span class="ex">!</span>تنبيه: الزبون تجاوز اليوم المستحق لتسديد</div>' : "") + '<div class="ic2"><div class="ih"><div class="av2">' + (g ? IC_B : IC_P) + '</div><div class="it2"><b>' + (g ? E(i.desc) : E(c.name || "—") + " (" + (i.no || "—") + ")") + "</b><span>" + (g ? "رقم السجل " + (i.no || "—") + " · " + (i.start || "").replace(/-/g, "/") : IC_B + E(i.desc)) + "</span></div>" + bell + '<span class="pl">' + (done ? "مكتمل ✓" : "نشط") + '</span></div><div class="ib"><div class="bx"><small>المبلغ الكلي</small><b>' + F(i.total) + ' د.ع</b></div><div class="bx"><small>المتبقي</small><b>' + F(l.rem) + ' د.ع</b></div></div><div class="ip"><span>نسبة السداد</span><b>' + pc.toFixed(1) + '%</b></div><div class="pb"><i style="width:' + pc + "%;background-size:" + (pc > 0 ? 1e4 / pc : 100) + '% 100%"></i></div>' + acts + "</div></div>";
}
function instList() {
  if (!S.inst.length) return '<div class="ilist">' + empty("لا توجد أقساط بعد") + "</div>";
  const G = /* @__PURE__ */ new Map();
  S.inst.forEach((i, k) => {
    const y = i.cust || "n:" + i.id, g = G.get(y) || { a: [], k: 0 };
    g.a.push(i);
    g.k = k;
    G.set(y, g);
  });
  return '<div class="ilist">' + [...G.values()].map((g) => ({ g, d: g.a.every((i) => late(i).rem <= 0) })).sort((x, y) => x.d - y.d || y.g.k - x.g.k).map((x) => x.g.a.length > 1 ? gCard(x.g.a) : iCard(x.g.a[0])).join("") + "</div>";
}
const gInsts = (id) => S.inst.filter((i) => i.cust === id);
function gStat(a) {
  const ls = a.map((i) => ({ i, ...late(i) }));
  return { t: sum(a, "total"), p: ls.reduce((s, x) => s + x.p, 0), r: ls.reduce((s, x) => s + x.rem, 0), L: ls.reduce((s, x) => s + (x.rem > 0 ? x.L : 0), 0), n: ls.filter((x) => x.L > 0 && x.rem > 0).length, no: [...new Set(a.map((i) => i.no).filter(Boolean))] };
}
function msgGrp(id) {
  const c = S.cust.find((k) => k.id === id) || {}, a = gInsts(id), s = gStat(a);
  return "السلام عليكم\n\nتحية طيبة *" + (c.name || "") + (s.no.length === 1 ? " (" + s.no[0] + ")" : "") + "*\n\n" + a.map((i) => ({ i, ...late(i) })).filter((x) => x.rem > 0).map((x) => "(" + x.i.desc + ")\n▫️ المبلغ الإجمالي: " + F(x.i.total) + " د.ع\n▫️ المبلغ المدفوع: " + F(x.p) + " د.ع\n▫️ المبلغ المتبقي: " + F(x.rem) + " د.ع").join("\n\n") + "\n\n⏰ نرجو منكم التكرم بتسديد القسط";
}
function copyGrp(id) {
  copyText(msgGrp(id));
  toast("تم نسخ ملخص الأقساط");
}
function openG(id) {
  NAV.push({ t: tab, g: curG, y: scrollY });
  curG = id;
  tab = "gdetail";
  render();
  scrollTo(0, 0);
}
function backInst() {
  navBack("inst");
}
function gCard(a) {
  const id = a[0].cust, c = S.cust.find((k) => k.id === id) || {}, ph = normPh(c.phone), s = gStat(a), done = s.r <= 0, lt = s.n > 0 && !done, pc = s.t ? Math.max(0, Math.min(100, s.p / s.t * 100)) : 0, wa = ph ? "https://wa.me/" + ph + "?text=" + encodeURIComponent(msgGrp(id)) : "", acts = '<div class="ia" onclick="event.stopPropagation()">' + (done ? "" : `<button class="ab pay" onclick="payGrp('` + id + `')">💳 تسديد</button>` + (ph ? '<a class="ab wa" target="_blank" rel="noopener" href="' + wa + '">' + WA + " تذكير</a>" : `<button class="ab wa" onclick="toast('أضف رقم هاتف العميل')">` + WA + " تذكير</button>")) + (ph ? `<button class="ab cl" onclick="callPh('` + ph + `')">📞 اتصال</button>` : `<button class="ab cl" onclick="toast('أضف رقم هاتف العميل')">📞 اتصال</button>`) + "</div>", bell = lt ? ph ? '<a class="bl" target="_blank" rel="noopener" href="' + wa + '" onclick="event.stopPropagation()">' + IC_BELL + "</a>" : `<button class="bl" onclick="event.stopPropagation();toast('أضف رقم هاتف العميل')">` + IC_BELL + "</button>" : "";
  return '<div class="iw gp' + (lt ? " lt2" : "") + (done ? " dn2" : "") + `" onclick="openG('` + id + `')">` + (lt ? '<div class="al"><span class="ex">!</span>تنبيه: الزبون تجاوز اليوم المستحق لتسديد' + (s.n > 1 ? " (" + s.n + " أقساط)" : "") + "</div>" : "") + '<div class="ic2"><div class="ih"><div class="av2">' + IC_P + '</div><div class="it2"><b>' + E(c.name || "—") + (s.no.length === 1 ? " (" + s.no[0] + ")" : "") + "</b><span>" + IC_B + a.length + " أقساط</span></div>" + bell + '<span class="pl">' + (done ? "مكتمل ✓" : "نشط") + '</span></div><div class="ib"><div class="bx"><small>المبلغ الكلي</small><b>' + F(s.t) + ' د.ع</b></div><div class="bx"><small>المتبقي</small><b>' + F(s.r) + ' د.ع</b></div></div><div class="ip"><span>نسبة السداد</span><b>' + pc.toFixed(1) + '%</b></div><div class="pb"><i style="width:' + pc + "%;background-size:" + (pc > 0 ? 1e4 / pc : 100) + '% 100%"></i></div>' + acts + '</div><div class="gstk"></div></div>';
}
V.gdetail = function() {
  const a = gInsts(curG);
  if (!a.length) {
    tab = "inst";
    return V.inst();
  }
  const id = curG, c = S.cust.find((k) => k.id === id) || {}, ph = normPh(c.phone), name = c.name || "—", s = gStat(a), gu = [...new Set(a.map((i) => i.guar).filter(Boolean))], old = a.map((i) => i.start).filter(Boolean).sort()[0] || "", bn = s.r > 0 ? '<div class="dbn" style="background:' + (s.n ? "#ef4444" : "#4285dd") + '">المتبقي: ' + F(s.r) + " د.ع</div>" : '<div class="dbn" style="background:#5cb85c">مسدد بالكامل ✓</div>', list = a.map((i) => [i, S.inst.indexOf(i)]).sort((x, y) => (late(x[0]).rem <= 0) - (late(y[0]).rem <= 0) || y[1] - x[1]).map((x) => iCard(x[0], 1)).join(""), waB = ph ? '<a style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:#25d366;text-decoration:none;font-size:19px;color:#fff" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgGrp(id)) + '">' + WA + "</a>" : `<button onclick="toast('أضف رقم هاتف العميل')">` + WA + "</button>";
  return `<div class="tb" style="align-items:center"><button onclick="navBack('inst')">➡️</button><b style="flex:1;padding:0 8px">` + E(name) + `</b><button onclick="editCust('` + id + `')" aria-label="تعديل">✏️</button><button onclick="print()">🖨️</button>` + (s.r > 0 ? waB : "") + `<button onclick="copyGrp('` + id + `')">📋</button></div>` + bn + '<div class="sm3"><div class="c"><span>👛</span><div class="mut">المبلغ الكلي</div><b style="color:#2563eb">' + F(s.t) + '</b></div><div class="c"><span>💵</span><div class="mut">المدفوع</div><b class="ok">' + F(s.p) + '</b></div><div class="c"><span>💲</span><div class="mut">المتبقي</div><b style="color:#f59e0b">' + F(s.r) + '</b></div></div><div class="dcard">' + kv("الاسم", E(name)) + kv("رقم الهاتف", c.phone ? `<a onclick="callPh('` + ph + `')" style="cursor:pointer">` + E(c.phone) + " 📞</a>" : "—") + kv("رقم السجل", s.no.length ? E(s.no.join("، ")) : "—") + (gu.length ? kv("الكفيل", E(gu.join("، "))) : "") + kv("عدد الأقساط", a.length) + kv("المتأخر", F(s.L) + " د.ع", s.L ? "bad" : "") + kv("تاريخ أقدم قسط", old.split("-").reverse().join("/")) + '</div><h2 style="margin-top:16px">قائمة أقساط ' + E(name) + '</h2><div class="ilist">' + list + `</div><div class="bt"><button style="background:#4285dd" onclick="addInst(null,'` + id + `')">➕<br>إضافة قسط</button><button style="background:#5cb85c" onclick="payGrp('` + id + `')">🧾<br>تسديد</button></div>`;
};
function payGrp(id) {
  const a = gInsts(id).filter((i) => late(i).rem > 0);
  if (!a.length) {
    toast("لا توجد أقساط مستحقة");
    return;
  }
  if (a.length === 1) return payInstDlg(a[0].id);
  a.sort((p, q) => (late(q).L > 0) - (late(p).L > 0) || String(p.start).localeCompare(String(q.start)));
  const c = S.cust.find((k) => k.id === id) || {}, ip = "background:#fff;color:#0f172a;margin:0 0 12px", cs = a.map((i, k) => {
    const l = late(i);
    return '<label class="pc" style="display:flex;align-items:center;gap:10px;background:#fff;border:2px solid transparent;border-radius:14px;padding:12px;margin-bottom:8px;cursor:pointer"><input type="radio" name="d" value="' + i.id + '"' + (k ? "" : " checked") + ' style="width:auto;margin:0"><div style="flex:1"><b>' + E(i.desc) + '</b> <span class="tag">رقم السجل ' + (i.no || "—") + '</span><div class="mut">القسط الشهري ' + F(l.m) + (l.L > 0 ? ' · <span class="bad">متأخر ' + F(l.L) + "</span>" : "") + '</div></div><b style="color:#dc2626">' + F(l.rem) + "</b></label>";
  }).join(""), m = document.createElement("div");
  m.className = "ov";
  m.style.alignItems = "center";
  m.innerHTML = '<form class="md" style="padding:0;border-radius:22px;max-width:380px;width:92%;overflow:auto;max-height:90vh;background:#f1f8ec;color:#0f172a"><div style="background:#6cc644;color:#fff;padding:18px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:18px"><span>تسديد قسط · ' + E(c.name || "") + '</span><span id="x" style="cursor:pointer;font-size:22px">✕</span></div><div style="padding:16px"><div style="font-weight:700;margin-bottom:8px">اختر القسط المراد تسديده</div>' + cs + '<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;margin:12px 0"><div class="mut">المبلغ المستحق</div><b id="rm" style="font-size:30px;color:#dc2626"></b></div><input name="amount" type="number" step="any" min="1" required placeholder="💳 المبلغ المراد تسديده" style="' + ip + '"><div class="mut" style="text-align:center;margin:0 0 12px;font-size:12.5px">سيُسجَّل التسديد بتاريخ اليوم ' + today() + '</div><button class="btn" style="width:100%;background:#6cc644;padding:14px;font-weight:700;border-radius:14px">تسديد</button></div></form>';
  document.body.appendChild(m);
  m.querySelector("#x").onclick = () => m.remove();
  m.onclick = (e) => {
    if (e.target === m) m.remove();
  };
  const f = m.querySelector("form"), cur = () => a.find((i) => i.id === f.d.value), sync = () => {
    const l = late(cur());
    f.querySelectorAll(".pc").forEach((x) => {
      x.style.borderColor = x.querySelector("input").checked ? "#6cc644" : "transparent";
    });
    m.querySelector("#rm").textContent = F(l.rem);
    f.amount.value = String(Math.round(Math.min(l.m, l.rem)));
    f.amount.dispatchEvent(new Event("input", { bubbles: true }));
  };
  f.addEventListener("change", (e) => {
    if (e.target.name === "d") sync();
  });
  sync();
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), i = cur(), amt = Math.min(+d.amount, late(i).rem);
    if (!(amt > 0)) return;
    S.pays.push({ id: uid(), inst: i.id, amt, date: today(), note: "قسط" });
    LOG("تسديد " + F(amt) + " - " + i.desc);
    save();
    m.remove();
    render();
    setTimeout(() => receipt(i.id), 50);
  };
}
function debtPays(id, one) {
  const a0 = S.debts.find((x) => x.id === id);
  if (!a0) return;
  const c = S.cust.find((k) => k.id === a0.cust), nm2 = c ? c.name : a0.name, a = one ? [a0] : grp(gk(a0)), mix = new Set(a.map((x) => x.type)).size > 1, rows = [];
  let un = 0;
  a.forEach((x) => {
    const pl = (x.pl || []).filter((p) => p && +p.amt > 0);
    pl.forEach((p) => rows.push({ p, x }));
    un += Math.max(0, Math.round(x.paid - pl.reduce((s, p) => s + (+p.amt || 0), 0)));
  });
  rows.sort((u, v) => String(v.p.date || "").localeCompare(String(u.p.date || "")));
  const t = sum(a, "amount"), pd = sum(a, "paid"), row = (d, lb, am, cl, extra) => '<div class="kv" style="align-items:center"><div><b>' + d + '</b><div class="mut">' + lb + '</div></div><div style="display:flex;align-items:center;gap:8px"><b class="' + cl + '">' + am + "</b>" + (extra || "") + "</div></div>", list = rows.map(({ p, x }) => row(String(p.date || "—").split("-").reverse().join("/"), E((one ? "" : (x.prod || x.note || "دين") + (mix ? " (" + (x.type === "in" ? "لي" : "عليّ") + ")" : "") + (p.note ? " · " : "")) + (p.note || (one ? "تسديد" : ""))), F(p.amt) + " د.ع", x.type === "in" ? "ok" : "bad", '<button class="btn sm ghost" onclick="debtReceipt(\'' + x.id + '\',' + (x.pl || []).indexOf(p) + ')">🧾 وصل</button>')).join("") + (un ? row("—", "تسديدات سابقة (بدون تفاصيل)", F(un) + " د.ع", "ok") : ""), o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = '<div class="md" style="padding:0;border-radius:22px;max-width:400px;width:92%;overflow:hidden;display:flex;flex-direction:column"><div style="background:linear-gradient(135deg,#0d9488,#14b8a6);color:#fff;padding:16px 18px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:17px"><span>🕘 تسديدات الديون · ' + E(nm2) + '</span><span id="x" style="cursor:pointer;font-size:22px">✕</span></div><div style="padding:14px 16px;overflow:auto"><div class="sm3"><div class="c"><div class="mut">الدين الكلي</div><b style="color:#2563eb">' + F(t) + '</b></div><div class="c"><div class="mut">المسدد</div><b class="ok">' + F(pd) + '</b></div><div class="c"><div class="mut">الباقي</div><b style="color:#f59e0b">' + F(t - pd) + '</b></div></div><div class="mut" style="margin:0 0 4px">عدد التسديدات: ' + (rows.length + (un ? 1 : 0)) + "</div>" + (list || '<div class="empty">لا توجد تسديدات</div>') + '</div><div style="padding:0 16px 16px"><button class="btn ghost" id="cl" style="width:100%">إغلاق</button></div></div>';
  document.body.appendChild(o);
  o.querySelector("#x").onclick = o.querySelector("#cl").onclick = () => o.remove();
  o.onclick = (e) => {
    if (e.target === o) o.remove();
  };
}
function msgPurchase(x) {
  const c = S.cust.find((k) => k.id === x.i.cust) || {};
  return "السلام عليكم\n\nتحية طيبة  " + (c.name || "") + "\nتذكير بخصوص القسط\n\n▫️ المبلغ الإجمالي: " + F(x.i.total) + " د.ع\n▫️ المبلغ المدفوع: " + F(x.p) + " د.ع\n▫️ المبلغ المتبقي: " + F(x.rem) + " د.ع\n\nوصل شراء (" + x.i.desc + ") (" + (x.i.start || "").replace(/-/g, "/") + ")";
}
const APP_VER = "1.1";
function officeCard() {
  return '<div class="card"><div style="font-weight:700;font-size:16px">🏢 اسم المكتب</div><div class="mut" style="margin:4px 0 12px">يظهر في الواجهة الرئيسية، وإذا تركته فارغاً تظهر عبارة «اكتب اسم مكتبك من الإعدادات»</div><div style="display:flex;gap:8px"><input id="ofn" placeholder="مثال: مكتب النور للأقساط" value="' + E(S.office || "") + '" style="margin:0"><button class="btn" onclick="saveOffice()">حفظ</button></div></div>';
}
function saveOffice() {
  S.office = document.getElementById("ofn").value.trim();
  save();
  toast(S.office ? "تم حفظ اسم المكتب" : "تمت العودة للاسم الافتراضي");
}
