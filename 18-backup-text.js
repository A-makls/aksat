/**
 * 18 · backup-text.js — النسخ النصي واستعادة البيانات ومسح الكل
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function copyBk() {
  const t = document.getElementById("bk");
  t.select();
  try {
    navigator.clipboard.writeText(t.value);
  } catch (e) {
    document.execCommand("copy");
  }
  LOG("إنشاء نسخة احتياطية");
  save();
  alert("تم النسخ");
}
function validData(o) {
  return !!o && typeof o === "object" && Array.isArray(o.inst) && ["cust", "emp", "items", "pays", "exps", "debts", "log"].every((k) => o[k] === void 0 || Array.isArray(o[k]));
}
function restoreBk() {
  try {
    const o = JSON.parse(document.getElementById("bk").value);
    if (!validData(o)) throw 0;
    const pk = S.pin, ad = S.ads;
    S = Object.assign(DEF(), o, { ads: ad });
    S.pin = pk;
    LOG("استعادة نسخة احتياطية");
    save();
    render();
    alert("تمت الاستعادة");
  } catch (e) {
    alert("النص غير صالح");
  }
}
function resetAll() {
  ask("سيتم مسح كل البيانات نهائياً. متابعة؟", () => {
    S = DEF();
    save();
    render();
  });
}
