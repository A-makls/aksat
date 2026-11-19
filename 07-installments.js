/**
 * 07 · installments.js — حساب التأخير ونموذج القسط والتنقل السريع
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function late(i) {
  const p = paid(i), m = monthly(i), f = i.freq || "m", rem = Math.max(0, i.total - p), T = today();
  let ref = i.start || T;
  S.pays.forEach((x) => {
    if (x.inst === i.id && x.date > ref) ref = x.date;
  });
  let due, k = 1;
  if (f === "m") {
    due = new Date(Date.UTC(+ref.slice(0, 4), +ref.slice(5, 7) + 1, 0)).toISOString().slice(0, 10);
  } else {
    const d = new Date(ref);
    d.setUTCDate(d.getUTCDate() + (f === "w" ? 7 : 1));
    due = d.toISOString().slice(0, 10);
  }
  const isLate = rem > 0 && m > 0 && (f === "m" ? T >= due : T > due);
  if (isLate && f === "m") {
    const ty = +T.slice(0, 4), tm = +T.slice(5, 7), end = new Date(Date.UTC(ty, tm, 0)).toISOString().slice(0, 10), em = ty * 12 + tm - (T >= end ? 0 : 1);
    k = Math.max(1, em - (+ref.slice(0, 4) * 12 + +ref.slice(5, 7)));
  }
  return { p, m, L: isLate ? Math.min(Math.round(m * k), Math.round(rem)) : 0, days: isLate ? Math.floor((Date.parse(T) - Date.parse(due)) / 864e5) : 0, rem, due };
}
function addInst(ex, pre) {
  let fr = "m";
  const o = document.createElement("div");
  o.className = "fs";
  const n = (v) => +String(v || "").replace(/,/g, "") || 0, fm = (v) => Math.round(v).toLocaleString("en-US");
  o.innerHTML = `<div class='fh'><button type='button' id='bk'>➡️</button><div class='seg'><button type='button' data-f='d'>يومي</button><button type='button' data-f='w'>أسبوعي</button><button type='button' data-f='m' class='on'>✓ شهري</button></div></div><form autocomplete='off'>
<div class='fc'><h4><span>👤</span>معلومات الزبون</h4><div class='tr'><label class='ff' id='nmw'><i>👤</i><input name='cname' placeholder='اسم الزبون'></label><div id='slw' style='display:none;position:relative;flex:1;min-width:0;margin-bottom:12px'><label class='ff' style='margin:0'><i>🔍</i><input id='cq' autocomplete='off' placeholder='ابحث عن عميل بالاسم أو الهاتف أو رقم السجل'><button type='button' id='cx' class='cxb' style='display:none'>✕</button></label><input type='hidden' name='cust'><div id='cr' class='csr' style='display:none'></div></div>${S.cust.length ? `<input type='checkbox' class='sw' id='regT'>` : ""}</div><label class='ff'><i>💼</i><input name='guar' placeholder='اسم الكفيل (اختياري)'></label><label class='ff' id='phw'><i>📞</i><input name='cphone' inputmode='tel' placeholder='رقم الهاتف'></label>${S.cust.length ? `<div class='mut'>فعّل المفتاح لاختيار عميل مسجّل</div>` : ""}</div>
<div class='fc'><h4><span>📦</span>معلومات المنتج</h4><label class='pick'><span class='pi'>📦</span><div><small>اختر المنتجات</small><div id='pt'>اضغط لاختيار المنتجات من المخزن</div></div><span class='ch'>‹</span><select id='st'><option value=''>—</option>${S.items.map((x) => `<option value='${x.id}'>${E(x.name)} (${x.qty})</option>`).join("")}</select></label><label class='ff'><i>🧩</i><input name='prod' placeholder='المادة'></label><label class='ff'><i>#</i><input name='qty' type='number' value='1' placeholder='الكمية'></label></div>
<div class='fc'><h4><span>💲</span>معلومات السعر</h4><div class='tr2'><span>بيع نقدي</span><input type='checkbox' class='sw' name='cash'></div><label class='ff'><i>🛒</i><input name='cost' type='number' placeholder='سعر الشراء'></label><label class='ff'><i>％</i><input name='pct' type='number' placeholder='نسبة الربح %'></label><label class='ff'><i>💲</i><input name='total' type='number' placeholder='سعر البيع'></label></div>
<div class='fc' id='ic'><h4><span>💳</span>معلومات القسط</h4><label class='ff'><i>💵</i><input name='down' type='number' placeholder='المقدمة (اختياري)'></label><label class='ff'><i>👛</i><input name='mon' type='number' placeholder='مبلغ القسط'></label></div>
<div class='fc rs'><h4><span>✨</span>النتائج التلقائية</h4><div class='kv'><span>عدد الأقساط</span><b id='r1'>0</b></div><div class='kv'><span>مبلغ القسط الأخير</span><b id='r2'>0 د.ع</b></div><div class='kv'><span>الأرباح</span><b id='r3'>0 د.ع</b></div><div class='kv'><span>الباقي</span><b id='r4'>0 د.ع</b></div></div>
<div class='fc'><h4><span>📅</span>التاريخ</h4><label class='ff'><i>📅</i><input name='date' type='date' value='${today()}' required></label><label class='ff'><i>🔢</i><input name='no' type='number' value='' placeholder='رقم السجل (إجباري)' required></label></div>
<div style='padding:0 12px 20px'><button class='btn' style='width:100%;padding:15px;font-size:17px;background:#3f51b5;border-radius:18px'>حفظ القسط</button></div></form>`;
  document.body.appendChild(o);
  const f = o.querySelector("form"), rg = o.querySelector("#regT"), st = o.querySelector("#st"), $ = (s) => o.querySelector(s);
  const setV = (el, v) => {
    el.value = el.type === "number" ? String(Math.round(v)) : fm(v);
  };
  const recalc = () => {
    const cash = f.cash.checked, total = n(f.total.value), down = cash ? total : Math.min(n(f.down.value), total), mon = n(f.mon.value), cost = n(f.cost.value), rem = Math.max(0, total - down), cnt = !cash && mon > 0 && rem > 0 ? Math.ceil(rem / mon) : 0, last = cnt ? rem - (cnt - 1) * mon : 0;
    $("#r1").textContent = cnt;
    $("#r2").textContent = fm(last) + " د.ع";
    $("#r3").textContent = fm(total - cost) + " د.ع";
    $("#r4").textContent = fm(rem) + " د.ع";
  };
  const itemFill = () => {
    const it = S.items.find((x) => x.id === st.value);
    if (!it) return;
    const q = n(f.qty.value) || 1;
    f.prod.value = it.name;
    setV(f.cost, it.cost * q);
    setV(f.total, it.price * q);
    f.pct.value = it.cost > 0 ? String(Math.round((it.price / it.cost - 1) * 1e3) / 10) : "";
  };
  $("#bk").onclick = () => o.remove();
  o.querySelectorAll(".seg button").forEach((b) => b.onclick = () => {
    fr = b.dataset.f;
    o.querySelectorAll(".seg button").forEach((x) => {
      x.classList.toggle("on", x === b);
      x.textContent = (x === b ? "✓ " : "") + x.textContent.replace("✓ ", "");
    });
  });
  const nrm = (s) => String(s == null ? "" : s).toLowerCase().trim(), cq = $("#cq"), cr = $("#cr"), cx = $("#cx");
  let filled = false;
  const cinfo = (id) => {
    let no = "", gu = "";
    S.inst.filter((i) => i.cust === id).reverse().forEach((i) => {
      if (!no && i.no) no = i.no;
      if (!gu && i.guar) gu = i.guar;
    });
    return { no, gu };
  };
  const cunset = () => {
    const sc = S.cust.find((x) => x.id === f.cust.value);
    f.cust.value = "";
    if (filled) {
      f.guar.value = "";
      f.no.value = "";
      filled = false;
    }
    if (sc && f.cphone.value === (sc.phone || "")) f.cphone.value = "";
    cx.style.display = cq.value ? "" : "none";
  };
  const cdraw = () => {
    const q = nrm(cq.value), sc = (x) => String(x.inf.no) === q ? 0 : nrm(x.c.name).startsWith(q) ? 1 : 2;
    const a = S.cust.map((c) => ({ c, inf: cinfo(c.id) })).filter((x) => !q || nrm([x.c.name, x.c.phone, x.inf.gu, x.inf.no].join(" ")).includes(q)).sort((x, y) => sc(x) - sc(y)).slice(0, 40);
    cr.innerHTML = a.length ? a.map((x) => "<button type='button' data-id='" + x.c.id + "'><span class='ca'>" + E((x.c.name || "?").trim().charAt(0)) + "</span><span style='flex:1;min-width:0'><div class='cn'>" + E(x.c.name) + "</div><div class='cs'>" + [x.c.phone ? "📞 " + E(x.c.phone) : "", x.inf.no ? "رقم السجل " + x.inf.no : "", x.inf.gu ? "الكفيل " + E(x.inf.gu) : ""].filter(Boolean).join(" · ") + "</div></span></button>").join("") : "<div class='ce'>لا يوجد عميل مطابق</div>";
    cr.style.display = "";
  };
  const cpick = (id, quiet) => {
    const c = S.cust.find((x) => x.id === id);
    if (!c) return;
    if (filled) {
      f.guar.value = "";
      f.no.value = "";
    }
    const inf = cinfo(id);
    f.cust.value = id;
    cq.value = c.name;
    cr.style.display = "none";
    cx.style.display = "";
    f.cphone.value = c.phone || "";
    f.guar.value = inf.gu;
    if (inf.no) f.no.value = inf.no;
    filled = true;
    if (!quiet) toast("تمت إضافة معلومات العميل تلقائياً");
  };
  const setReg = (on, fo) => {
    $("#nmw").style.display = on ? "none" : "";
    $("#slw").style.display = on ? "" : "none";
    if (!on) {
      cq.value = "";
      cunset();
      cr.style.display = "none";
    } else if (fo) setTimeout(() => cq.focus(), 50);
  };
  if (rg) rg.onchange = () => setReg(rg.checked, 1);
  cq.onfocus = cdraw;
  cq.oninput = () => {
    if (f.cust.value) cunset();
    cx.style.display = cq.value ? "" : "none";
    cdraw();
  };
  cq.onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const b = cr.querySelector("button");
      if (b) cpick(b.dataset.id);
    }
  };
  cx.onclick = () => {
    cq.value = "";
    cunset();
    cdraw();
    cq.focus();
  };
  cr.onclick = (e) => {
    const b = e.target.closest("button[data-id]");
    if (b) cpick(b.dataset.id);
  };
  o.addEventListener("click", (e) => {
    if (!e.target.closest("#slw")) cr.style.display = "none";
  });
  st.onchange = () => {
    const it = S.items.find((x) => x.id === st.value);
    $("#pt").textContent = it ? it.name + " · المتوفر " + it.qty : "اضغط لاختيار المنتجات من المخزن";
    itemFill();
    recalc();
  };
  f.cash.onchange = () => {
    $("#ic").style.display = f.cash.checked ? "none" : "";
    recalc();
  };
  f.addEventListener("input", (e) => {
    const t = e.target.name, c = n(f.cost.value);
    if (t === "cost" || t === "pct") {
      if (c > 0 && f.pct.value !== "") setV(f.total, c * (1 + n(f.pct.value) / 100));
    } else if (t === "total") {
      if (c > 0) f.pct.value = String(Math.round((n(f.total.value) / c - 1) * 1e3) / 10);
    } else if (t === "qty") itemFill();
    recalc();
  });
  if (ex) {
    fr = ex.freq || "m";
    o.querySelectorAll(".seg button").forEach((x) => {
      const on = x.dataset.f === fr;
      x.classList.toggle("on", on);
      x.textContent = (on ? "✓ " : "") + x.textContent.replace("✓ ", "");
    });
    const cs = ex.mon === 0 && ex.down === ex.total;
    f.guar.value = ex.guar || "";
    f.prod.value = ex.desc;
    f.qty.value = ex.qty || 1;
    f.cash.checked = cs;
    f.cost.value = ex.cost || "";
    f.total.value = ex.total;
    f.pct.value = ex.cost > 0 ? String(Math.round((ex.total / ex.cost - 1) * 1e3) / 10) : "";
    f.down.value = cs ? "" : ex.down;
    f.mon.value = cs ? "" : Math.round(monthly(ex));
    f.date.value = ex.start;
    f.no.value = ex.no || "";
    if (rg) {
      rg.checked = true;
      setReg(true, 0);
      const ec = S.cust.find((k) => k.id === ex.cust) || {};
      f.cust.value = ex.cust;
      cq.value = ec.name || "";
      cx.style.display = cq.value ? "" : "none";
      f.cphone.value = ec.phone || "";
    } else {
      const c = S.cust.find((k) => k.id === ex.cust) || {};
      f.cname.value = c.name || "";
      f.cphone.value = c.phone || "";
    }
    $("#ic").style.display = cs ? "none" : "";
    f.querySelector("button.btn").textContent = "حفظ التعديلات";
    recalc();
  }
  if (!ex && pre && rg) {
    rg.checked = true;
    setReg(true, 0);
    cpick(pre, 1);
  }
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), it = S.items.find((x) => x.id === st.value), qty = n(d.qty) || 1, total = n(d.total), cash = !!d.cash, down = cash ? total : Math.min(n(d.down), total), mon = cash ? 0 : n(d.mon), cost = n(d.cost);
    let desc = (d.prod || "").trim();
    if (!desc && it) desc = it.name;
    if (!desc) {
      alert("اكتب اسم المادة أو اختر منتجاً من المخزن");
      return;
    }
    if (total <= 0) {
      alert("أدخل سعر البيع");
      return;
    }
    if (!cash && mon <= 0) {
      alert("أدخل مبلغ القسط");
      return;
    }
    if (!ex && it && it.qty < qty) {
      alert("الكمية غير كافية في المخزن");
      return;
    }
    const noV = n(d.no);
    if (!noV) {
      alert("اكتب رقم السجل");
      return;
    }
    const reg = !!(rg && rg.checked);
    if (reg && !d.cust) {
      alert("اختر عميلاً من القائمة");
      return;
    }
    let cid;
    if (reg) {
      cid = d.cust;
      const rc = S.cust.find((c) => c.id === cid);
      if (rc && d.cphone && rc.phone !== d.cphone) rc.phone = d.cphone;
    } else {
      const nn = (d.cname || "").trim();
      if (!nn) {
        alert("اكتب اسم الزبون");
        return;
      }
      let ex2 = S.cust.find((c) => c.name === nn);
      if (!ex2) {
        ex2 = { id: uid(), name: nn, phone: d.cphone || "" };
        S.cust.push(ex2);
        LOG("إضافة عميل: " + nn);
      } else if (!ex2.phone && d.cphone) ex2.phone = d.cphone;
      cid = ex2.id;
    }
    if (it && !ex) it.qty -= qty;
    const rem = total - down, i = { id: uid(), no: noV, qty, created: today(), cust: cid, desc, total, cost, down, mon, months: cash || mon <= 0 || rem <= 0 ? 1 : Math.max(1, Math.ceil(rem / mon)), start: d.date, freq: fr, guar: (d.guar || "").trim() };
    if (ex) {
      Object.assign(ex, { no: i.no, qty, cust: cid, desc, total, cost, down, mon, months: i.months, start: d.date, freq: fr, guar: i.guar });
      const dp = S.pays.find((p) => p.inst === ex.id && (p.note === "دفعة أولى" || p.note === "بيع نقدي")), nt = cash ? "بيع نقدي" : "دفعة أولى";
      if (down > 0) {
        if (dp) {
          dp.amt = down;
          dp.date = d.date;
          dp.note = nt;
        } else S.pays.push({ id: uid(), inst: ex.id, amt: down, date: d.date, note: nt });
      } else if (dp) S.pays = S.pays.filter((p) => p !== dp);
      LOG("تعديل القسط: " + desc);
      save();
      o.remove();
      render();
      return;
    }
    S.inst.push(i);
    if (down > 0) S.pays.push({ id: uid(), inst: i.id, amt: down, date: d.date, note: cash ? "بيع نقدي" : "دفعة أولى" });
    LOG("قسط جديد: " + desc + " للعميل " + nm(S.cust, cid));
    save();
    o.remove();
    render();
    setTimeout(() => purchaseDlg(i.id), 50);
  };
}
function editInst(id) {
  addInst(S.inst.find((x) => x.id === id));
}
function fabGo() {
  if (tab === "gdetail") return addInst(null, curG);
  if (tab === "ddetail") {
    const a = grp(curD)[0];
    if (a) return addDebtFor(a.id);
  }
  const F2 = { debts: addDebt, ddetail: addDebt, stock: addItem, exp: addExp, cust: addCust, emp: addEmp }[tab];
  (F2 || addInst)();
}
