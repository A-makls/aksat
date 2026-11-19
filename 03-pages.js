/**
 * 03 · pages.js — صفحات العرض: المتأخرات، التسديدات، المخزن، العملاء، تفاصيل القسط والدين
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const V = {
  late() {
    const L = lateList();
    return head("الأقساط المتأخرة") + (L.length ? L.map((x) => card(E(nm(S.cust, x.i.cust)), E(x.i.desc) + (x.days ? " · متأخر " + x.days + " يوم" : ""), '<span class="bad">' + F(x.L) + "</span>", `<button class="btn sm grn" onclick="payInst('` + x.i.id + `')">تسديد</button>` + remind(x))).join("") : empty("🎉 لا توجد أقساط متأخرة"));
  },
  pays() {
    const a = S.pays.slice().sort((x, y) => y.date.localeCompare(x.date));
    return head("التسديدات") + (a.length ? a.map((p) => {
      const i = S.inst.find((x) => x.id === p.inst) || {};
      return card(E(nm(S.cust, i.cust)), E(i.desc || "—") + " · " + p.date + " · " + E(p.note || ""), '<span class="ok">+' + F(p.amt) + "</span>");
    }).join("") : empty("لا توجد تسديدات"));
  },
  stock() {
    const c = sum(S.items.map((i) => ({ v: i.qty * i.cost })), "v"), s = sum(S.items.map((i) => ({ v: i.qty * i.price })), "v");
    return head("المخزن", "addItem") + '<div class="grid"><div class="st"><b>' + F(c) + '</b><small>قيمة المخزون (شراء)</small></div><div class="st"><b>' + F(s) + "</b><small>قيمة المخزون (بيع)</small></div></div>" + (S.items.length ? S.items.map((i) => card(E(i.name), "شراء " + F(i.cost) + " · بيع " + F(i.price), '<span class="' + (i.qty <= 2 ? "bad" : "") + '">' + i.qty + " قطعة</span>", `<button class="btn sm" onclick="restock('` + i.id + `')">＋ كمية</button>` + dbtn("items", i.id, i.name))).join("") : empty("المخزن فارغ"));
  },
  cust() {
    return head("العملاء", "addCust") + (S.cust.length ? S.cust.map((c) => {
      const ins = S.inst.filter((i) => i.cust === c.id), r = ins.reduce((a, i) => a + late(i).rem, 0);
      return card(E(c.name), E(c.phone || "") + " · " + ins.length + " أقساط", '<span class="' + (r ? "warn" : "ok") + '">' + F(r) + "</span>", callC(c.id) + `<button class="btn sm" onclick="editCust('` + c.id + `')">✏️ تعديل</button>` + dbtn("cust", c.id, c.name));
    }).join("") : empty("لا يوجد عملاء"));
  },
  emp() {
    return head("الموظفون", "addEmp") + (S.emp.length ? S.emp.map((e) => card(E(e.name), E(e.role || ""), F(e.sal), `<button class="btn sm grn" onclick="payEmp('` + e.id + `')">صرف الراتب</button>` + dbtn("emp", e.id, e.name))).join("") : empty("لا يوجد موظفون"));
  },
  exp() {
    const a = S.exps.slice().sort((x, y) => y.date.localeCompare(x.date));
    return head("المصروفات", "addExp") + '<div class="card">' + kv("إجمالي المصروفات", F(sum(S.exps, "amt")), "bad") + "</div>" + (a.length ? a.map((e) => card(E(e.title), e.date, '<span class="bad">-' + F(e.amt) + "</span>", dbtn("exps", e.id, "المصروف"))).join("") : empty("لا توجد مصروفات"));
  },
  profit() {
    const g = S.inst.reduce((a, i) => a + profitOf(i), 0), e = sum(S.exps, "amt"), exp = S.inst.reduce((a, i) => a + Math.max(0, i.total - i.cost), 0);
    return head("الأرباح") + '<div class="hero"><small>صافي الربح (بعد المصروفات)</small><b>' + F(g - e) + '</b></div><div class="card">' + kv("الأرباح المحققة من الأقساط", F(g), "ok") + kv("المصروفات", F(e), "bad") + kv("أرباح متوقعة عند اكتمال الأقساط", F(exp)) + "</div>" + S.inst.map((i) => card(E(nm(S.cust, i.cust)), E(i.desc), F(profitOf(i)), "", kv("ربح العقد", F(i.total - i.cost)))).join("");
  },
  stats() {
    const ms = [];
    for (let k = 5; k >= 0; k--) {
      const d = /* @__PURE__ */ new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() - k);
      ms.push(d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0"));
    }
    const inn = ms.map((m) => S.pays.filter((p) => p.date.slice(0, 7) === m).reduce((a, p) => a + p.amt, 0)), out = ms.map((m) => S.exps.filter((p) => p.date.slice(0, 7) === m).reduce((a, p) => a + p.amt, 0)), mx = Math.max(1, ...inn, ...out);
    let svg = '<svg viewBox="0 0 340 170" width="100%">';
    ms.forEach((m, i) => {
      const x = 10 + i * 54, h1 = inn[i] / mx * 120, h2 = out[i] / mx * 120;
      svg += '<rect x="' + x + '" y="' + (130 - h1) + '" width="20" height="' + h1 + '" rx="4" fill="#14b8a6"/><rect x="' + (x + 22) + '" y="' + (130 - h2) + '" width="20" height="' + h2 + '" rx="4" fill="#f87171"/><text x="' + (x + 21) + '" y="150" font-size="10" text-anchor="middle" fill="currentColor">' + m.slice(5) + "</text>";
    });
    svg += "</svg>";
    const sv = S.items.reduce((a, i) => a + i.qty, 0), low = S.items.filter((i) => i.qty <= 2).length;
    return head("الإحصائيات") + '<div class="card"><b>التحصيل مقابل المصروفات (آخر 6 أشهر)</b><div class="mut"><span class="ok">■</span> تحصيل &nbsp; <span class="bad">■</span> مصروفات</div>' + svg + '</div><div class="card"><b>إحصائيات المخزن</b>' + kv("عدد الأصناف", S.items.length) + kv("إجمالي القطع", sv) + kv("أصناف قاربت على النفاد", low, low ? "bad" : "") + kv("الأرباح المتوقعة من المخزون", F(S.items.reduce((a, i) => a + i.qty * (i.price - i.cost), 0)), "ok") + '</div><div class="card"><b>عام</b>' + kv("العملاء", S.cust.length) + kv("الموظفون", S.emp.length) + kv("عقود الأقساط", S.inst.length) + kv("إجمالي المبالغ المحصلة", F(sum(S.pays, "amt")), "ok") + "</div>";
  },
  cash() {
    return head("الصندوق") + '<div class="hero"><small>الرصيد الحالي</small><b>' + F(cash()) + '</b></div><div class="card">' + kv("الرصيد الافتتاحي", F(S.cash0)) + kv("+ تسديدات الأقساط", F(sum(S.pays, "amt")), "ok") + kv("+ ديون مستلمة", F(debtIn()), "ok") + kv("− المصروفات والرواتب", F(sum(S.exps, "amt")), "bad") + kv("− ديون مسددة", F(debtOut()), "bad") + '</div><button class="btn" onclick="setCash()">تعديل الرصيد الافتتاحي</button>';
  },
  log() {
    return head("سجل العمليات") + (S.log.length ? S.log.map((l) => card(E(l.x), l.t)).join("") : empty("لا توجد عمليات"));
  }
};
function normPh(p) {
  let d = String(p || "").replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("964")) return d;
  if (d.startsWith("0")) d = d.slice(1);
  return "964" + d;
}
function callC(id) {
  const c = S.cust.find((x) => x.id === id) || {}, ph = normPh(c.phone);
  return ph ? `<button class="btn sm" onclick="callPh('` + ph + `')">📞 اتصال</button>` : "";
}
function remind(x) {
  const c = S.cust.find((c2) => c2.id === x.i.cust) || {}, ph = normPh(c.phone), msg = encodeURIComponent("السلام عليكم\n\nتحية طيبة *" + (c.name || "") + " (" + (x.i.no || "") + ")*\n\n(" + x.i.desc + ")\n▫️ المبلغ الإجمالي: " + F(x.i.total) + " د.ع\n▫️ المبلغ المدفوع: " + F(x.p) + " د.ع\n▫️ المبلغ المتبقي: " + F(x.rem) + " د.ع\n\n⏰ نرجو منكم التكرم بتسديد القسط");
  return ph ? callC(x.i.cust) + '<a class="btn sm" style="text-decoration:none" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + msg + '">' + WA + ' تذكير واتساب</a><a class="btn sm ghost" style="text-decoration:none" target="_blank" rel="noopener" href="sms:+' + ph + "?&body=" + msg + '">✉️ رسالة</a>' : '<span class="mut">أضف رقم هاتف العميل للتذكير</span>';
}
let cur = null;
let curG = null;
function openInst(id) {
  NAV.push({ t: tab, g: curG, y: scrollY });
  cur = id;
  tab = "detail";
  render();
  scrollTo(0, 0);
}
function msgOf(x) {
  const c = S.cust.find((c2) => c2.id === x.i.cust) || {};
  return "السلام عليكم\n\nتحية طيبة *" + (c.name || "") + " (" + (x.i.no || "") + ")*\n\n(" + x.i.desc + ")\n▫️ المبلغ الإجمالي: " + F(x.i.total) + " د.ع\n▫️ المبلغ المدفوع: " + F(x.p) + " د.ع\n▫️ المبلغ المتبقي: " + F(x.rem) + " د.ع\n\n⏰ نرجو منكم التكرم بتسديد القسط";
}
function copyInst(id) {
  const i = S.inst.find((x) => x.id === id);
  copyText(msgOf({ i, ...late(i) }));
  alert("تم نسخ ملخص القسط");
}
V.detail = function() {
  const i = S.inst.find((x2) => x2.id === cur);
  if (!i) {
    const e = NAV.pop();
    tab = e ? e.t : "inst";
    if (e && e.g != null) curG = e.g;
    return V[tab]();
  }
  const l = late(i), x = { i, ...l }, c = S.cust.find((k) => k.id === i.cust) || {}, ph = normPh(c.phone);
  const st = l.rem === 0 ? "مكتمل" : l.L > 0 ? "متأخر" : "قيد التنفيذ";
  const ps = S.pays.filter((p) => p.inst === i.id).sort((a, b) => b.date.localeCompare(a.date));
  return `<div class="tb"><button onclick="backInst()">➡️</button><button onclick="var d=document.getElementById('pl');d.open=true;d.scrollIntoView()">🕘</button><button onclick="editInst('` + i.id + `')">✏️</button><button onclick="print()">🖨️</button><button onclick="copyInst('` + i.id + `')">📄</button><button style="margin-right:auto" onclick="del('inst','` + i.id + `','القسط')">🗑️</button></div><div class="hd"><div><b style="font-size:17px">` + E(c.name || "—") + " (" + (i.no || "—") + ')</b><div style="font-size:13px;opacity:.75">' + E(i.desc) + '</div></div><span class="pill">' + st + '</span></div><details class="sec s1" open><summary>👤 معلومات الزبون</summary>' + kv("الهاتف", c.phone ? `<a onclick="callPh('` + ph + `')" style="cursor:pointer">` + E(c.phone) + " 📞</a>" : "—") + (i.guar ? kv("الكفيل", E(i.guar)) : "") + kv("تاريخ الإنشاء", (i.created || i.start).replace(/-/g, "/")) + '</details><details class="sec s2" open><summary>📦 معلومات المنتج</summary>' + kv("اسم المنتج", E(i.desc)) + kv("الكمية", i.qty || 1) + '</details><details class="sec s3"><summary>💳 معلومات الدفع</summary>' + kv("السعر الإجمالي", F(i.total)) + kv("المقدمة", F(i.down)) + kv("مبلغ القسط", F(l.m)) + kv("نوع القسط", i.freq === "w" ? "أسبوعي" : i.freq === "d" ? "يومي" : "شهري") + kv("عدد الأقساط", i.months) + kv("المدفوع", F(l.p), "ok") + kv("المتبقي", F(l.rem), l.rem ? "bad" : "ok") + kv("المتأخر", F(l.L), l.L ? "bad" : "") + kv("الربح المحقق", F(profitOf(i))) + '</details><details class="sec s4" id="pl"><summary>🕘 سجل المدفوعات</summary>' + (ps.length ? ps.map((p) => kv(p.date + " · " + E(p.note || ""), F(p.amt) + ` <button class="btn sm red" onclick="del('pays','` + p.id + `','التسديد')">حذف</button>`, "ok")).join("") : '<div class="mut">لا توجد مدفوعات</div>') + '</details><div class="bt"><a style="background:linear-gradient(135deg,#2563eb,#1d4ed8)" target="_blank" rel="noopener" ' + (ph ? 'href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgOf(x)) + '"' : `onclick="alert('أضف رقم هاتف العميل')"`) + ">" + WA + ` إرسال تذكير</a><button style="background:#16a34a" onclick="payInst('` + i.id + `')">💳 تسديد قسط</button></div>`;
};
let curD = null;
function openDebt(id) {
  NAV.push({ t: tab, g: curG, y: scrollY });
  const d0 = S.debts.find((x) => x.id === id);
  curD = d0 ? d0.cust || "n:" + d0.name : id;
  tab = "ddetail";
  render();
  scrollTo(0, 0);
}
function editDebt(id) {
  const d = S.debts.find((x) => x.id === id);
  openForm("تعديل الدين", [{ k: "type", l: "النوع", t: "select", o: [["in", "دين لي عند شخص"], ["out", "دين عليّ لشخص"]], v: d.type }, { k: "cust", l: "العميل", t: "select", o: [["", "— كتابة اسم يدوياً —"]].concat(S.cust.map((c) => [c.id, c.name])), v: d.cust || "" }, { k: "name", l: "الاسم (إن لم تختر عميلاً)", r: 0, v: d.name }, { k: "phone", l: "رقم الهاتف", r: 0, v: d.phone || "" }, { k: "prod", l: "اسم المنتج", r: 0, v: d.prod || d.note || "" }, { k: "qty", l: "الكمية", t: "number", r: 0, v: d.qty || 1 }, { k: "amount", l: "المبلغ الكلي", t: "number", v: d.amount }, { k: "date", l: "تاريخ الدين", t: "date", v: d.date }], (x) => {
    const c = S.cust.find((k) => k.id === x.cust);
    if (!c && !x.name) {
      alert("اختر عميلاً أو اكتب الاسم");
      return false;
    }
    if (+x.amount < d.paid) {
      alert("المبلغ أقل من المسدد");
      return false;
    }
    Object.assign(d, { cust: x.cust, type: x.type, name: c ? c.name : x.name, phone: c ? c.phone : x.phone, prod: x.prod, note: "", qty: +x.qty || 1, amount: +x.amount, date: x.date });
    LOG("تعديل دين: " + (c ? c.name : x.name));
  });
}
function copyDebt(id) {
  const d = S.debts.find((x) => x.id === id);
  copyText("*" + d.name + "*\nالدين الكلي: " + F(d.amount) + " د.ع\nالمسدد: " + F(d.paid) + " د.ع\nالباقي: " + F(d.amount - d.paid) + " د.ع");
  alert("تم نسخ ملخص الدين");
}
const gk = (d) => d.cust || "n:" + d.name;
const grp = (key) => S.debts.filter((x) => gk(x) === key);
function delPerson(id) {
  const a0 = S.debts.find((x) => x.id === id), k = gk(a0);
  ask("حذف كل ديون " + a0.name + "؟", () => pinDel(true, () => {
    S.debts = S.debts.filter((x) => gk(x) !== k);
    LOG("حذف ديون " + a0.name);
    save();
    render();
  }));
}
function copyPerson(id) {
  const a0 = S.debts.find((x) => x.id === id), a = grp(gk(a0)), t = a.reduce((s, x) => s + x.amount, 0), p = a.reduce((s, x) => s + x.paid, 0);
  copyText("*" + a0.name + "*\nعدد الديون: " + a.length + "\nالكلي: " + F(t) + " د.ع\nالمسدد: " + F(p) + " د.ع\nالباقي: " + F(t - p) + " د.ع");
  toast("تم نسخ الملخص");
}
V.debts = function() {
  const G = {};
  S.debts.forEach((d) => {
    (G[gk(d)] = G[gk(d)] || []).push(d);
  });
  const rows = Object.values(G).sort((x, y) => {
    const dx = x.every((d) => d.paid >= d.amount), dy = y.every((d) => d.paid >= d.amount);
    return dx - dy || S.debts.indexOf(y[y.length - 1]) - S.debts.indexOf(x[x.length - 1]);
  }).map((a) => {
    const c = S.cust.find((k) => k.id === a[0].cust), nmx = c ? c.name : a[0].name, ph = c ? c.phone : a[0].phone, t = sum(a, "amount"), p = sum(a, "paid"), rIn = a.filter((x) => x.type === "in").reduce((s, x) => s + x.amount - x.paid, 0), rOut = a.filter((x) => x.type === "out").reduce((s, x) => s + x.amount - x.paid, 0), r = t - p, id = a[0].id;
    return card(E(nmx), a.length + " دين" + (ph ? " · " + E(ph) : "") + " · الكلي " + F(t) + " · مسدد " + F(p), '<span class="' + (rOut > rIn ? "bad" : "ok") + '">' + F(r) + "</span>", (r > 0 ? `<button class="btn sm grn" onclick="payPerson('` + id + `')">تسديد</button>` : '<span class="tag g">مسدد</span>') + (rIn > 0 ? waDebt(id) : "") + `<button class="btn sm" onclick="addDebtFor('` + id + `')">＋ دين</button><button class="btn sm" style="background:#0ea5e9" onclick="editGrp('` + id + `')">✏️ تعديل</button><button class="btn sm" style="background:#0d9488" onclick="debtPays('` + id + `')">🕘 التسديدات</button><button class="btn sm red" onclick="delPerson('` + id + `')">حذف</button>`, bar(t ? p / t * 100 : 0), "openDebt('" + id + "')", "dy" + (r <= 0 ? " dn" : ""));
  });
  return head("الديون", "addDebt") + (rows.length ? rows.join("") : empty("لا توجد ديون"));
};
V.ddetail = function() {
  const arr = grp(curD).sort((p2, q) => q.date.localeCompare(p2.date));
  if (!arr.length) {
    const e = NAV.pop();
    tab = e ? e.t : "debts";
    if (e && e.g != null) curG = e.g;
    return V[tab]();
  }
  const d0 = arr[0], c = S.cust.find((k) => k.id === d0.cust), name = c ? c.name : d0.name, phone = c ? c.phone : d0.phone, t = sum(arr, "amount"), p = sum(arr, "paid"), r = t - p, rIn = arr.filter((x) => x.type === "in").reduce((s, x) => s + x.amount - x.paid, 0), rOut = arr.filter((x) => x.type === "out").reduce((s, x) => s + x.amount - x.paid, 0), old = Math.min(...arr.map((x) => x.ts || new Date(x.date).getTime())), ms = Math.max(0, Date.now() - old), dy = Math.floor(ms / 864e5), hr = Math.floor(ms % 864e5 / 36e5), mn = Math.floor(ms % 36e5 / 6e4);
  const bn = (rIn > 0 ? '<div class="dbn" style="background:#5cb85c">الدين: ' + F(rIn) + " د.ع</div>" : "") + (rOut > 0 ? '<div class="dbn" style="background:#ef4444">دين عليّ: ' + F(rOut) + " د.ع</div>" : "") || '<div class="dbn" style="background:#5cb85c">مسدد بالكامل ✓</div>';
  const list = arr.map((x) => {
    const rr = x.amount - x.paid;
    return card(E(x.prod || x.note || "دين") + ' <span class="tag">' + (x.type === "in" ? "لي" : "عليّ") + "</span>", x.date.split("-").reverse().join("/") + " · الكلي " + F(x.amount) + " · المسدد " + F(x.paid), (x.note ? `<button class="nt" onclick="event.stopPropagation();showNote('` + x.id + `')" aria-label="ملاحظة">!</button>` : "") + '<span class="' + (x.type === "in" ? "ok" : "bad") + '">' + F(rr) + "</span>", (rr > 0 ? `<button class="btn sm grn" onclick="payDebt('` + x.id + `')">تسديد</button>` : '<span class="tag g">مسدد</span>') + `<button class="btn sm" onclick="editDebt('` + x.id + `')">✏️ تعديل</button><button class="btn sm" style="background:#0d9488" onclick="debtPays('` + x.id + `',1)">🕘 التسديدات</button>` + dbtn("debts", x.id, "الدين"), bar(x.amount ? x.paid / x.amount * 100 : 0), "", rr <= 0 ? "dn" : "");
  }).join("");
  return `<div class="tb" style="align-items:center"><button onclick="navBack('debts')">➡️</button><b style="flex:1;padding:0 8px">` + E(name) + '</b><button onclick="print()">🖨️</button>' + (rIn > 0 ? waDebt(d0.id, 1) : "") + `<button onclick="copyPerson('` + d0.id + `')">📋</button><button onclick="debtPays('` + d0.id + `')" aria-label="التسديدات">🕘</button><button onclick="delPerson('` + d0.id + `')">🗑️</button></div>` + bn + '<div class="sm3"><div class="c"><span>👛</span><div class="mut">الدين الكلي</div><b style="color:#2563eb">' + F(t) + '</b></div><div class="c"><span>💵</span><div class="mut">المسدد</div><b class="ok">' + F(p) + '</b></div><div class="c"><span>💲</span><div class="mut">الباقي</div><b style="color:#f59e0b">' + F(r) + '</b></div></div><div class="dcard">' + kv("الاسم", E(name)) + kv("رقم الهاتف", phone ? `<a onclick="callPh('` + normPh(phone) + `')" style="cursor:pointer">` + E(phone) + " 📞</a>" : "—") + kv("عدد الديون", arr.length) + kv("مدة أقدم دين", dy + " أيام و " + hr + " ساعة و " + mn + " دقيقة") + '</div><h2 style="margin-top:16px">قائمة ديون ' + E(name) + "</h2>" + list + `<div class="bt"><button style="background:#f0931b" onclick="addDebtFor('` + d0.id + `')">➕<br>إضافة دين</button><button style="background:#5cb85c" onclick="payPerson('` + d0.id + `')">🧾<br>تسديد</button></div>`;
};
function addDebtFor(id) {
  const a0 = S.debts.find((x) => x.id === id), a = grp(gk(a0)), rem = a.reduce((s, x) => s + x.amount - x.paid, 0), ip = "background:#fff;color:#0f172a;margin:0 0 12px";
  const m = document.createElement("div");
  m.className = "ov";
  m.style.alignItems = "center";
  m.innerHTML = '<form class="md" style="padding:0;border-radius:22px;max-width:380px;width:92%;overflow:hidden;background:#fdf3e7;color:#0f172a"><div style="background:#f59a23;color:#fff;padding:18px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:18px"><span>إضافة دين</span><span id="x" style="cursor:pointer;font-size:22px">✕</span></div><div style="padding:16px"><div style="background:#fff;border-radius:16px;padding:14px;text-align:center;margin-bottom:12px"><div class="mut">معلومات الدين</div><div class="mut" style="margin-top:8px">المبلغ المتبقي</div><b style="font-size:30px;color:#dc2626">' + F(rem) + '</b></div><input name="amount" type="number" step="any" min="0" required placeholder="＋ المبلغ المراد إضافته" style="' + ip + '"><input name="date" type="date" value="' + today() + '" required style="' + ip + '"><input name="prod" placeholder="＋ اسم المنتج" style="' + ip + '"><button class="btn" style="width:100%;background:#f59a23;padding:14px;font-weight:700;border-radius:14px">إضافة</button></div></form>';
  document.body.appendChild(m);
  m.querySelector("#x").onclick = () => m.remove();
  m.onclick = (e) => {
    if (e.target === m) m.remove();
  };
  m.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    S.debts.push({ id: uid(), cust: a0.cust, type: a0.type, name: a0.name, phone: a0.phone, amount: +d.amount, paid: 0, date: d.date, note: "", prod: d.prod, qty: 1, ts: d.date === today() ? Date.now() : new Date(d.date).getTime() });
    LOG("إضافة دين لـ " + a0.name + ": " + F(d.amount));
    save();
    m.remove();
    render();
  };
}
function payPerson(id) {
  const a0 = S.debts.find((x) => x.id === id);
  payDlg(grp(gk(a0)), a0.name);
}
function payDlg(a, name) {
  a = a.filter((x) => x.amount > x.paid).sort((p, q) => p.date.localeCompare(q.date));
  if (!a.length) {
    toast("لا توجد ديون مستحقة");
    return;
  }
  const ip = "background:#fff;color:#0f172a;margin:0 0 12px", cs = a.map((x, i) => '<label class="pc" style="display:flex;align-items:center;gap:10px;background:#fff;border:2px solid transparent;border-radius:14px;padding:12px;margin-bottom:8px;cursor:pointer"><input type="radio" name="d" value="' + x.id + '"' + (i ? "" : " checked") + ' style="width:auto;margin:0"><div style="flex:1"><b>' + E(x.prod || x.note || "دين") + '</b> <span class="tag">' + (x.type === "in" ? "لي" : "عليّ") + '</span><div class="mut">' + x.date.split("-").reverse().join("/") + " · الكلي " + F(x.amount) + " · المسدد " + F(x.paid) + '</div></div><b style="color:#dc2626">' + F(x.amount - x.paid) + "</b></label>").join("");
  const m = document.createElement("div");
  m.className = "ov";
  m.style.alignItems = "center";
  m.innerHTML = '<form class="md" style="padding:0;border-radius:22px;max-width:380px;width:92%;overflow:auto;max-height:90vh;background:#f1f8ec;color:#0f172a"><div style="background:#6cc644;color:#fff;padding:18px;display:flex;justify-content:space-between;align-items:center;font-weight:700;font-size:18px"><span>تسديد دين · ' + E(name) + '</span><span id="x" style="cursor:pointer;font-size:22px">✕</span></div><div style="padding:16px"><div style="font-weight:700;margin-bottom:8px">اختر الدين المراد تسديده</div>' + cs + '<div style="background:#fff;border-radius:16px;padding:14px;text-align:center;margin:12px 0"><div class="mut">الدين المستحق</div><b id="rm" style="font-size:30px;color:#dc2626"></b></div><input name="amount" type="number" step="any" min="1" required placeholder="💳 المبلغ المراد تسديده" style="' + ip + '"><input name="date" type="date" value="' + today() + '" required style="' + ip + '"><button class="btn" style="width:100%;background:#6cc644;padding:14px;font-weight:700;border-radius:14px">تسديد</button></div></form>';
  document.body.appendChild(m);
  m.querySelector("#x").onclick = () => m.remove();
  m.onclick = (e) => {
    if (e.target === m) m.remove();
  };
  const f = m.querySelector("form"), cur2 = () => a.find((x) => x.id === f.d.value), sync = () => {
    const r = cur2().amount - cur2().paid;
    f.querySelectorAll(".pc").forEach((l) => {
      l.style.borderColor = l.querySelector("input").checked ? "#6cc644" : "transparent";
    });
    f.amount.max = r;
    f.querySelector("#rm").textContent = F(r);
  };
  f.addEventListener("change", (e) => {
    if (e.target.name === "d") sync();
  });
  sync();
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), x = cur2(), t = Math.min(+d.amount, x.amount - x.paid);
    if (!(t > 0)) {
      toast("أدخل مبلغاً صحيحاً");
      return;
    }
    x.paid += t;
    (x.pl = x.pl || []).push({ date: d.date, amt: t, note: d.note });
    LOG("تسديد دين " + name + " (" + (x.prod || x.note || "دين") + "): " + F(t) + (d.note ? " - " + d.note : ""));
    save();
    m.remove();
    render();
    setTimeout(() => debtReceipt(x.id, x.pl.length - 1), 50);
  };
}
function waInst(i) {
  const c = S.cust.find((k) => k.id === i.cust) || {}, ph = normPh(c.phone);
  return ph ? '<a class="btn sm" style="text-decoration:none;background:#25d366" target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgOf({ i, ...late(i) })) + '">' + WA + " تذكير</a>" : `<button class="btn sm ghost" onclick="toast('أضف رقم هاتف العميل')">` + WA + " تذكير</button>";
}
function msgDebt(a0) {
  const a = grp(gk(a0)).filter((x) => x.type === "in"), c = S.cust.find((k) => k.id === a0.cust), t = sum(a, "amount"), p = sum(a, "paid");
  return "السلام عليكم\n\nتحية طيبة *" + (c ? c.name : a0.name) + "*\nتذكير بخصوص الدين\n\n▫️ المبلغ الإجمالي: " + F(t) + " د.ع\n▫️ المبلغ المدفوع: " + F(p) + " د.ع\n▫️ المبلغ المتبقي: " + F(t - p) + " د.ع\n\n⏰ نرجو منكم التكرم بتسديد المبلغ";
}
function waDebt(id, tb) {
  const a0 = S.debts.find((x) => x.id === id), c = S.cust.find((k) => k.id === a0.cust), ph = normPh(c ? c.phone : a0.phone), txt = tb ? WA : WA + " تذكير";
  if (!ph) return "<button" + (tb ? "" : ' class="btn sm ghost"') + ` onclick="toast('أضف رقم هاتف العميل')">` + txt + "</button>";
  return "<a " + (tb ? 'style="width:42px;height:42px;display:flex;align-items:center;justify-content:center;border-radius:12px;background:#25d366;text-decoration:none;font-size:19px;color:#fff"' : 'class="btn sm" style="text-decoration:none;background:#25d366"') + ' target="_blank" rel="noopener" href="https://wa.me/' + ph + "?text=" + encodeURIComponent(msgDebt(a0)) + '">' + txt + "</a>";
}
const WA = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="vertical-align:-3px"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
function msgRcpt(x) {
  const c = S.cust.find((k) => k.id === x.i.cust) || {}, dt = (S.pays.filter((p) => p.inst === x.i.id).map((p) => p.date).sort().pop() || today()).replace(/-/g, "/");
  return "السلام عليكم\n\nتحية طيبة *" + (c.name || "") + " (" + (x.i.no || "") + ")*\n\n(" + x.i.desc + ")\n▫️ المبلغ الإجمالي: " + F(x.i.total) + " د.ع\n▫️ المبلغ المدفوع: " + F(x.p) + " د.ع\n▫️ المبلغ المتبقي: " + F(x.rem) + " د.ع\n\nوصل تسديد ✅ (" + dt + ")";
}
