/**
 * animations.js — حركة ظهور بطاقات الأقساط والديون عند التنقل وعند التمرير للأعلى والأسفل
 * الإعداد محفوظ في S.anim (none | fade | slide | zoom | flip | bounce | swing | stretch)
 *
 * طريقة العمل:
 *  - كل بطاقة (.card / .iw) في صفحات الأقساط والديون تُراقَب بـ IntersectionObserver.
 *  - خارج الشاشة تُخفى (an-pre)، وعند دخولها تتحرك بحسب موضعها: من الأسفل عند النزول، ومن الأعلى عند الصعود.
 *  - عند مغادرتها الشاشة تُخفى من جديد لتعيد الحركة عند عودتها (في الاتجاهين).
 *  - مسح احتياطي (animSweep) يكشف أي بطاقة بقيت مخفية داخل الشاشة، حتى لو تأخر المراقب (يحدث على iOS).
 * سكربت كلاسيكي يشترك في النطاق العام؛ يُحمَّل قبل 19-app.js.
 */
const ANIMS = [
  ["none", "بدون", "⛔"],
  ["fade", "تلاشي", "✨"],
  ["slide", "انزلاق", "⬆️"],
  ["zoom", "تكبير", "🔍"],
  ["flip", "قلب", "🔄"],
  ["bounce", "ارتداد", "🏀"],
  ["swing", "تأرجح", "🎢"],
  ["stretch", "تمدد", "↕️"]
];
const ANIM_SEL = ".card, .iw";
const ANIM_TABS = ["inst", "late", "pays", "debts", "gdetail", "ddetail"];
let _animDir = 1, _animHint = 1, _animHintT = 0, _animLastY = window.scrollY || 0, _animNavUntil = 0, _animLastTab = null, _animSeen = new WeakSet(), _animSweepT = 0;
// مراقبان بهامشين مختلفين لمنع التذبذب: الأول يكشف البطاقة قرب حافة الشاشة، والثاني يخفيها فقط حين تبتعد كثيراً (300px).
// (لو كان الإخفاء والكشف على نفس الحد لأخرجت إزاحة الحركة نفسها البطاقة من الحد فتتكرر الحركة في حلقة)
const _animIO = typeof IntersectionObserver === "function" ? new IntersectionObserver(animOnEnter, { threshold: 0.05, rootMargin: "40px 0px" }) : null;
const _animFar = typeof IntersectionObserver === "function" ? new IntersectionObserver(animOnFar, { threshold: 0, rootMargin: "300px 0px" }) : null;
const animStop = (el) => { _animIO.unobserve(el); _animFar.unobserve(el); el.classList.remove("an-pre"); };

function animName() {
  const a = S.anim;
  return a && a !== "none" && ANIMS.some((x) => x[0] === a) ? a : "";
}

// d: 1 تدخل البطاقة من الأسفل (نزول)، -1 من الأعلى (صعود) — x: يمين/يسار للتأرجح
// الإزاحات الأفقية صغيرة عمداً حتى لا تتجاوز هامش الصفحة فتتسع أفقياً
function animFrames(name, d, x) {
  const to = { opacity: 1, transform: "none" };
  switch (name) {
    case "fade":
      return [{ opacity: 0 }, { opacity: 1 }];
    case "slide":
      return [{ opacity: 0, transform: "translateY(" + d * 28 + "px)" }, to];
    case "zoom":
      return [{ opacity: 0, transform: "scale(.88)" }, to];
    case "flip":
      return [{ opacity: 0, transform: "perspective(900px) rotateX(" + -d * 30 + "deg)" }, { opacity: 1, transform: "perspective(900px) rotateX(0deg)" }];
    case "bounce":
      return [
        { opacity: 0, transform: "translateY(" + d * 44 + "px)", offset: 0 },
        { opacity: 1, transform: "translateY(" + -d * 8 + "px)", offset: 0.65 },
        { opacity: 1, transform: "none", offset: 1 }
      ];
    case "swing":
      return [{ opacity: 0, transform: "translateX(" + x * 12 + "px) rotate(" + x * 2 + "deg)" }, to];
    case "stretch": {
      const o = d > 0 ? "50% 0%" : "50% 100%";
      return [{ opacity: 0, transform: "scaleY(.55)", transformOrigin: o }, { opacity: 1, transform: "none", transformOrigin: o }];
    }
  }
  return [{ opacity: 1 }, { opacity: 1 }];
}
const animOpts = (name, i) => ({
  duration: name === "bounce" ? 520 : 420,
  delay: Math.min(i, 4) * 45,
  easing: name === "bounce" ? "ease-out" : "cubic-bezier(.22,1,.36,1)",
  fill: "backwards"
});

