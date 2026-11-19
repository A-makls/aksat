/**
 * 04 · receipts.js — توليد الوصولات (Canvas) وحوار المشاركة
 * سكربت كلاسيكي يشترك في النطاق العام مع بقية الملفات؛ الترتيب مهم (انظر index.html).
 */
function rcptRender(cfg, pl) {
  const fl = document.fonts && document.fonts.load ? Promise.all([document.fonts.load("700 20px Cairo"), document.fonts.load("400 20px Cairo")]).catch(() => {
  }) : Promise.resolve();
  return fl.then(() => {
    const W = 400, P = 16, PX = 2, M = 20, FN = "Cairo,Tahoma,Arial,sans-serif", INK = "#161616", MUT = "#666";
    const office = (S.office || "").trim(), L = P + M, R = P + W - M, CX = P + W / 2, IW = R - L;
    const cv = document.createElement("canvas"), g = cv.getContext("2d");
    function run(paint, H2) {
      g.direction = "rtl";
      const T = (s2, px, yy, sz, wt, al, col) => {
        g.font = wt + " " + sz + "px " + FN;
        g.textAlign = al;
        g.fillStyle = col || INK;
        if (paint) g.fillText(s2, px, yy);
      };
      const wd = (s2, sz, wt) => {
        g.font = wt + " " + sz + "px " + FN;
        return g.measureText(s2).width;
      };
      const wrap = (s2, mw, sz, wt) => {
        const ws = String(s2).split(/\s+/), ls = [];
        let cur = "";
        ws.forEach((w) => {
          const t = cur ? cur + " " + w : w;
          if (cur && wd(t, sz, wt) > mw) {
            ls.push(cur);
            cur = w;
          } else cur = t;
        });
        if (cur) ls.push(cur);
        return ls.length ? ls : [""];
      };
      if (paint) {
        g.fillStyle = pl ? "#fff" : "#d9dde3";
        g.fillRect(0, 0, W + 2 * P, H2 + 2 * P);
        g.save();
        g.shadowColor = pl ? "rgba(0,0,0,0)" : "rgba(0,0,0,.28)";
        g.shadowBlur = 12;
        g.shadowOffsetY = 3;
        g.fillStyle = "#fff";
        g.beginPath();
        const t = 10, d = 6, n = W / t, yb = P + H2;
        g.moveTo(P, P + d);
        for (let k = 1; k <= n; k++) g.lineTo(P + k * t, k % 2 ? P : P + d);
        for (let k = n; k >= 0; k--) g.lineTo(P + k * t, k % 2 ? yb : yb - d);
        g.closePath();
        g.fill();
        g.restore();
      }
      const dash = (yy) => {
        if (!paint) return;
        g.save();
        g.strokeStyle = INK;
        g.lineWidth = 1.2;
        g.setLineDash([5, 4]);
        g.beginPath();
        g.moveTo(L, yy);
        g.lineTo(R, yy);
        g.stroke();
        g.restore();
      };
      let y = P + 40;
      if (office) {
        wrap(office, IW, 24, 700).forEach((s2) => {
          T(s2, CX, y, 24, 700, "center");
          y += 32;
        });
        y += 4;
      }
      T(cfg.title, CX, y + 18, 46, 700, "center");
      y += 50;
      dash(y);
      y += 26;
      const row = (lb, val, b) => {
        T(lb, R, y, 15, 700, "right");
        const lw = wd(lb, 15, 700) + 8;
        wrap(val, IW - lw, 15, b ? 700 : 400).forEach((s2) => {
          T(s2, R - lw, y, 15, b ? 700 : 400, "right");
          y += 23;
        });
        y += 2;
      };
      cfg.rows.forEach((r) => row(r[0], r[1], r[2]));
      y += 4;
      if (paint) {
        g.strokeStyle = INK;
        g.lineWidth = 1.5;
        g.strokeRect(L, y, IW, 30);
      }
      T("البيان", R - 10, y + 20, 14, 700, "right");
      T("المبلغ (د.ع)", L + 10, y + 20, 14, 700, "left");
      y += 30;
      const tr = (lb, v, k, b) => {
        if (paint && k % 2 === 0) {
          g.fillStyle = "#f2f2f2";
          g.fillRect(L, y, IW, 30);
        }
        T(lb, R - 10, y + 20, 14, b ? 700 : 400, "right");
        T(typeof v === "number" ? F(v) : String(v), L + 10, y + 20, 14, b ? 700 : 400, "left");
        y += 30;
      };
      cfg.tbl.forEach((r, k) => tr(r[0], r[1], k, r[2]));
      y += 20;
      if (paint) {
        g.strokeStyle = INK;
        g.lineWidth = 1.8;
        g.strokeRect(L, y, IW, 56);
      }
      T(cfg.boxL, R - 12, y + 34, 16, 700, "right");
      const cw = wd("د.ع", 13, 700);
      T("د.ع", L + 12, y + 34, 13, 700, "left");
      T(F(cfg.boxV), L + 12 + cw + 8, y + 37, 30, 700, "left");
      y += 56 + 22;
      if (cfg.stamp) {
        if (paint) {
          g.fillStyle = INK;
          g.fillRect(L, y - 4, IW, 32);
        }
        T(cfg.stamp, CX, y + 18, 16, 700, "center", "#fff");
        y += 48;
      }
      dash(y);
      y += 30;
      T("شكراً لتعاملكم معنا", CX, y, 17, 700, "center");
      y += 20;
      let s = 0;
      for (const ch of cfg.no + cfg.dt) s = s * 31 + ch.charCodeAt(0) >>> 0;
      if (paint) {
        g.fillStyle = INK;
        let bx = L + 30;
        while (bx < R - 30) {
          s = s * 1103515245 + 12345 >>> 0;
          const w = 1 + (s >>> 16) % 3;
          if (bx + w > R - 30) break;
          g.fillRect(bx, y, w, 34);
          bx += w + 1 + (s >>> 8) % 2;
        }
      }
      y += 34;
      T(cfg.no, CX, y + 16, 12, 400, "center", MUT);
      y += 16;
      return y + 22 - P;
    }
    const H = run(false);
    cv.width = (W + 2 * P) * PX;
    cv.height = (H + 2 * P) * PX;
    g.scale(PX, PX);
    run(true, H);
    return cv;
  });
}
function rcptCanvas(i, c, pay, x, no, pl) {
  const prev = Math.max(0, x.p - pay.amt), dt = String(pay.date || today()).replace(/-/g, "/");
  const rows = [["التاريخ:", dt], ["رقم الوصل:", no], ["وصل إلى:", c.name || "—", true]];
  if (i.no) rows.push(["رقم السجل:", String(i.no)]);
  rows.push(["عن:", i.desc || "—"]);
  return rcptRender({ title: "وصل تسديد", no, dt, rows, tbl: [["إجمالي القسط", i.total], ["المسدد سابقاً", prev], ["المسدد الآن", pay.amt, true], ["المتبقي", x.rem]], boxL: "المبلغ المسدد", boxV: pay.amt, stamp: x.rem <= 0 ? "تم تسديد القسط بالكامل" : "" }, pl);
}
function purchaseCanvas(i, c, x, no, pl) {
  const dt = String(i.created || today()).replace(/-/g, "/"), cash = x.rem <= 0, fq = i.freq === "w" ? "الأسبوعي" : i.freq === "d" ? "اليومي" : "الشهري";
  const rows = [["التاريخ:", dt], ["رقم الوصل:", no], ["وصل إلى:", c.name || "—", true]];
  if (i.no) rows.push(["رقم السجل:", String(i.no)]);
  rows.push(["المادة:", (i.desc || "—") + (+i.qty > 1 ? " × " + i.qty : "")]);
  const tbl = [["سعر البيع", i.total], ["الدفعة الأولى", i.down || 0]];
  if (!cash) tbl.push(["المتبقي", x.rem, true], ["القسط " + fq, i.mon || 0], ["عدد الأقساط", String(i.months)], ["القسط القادم", String(x.due).replace(/-/g, "/")]);
  return rcptRender({ title: "وصل شراء", no, dt, rows, tbl, boxL: "المجموع", boxV: i.total, stamp: cash ? "بيع نقدي - مدفوع بالكامل" : "" }, pl);
}
function rcptDlg(k) {
  const ph = k.ph, o = document.createElement("div");
  o.className = "ov";
  o.style.alignItems = "center";
  o.innerHTML = '<div class="md" style="border-radius:22px;max-width:380px;width:94%;text-align:center;padding:14px"><h3 style="margin:0 0 4px">' + k.title + '</h3><div class="mut" style="margin-bottom:10px">' + k.sub + '</div><div id="rw" style="max-height:56vh;overflow:auto;border-radius:12px;background:#d9dde3;margin-bottom:10px"><div class="mut" style="padding:50px 0">جارٍ إنشاء الوصل...</div></div><button class="btn" id="rs" disabled style="width:100%;background:#25d366;display:flex;align-items:center;justify-content:center;gap:8px;padding:13px;margin-bottom:8px;font-size:16px">' + WA + " " + k.label + "</button>" + (ph ? '<a id="rl" target="_blank" rel="noopener" href="https://wa.me/' + ph + '" style="display:none;text-decoration:none;text-align:center;margin-bottom:8px;padding:10px;border:1.5px solid #25d366;border-radius:14px;color:#128c7e;font-weight:700">فتح محادثة العميل في واتساب</a>' : "") + '<div id="rh" class="mut" style="display:none;font-size:13px;margin:0 0 8px;line-height:1.6"></div><div class="row"><button class="btn ghost" id="rd" disabled>حفظ</button><button class="btn ghost" id="rp" disabled>طباعة</button><button class="btn ghost" id="cl">إغلاق</button></div></div>';
  document.body.appendChild(o);
  let url = "", blob = null;
  const close = () => {
    if (url) URL.revokeObjectURL(url);
    o.remove();
  };
  o.querySelector("#cl").onclick = close;
  o.onclick = (e) => {
    if (e.target === o) close();
  };
  const pr = () => {
    k.draw(true).then((cv) => {
      const u = cv.toDataURL("image/png"), f = document.createElement("iframe");
      f.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0";
      document.body.appendChild(f);
      const d = f.contentWindow.document;
      d.open();
      d.write('<html><head><meta charset="utf-8"><style>@page{size:80mm auto;margin:0}html,body{margin:0;background:#fff}img{display:block;width:80mm;max-width:100%;margin:0 auto}</style></head><body><img src="' + u + '"></body></html>');
      d.close();
      const im = d.querySelector("img"), go = () => {
        try {
          f.contentWindow.focus();
          f.contentWindow.print();
        } catch (e) {
          window.print();
        }
        setTimeout(() => f.remove(), 6e4);
      };
      if (im.complete) go();
      else im.onload = go;
    });
  };
  const bad = () => {
    o.querySelector("#rw").innerHTML = '<div class="mut" style="padding:30px 0">تعذّر إنشاء الصورة</div>';
  };
  k.draw(false).then((cv) => cv.toBlob((b) => {
    if (!b) {
      bad();
      return;
    }
    blob = b;
    url = URL.createObjectURL(b);
    o.querySelector("#rw").innerHTML = '<img src="' + url + '" alt="' + k.alt + '" style="display:block;width:100%">';
    const bs = o.querySelector("#rs"), bd = o.querySelector("#rd"), bp = o.querySelector("#rp");
    bs.disabled = bd.disabled = bp.disabled = false;
    bp.onclick = pr;
    const hint = (m) => {
      const h = o.querySelector("#rh");
      h.textContent = m;
      h.style.display = "block";
    }, SV = "اضغط مطولاً على صورة الوصل ثم «حفظ في الصور».", fb = async () => {
      let ok = false;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        ok = true;
      } catch (e) {
      }
      const rl = o.querySelector("#rl");
      if (rl) rl.style.display = "block";
      hint(ok ? "تم نسخ صورة الوصل. افتح محادثة العميل والصقها (لصق)." : "اضغط مطولاً على صورة الوصل واحفظها ثم أرسلها من واتساب.");
    }, sh = (w) => {
      const f = new File([blob], k.fn, { type: "image/png" });
      if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [f] }))) navigator.share({ files: [f], title: k.alt }).catch((e) => {
        if (e && e.name === "AbortError") return;
        w ? fb() : hint(SV);
      });
      else w ? fb() : hint(SV);
    };
    // يفتح محادثة العميل مباشرة مع نص الوصل، وتُنسخ صورة الوصل للحافظة لتلصقها (واتساب لا يقبل إرفاق صورة عبر الرابط)
    const wa = async () => {
      let ok = false;
      try {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        ok = true;
      } catch (e) {
      }
      const u = "https://wa.me/" + k.ph + "?text=" + encodeURIComponent(k.msg);
      hint(ok ? "تم نسخ صورة الوصل. في المحادثة اضغط مطولاً على خانة الكتابة ثم «لصق» لإرفاقها." : "اضغط «حفظ» لحفظ صورة الوصل ثم أرفقها من المحادثة.");
      const w = window.open(u, "_blank");
      if (!w) location.href = u;
    };
    bd.onclick = () => sh(0);
    bs.onclick = () => k.ph && k.msg ? wa() : sh(1);
  }, "image/png")).catch(bad);
}
function receipt(id) {
  const i = S.inst.find((x2) => x2.id === id);
  if (!i) return;
  const c = S.cust.find((k) => k.id === i.cust) || {}, x = { i, ...late(i) }, ps = S.pays.filter((p) => p.inst === id), pay = ps[ps.length - 1];
  if (!pay) return;
  const no = String(S.pays.indexOf(pay) + 1).padStart(5, "0");
  rcptDlg({ title: "تم تسديد القسط", sub: E(c.name || "") + " · المتبقي " + F(x.rem) + " د.ع", label: "إرسال وصل تسديد", alt: "وصل تسديد", fn: "receipt-" + no + ".png", ph: normPh(c.phone), msg: msgRcpt(x), draw: (pl) => rcptCanvas(i, c, pay, x, no, pl) });
}
function purchaseDlg(id) {
  const i = S.inst.find((x2) => x2.id === id);
  if (!i) return;
  const c = S.cust.find((k) => k.id === i.cust) || {}, x = { i, ...late(i) }, no = String(S.inst.indexOf(i) + 1).padStart(5, "0");
  rcptDlg({ title: "تمت إضافة القسط", sub: E(c.name || "") + " · المتبقي " + F(x.rem) + " د.ع", label: "إرسال وصل الشراء", alt: "وصل شراء", fn: "purchase-" + no + ".png", ph: normPh(c.phone), msg: msgPurchase(x), draw: (pl) => purchaseCanvas(i, c, x, no, pl) });
}

