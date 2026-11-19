/**
 * 10 · backup.js — النسخ الاحتياطي: التصدير وصفحة النسخ
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const pad = (x) => String(x).padStart(2, "0");
const fmtTs = (ts) => {
  const d = new Date(ts), h = d.getHours();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) + " " + (h % 12 || 12) + ":" + pad(d.getMinutes()) + " " + (h < 12 ? "صباحاً" : "مساءً");
};
function textBackup() {
  const o = snapData();
  delete o.pin;
  return JSON.stringify(o);
}
function snapData() {
  const o = JSON.parse(JSON.stringify(S));
  o.ads = (o.ads || []).map((a) => ({ title: a.title || "" }));
  return o;
}
function autoBak() {
  if (!S.autoBak || S.lastAuto === today()) return;
  try {
    localStorage.setItem("aqsat_snap", JSON.stringify(snapData()));
  } catch (e) {
    return;
  }
  S.lastAuto = today();
  S.lastBak = { ts: Date.now(), type: "تلقائية" };
  save();
}
// عند فشل المشاركة التلقائية (يحدث على iOS) تظهر نافذة بأزرار تُستدعى بلمسة جديدة من المستخدم
function fileDialog(name, blob, mime, onDone) {
  const f = new File([blob], name, { type: mime });
  const url = URL.createObjectURL(blob);
  const o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = '<div class="md" style="border-radius:22px;max-width:340px;width:92%;text-align:center"><h3>📁 الملف جاهز</h3><div class="mut" style="margin-bottom:14px;word-break:break-all" dir="ltr">' + E(name) + '</div><button class="btn" id="fs1" style="width:100%;margin-bottom:8px">مشاركة / حفظ في «الملفات»</button><a class="btn ghost" id="fs2" download="' + E(name) + '" href="' + url + '" style="display:block;text-decoration:none;margin-bottom:8px">تنزيل مباشر</a><button class="btn ghost" id="fs3" style="width:100%">إغلاق</button></div>';
  document.body.appendChild(o);
  const close = () => { o.remove(); setTimeout(() => URL.revokeObjectURL(url), 60000); };
  o.querySelector("#fs3").onclick = close;
  o.querySelector("#fs2").onclick = () => { if (onDone) onDone(); };
  o.querySelector("#fs1").onclick = async () => {
    try {
      await navigator.share({ files: [f], title: name });
      if (onDone) onDone();
      close();
    } catch (e) {
      if (!e || e.name !== "AbortError") toast("تعذّرت المشاركة، جرّب «تنزيل مباشر»");
    }
  };
}
async function saveFile(name, data, mime, onDone) {
  mime = mime || "application/octet-stream";
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const mobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  if (mobile) {
    let canShare = false;
    try { canShare = !!(navigator.share && navigator.canShare && navigator.canShare({ files: [new File([blob], name, { type: mime })] })); } catch (e) {}
    if (canShare) {
      try {
        await navigator.share({ files: [new File([blob], name, { type: mime })], title: name });
        return "ok";
      } catch (e) {
        if (e && e.name === "AbortError") return "no";
      }
    }
    fileDialog(name, blob, mime, onDone);
    return "dialog";
  }
  try {
    const u = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = u;
    a.download = name;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(u); }, 4000);
    return "ok";
  } catch (e) {
    return "na";
  }
}
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
let _xl = null;
function loadXlsx() {
  if (window.XLSX) return Promise.resolve(true);
  if (_xl) return _xl;
  const get = (src) => new Promise((res) => {
    const s = document.createElement("script");
    s.src = src;
    s.onload = () => res(!!window.XLSX);
    s.onerror = () => res(false);
    document.head.appendChild(s);
  });
  _xl = get("vendor/xlsx.full.min.js").then((ok) => ok || get("https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js")).then((ok) => {
    if (!ok) _xl = null;
    return ok;
  });
  return _xl;
}
async function exportXlsx() {
  if (!await loadXlsx()) {
    toast("تعذّر تحميل مكتبة Excel (تحقق من الاتصال بالإنترنت)");
    return;
  }
  const sh = (a) => XLSX.utils.json_to_sheet(a.length ? a : [{ "—": "" }]), wb = XLSX.utils.book_new(), cu = (id) => S.cust.find((k) => k.id === id) || {}, fq = (f) => f === "w" ? "أسبوعي" : f === "d" ? "يومي" : "شهري";
  wb.Workbook = { Views: [{ RTL: true }] };
  XLSX.utils.book_append_sheet(wb, sh(S.inst.map((i) => {
    const l = late(i), c = cu(i.cust);
    return { "رقم السجل": i.no, "العميل": c.name || "", "الهاتف": c.phone || "", "الكفيل": i.guar || "", "المنتج": i.desc, "الكمية": i.qty || 1, "السعر الإجمالي": i.total, "المقدمة": i.down, "مبلغ القسط": Math.round(l.m), "عدد الأقساط": i.months, "النوع": fq(i.freq), "تاريخ البداية": i.start, "المدفوع": l.p, "المتبقي": l.rem, "المتأخر": l.L };
  })), "الأقساط");
  XLSX.utils.book_append_sheet(wb, sh(S.pays.map((p) => {
    const i = S.inst.find((x) => x.id === p.inst) || {};
    return { "التاريخ": p.date, "العميل": cu(i.cust).name || "", "المنتج": i.desc || "", "المبلغ": p.amt, "ملاحظة": p.note || "" };
  })), "التسديدات");
  XLSX.utils.book_append_sheet(wb, sh(S.debts.map((d) => {
    const c = cu(d.cust);
    return { "العميل": c.name || d.name, "الهاتف": c.phone || d.phone || "", "النوع": d.type === "in" ? "دين لي" : "دين عليّ", "المنتج": d.prod || d.note || "", "الكمية": d.qty || 1, "المبلغ": d.amount, "المسدد": d.paid, "المتبقي": d.amount - d.paid, "التاريخ": d.date };
  })), "الديون");
  XLSX.utils.book_append_sheet(wb, sh(S.cust.map((c) => ({ "الاسم": c.name, "الهاتف": c.phone || "" }))), "العملاء");
  XLSX.utils.book_append_sheet(wb, sh(S.emp.map((e) => ({ "الاسم": e.name, "الوظيفة": e.role || "", "الراتب": e.sal }))), "الموظفون");
  XLSX.utils.book_append_sheet(wb, sh(S.items.map((x) => ({ "الصنف": x.name, "الكمية": x.qty, "سعر الشراء": x.cost, "سعر البيع": x.price }))), "المخزن");
  XLSX.utils.book_append_sheet(wb, sh(S.exps.map((x) => ({ "البيان": x.title, "المبلغ": x.amt, "التاريخ": x.date }))), "المصروفات");
  const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" }), r = await saveFile("aqsat-" + today() + ".xlsx", buf, XLSX_MIME);
  if (r === "ok") toast("تم تصدير ملف Excel");
  else if (r === "na") toast("تعذّر حفظ الملف على هذا الجهاز");
}
function restoreSnap() {
  let o;
  try {
    o = JSON.parse(localStorage.getItem("aqsat_snap"));
  } catch (e) {
  }
  if (!o) {
    toast("لا توجد نسخة تلقائية");
    return;
  }
  ask("استعادة آخر نسخة تلقائية؟ ستُستبدل بياناتك الحالية.", () => {
    S = Object.assign(DEF(), o, { ads: S.ads, pin: S.pin });
    save();
    render();
    toast("تمت الاستعادة");
  });
}
V.bak = function() {
  loadXlsx();
  const lb = S.lastBak;
  let hs = false;
  try {
    hs = !!localStorage.getItem("aqsat_snap");
  } catch (e) {
  }
  const info = ["النسخة الاحتياطية بصيغة Excel (xlsx) وتحتوي على جميع بيانات التطبيق", "يمكن تصدير البيانات إلى ملف Excel بشيت منفصل لكل قسم", "النسخ التلقائي يعمل مرة واحدة كل يوم عند فتح التطبيق", "يمكنك مشاركة ملف النسخة الاحتياطية مع أي شخص"];
  return '<div class="card"><div class="bkh"><span style="color:#1e88e5">☁️</span>آخر نسخة احتياطية</div>' + (lb ? '<div class="bkr"><span>📅</span><span>التاريخ والوقت:</span><b>' + fmtTs(lb.ts) + '</b></div><div class="bkr"><span>' + (lb.type === "تلقائية" ? "⏱️" : "👆") + "</span><span>النوع:</span><b>" + lb.type + "</b></div>" : '<div class="mut" style="margin:6px 0 14px">لم تُنشأ أي نسخة احتياطية بعد</div>') + '<button class="bkx" onclick="exportXlsx()">⬇️ تصدير تقرير Excel</button></div><button class="bkb g" onclick="makeBackup()">☁️ إنشاء نسخة احتياطية الآن</button><div class="card"><div class="bkh"><span style="color:#fb8c00">🕛</span>النسخ التلقائي</div><div class="tr2" style="margin:0"><div><b style="font-size:16px">النسخ التلقائي اليومي</b><div class="mut" style="margin-top:4px;font-size:13px">تُؤخذ نسخة احتياطية تلقائياً مرة كل يوم عند فتح التطبيق</div></div><input type="checkbox" class="sw" ' + (S.autoBak ? "checked " : "") + 'onchange="S.autoBak=this.checked;save();if(this.checked)autoBak();render()"></div>' + (hs ? '<button class="btn sm ghost" style="margin-top:12px" onclick="restoreSnap()">↩️ استعادة آخر نسخة تلقائية</button>' : "") + '</div><div class="card"><div class="bkh"><span style="color:#43a047">📥</span>استعادة نسخة احتياطية</div><div class="mut" style="margin-bottom:12px;font-size:13px">اختر ملف النسخة الاحتياطية، أو تقرير Excel المُصدَّر من التطبيق (‎.xlsx)</div><label class="bkx" style="display:flex;justify-content:center;background:#43a047;margin:0;box-shadow:none">📂 اختيار ملف<input type="file" accept=".xlsx,.xls,.json" style="display:none" onchange="pickRestore(this.files[0])"></label><details style="margin-top:14px"><summary class="mut" style="cursor:pointer">طريقة بديلة: نسخ ولصق النص</summary><textarea id="bk" style="margin-top:10px">' + E(textBackup()) + '</textarea><div class="acts"><button class="btn sm" onclick="copyBk()">نسخ</button><button class="btn sm grn" onclick="restoreBk()">استعادة</button></div></details></div><div class="bki"><div class="bkh" style="color:#1e88e5;font-size:17px">ℹ️ معلومات مهمة</div>' + info.map((x) => '<div class="bkc"><span>✔</span><span>' + x + "</span></div>").join("") + '</div><button class="bkb r" onclick="resetAll()">🗑️ مسح كل البيانات</button>';
};
autoBak();
