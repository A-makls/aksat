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
<div class='fc'><h4><span>👤</span>معلومات الزبون</h4><div class='tr'><label class='ff' id='nmw'><i>👤</i><input name='cname' placeholder='اسم الزبون'></label><label class='ff' id='slw' style='display:none'><i>👥</i><select name='cust'>${S.cust.map((c) => `<option value='${c.id}'>${E(c.name)}</option>`).join("")}</select></label>${S.cust.length ? `<input type='checkbox' class='sw' id='regT'>` : ""}</div><label class='ff' id='phw'><i>📞</i><input name='cphone' inputmode='tel' placeholder='رقم الهاتف'></label>${S.cust.length ? `<div class='mut'>فعّل المفتاح لاختيار عميل مسجّل</div>` : ""}</div>
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
  const showReg = (on) => {
    $("#nmw").style.display = on ? "none" : "";
    $("#phw").style.display = on ? "none" : "";
    $("#slw").style.display = on ? "" : "none";
  };
  $("#bk").onclick = () => o.remove();
  o.querySelectorAll(".seg button").forEach((b) => b.onclick = () => {
    fr = b.dataset.f;
    o.querySelectorAll(".seg button").forEach((x) => {
      x.classList.toggle("on", x === b);
      x.textContent = (x === b ? "✓ " : "") + x.textContent.replace("✓ ", "");
    });
  });
  if (rg) rg.onchange = () => showReg(rg.checked);
  if (pre) {
    if (pre.cust && rg) {
      rg.checked = true;
      showReg(true);
      f.cust.value = pre.cust;
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
