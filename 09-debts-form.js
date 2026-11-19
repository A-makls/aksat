/**
 * 09 · debts-form.js — نموذج إضافة الدين
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function debtForm(pre) {
  let fr = "in";
  const o = document.createElement("div");
  o.className = "fs";
  const n = (v) => +String(v || "").replace(/,/g, "") || 0, fm = (v) => Math.round(v).toLocaleString("en-US");
  o.innerHTML = `<div class='fh'><button type='button' id='bk'>➡️</button><div class='seg'><button type='button' data-f='out'>دين عليّ</button><button type='button' data-f='in' class='on'>✓ دين لي</button></div></div><form autocomplete='off'>
<div class='fc'><h4><span>👤</span>معلومات الزبون</h4><div class='tr'><label class='ff' id='nmw'><i>👤</i><input name='cname' placeholder='اسم الزبون'></label><div id='slw' style='display:none;position:relative;flex:1;min-width:0;margin-bottom:12px'><label class='ff' style='margin:0'><i>🔍</i><input id='cq' autocomplete='off' placeholder='ابحث عن عميل بالاسم أو الهاتف'><button type='button' id='cx' class='cxb' style='display:none'>✕</button></label><input type='hidden' name='cust'><div id='cr' class='csr' style='display:none'></div></div>${S.cust.length ? `<input type='checkbox' class='sw' id='regT'>` : ""}</div><label class='ff' id='phw'><i>📞</i><input name='cphone' inputmode='tel' placeholder='رقم الهاتف'></label>${S.cust.length ? `<div class='mut'>فعّل المفتاح لاختيار عميل مسجّل</div>` : ""}</div>
<div class='fc'><h4><span>📦</span>معلومات الدين</h4><label class='ff'><i>🧩</i><input name='prod' placeholder='اسم المنتج أو سبب الدين (اختياري)'></label><label class='ff'><i>#</i><input name='qty' type='number' value='1' placeholder='الكمية'></label><label class='ff'><i>💲</i><input name='amount' type='number' placeholder='المبلغ الكلي'></label></div>
<div class='fc'><h4><span>💳</span>معلومات التسديد</h4><label class='ff'><i>💵</i><input name='paid' type='number' placeholder='المبلغ المسدد مسبقاً (اختياري)'></label></div>
<div class='fc rs'><h4><span>✨</span>النتائج التلقائية</h4><div class='kv'><span>المبلغ الكلي</span><b id='r1'>0 د.ع</b></div><div class='kv'><span>المسدد</span><b id='r2'>0 د.ع</b></div><div class='kv'><span>الباقي</span><b id='r3'>0 د.ع</b></div><div class='kv'><span>سعر الوحدة</span><b id='r4'>0 د.ع</b></div></div>
<div class='fc'><h4><span>📅</span>التاريخ</h4><label class='ff'><i>📅</i><input name='date' type='date' value='${today()}' required></label><label class='ff'><i>📝</i><input name='note' placeholder='ملاحظات (اختياري)'></label></div>
<div style='padding:0 12px 20px'><button class='btn' style='width:100%;padding:15px;font-size:17px;background:#3f51b5;border-radius:18px'>حفظ الدين</button></div></form>`;
  document.body.appendChild(o);
  const f = o.querySelector("form"), rg = o.querySelector("#regT"), $ = (s) => o.querySelector(s);
  const recalc = () => {
    const a = n(f.amount.value), p = Math.min(n(f.paid.value), a), q = n(f.qty.value) || 1;
    $("#r1").textContent = fm(a) + " د.ع";
    $("#r2").textContent = fm(p) + " د.ع";
    $("#r3").textContent = fm(a - p) + " د.ع";
    $("#r4").textContent = fm(a / q) + " د.ع";
  };
  // بحث عن عميل مسجّل (نفس أسلوب نموذج القسط)
  const nrm = (s) => String(s == null ? "" : s).toLowerCase().trim(), cq = $("#cq"), cr = $("#cr"), cx = $("#cx");
  const cdraw = () => {
    const q = nrm(cq.value);
    const a = S.cust.filter((c) => !q || nrm(c.name + " " + (c.phone || "")).includes(q)).sort((x, y) => (nrm(x.name).startsWith(q) ? 0 : 1) - (nrm(y.name).startsWith(q) ? 0 : 1)).slice(0, 40);
    cr.innerHTML = a.length ? a.map((c) => "<button type='button' data-id='" + c.id + "'><span class='ca'>" + E((c.name || "?").trim().charAt(0)) + "</span><span style='flex:1;min-width:0'><div class='cn'>" + E(c.name) + "</div><div class='cs'>" + (c.phone ? "📞 " + E(c.phone) : "") + "</div></span></button>").join("") : "<div class='ce'>لا يوجد عميل مطابق</div>";
    cr.style.display = "";
  };
  const cunset = () => {
    f.cust.value = "";
    cx.style.display = cq.value ? "" : "none";
  };
  const cpick = (id) => {
    const c = S.cust.find((x) => x.id === id);
    if (!c) return;
    f.cust.value = id;
    cq.value = c.name;
    cr.style.display = "none";
    cx.style.display = "";
  };
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
  const showReg = (on, focus) => {
    $("#nmw").style.display = on ? "none" : "";
    $("#phw").style.display = on ? "none" : "";
    $("#slw").style.display = on ? "" : "none";
    if (!on) {
      cq.value = "";
      cunset();
      cr.style.display = "none";
    } else if (focus) setTimeout(() => cq.focus(), 50);
  };
  $("#bk").onclick = () => o.remove();
  o.querySelectorAll(".seg button").forEach((b) => b.onclick = () => {
    fr = b.dataset.f;
    o.querySelectorAll(".seg button").forEach((x) => {
      x.classList.toggle("on", x === b);
      x.textContent = (x === b ? "✓ " : "") + x.textContent.replace("✓ ", "");
    });
  });
  if (rg) rg.onchange = () => showReg(rg.checked, 1);
  if (pre) {
    if (pre.cust && rg) {
      rg.checked = true;
      showReg(true);
      cpick(pre.cust);
    } else {
      f.cname.value = pre.name || "";
      f.cphone.value = pre.phone || "";
    }
  }
  f.addEventListener("input", recalc);
  f.onsubmit = (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), amount = n(d.amount), paid = Math.min(n(d.paid), amount), qty = n(d.qty) || 1;
    if (amount <= 0) {
      alert("أدخل مبلغ الدين");
      return;
    }
    let cid, name, phone;
    if (rg && rg.checked) {
      if (!d.cust) {
        alert("اختر عميلاً من القائمة");
        return;
      }
      cid = d.cust;
      const c = S.cust.find((x2) => x2.id === cid) || {};
      name = c.name;
      phone = c.phone;
    } else {
      const nn = (d.cname || "").trim();
      if (!nn) {
        alert("اكتب اسم الزبون");
        return;
      }
      let ex = S.cust.find((c) => c.name === nn);
      if (!ex) {
        ex = { id: uid(), name: nn, phone: d.cphone || "" };
        S.cust.push(ex);
        LOG("إضافة عميل: " + nn);
      } else if (!ex.phone && d.cphone) ex.phone = d.cphone;
      cid = ex.id;
      name = ex.name;
      phone = ex.phone;
    }
    const x = { id: uid(), cust: cid, type: fr, name, phone, amount, paid, date: d.date, note: (d.note || "").trim(), prod: (d.prod || "").trim(), qty, ts: d.date === today() ? Date.now() : new Date(d.date).getTime() };
    if (paid > 0) x.pl = [{ date: d.date, amt: paid, note: "دفعة مسبقة" }];
    S.debts.push(x);
    LOG("دين جديد: " + name + " " + F(amount));
    save();
    o.remove();
    render();
  };
  return true;
}