// ===== وصل تسديد الدين =====
function debtRcptCanvas(x, name, pay, before, rem, no, pl) {
  const dt = String(pay.date || today()).replace(/-/g, "/");
  const rows = [["التاريخ:", dt], ["رقم الوصل:", no], [x.type === "in" ? "وصل إلى:" : "مدفوع إلى:", name || "—", true]];
  if (x.prod) rows.push(["عن:", x.prod]);
  return rcptRender({ title: "وصل تسديد", no, dt, rows, tbl: [["إجمالي الدين", x.amount], ["المسدد سابقاً", before], ["المسدد الآن", pay.amt, true], ["المتبقي", rem]], boxL: "المبلغ المسدد", boxV: pay.amt, stamp: rem <= 0 ? "تم تسديد الدين بالكامل" : "" }, pl);
}
function debtReceipt(id, k) {
  const x = S.debts.find((d) => d.id === id);
  if (!x || !x.pl || !x.pl[k]) return;
  const pay = x.pl[k], c = S.cust.find((q) => q.id === x.cust), name = c ? c.name : x.name, phone = c ? c.phone : x.phone;
  const sumPl = (a) => a.reduce((s, p) => s + (+p.amt || 0), 0);
  const before = Math.max(0, x.paid - sumPl(x.pl)) + sumPl(x.pl.slice(0, k));
  const rem = Math.max(0, x.amount - before - pay.amt);
  const no = "D" + String(S.debts.indexOf(x) + 1).padStart(3, "0") + "-" + String(k + 1).padStart(2, "0");
  const dt = String(pay.date || today()).replace(/-/g, "/");
  const msg = "السلام عليكم\n\nتحية طيبة *" + (name || "") + "*\n" + (x.prod ? "(" + x.prod + ")\n" : "") + "▫️ مبلغ الدين: " + F(x.amount) + " د.ع\n▫️ المسدد الآن: " + F(pay.amt) + " د.ع\n▫️ المتبقي: " + F(rem) + " د.ع\n\nوصل تسديد ✅ (" + dt + ")";
  rcptDlg({ title: "تم تسديد الدين", sub: E(name || "") + " · المتبقي " + F(rem) + " د.ع", label: "إرسال وصل تسديد", alt: "وصل تسديد دين", fn: "debt-receipt-" + no + ".png", ph: normPh(phone), msg, draw: (pl) => debtRcptCanvas(x, name, pay, before, rem, no, pl) });
}
