/* AI产品思维 · 两课共用脚本：本地存储、主题、阅读进度、淡入、头图循环、分拣组件 */
(function () {
  "use strict";
  const PT = (window.PT = window.PT || {});

  // ---------- 本地存储：读写失败时静默退回，页面照常可用 ----------
  PT.store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (e) {
        return false;
      }
    },
  };

  const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- 主题切换（跟随系统，或手动指定） ----------
  function initTheme() {
    const btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    const sysDark = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = () => document.documentElement.dataset.theme || (sysDark() ? "dark" : "light");
    const paint = () => {
      const dark = current() === "dark";
      btn.setAttribute("aria-label", dark ? "切换到浅色" : "切换到深色");
      btn.innerHTML = dark
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>';
    };
    btn.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = next;
      PT.store.set("pt.theme", next);
      paint();
    });
    paint();
  }

  // ---------- 阅读进度 ----------
  function initProgress() {
    const bar = document.querySelector(".progress");
    if (!bar) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(1, scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // ---------- 进入视口淡入 ----------
  function initFx() {
    const els = document.querySelectorAll(".fx");
    if (!("IntersectionObserver" in window) || reduceMotion()) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  // ---------- 头图循环：只在桌面宽度、且没有减少动态效果时加载 ----------
  function initHeroLoop() {
    const v = document.querySelector(".hero-bg video[data-src]");
    if (!v) return;
    if (reduceMotion() || !window.matchMedia("(min-width: 861px)").matches) return;
    v.src = v.dataset.src;
    v.play().catch(() => {});
  }

  // ---------- 分拣组件：拖放 / 先点后放 / 键盘 ----------
  // PT.sorter(root, { items: [{id, bin, html, hint}], bins: [{id, label}], onDone(stats) })
  PT.sorter = function (root, opts) {
    const state = { selected: null, mistakes: 0, placed: 0 };
    const byId = new Map(opts.items.map((it) => [it.id, it]));
    root.classList.add("sorter");
    root.innerHTML = "";

    const pool = el("div", "pool");
    pool.setAttribute("role", "list");
    pool.setAttribute("aria-label", "待分拣");
    const toast = el("p", "toast");
    toast.setAttribute("aria-live", "polite");
    const bins = el("div", "bins" + (opts.binsClass ? " " + opts.binsClass : ""));
    root.append(pool, toast, bins);

    const binEls = new Map();
    opts.bins.forEach((b) => {
      const total = opts.items.filter((it) => it.bin === b.id).length;
      const box = el("div", "bin");
      box.dataset.bin = b.id;
      box.tabIndex = 0;
      box.setAttribute("role", "button");
      box.setAttribute("aria-label", "放进「" + b.label + "」");
      box.innerHTML = '<span class="bin-label">' + b.label + '<span class="count">0/' + total + '</span></span><div class="bin-items"></div>';
      box.addEventListener("click", () => { if (state.selected) place(state.selected, b.id); });
      box.addEventListener("keydown", (e) => {
        if ((e.key === "Enter" || e.key === " ") && state.selected) { e.preventDefault(); place(state.selected, b.id); }
      });
      bins.append(box);
      binEls.set(b.id, { box, total, n: 0 });
    });

    shuffle(opts.items.slice()).forEach((it) => pool.append(makeChip(it)));

    function makeChip(it) {
      const c = el("div", "chip");
      c.dataset.id = it.id;
      c.tabIndex = 0;
      c.setAttribute("role", "button");
      c.setAttribute("aria-pressed", "false");
      c.innerHTML = it.html;
      c.addEventListener("click", (e) => {
        if (c.dataset.dragged) { delete c.dataset.dragged; return; }
        if (c.classList.contains("placed")) return;
        select(state.selected === c ? null : c);
        e.stopPropagation();
      });
      c.addEventListener("keydown", (e) => {
        if (c.classList.contains("placed")) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(state.selected === c ? null : c); }
        if (e.key === "Escape") select(null);
      });
      enableDrag(c);
      return c;
    }

    function select(c) {
      if (state.selected) state.selected.setAttribute("aria-pressed", "false");
      state.selected = c;
      if (c) c.setAttribute("aria-pressed", "true");
      binEls.forEach(({ box }) => box.classList.toggle("armed", !!c));
      if (c) say("选好了，现在点它该去的那一堆。");
    }

    function place(c, binId) {
      const it = byId.get(c.dataset.id);
      select(null);
      if (it.bin === binId) {
        const b = binEls.get(binId);
        c.classList.add("placed", "drop");
        c.removeAttribute("tabindex");
        c.removeAttribute("role");
        c.removeAttribute("aria-pressed");
        c.style.transform = "";
        b.box.querySelector(".bin-items").append(c);
        b.n += 1;
        b.box.querySelector(".count").textContent = b.n + "/" + b.total;
        state.placed += 1;
        say("");
        opts.onPlace && opts.onPlace(it, binId);
        if (state.placed === opts.items.length) {
          root.classList.add("revealed");
          opts.onDone && opts.onDone({ mistakes: state.mistakes });
        } else {
          const next = pool.querySelector(".chip");
          if (next && document.activeElement && document.activeElement.closest(".bins")) next.focus({ preventScroll: true });
        }
      } else {
        state.mistakes += 1;
        c.style.transform = "";
        c.classList.remove("shake");
        void c.offsetWidth;
        c.classList.add("shake");
        say(it.hint || "再想想，它好像不属于这一堆。");
      }
    }

    function enableDrag(c) {
      let sx = 0, sy = 0, dragging = false, over = null, pid = null;
      c.addEventListener("pointerdown", (e) => {
        if (c.classList.contains("placed") || e.button > 0) return;
        sx = e.clientX; sy = e.clientY; pid = e.pointerId; dragging = false;
        c.setPointerCapture(pid);
      });
      c.addEventListener("pointermove", (e) => {
        if (pid !== e.pointerId) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (!dragging && Math.hypot(dx, dy) > 6) {
          dragging = true;
          select(null);
          c.classList.add("dragging");
          c.style.pointerEvents = "none";
        }
        if (!dragging) return;
        c.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + Math.max(-4, Math.min(4, dx / 40)) + "deg)";
        const hit = document.elementFromPoint(e.clientX, e.clientY);
        const box = hit && hit.closest ? hit.closest(".bin") : null;
        if (box !== over) {
          over && over.classList.remove("over");
          over = box && root.contains(box) ? box : null;
          over && over.classList.add("over");
        }
      });
      const end = (e) => {
        if (pid !== e.pointerId) return;
        pid = null;
        c.style.pointerEvents = "";
        if (!dragging) return;
        c.dataset.dragged = "1";
        setTimeout(() => { delete c.dataset.dragged; }, 0);
        c.classList.remove("dragging");
        if (over) {
          over.classList.remove("over");
          const id = over.dataset.bin;
          over = null;
          place(c, id);
        } else {
          c.style.transition = "transform .25s ease";
          c.style.transform = "";
          setTimeout(() => { c.style.transition = ""; }, 260);
        }
        dragging = false;
      };
      c.addEventListener("pointerup", end);
      c.addEventListener("pointercancel", end);
    }

    function say(msg) { toast.textContent = msg; }

    return { reset: () => PT.sorter(root, opts) };
  };

  // ---------- 步骤式标签页 ----------
  // <div class="steps" role="tablist"><button role="tab" aria-controls="p1">…</button></div> + <div class="panel" id="p1" role="tabpanel">
  // 返回 { go(i), unlock(i) }；data-locked 的步骤要先 unlock 才能点。
  PT.steps = function (root) {
    const tabs = Array.from(root.querySelectorAll('[role="tab"]'));
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls")));
    const go = (i) => {
      tabs.forEach((t, k) => {
        t.setAttribute("aria-selected", k === i ? "true" : "false");
        t.tabIndex = k === i ? 0 : -1;
        panels[k].hidden = k !== i;
      });
    };
    const unlock = (i) => { tabs[i].disabled = false; };
    const done = (i) => tabs[i].classList.add("done");
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => go(i));
      t.addEventListener("keydown", (e) => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        let j = i;
        do { j = (j + d + tabs.length) % tabs.length; } while (tabs[j].disabled && j !== i);
        go(j); tabs[j].focus();
      });
    });
    go(0);
    return { go, unlock, done };
  };

  // ---------- 自测题 ----------
  // PT.quiz(root, [{q, options: [..], answer: index, why}])
  PT.quiz = function (root, questions) {
    let answered = 0, right = 0;
    root.classList.add("quiz");
    root.innerHTML = "";
    const score = el("p", "score");
    score.setAttribute("aria-live", "polite");
    questions.forEach((item) => {
      const box = el("div", "q");
      const fs = el("fieldset");
      const lg = el("legend");
      lg.textContent = item.q;
      const ch = el("div", "choices");
      const why = el("p", "why");
      item.options.forEach((txt, i) => {
        const b = el("button", "choice");
        b.type = "button";
        b.textContent = txt;
        b.addEventListener("click", () => {
          if (box.classList.contains("answered")) return;
          box.classList.add("answered");
          answered += 1;
          const ok = i === item.answer;
          if (ok) right += 1;
          ch.querySelectorAll("button").forEach((x, k) => {
            x.disabled = true;
            if (k === item.answer) x.classList.add("right");
            else if (k === i) x.classList.add("wrong");
          });
          why.innerHTML = (ok ? "<b>答对了。</b>" : "<b>再看看。</b>") + item.why;
          if (answered === questions.length) {
            score.textContent = "你答对了 " + right + " / " + questions.length + " 题。" +
              (right === questions.length ? "这一面的三招都拿下了。" : "没答对的题，回到对应的 Track 再看一眼。");
          }
        });
        ch.append(b);
      });
      fs.append(lg, ch);
      box.append(fs, why);
      root.append(box);
    });
    root.append(score);
  };

  // ---------- 复制文字 ----------
  PT.copy = async function (text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      const ta = el("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;left:-9999px;top:0";
      document.body.append(ta);
      ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch (e2) { ok = false; }
      ta.remove();
      return ok;
    }
  };

  // ---------- 卡片导出成 PNG（Canvas 自绘，离线可用） ----------
  // PT.cardImage({ kicker, title, rows: [{label, text}], footer, accent }) → canvas
  PT.cardImage = function (o) {
    const W = 1080, PAD = 72, IN = W - PAD * 2;
    const css = getComputedStyle(document.body);
    const accent = o.accent || css.getPropertyValue("--accent").trim() || "#A9472E";
    const ink = "#1E2235", muted = "#5F6474", paper = "#F4F0E8", card = "#FBF8F3";
    const sans = '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif';
    const serif = '"Noto Serif SC", "Songti SC", "STSong", serif';
    const mono = '"JetBrains Mono", Menlo, monospace';
    const measure = document.createElement("canvas").getContext("2d");
    const wrap = (text, font, width) => {
      measure.font = font;
      const lines = [];
      String(text || "").split("\n").forEach((para) => {
        let line = "";
        for (const ch of para) {
          if (measure.measureText(line + ch).width > width && line) { lines.push(line); line = ch; }
          else line += ch;
        }
        lines.push(line);
      });
      return lines;
    };
    const fTitle = "900 60px " + serif, fLabel = "700 26px " + serif, fText = "400 28px " + sans;
    const titleLines = wrap(o.title, fTitle, IN);
    const blocks = o.rows.map((r) => ({ label: r.label, lines: wrap(r.text || "（还没填）", fText, IN - 40) }));
    let H = PAD + 40 + titleLines.length * 76 + 36;
    blocks.forEach((b) => { H += 44 + b.lines.length * 46 + 34; });
    H += 70 + PAD;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const g = c.getContext("2d");
    g.fillStyle = paper; g.fillRect(0, 0, W, H);
    // 右上角的唱片
    g.save(); g.translate(W - 40, 40);
    for (let r = 170; r > 20; r -= 9) { g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.strokeStyle = "rgba(30,34,53,.07)"; g.lineWidth = 1.2; g.stroke(); }
    g.beginPath(); g.arc(0, 0, 56, 0, Math.PI * 2); g.fillStyle = accent; g.globalAlpha = .9; g.fill(); g.restore();
    let y = PAD;
    g.fillStyle = accent; g.font = "600 22px " + mono; g.textBaseline = "top";
    g.fillText(o.kicker || "", PAD, y); y += 40;
    g.fillStyle = ink; g.font = fTitle;
    titleLines.forEach((l) => { g.fillText(l, PAD, y); y += 76; });
    y += 36;
    blocks.forEach((b, i) => {
      const h = 44 + b.lines.length * 46 + 14;
      g.fillStyle = card; roundRect(g, PAD, y - 6, IN, h + 6, 18); g.fill();
      g.strokeStyle = "rgba(30,34,53,.12)"; g.lineWidth = 1.5; roundRect(g, PAD, y - 6, IN, h + 6, 18); g.stroke();
      g.fillStyle = accent; g.font = "600 20px " + mono; g.fillText(String(i + 1).padStart(2, "0"), PAD + 20, y + 10);
      g.fillStyle = ink; g.font = fLabel; g.fillText(b.label, PAD + 66, y + 6);
      g.fillStyle = b.lines[0] === "（还没填）" ? muted : ink; g.font = fText;
      let ly = y + 50;
      b.lines.forEach((l) => { g.fillText(l, PAD + 20, ly); ly += 46; });
      y += h + 34;
    });
    g.fillStyle = muted; g.font = "500 22px " + sans;
    g.fillText(o.footer || "", PAD, y + 16);
    return c;
  };
  function roundRect(g, x, y, w, h, r) {
    g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
    g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  }
  PT.download = function (canvas, filename) {
    const a = el("a");
    a.download = filename;
    a.href = canvas.toDataURL("image/png");
    document.body.append(a);
    a.click();
    a.remove();
  };

  // ---------- 连连看：先点左边，再点右边（键盘同样可用） ----------
  // PT.matcher(root, { left: [{id, html}], right: [{id, html}], pairs: {leftId: rightId}, hints: {leftId: "…"}, onDone })
  PT.matcher = function (root, o) {
    root.classList.add("matcher");
    root.innerHTML = "";
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("class", "lines");
    const L = el("div", "col"), R = el("div", "col");
    root.append(svg, L, R);
    const toast = el("p", "toast");
    toast.setAttribute("aria-live", "polite");
    toast.style.gridColumn = "1 / -1";
    root.append(toast);
    let sel = null, done = 0;
    const lines = [];
    const mk = (it, side) => {
      const b = el("button", "mt");
      b.type = "button";
      b.innerHTML = it.html;
      b.dataset.id = it.id;
      b.dataset.side = side;
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("click", () => pick(b));
      return b;
    };
    o.left.forEach((it) => L.append(mk(it, "l")));
    shuffle(o.right.slice()).forEach((it) => R.append(mk(it, "r")));
    function pick(b) {
      if (b.classList.contains("done")) return;
      if (!sel || sel.dataset.side === b.dataset.side) {
        if (sel) sel.setAttribute("aria-pressed", "false");
        sel = sel === b ? null : b;
        if (sel) sel.setAttribute("aria-pressed", "true");
        return;
      }
      const l = sel.dataset.side === "l" ? sel : b, r = sel.dataset.side === "r" ? sel : b;
      sel.setAttribute("aria-pressed", "false");
      sel = null;
      if (o.pairs[l.dataset.id] === r.dataset.id) {
        l.classList.add("done"); r.classList.add("done");
        l.disabled = r.disabled = true;
        lines.push([l, r]);
        draw();
        toast.textContent = "";
        done += 1;
        if (done === o.left.length && o.onDone) o.onDone();
      } else {
        [l, r].forEach((x) => { x.classList.remove("shake"); void x.offsetWidth; x.classList.add("shake"); });
        toast.textContent = (o.hints && o.hints[l.dataset.id]) || "再想想，这两个好像对不上。";
      }
    }
    function draw() {
      const box = root.getBoundingClientRect();
      svg.innerHTML = "";
      lines.forEach(([l, r]) => {
        const a = l.getBoundingClientRect(), b = r.getBoundingClientRect();
        const x1 = a.right - box.left, y1 = a.top + a.height / 2 - box.top, x2 = b.left - box.left, y2 = b.top + b.height / 2 - box.top;
        const path = document.createElementNS(svgNS, "path");
        const mx = (x1 + x2) / 2;
        path.setAttribute("d", `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#8A5F16");
        path.setAttribute("stroke-width", "2.5");
        svg.append(path);
      });
    }
    addEventListener("resize", draw);
    return { reset: () => PT.matcher(root, o) };
  };

  // ---------- 小工具 ----------
  function el(tag, cls) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  PT.countUp = function (node, to, ms) {
    if (reduceMotion()) { node.textContent = PT.fmt(to); return; }
    const t0 = performance.now();
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms);
      node.textContent = PT.fmt(Math.round(to * (1 - Math.pow(1 - k, 3))));
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  PT.fmt = (n) => (n >= 10000 ? (n / 10000).toFixed(1).replace(/\.0$/, "") + "万" : n.toLocaleString("zh-CN"));

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initProgress();
    initFx();
    initHeroLoop();
  });
})();