function animReveal(el, i, d) {
  const name = animName();
  el.classList.remove("an-pre");
  if (!name || !el.animate) return;
  if (el._anA) el._anA.cancel();
  el.style.willChange = "transform, opacity";
  const a = el._anA = el.animate(animFrames(name, d, i % 2 ? 1 : -1), animOpts(name, i));
  a.onfinish = a.oncancel = () => { if (el._anA === a) el.style.willChange = ""; };
}

// يكشف مجموعة بطاقات دخلت الشاشة: الأقرب أولاً، والحركة بحسب اتجاه دخولها
function animEnter(els) {
  const mid = innerHeight / 2, nav = performance.now() < _animNavUntil;
  const info = els.map((el) => {
    const r = el.getBoundingClientRect();
    return { el, top: r.top, d: r.top + r.height / 2 > mid ? 1 : -1 };
  });
  info.sort((a, b) => a.top - b.top);
  // الأولوية: فتح الصفحة (من الأسفل) ثم اتجاه التمرير الأخير (إشارته فقط) ثم موضع البطاقات
  const d = nav ? 1 : performance.now() - _animHintT < 500 ? _animHint : info.reduce((s, x) => s + x.d, 0) >= 0 ? 1 : -1;
  _animDir = d;
  if (d < 0) info.reverse();
  info.forEach((x, i) => {
    if (i >= 6) x.el.classList.remove("an-pre"); // بطاقات كثيرة دفعة واحدة: تظهر مباشرة
    else animReveal(x.el, i, d);
  });
}

// دخلت الشاشة: تُكشف بحركة إن كانت مخفية
function animOnEnter(entries) {
  const name = animName(), enter = [];
  entries.forEach((e) => {
    const el = e.target;
    if (!el.isConnected || !name) return animStop(el);
    if (e.isIntersecting && el.classList.contains("an-pre")) enter.push(el);
  });
  if (enter.length) animEnter(enter);
}

// ابتعدت كثيراً عن الشاشة: تُخفى لتعيد الحركة عند عودتها
function animOnFar(entries) {
  const name = animName();
  entries.forEach((e) => {
    const el = e.target;
    if (!el.isConnected || !name) return animStop(el);
    if (!e.isIntersecting) el.classList.add("an-pre");
  });
}

// مسح احتياطي: أي بطاقة مخفية وهي داخل الشاشة تُكشف (يغطي تأخر المراقب على iOS)
function animSweep() {
  const main = document.getElementById("main");
  if (!main || !animName()) return;
  const vh = innerHeight;
  const hid = [...main.querySelectorAll(".an-pre")].filter((el) => {
    const r = el.getBoundingClientRect(), seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    return seen > 0 && seen >= r.height * 0.05; // نفس شرط المراقب (5% مرئية)
  });
  if (hid.length) animEnter(hid);
}
const animSweepLater = (ms) => {
  clearTimeout(_animSweepT);
  _animSweepT = setTimeout(animSweep, ms);
};

function animTrack(cards, skip) {
  if (!_animIO || !animName()) return;
  cards.forEach((el) => {
    if (_animSeen.has(el)) return;
    _animSeen.add(el);
    if (!skip) el.classList.add("an-pre");
    _animIO.observe(el);
    _animFar.observe(el);
  });
}

