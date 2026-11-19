/**
 * 02 · ui.js — النماذج والحوارات والإشعارات وإجراءات الإضافة
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function openForm(title, fields, cb) {
  const m = document.createElement("div");
  m.className = "ov";
  m.innerHTML = '<form class="md"><h3>' + title + "</h3>" + fields.map((f) => "<label>" + f.l + (f.t === "select" ? '<select name="' + f.k + '">' + f.o.map((o) => '<option value="' + E(o[0]) + '"' + (o[0] === f.v ? " selected" : "") + ">" + E(o[1]) + "</option>").join("") + "</select>" : '<input name="' + f.k + '" type="' + (f.t || "text") + '" value="' + E(f.v) + '"' + (f.t === "number" ? ' step="any" min="0"' : "") + (f.r === 0 ? "" : " required") + ">") + "</label>").join("") + '<div class="row"><button class="btn">حفظ</button><button type="button" class="btn ghost" id="x">إلغاء</button></div></form>';
  document.body.appendChild(m);
  m.querySelector("#x").onclick = () => m.remove();
  m.onclick = (e) => {
    if (e.target === m) m.remove();
  };
  m.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    if (cb(d) === false) return;
    m.remove();
    save();
    render();
  };
}
function ask(m, cb) {
  const o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = '<div class="md" style="border-radius:22px;max-width:340px;text-align:center"><h3>' + E(m) + '</h3><div class="row"><button class="btn red" id="y">نعم</button><button class="btn ghost" id="n">إلغاء</button></div></div>';
  document.body.appendChild(o);
  o.querySelector("#n").onclick = () => o.remove();
  o.querySelector("#y").onclick = () => {
    o.remove();
    cb();
  };
}
function copyText(t) {
  const fb = () => {
    const a = document.createElement("textarea");
    a.value = t;
    a.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(a);
    a.select();
    try {
      document.execCommand("copy");
    } catch (e) {
    }
    a.remove();
  };
  try {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).catch(fb);
  } catch (e) {
  }
  fb();
}
function toast(m) {
  const t = document.createElement("div");
  t.textContent = m;
  t.style.cssText = "position:fixed;bottom:90px;left:50%;transform:translateX(-50%);background:#0f172a;color:#fff;padding:10px 18px;border-radius:99px;z-index:50;font-size:14px";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}
window.alert = toast;
const del = (c, id, txt) => c === "cust" && (S.inst.some((i) => i.cust === id) || S.debts.some((d) => d.cust === id)) ? toast("لا يمكن حذف عميل له أقساط أو ديون") : ask("حذف " + txt + "؟", () => pinDel(c === "inst" || c === "debts", () => {
  S[c] = S[c].filter((x) => x.id !== id);
  if (c === "inst") S.pays = S.pays.filter((p) => p.inst !== id);
  LOG("حذف " + txt);
  save();
  render();
}));
const addCust = () => openForm("عميل جديد", [{ k: "name", l: "الاسم" }, { k: "phone", l: "الهاتف (بدون مفتاح العراق، مثل 07701234567)", r: 0 }], (d) => {
  S.cust.push({ id: uid(), name: d.name, phone: d.phone });
  LOG("إضافة عميل: " + d.name);
});
const addEmp = () => openForm("موظف جديد", [{ k: "name", l: "الاسم" }, { k: "role", l: "الوظيفة", r: 0 }, { k: "sal", l: "الراتب الشهري", t: "number" }], (d) => {
  S.emp.push({ id: uid(), name: d.name, role: d.role, sal: +d.sal });
  LOG("إضافة موظف: " + d.name);
});
const payEmp = (id) => {
  const e = S.emp.find((x) => x.id === id);
  ask("صرف راتب " + e.name + " (" + F(e.sal) + ")؟", () => {
    S.exps.push({ id: uid(), title: "راتب " + e.name, amt: e.sal, date: today() });
    LOG("صرف راتب " + e.name + ": " + F(e.sal));
    save();
    render();
  });
};
const addItem = () => openForm("صنف جديد", [{ k: "name", l: "اسم الصنف" }, { k: "qty", l: "الكمية", t: "number" }, { k: "cost", l: "سعر الشراء", t: "number" }, { k: "price", l: "سعر البيع", t: "number" }], (d) => {
  S.items.push({ id: uid(), name: d.name, qty: +d.qty, cost: +d.cost, price: +d.price });
  LOG("إضافة صنف: " + d.name);
});
const restock = (id) => openForm("إضافة كمية", [{ k: "q", l: "الكمية المضافة", t: "number" }], (d) => {
  const it = S.items.find((x) => x.id === id);
  it.qty += +d.q;
  LOG("توريد " + d.q + " من " + it.name);
});
const addExp = () => openForm("مصروف جديد", [{ k: "title", l: "البيان" }, { k: "amt", l: "المبلغ", t: "number" }, { k: "date", l: "التاريخ", t: "date", v: today() }], (d) => {
  S.exps.push({ id: uid(), title: d.title, amt: +d.amt, date: d.date });
  LOG("مصروف: " + d.title + " " + F(d.amt));
});
const addDebt = (pre) => debtForm(pre) || openForm("دين جديد", [{ k: "type", l: "النوع", t: "select", o: [["in", "دين لي عند شخص"], ["out", "دين عليّ لشخص"]] }, { k: "cust", l: "العميل (الاسم والهاتف تلقائياً)", t: "select", o: [["", "— كتابة اسم يدوياً —"]].concat(S.cust.map((c) => [c.id, c.name])), v: pre && pre.cust || "" }, { k: "name", l: "الاسم (إن لم تختر عميلاً)", r: 0, v: pre && !pre.cust && pre.name || "" }, { k: "amount", l: "المبلغ", t: "number" }, { k: "date", l: "التاريخ", t: "date", v: today() }, { k: "phone", l: "رقم الهاتف (يؤخذ من العميل تلقائياً)", r: 0, v: pre && !pre.cust && pre.phone || "" }, { k: "prod", l: "اسم المنتج (اختياري)", r: 0 }, { k: "qty", l: "الكمية", t: "number", r: 0, v: 1 }], (d) => {
  const c = S.cust.find((x) => x.id === d.cust);
  if (!c && !d.name) {
    alert("اختر عميلاً أو اكتب الاسم");
    return false;
  }
  S.debts.push({ id: uid(), cust: d.cust, type: d.type, name: c ? c.name : d.name, amount: +d.amount, paid: 0, date: d.date, phone: c ? c.phone : d.phone, prod: d.prod, qty: +d.qty || 1, ts: d.date === today() ? Date.now() : new Date(d.date).getTime() });
  LOG("دين جديد: " + (c ? c.name : d.name) + " " + F(d.amount));
});
const payDebt = (id) => {
  const x = S.debts.find((d) => d.id === id);
  if (x) payDlg([x], x.name);
};
const payInst = (id) => {
  if (S.inst.some((x) => x.id === id)) payInstDlg(id);
};
const setCash = () => openForm("الرصيد الافتتاحي", [{ k: "a", l: "المبلغ", t: "number", v: S.cash0 }], (d) => {
  S.cash0 = +d.a;
  LOG("تعديل رصيد الصندوق الافتتاحي: " + F(d.a));
});
const card = (t, sub, r, acts, extra, click, cls) => '<div class="card' + (cls ? " " + cls : "") + '"' + (click ? ' style="cursor:pointer" onclick="' + click + '"' : "") + '><div class="top"><div><b>' + t + '</b><div class="mut">' + (sub || "") + '</div></div><div class="amt">' + (r || "") + "</div></div>" + (extra || "") + (acts ? '<div class="acts" onclick="event.stopPropagation()">' + acts + "</div>" : "") + "</div>";
const empty = (t) => '<div class="empty">' + t + "</div>";
const head = (t, fn) => "<h2>" + t + (fn ? '<button class="btn sm" onclick="' + fn + '()">＋ إضافة</button>' : "") + "</h2>";
const dbtn = (c, id, t) => `<button class="btn sm red" onclick="del('` + c + "','" + id + "','" + E(t).replace(/['\\]/g, "") + `')">حذف</button>`;
const bar = (p) => '<div class="bar"><i style="width:' + Math.min(100, p) + '%"></i></div>';
const kv = (a, b, c) => '<div class="kv"><span>' + a + '</span><b class="' + (c || "") + '">' + b + "</b></div>";
