/**
 * 06 · home.js — الإعلانات والصفحة الرئيسية والإعدادات والبحث
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
let adK = 0, adT = null;
const AD0 = [["🧾", "سجّل أقساطك بسهولة", "linear-gradient(135deg,#0ea5e9,#2563eb)"], ["💬", "ذكّر عملاءك عبر واتساب", "linear-gradient(135deg,#06b6d4,#0ea5e9)"], ["🤝", "تابع ديونك وتسديداتها", "linear-gradient(135deg,#14b8a6,#06b6d4)"], ["📊", "أرباحك وإحصائياتك بنظرة", "linear-gradient(135deg,#38bdf8,#818cf8)"], ["💾", "احفظ نسخة من بياناتك", "linear-gradient(135deg,#0284c7,#0e7490)"]];
const ads = () => {
  S.ads = S.ads && S.ads.length === 5 ? S.ads : [{}, {}, {}, {}, {}];
  return S.ads;
};
function adGo(k) {
  document.querySelectorAll("#ads .ad").forEach((e, i) => e.classList.toggle("on", i === k));
  document.querySelectorAll("#ads .dots i").forEach((e, i) => e.classList.toggle("on", i === k));
  adK = k;
}
function startAds() {
  clearInterval(adT);
  adK = 0;
  adT = setInterval(() => {
    if (!document.getElementById("ads")) {
      clearInterval(adT);
      return;
    }
    adGo((adK + 1) % 5);
  }, 4e3);
}
function adBar() {
  const A = ads();
  setTimeout(startAds, 0);
  return '<div class="ads" id="ads">' + A.map((a, k) => {
    const d = AD0[k];
    return '<div class="ad' + (k ? "" : " on") + '" style="background:' + (a.img ? "url(" + a.img + ") center/cover" : d[2]) + '">' + (a.img ? "" : '<span class="ae">' + d[0] + "</span>") + (a.img && !a.title ? "" : '<b class="at">' + E(a.title || d[1]) + "</b>") + "</div>";
  }).join("") + '<button class="aed" onclick="adEdit()">✎</button><div class="dots">' + A.map((a, k) => '<i class="' + (k ? "" : "on") + '" onclick="adGo(' + k + ')"></i>').join("") + "</div></div>";
}
function adEdit() {
  const A = ads(), o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  const draw = () => {
    o.innerHTML = '<div class="md" style="border-radius:22px;max-width:420px;width:94%;max-height:88vh"><h3>🖼️ صور الإعلانات (5)</h3>' + A.map((a, k) => '<div class="card" style="padding:10px"><div style="display:flex;gap:10px;align-items:center"><div style="width:84px;height:52px;border-radius:10px;flex:none;background:' + (a.img ? "url(" + a.img + ") center/cover" : AD0[k][2]) + '"></div><div style="flex:1"><input class="atit" data-k="' + k + '" placeholder="' + AD0[k][1] + '" value="' + E(a.title || "") + '" style="margin:0 0 6px"><div class="row"><label class="btn sm" style="text-align:center;margin:0;color:#fff;font-size:12px">اختيار صورة<input type="file" accept="image/*" data-k="' + k + '" style="display:none"></label>' + (a.img ? '<button class="btn sm red" data-r="' + k + '">حذف الصورة</button>' : "") + "</div></div></div></div>").join("") + '<button class="btn" id="ok" style="width:100%;margin-top:8px">تم</button></div>';
    o.querySelectorAll(".atit").forEach((i) => i.oninput = () => {
      A[+i.dataset.k].title = i.value;
      save();
    });
    o.querySelectorAll("input[type=file]").forEach((f) => f.onchange = () => {
      const k = +f.dataset.k, fl = f.files[0];
      if (!fl) return;
      const r = new FileReader();
      r.onload = () => {
        const im = new Image();
        im.onload = () => {
          const s = Math.min(1, 900 / im.width), c = document.createElement("canvas");
          c.width = im.width * s;
          c.height = im.height * s;
          c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
          A[k].img = c.toDataURL("image/jpeg", 0.7);
          save();
          draw();
        };
        im.src = r.result;
      };
      r.readAsDataURL(fl);
    });
    o.querySelectorAll("[data-r]").forEach((b) => b.onclick = () => {
      A[+b.dataset.r].img = "";
      save();
      draw();
    });
    o.querySelector("#ok").onclick = () => {
      o.remove();
      render();
    };
  };
  draw();
  document.body.appendChild(o);
  o.onclick = (e) => {
    if (e.target === o) {
      o.remove();
      render();
    }
  };
}
const tileHtml = (t) => `<div class="tl" onclick="go('` + t[0] + `')">` + (t[0] === "late" && t[4] > 0 ? '<em class="bg">' + t[4] + "</em>" : "") + '<div class="ic" style="--c:' + t[3] + '"><i>' + t[2] + "</i></div><span>" + t[1] + "</span>" + (t[4] !== "" && t[0] !== "late" ? "<small>" + t[4] + "</small>" : "") + "</div>";
V.settings = function() {
  const L = lateList();
  return head("الإعدادات") + '<div class="tg">' + [["stock", "المخزن", "📦", "#06b6d4", S.items.length], ["exp", "المصروفات", "🧾", "#14b8a6", S.exps.length], ["pays", "التسديدات", "📅", "#0ea5e9", S.pays.length], ["late", "الأقساط المتأخرة", "⚠️", "#f43f5e", L.length], ["stats", "الإحصائيات", "📊", "#3b82f6", ""], ["profit", "الأرباح", "💲", "#10b981", ""], ["cash", "الصندوق", "🏦", "#2563eb", F(cash())], ["cust", "العملاء", "🧑‍🤝‍🧑", "#38bdf8", S.cust.length], ["emp", "الموظفون", "👔", "#0369a1", S.emp.length], ["log", "سجل العمليات", "📜", "#60a5fa", ""], ["bak", "النسخة الاحتياطية", "💾", "#0d9488", ""]].map(tileHtml).join("") + "</div>";
};
V.home = function() {
  const L = lateList(), d = /* @__PURE__ */ new Date(), ds = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear(), rec = S.inst.reduce((a, i) => a + late(i).rem, 0), dc = new Set(S.debts.map(gk)).size, dRem = S.debts.reduce((a, x) => a + (x.type === "in" ? x.amount - x.paid : 0), 0);
  const big = (k, ic, t, l1, l2, c, b) => '<div class="bigc" style="--c:' + c + `" onclick="go('` + k + `')">` + (b ? '<em class="bg">' + b + "</em>" : "") + ico(k, "l") + "<div><b>" + t + "</b><div>" + l1 + "</div><small>" + l2 + "</small></div></div>";
  return adBar() + '<div class="db"><div class="dh"><div style="display:flex;gap:10px;align-items:center"><span class="hlogo' + (window.__hlp ? "" : " f") + '" style="--d:' + (document.getElementById("spl") ? "4.4s" : "0s") + '">' + HLOGO + "</span><div><b>" + E(S.office || "اكتب اسم مكتبك من الإعدادات") + '</b><div style="font-size:12px;opacity:.85">' + ds + ' 📅</div></div></div><span class="live" dir="ltr">v' + APP_VER + '</span></div><div class="tg1">' + big("inst", "👥", "الأقساط", S.inst.length + " قسط", "المتبقي " + F(rec) + " د.ع", "#0284c7", L.length ? "متأخر " + L.length : "") + big("debts", "🤝", "الديون", dc + " عميل", "المتبقي لك " + F(dRem) + " د.ع", "#0e7490", "") + big("late", "⚠️", "الأقساط المتأخرة", L.length + " قسط", "المبلغ المتأخر " + F(L.reduce((a, x) => a + x.L, 0)) + " د.ع", "#f43f5e", L.length ? "تنبيه" : "") + "</div></div>";
};
let qI = "", qD = "";
const oldInst = () => '<h2 class="hx"></h2>' + instList(), oldDebts = V.debts;
const sBar = (id, v, fn) => '<div class="sw2" style="margin:0 0 12px"><input id="' + id + '" placeholder="🔍 ابحث بالاسم أو الهاتف أو المنتج' + (id === "qi" ? " أو رقم السجل" : "") + '" value="' + E(v) + '" oninput="' + fn + `" style="margin:0;border-radius:14px;padding-left:44px"><button type="button" class="sx" aria-label="مسح" onclick="var i=this.previousElementSibling;i.value='';i.dispatchEvent(new Event('input'));i.focus()">✕</button></div>`;
function srSplit(h, q, msg0) {
  const k = h.indexOf("</h2>") + 5;
  let rest = h.slice(k);
  if (q && rest.includes(msg0)) rest = rest.replace(msg0, "لا توجد نتائج مطابقة");
  return { head: h.slice(0, k), rest };
}
function srInst() {
  const all = S.inst, q = qI.trim().toLowerCase();
  const base = all.filter((i) => fMatch(stOf(i)));
  S.inst = q ? base.filter((i) => {
    const c = S.cust.find((k) => k.id === i.cust) || {};
    return [c.name, c.phone, i.desc, i.no].join(" ").toLowerCase().includes(q);
  }) : base;
  let h;
  try {
    h = oldInst();
  } finally {
    S.inst = all;
  }
  return srSplit(h, q || fSt !== "all", "لا توجد أقساط بعد");
}
function srDebts() {
  const all = S.debts, q = qD.trim().toLowerCase();
  let keep = all;
  if (q) {
    const ks = /* @__PURE__ */ new Set();
    all.forEach((d) => {
      const c = S.cust.find((k) => k.id === d.cust);
      if ([c ? c.name : d.name, c ? c.phone : d.phone, d.prod, d.note].join(" ").toLowerCase().includes(q)) ks.add(gk(d));
    });
    keep = all.filter((d) => ks.has(gk(d)));
  }
  {
    const gs = {};
    all.forEach((d) => {
      (gs[gk(d)] = gs[gk(d)] || []).push(d);
    });
    const ok = new Set(Object.keys(gs).filter((k) => fMatch(dStOf(gs[k]))));
    keep = keep.filter((d) => ok.has(gk(d)));
  }
  S.debts = keep;
  let h;
  try {
    h = oldDebts();
  } finally {
    S.debts = all;
  }
  return srSplit(h, q || fSt !== "all", "لا توجد ديون");
}
V.inst = function() {
  const r = srInst();
  return r.head + sBar("qi", qI, "qI=this.value;document.getElementById('sr').innerHTML=srInst().rest") + '<div id="sr">' + r.rest + "</div>";
};
V.debts = function() {
  const r = srDebts();
  return '<h2 class="hx"></h2>' + sBar("qd", qD, "qD=this.value;document.getElementById('sr').innerHTML=srDebts().rest") + '<div id="sr">' + r.rest + "</div>";
};
