/**
 * 17 · i18n.js — الترجمة عربي/English
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
const EN_RAW = {
  "اكتب اسم مكتبك من الإعدادات": "Set your office name in Settings",
  "أقساطي": "My Installments",
  "الرئيسية": "Home",
  "الإعدادات": "Settings",
  "الأقساط المتأخرة": "Late Installments",
  "الأقساط": "Installments",
  "المتأخرة": "Late",
  "التسديدات": "Payments",
  "الديون": "Debts",
  "المخزن": "Inventory",
  "المصروفات": "Expenses",
  "الأرباح": "Profits",
  "الإحصائيات": "Statistics",
  "الصندوق": "Cash Box",
  "العملاء": "Customers",
  "الموظفون": "Employees",
  "سجل العمليات": "Activity Log",
  "النسخة الاحتياطية": "Backup",
  "من نحن": "About Us",
  "تفاصيل القسط": "Installment Details",
  "تفاصيل الدين": "Debt Details",
  "الأقسام": "Sections",
  "قسط جديد": "New Installment",
  "دين جديد": "New Debt",
  "تعديل القسط": "Edit Installment",
  "تعديل الدين": "Edit Debt",
  "حفظ القسط": "Save Installment",
  "حفظ الدين": "Save Debt",
  "حفظ التعديلات": "Save Changes",
  "تسديد قسط": "Pay Installment",
  "تسديد دين": "Pay Debt",
  "إضافة دين": "Add Debt",
  "المبلغ الكلي": "Total",
  "المتبقي لك": "Owed to you",
  "المتبقي": "Remaining",
  "نسبة السداد": "Paid %",
  "نشط": "Active",
  "مكتمل": "Completed",
  "تسديد": "Pay",
  "تذكير": "Remind",
  "اتصال": "Call",
  "تنبيه: الزبون تجاوز اليوم المستحق لتسديد": "Alert: customer is past the due date",
  "تنبيه": "Alert",
  "حذف": "Delete",
  "تعديل": "Edit",
  "إضافة": "Add",
  "حفظ": "Save",
  "إلغاء": "Cancel",
  "إغلاق": "Close",
  "نعم": "Yes",
  "تم": "Done",
  "نسخ": "Copy",
  "استعادة": "Restore",
  "د.ع": "IQD",
  "مسدد": "Paid off",
  "ابحث بالاسم أو الهاتف أو المنتج": "Search by name, phone or product",
  "أو رقم السجل": " or record no.",
  "لا توجد نتائج مطابقة": "No matching results",
  "لا توجد أقساط بعد": "No installments yet",
  "لا توجد ديون": "No debts",
  "لا توجد مدفوعات": "No payments",
  "لا توجد تسديدات": "No payments",
  "لا يوجد عملاء": "No customers",
  "لا يوجد موظفون": "No employees",
  "المخزن فارغ": "Inventory is empty",
  "لا توجد مصروفات": "No expenses",
  "لا توجد عمليات": "No activity",
  "الكل": "All",
  "النشطة": "Active",
  "المكتملة": "Completed",
  "لوحة التحكم": "Dashboard",
  "قسط متأخر": "late installments",
  "قسط": "installments",
  "عميل": "customers",
  "صنف": "items",
  "مصروف": "expenses",
  "دفعة": "payments",
  "موظف": "employees",
  "المبلغ المتأخر": "Late amount",
  "ملخص وتحليلات": "Summary & analytics",
  "الأرباح المحققة": "Realized profit",
  "الرصيد": "Balance",
  "آخر العمليات": "Recent activity",
  "تصدير واستعادة البيانات": "Export & restore data",
  "معلومات الزبون": "Customer Info",
  "اسم الزبون": "Customer name",
  "اسم الكفيل (اختياري)": "Guarantor name (optional)",
  "رقم الهاتف": "Phone number",
  "معلومات المنتج": "Product Info",
  "اختر المنتجات": "Select products",
  "اضغط لاختيار المنتجات من المخزن": "Tap to pick products from inventory",
  "المادة": "Item",
  "الكمية": "Quantity",
  "معلومات السعر": "Price Info",
  "بيع نقدي": "Cash sale",
  "سعر الشراء": "Purchase price",
  "نسبة الربح %": "Profit %",
  "سعر البيع": "Selling price",
  "معلومات القسط": "Installment Info",
  "المقدمة (اختياري)": "Down payment (optional)",
  "مبلغ القسط الأخير": "Last installment",
  "مبلغ القسط": "Installment amount",
  "النتائج التلقائية": "Auto Results",
  "عدد الأقساط": "Number of installments",
  "الباقي": "Balance",
  "التاريخ": "Date",
  "رقم السجل (إجباري)": "Record no. (required)",
  "رقم السجل": "Record no.",
  "يومي": "Daily",
  "أسبوعي": "Weekly",
  "شهري": "Monthly",
  "فعّل المفتاح لاختيار عميل مسجّل": "Turn on to pick a saved customer",
  "دين لي": "Owed to me",
  "دين عليّ": "I owe",
  "معلومات الدين": "Debt Info",
  "اسم المنتج أو سبب الدين (اختياري)": "Product or reason (optional)",
  "معلومات التسديد": "Payment Info",
  "المبلغ المسدد مسبقاً (اختياري)": "Prepaid amount (optional)",
  "المسدد": "Paid",
  "سعر الوحدة": "Unit price",
  "ملاحظات (اختياري)": "Notes (optional)",
  "ملاحظة الدين": "Debt note",
  "ملاحظة": "Note",
  "المبلغ المستحق": "Amount due",
  "القسط الشهري": "Monthly installment",
  "كامل المتبقي": "Full remaining",
  "سيُسجَّل التسديد بتاريخ اليوم": "Payment will be recorded with today's date",
  "المبلغ المراد تسديده": "Amount to pay",
  "اختر الدين المراد تسديده": "Select the debt to pay",
  "الدين المستحق": "Debt due",
  "المبلغ المراد إضافته": "Amount to add",
  "تمت إضافة القسط": "Installment added",
  "إرسال وصل الشراء": "Send purchase receipt",
  "تم تسديد القسط": "Installment paid",
  "إرسال وصل التسديد": "Send payment receipt",
  "إرسال تذكير": "Send reminder",
  "أضف رقم هاتف العميل لإرسال الوصل": "Add the customer phone to send the receipt",
  "أضف رقم هاتف العميل": "Add the customer phone number",
  "اتصال الآن": "Call now",
  "نسخ الرقم": "Copy number",
  "محادثة واتساب": "WhatsApp chat",
  "تذكير واتساب": "WhatsApp reminder",
  "واتساب": "WhatsApp",
  "المتوفر": "Available",
  "المظهر": "Appearance",
  "اختر الوضع النهاري أو الليلي، أو اتبع إعداد جهازك تلقائياً": "Choose light or dark mode, or follow your device",
  "نهاري": "Light",
  "ليلي": "Dark",
  "تلقائي": "Auto",
  "اسم المكتب": "Office Name",
  "يظهر في الواجهة الرئيسية، وإذا تركته فارغاً تظهر عبارة «اكتب اسم مكتبك من الإعدادات»": "Shown on the home screen; if empty a reminder appears",
  "مثال: مكتب النور للأقساط": "e.g. Al-Noor Installments Office",
  "أحمد المخلص · حساباتي على الفيسبوك والإنستقرام": "Ahmed Al-Mukhles · My Facebook and Instagram accounts",
  "فيسبوك": "Facebook",
  "إنستقرام": "Instagram",
  "اللغة": "Language",
  "اختر لغة التطبيق": "Choose the app language",
  "حساباتي على الفيسبوك والإنستقرام": "My Facebook and Instagram accounts",
  "آخر نسخة احتياطية": "Last backup",
  "التاريخ والوقت:": "Date & time:",
  "النوع:": "Type:",
  "يدوية": "Manual",
  "تلقائية": "Automatic",
  "تصدير تقرير Excel": "Export Excel report",
  "إنشاء نسخة احتياطية الآن": "Create backup now",
  "النسخ التلقائي اليومي": "Daily auto backup",
  "النسخ التلقائي": "Auto backup",
  "تُؤخذ نسخة احتياطية تلقائياً مرة كل يوم عند فتح التطبيق": "A backup is taken automatically once a day when the app opens",
  "استعادة آخر نسخة تلقائية": "Restore last auto backup",
  "استعادة نسخة احتياطية": "Restore a backup",
  "اختيار ملف": "Choose file",
  "معلومات مهمة": "Important info",
  "مسح كل البيانات": "Erase all data",
  "رمز الحماية": "Security PIN",
  "مفعّل — يُطلب الرمز عند فتح النسخة الاحتياطية وعند حذف أي بطاقة قسط أو دين": "Enabled — PIN required to open backups and to delete any installment or debt card",
  "غير مفعّل — فعّل رمزاً من 4 أرقام لحماية النسخ الاحتياطية وخيارات الحذف": "Disabled — set a 4-digit PIN to protect backups and deletions",
  "تغيير الرمز": "Change PIN",
  "إلغاء الرمز": "Remove PIN",
  "تفعيل رمز الحماية": "Enable PIN",
  "أدخل رمز الحماية": "Enter PIN",
  "أدخل رمز الحماية لتأكيد الحذف": "Enter PIN to confirm deletion",
  "اختر رمز حماية جديداً (4 أرقام)": "Choose a new 4-digit PIN",
  "أعد إدخال الرمز للتأكيد": "Re-enter PIN to confirm",
  "لم تُنشأ أي نسخة احتياطية بعد": "No backup has been created yet",
  "النسخة الاحتياطية بصيغة Excel (xlsx) وتحتوي على جميع بيانات التطبيق": "The backup is an Excel (xlsx) file containing all app data",
  "يمكن تصدير البيانات إلى ملف Excel بشيت منفصل لكل قسم": "Data can be exported to Excel with a separate sheet per section",
  "النسخ التلقائي يعمل مرة واحدة كل يوم عند فتح التطبيق": "Auto backup runs once a day when the app opens",
  "يمكنك مشاركة ملف النسخة الاحتياطية مع أي شخص": "You can share the backup file with anyone",
  "اختر ملف النسخة الاحتياطية، أو تقرير Excel المُصدَّر من التطبيق": "Choose a backup file, or an Excel report exported from the app",
  "طريقة بديلة: نسخ ولصق النص": "Alternative: copy & paste text",
  "صباحاً": "AM",
  "مساءً": "PM",
  "تم إنشاء النسخة الاحتياطية": "Backup created",
  "تمت الاستعادة بنجاح": "Restored successfully",
  "الملف غير صالح": "Invalid file",
  "تم حفظ اسم المكتب": "Office name saved",
  "تم تفعيل رمز الحماية": "PIN enabled",
  "تم إلغاء رمز الحماية": "PIN removed",
  "سيتم استبدال بياناتك الحالية بالنسخة المختارة. متابعة؟": "Your current data will be replaced. Continue?",
  "اكتب رقم السجل": "Enter the record number",
  "أدخل مبلغ الدين": "Enter the debt amount",
  "أدخل سعر البيع": "Enter the selling price",
  "أدخل مبلغ القسط": "Enter the installment amount",
  "اكتب اسم الزبون": "Enter the customer name",
  "قائمة ديون": "Debts of",
  "عدد الديون": "Number of debts",
  "مدة أقدم دين": "Oldest debt age",
  "الدين الكلي": "Total debt",
  "أيام": "days",
  "ساعة": "hours",
  "دقيقة": "min",
  "الاسم": "Name",
  "الهاتف": "Phone",
  "الوظيفة": "Role",
  "الراتب": "Salary",
  "صرف الراتب": "Pay salary",
  "الصنف": "Item",
  "المبلغ": "Amount",
  "البيان": "Description",
  "عميل جديد": "New Customer",
  "موظف جديد": "New Employee",
  "صنف جديد": "New Item",
  "مصروف جديد": "New Expense",
  "＋ دين": "＋ Debt",
  "＋ إضافة": "＋ Add",
  "التحصيل مقابل المصروفات (آخر 6 أشهر)": "Collections vs Expenses (last 6 months)",
  "تحصيل": "Collections",
  "إحصائيات المخزن": "Inventory stats",
  "عدد الأصناف": "Items count",
  "إجمالي القطع": "Total pieces",
  "أصناف قاربت على النفاد": "Low-stock items",
  "عام": "General",
  "إجمالي المبالغ المحصلة": "Total collected",
  "عقود الأقساط": "Installment contracts",
  "صافي الربح (بعد المصروفات)": "Net profit (after expenses)",
  "الأرباح المحققة من الأقساط": "Realized profit from installments",
  "أرباح متوقعة عند اكتمال الأقساط": "Expected profit when completed",
  "ربح العقد": "Contract profit",
  "الرصيد الحالي": "Current balance",
  "الرصيد الافتتاحي": "Opening balance",
  "تعديل الرصيد الافتتاحي": "Edit opening balance",
  "المعلومات": "Info",
  "معلومات الدفع": "Payment Info",
  "السعر الإجمالي": "Total price",
  "المقدمة": "Down payment",
  "نوع القسط": "Installment type",
  "المدفوع": "Paid",
  "المتأخر": "Late",
  "الربح المحقق": "Realized profit",
  "سجل المدفوعات": "Payments log",
  "الكفيل": "Guarantor",
  "تاريخ الإنشاء": "Created",
  "اسم المنتج": "Product",
  "تأكيد": "Confirm",
  "تعديل معلومات العميل": "Edit customer info",
  "اسم العميل": "Customer name",
  "ابحث...": "Search...",
  "رجوع": "Back",
  "تسديدات الديون": "Debt Payments",
  "عدد التسديدات": "Number of payments",
  "تسديدات سابقة (بدون تفاصيل)": "Earlier payments (no details)",
  "أقساط العميل": "Customer Installments",
  "أقساط": "installments",
  "قائمة أقساط": "Installments of",
  "إضافة قسط": "Add Installment",
  "لا توجد أقساط مستحقة": "No due installments",
  "اختر القسط المراد تسديده": "Select the installment to pay",
  "ابحث عن عميل بالاسم أو الهاتف أو رقم السجل": "Search customer by name, phone or record no.",
  "لا يوجد عميل مطابق": "No matching customer",
  "اختر عميلاً من القائمة": "Pick a customer from the list",
  "تمت إضافة معلومات العميل تلقائياً": "Customer info added automatically",
  "مسدد بالكامل": "Fully paid",
  "تاريخ أقدم قسط": "Oldest installment date",
  "تم نسخ ملخص الأقساط": "Installments summary copied",
  "ابحث عن عميل بالاسم أو الهاتف": "Search customer by name or phone",
  "تم تسديد الدين": "Debt paid",
  "حركة البطاقات": "Card animation",
  "حركة تظهر بها بطاقات الأقساط والديون عند فتح القسم وعند التمرير للأعلى والأسفل": "How installment and debt cards appear when opening a section and when scrolling up and down",
  "اضغط على البطاقة لإعادة الحركة": "Tap the card to replay the animation",
  "معاينة الحركة": "Animation preview"
};
const EN = Object.entries(EN_RAW).sort((a, b) => b[0].length - a[0].length);
const trS = (t) => {
  let r = t;
  for (const [a, b] of EN) if (r.includes(a)) r = r.split(a).join(b);
  return r;
};
function trNode(n) {
  if (n.nodeType === 3) {
    if (n.__ar === void 0 && n.nodeValue.trim()) {
      const v = trS(n.nodeValue);
      if (v !== n.nodeValue) {
        n.__ar = n.nodeValue;
        n.nodeValue = v;
      }
    }
  }
}
function trAll(root) {
  if (!root) return;
  if (root.nodeType === 3) {
    trNode(root);
    return;
  }
  if (root.nodeType !== 1) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n2) => /^(SCRIPT|STYLE|TEXTAREA)$/.test(n2.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  let n;
  while (n = w.nextNode()) trNode(n);
  root.querySelectorAll("[placeholder],[aria-label]").forEach((e) => {
    ["placeholder", "aria-label"].forEach((a) => {
      if (!e.hasAttribute(a)) return;
      const k = "data-ar-" + a, cur = e.getAttribute(a), o = e.getAttribute(k);
      if (o !== null && cur === trS(o)) return;
      const v = trS(cur);
      if (v !== cur) {
        e.setAttribute(k, cur);
        e.setAttribute(a, v);
      } else if (o !== null) e.removeAttribute(k);
    });
  });
}
function trRestore() {
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  while (n = w.nextNode()) if (n.__ar !== void 0) {
    n.nodeValue = n.__ar;
    n.__ar = void 0;
  }
  document.querySelectorAll("[data-ar-placeholder],[data-ar-aria-label]").forEach((e) => {
    ["placeholder", "aria-label"].forEach((a) => {
      const k = "data-ar-" + a;
      if (e.hasAttribute(k)) {
        e.setAttribute(a, e.getAttribute(k));
        e.removeAttribute(k);
      }
    });
  });
}
function applyLang() {
  const en = S.lang === "en", r = document.documentElement;
  r.lang = en ? "en" : "ar";
  r.dir = en ? "ltr" : "rtl";
}
function postLang() {
  applyLang();
  if (S.lang === "en") trAll(document.body);
}
function setLang(l) {
  const prev = S.lang === "en";
  S.lang = l;
  save();
  applyLang();
  if (prev && l !== "en") trRestore();
  render();
}
new MutationObserver((ms) => {
  if (S.lang !== "en") return;
  ms.forEach((m) => m.addedNodes.forEach((n) => trAll(n)));
}).observe(document.body, { childList: true, subtree: true });
function langCard() {
  const c = S.lang === "en" ? "en" : "ar";
  return '<div class="card"><div style="font-weight:700;font-size:16px">🌐 اللغة</div><div class="mut" style="margin:4px 0 12px">اختر لغة التطبيق</div><div class="thg" style="grid-template-columns:1fr 1fr"><button class="tho' + (c === "ar" ? " on" : "") + `" onclick="setLang('ar')"><span class="soc" style="background:linear-gradient(135deg,#16a34a,#0d9488);font-weight:800;font-size:20px">ع</span><span>العربية</span></button><button class="tho` + (c === "en" ? " on" : "") + `" onclick="setLang('en')"><span class="soc" style="background:linear-gradient(135deg,#2563eb,#4f46e5);font-weight:800;font-size:18px">En</span><span translate="no">English</span></button></div></div>`;
}