(function() {
  const main = document.getElementById("main");
  if (!main) return;
  // أي بطاقة تُضاف للصفحة تُراقَب تلقائياً.
  // فتح قسم (حتى لو كان نفسه) أو تغيير الصفحة: تتحرك. إعادة رسم بعد تسديد/تعديل أو أثناء الكتابة: بدون حركة.
  new MutationObserver((ms) => {
    const nav = tab !== _animLastTab || window.__animGo === true;
    _animLastTab = tab;
    window.__animGo = false;
    if (!ANIM_TABS.includes(tab) || !animName()) return;
    const cards = [];
    ms.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.nodeType !== 1) return;
      if (n.matches(ANIM_SEL)) cards.push(n);
      n.querySelectorAll(ANIM_SEL).forEach((c) => cards.push(c));
    }));
    if (!cards.length) return;
    const ae = document.activeElement, typing = !!ae && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName);
    const skip = !nav || typing;
    if (!skip) {
      _animDir = 1;
      _animNavUntil = performance.now() + 700;
    }
    animTrack(cards, skip);
    if (!skip) animSweepLater(900);
  }).observe(main, { childList: true, subtree: true });
  addEventListener("scroll", () => {
    const y = window.scrollY || document.documentElement.scrollTop || 0;
    if (Math.abs(y - _animLastY) > 1) {
      _animHint = y > _animLastY ? 1 : -1;
      _animHintT = performance.now();
      _animLastY = y;
    }
    animSweepLater(220);
  }, { passive: true });
})();

// ===== الإعدادات =====
// معاينة بتصميم بطاقة قسط حقيقية (نفس الأصناف والتركيب في iCard)
function animSample() {
  return '<div id="animPrevBox" onclick="animReplay()" style="cursor:pointer"><div class="iw" id="animPrev" style="margin:14px 0 6px;pointer-events:none"><div class="ic2"><div class="ih"><div class="av2">' + IC_P + '</div><div class="it2"><b>عميل تجريبي (12)</b><span>' + IC_B + 'ثلاجة سامسونج</span></div><span class="pl">نشط</span></div><div class="ib"><div class="bx"><small>المبلغ الكلي</small><b>' + F(1500000) + ' د.ع</b></div><div class="bx"><small>المتبقي</small><b>' + F(562500) + ' د.ع</b></div></div><div class="ip"><span>نسبة السداد</span><b>62.5%</b></div><div class="pb"><i style="width:62.5%;background-size:160% 100%"></i></div><div class="ia"><span class="ab pay">💳 تسديد</span><span class="ab wa">' + WA + ' تذكير</span><span class="ab cl">📞 اتصال</span></div></div></div><div class="mut" style="text-align:center;font-size:12px">اضغط على البطاقة لإعادة الحركة</div></div>';
}
function animCard() {
  const c = S.anim || "none";
  return '<div class="card"><div style="font-weight:700;font-size:16px">🎞️ حركة البطاقات</div><div class="mut" style="margin:4px 0 12px">حركة تظهر بها بطاقات الأقساط والديون عند فتح القسم وعند التمرير للأعلى والأسفل</div><div class="thg" id="animOpts" style="grid-template-columns:repeat(4,1fr)">' + ANIMS.map((a) => '<button class="tho' + (c === a[0] ? " on" : "") + '" data-a="' + a[0] + `" onclick="setAnim('` + a[0] + `')"><span class="soc" style="width:38px;height:38px;font-size:18px;background:linear-gradient(135deg,#0ea5e9,#6366f1)">` + a[2] + "</span><span>" + a[1] + "</span></button>").join("") + "</div>" + animSample() + "</div>";
}
function animReplay() {
  const el = document.getElementById("animPrev"), name = animName();
  if (!el || !name || !el.animate) return;
  const d = Math.random() < 0.5 ? 1 : -1;
  el.animate(animFrames(name, d, d), animOpts(name, 0));
}
function setAnim(n) {
  S.anim = n;
  save();
  document.querySelectorAll("#animOpts .tho").forEach((b) => b.classList.toggle("on", b.dataset.a === n));
  const main = document.getElementById("main");
  if (!animName()) {
    if (_animIO) {
      _animIO.disconnect();
      _animFar.disconnect();
    }
    _animSeen = new WeakSet();
    main.querySelectorAll(".an-pre").forEach((el) => el.classList.remove("an-pre"));
  } else if (ANIM_TABS.includes(tab)) animTrack([...main.querySelectorAll(ANIM_SEL)], true);
  animReplay();
}
