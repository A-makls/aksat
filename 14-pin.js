/**
 * 14 · pin.js — رمز الحماية
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
async function hashPin(p) {
  try {
    const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("aqsat:" + p));
    return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
  } catch (e) {
    return "x" + btoa(p);
  }
}
function pinPad(title, cb) {
  const o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  let v = "";
  o.innerHTML = `<div class='md pinm'><h3>${title}</h3><div class='pd'><i></i><i></i><i></i><i></i></div><div class='pk'>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => `<button type='button' data-k='${n}'>${n}</button>`).join("")}<span></span><button type='button' data-k='0'>0</button><button type='button' data-k='x'>⌫</button></div><button type='button' class='btn ghost' id='pc' style='width:100%;margin-top:12px'>إلغاء</button></div>`;
  document.body.appendChild(o);
  const dots = [...o.querySelectorAll(".pd i")], paint = () => dots.forEach((d, i) => d.classList.toggle("on", i < v.length));
  o.querySelector("#pc").onclick = () => o.remove();
  o.querySelectorAll(".pk button").forEach((b) => b.onclick = async () => {
    const k = b.dataset.k;
    if (k === "x") v = v.slice(0, -1);
    else if (v.length < 4) v += k;
    paint();
    if (v.length === 4) {
      const r = await cb(v);
      if (r) o.remove();
      else {
        const pd = o.querySelector(".pd");
        pd.classList.remove("shake");
        void pd.offsetWidth;
        pd.classList.add("shake");
        v = "";
        setTimeout(paint, 250);
      }
    }
  });
}
function pinAsk(ok) {
  pinPad("أدخل رمز الحماية", async (v) => {
    if (await hashPin(v) === S.pin) {
      _pinOK = true;
      ok();
      return true;
    }
    return false;
  });
}
function pinSet() {
  pinPad("اختر رمز حماية جديداً (4 أرقام)", async (v1) => {
    setTimeout(() => pinPad("أعد إدخال الرمز للتأكيد", async (v2) => {
      if (v1 !== v2) return false;
      S.pin = await hashPin(v1);
      save();
      _pinOK = true;
      render();
      toast("تم تفعيل رمز الحماية");
      return true;
    }), 200);
    return true;
  });
}
function pinChange() {
  pinAsk(() => pinSet());
}
function pinRemove() {
  pinAsk(() => {
    S.pin = "";
    save();
    render();
    toast("تم إلغاء رمز الحماية");
  });
}
function pinCard() {
  return '<div class="card"><div class="bkh"><span>🔒</span>رمز الحماية</div><div class="mut" style="font-size:13px;margin-bottom:12px">' + (S.pin ? "مفعّل — يُطلب الرمز عند فتح النسخة الاحتياطية وعند حذف أي بطاقة قسط أو دين" : "غير مفعّل — فعّل رمزاً من 4 أرقام لحماية النسخ الاحتياطية وخيارات الحذف") + "</div>" + (S.pin ? '<div class="acts"><button class="btn sm" onclick="pinChange()">تغيير الرمز</button><button class="btn sm red" onclick="pinRemove()">إلغاء الرمز</button></div>' : '<button class="btn" style="width:100%" onclick="pinSet()">تفعيل رمز الحماية</button>') + "</div>";
}
function pinDel(need, fn) {
  if (need && S.pin) pinPad("أدخل رمز الحماية لتأكيد الحذف", async (v) => {
    if (await hashPin(v) === S.pin) {
      fn();
      return true;
    }
    return false;
  });
  else fn();
}
