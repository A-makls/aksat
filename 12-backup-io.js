/**
 * 12 · backup-io.js — تحويل Excel واستيراد/استعادة النسخ
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const BK_SHEETS = ["inst", "pays", "debts", "cust", "emp", "items", "exps", "log"];
function bkWorkbook() {
  const wb = XLSX.utils.book_new(), flat = (a) => a.map((o) => {
    const r = {};
    Object.keys(o).forEach((k) => {
      const v = o[k];
      if (v === void 0 || v === null) return;
      r[k] = typeof v === "object" ? JSON.stringify(v) : v;
    });
    return r;
  });
  wb.Workbook = { Views: [{ RTL: true }] };
  BK_SHEETS.forEach((k) => {
    const a = flat(S[k] || []);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(a.length ? a : [{}]), k);
  });
  const meta = [{ key: "app", value: "aqsat" }, { key: "version", value: APP_VER }, { key: "exported", value: (/* @__PURE__ */ new Date()).toISOString() }];
  ["cash0", "office", "theme", "autoBak", "lastAuto", "ig"].forEach((k) => {
    if (S[k] !== void 0) meta.push({ key: k, value: S[k] });
  });
  if (S.lastBak) meta.push({ key: "lastBak", value: JSON.stringify(S.lastBak) });
  if (S.ads) meta.push({ key: "ads", value: JSON.stringify(S.ads.map((a) => ({ title: a.title || "" }))) });
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(meta), "meta");
  return wb;
}
function reportToData(wb) {
  const o = DEF(), rows = (n) => wb.Sheets[n] ? XLSX.utils.sheet_to_json(wb.Sheets[n]).filter((r) => r["—"] === void 0 && Object.keys(r).length) : [], dt = (v) => typeof v === "number" ? new Date(Math.round((v - 25569) * 864e5)).toISOString().slice(0, 10) : String(v || today()).slice(0, 10), str = (v) => v == null ? "" : String(v).trim(), num = (v) => +String(v == null ? 0 : v).replace(/,/g, "") || 0, cmap = {};
  let skipped = 0;
  const getC = (name, phone) => {
    name = str(name);
    if (!name) return null;
    let c = cmap[name];
    if (!c) {
      c = { id: uid(), name, phone: str(phone) };
      cmap[name] = c;
      o.cust.push(c);
    } else if (!c.phone && phone) c.phone = str(phone);
    return c;
  };
  rows("العملاء").forEach((r) => getC(r["الاسم"], r["الهاتف"]));
  rows("الأقساط").forEach((r, k) => {
    const c = getC(r["العميل"], r["الهاتف"]), st = dt(r["تاريخ البداية"]);
    o.inst.push({ id: uid(), no: num(r["رقم السجل"]) || k + 1, cust: c ? c.id : "", desc: str(r["المنتج"]), qty: num(r["الكمية"]) || 1, total: num(r["السعر الإجمالي"]), cost: 0, down: num(r["المقدمة"]), mon: num(r["مبلغ القسط"]), months: num(r["عدد الأقساط"]) || 1, start: st, created: st, freq: { "أسبوعي": "w", "يومي": "d" }[str(r["النوع"])] || "m", guar: str(r["الكفيل"]) });
  });
  rows("التسديدات").forEach((r) => {
    const c = cmap[str(r["العميل"])], i = o.inst.find((x) => c && x.cust === c.id && x.desc === str(r["المنتج"]));
    if (!i) {
      skipped++;
      return;
    }
    o.pays.push({ id: uid(), inst: i.id, amt: num(r["المبلغ"]), date: dt(r["التاريخ"]), note: str(r["ملاحظة"]) });
  });
  rows("الديون").forEach((r) => {
    const c = getC(r["العميل"], r["الهاتف"]), d = dt(r["التاريخ"]);
    o.debts.push({ id: uid(), cust: c ? c.id : "", type: str(r["النوع"]).startsWith("دين لي") ? "in" : "out", name: c ? c.name : "", phone: c ? c.phone : "", amount: num(r["المبلغ"]), paid: num(r["المسدد"]), date: d, note: "", prod: str(r["المنتج"]), qty: num(r["الكمية"]) || 1, ts: Date.parse(d) || Date.now() });
  });
  rows("الموظفون").forEach((r) => o.emp.push({ id: uid(), name: str(r["الاسم"]), role: str(r["الوظيفة"]), sal: num(r["الراتب"]) }));
  rows("المخزن").forEach((r) => o.items.push({ id: uid(), name: str(r["الصنف"]), qty: num(r["الكمية"]), cost: num(r["سعر الشراء"]), price: num(r["سعر البيع"]) }));
  rows("المصروفات").forEach((r) => o.exps.push({ id: uid(), title: str(r["البيان"]), amt: num(r["المبلغ"]), date: dt(r["التاريخ"]) }));
  o._rep = true;
  o._skipped = skipped;
  return o;
}
function xlsxToData(buf) {
  const wb = XLSX.read(buf, { type: "array" }), o = DEF();
  if (!wb.Sheets.inst && wb.Sheets["الأقساط"]) return reportToData(wb);
  if (!wb.Sheets.inst || !wb.Sheets.meta) throw 0;
  BK_SHEETS.forEach((k) => {
    const ws = wb.Sheets[k];
    if (!ws) return;
    o[k] = XLSX.utils.sheet_to_json(ws).filter((r) => Object.keys(r).length).map((r) => {
      if (typeof r.pl === "string") {
        try {
          r.pl = JSON.parse(r.pl);
        } catch (e) {
          delete r.pl;
        }
      }
      return r;
    });
  });
  XLSX.utils.sheet_to_json(wb.Sheets.meta).forEach((m) => {
    if (["app", "version", "exported"].includes(m.key)) return;
    let v = m.value;
    if ((m.key === "lastBak" || m.key === "ads") && typeof v === "string") {
      try {
        v = JSON.parse(v);
      } catch (e) {
      }
    }
    o[m.key] = v;
  });
  return o;
}
async function makeBackup() {
  if (!await loadXlsx()) {
    toast("تعذّر تحميل مكتبة Excel (تحقق من الاتصال بالإنترنت)");
    return;
  }
  const done = () => {
    toast("تم إنشاء النسخة الاحتياطية");
    S.lastBak = { ts: Date.now(), type: "يدوية" };
    LOG("إنشاء نسخة احتياطية (Excel)");
    save();
    render();
  };
  const buf = XLSX.write(bkWorkbook(), { bookType: "xlsx", type: "array" });
  const r = await saveFile("aqsat-backup-" + today() + ".xlsx", buf, XLSX_MIME, done);
  if (r === "no" || r === "dialog") return;
  if (r === "na") {
    toast("تعذّر حفظ الملف على هذا الجهاز");
    return;
  }
  done();
}
async function pickRestore(f) {
  if (!f) return;
  const isX = /\.xlsx?$/i.test(f.name);
  if (isX && !await loadXlsx()) {
    toast("تعذّر تحميل مكتبة Excel (تحقق من الاتصال بالإنترنت)");
    return;
  }
  const r = new FileReader();
  r.onload = () => {
    try {
      let o;
      if (isX) {
        if (!window.XLSX) throw 0;
        o = xlsxToData(r.result);
      } else {
        o = JSON.parse(r.result);
        o = o.data || o;
      }
      if (!validData(o)) throw 0;
      ask("سيتم استبدال بياناتك الحالية بالنسخة المختارة. متابعة؟", () => {
        const pinKeep = S.pin, keep = S.ads, st = { cash0: S.cash0, office: S.office, theme: S.theme, ig: S.ig, autoBak: S.autoBak }, sk = o._skipped;
        delete o._skipped;
        S = Object.assign(DEF(), o._rep ? st : {}, o);
        delete S._rep;
        if (isX) S.ads = keep;
        S.pin = pinKeep;
        LOG("استعادة نسخة احتياطية");
        save();
        render();
        toast(o._rep ? "تم الاستيراد: " + S.inst.length + " قسط، " + S.pays.length + " تسديد، " + S.debts.length + " دين" + (sk ? " (تعذّر ربط " + sk + " تسديد)" : "") : "تمت الاستعادة بنجاح");
      });
    } catch (e) {
      toast("الملف غير صالح");
    }
  };
  isX ? r.readAsArrayBuffer(f) : r.readAsText(f);
}
