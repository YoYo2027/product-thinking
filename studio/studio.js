/* Bonus Track · 录音棚：90 分钟工作坊的六个环节、存档、导出和投屏模式 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const INK = "#1E2235";

  const STAGES = [
    { t: "组队选题", min: 10, uses: [], give: "组名和成员，选好一个点子。" },
    { t: "互访", min: 20, uses: [["a", "A 面 · 看见人"]], give: "至少 6 张用户原话卡，每张写上是谁说的。" },
    { t: "理需求", min: 15, uses: [["c", "C 面 · 收需求"], ["a", "A 面 · 看见人"]], give: "原话卡放进使用环节，标好真需求、伪需求、再问问，挑出一块长尾里的金子。" },
    { t: "定方案", min: 15, uses: [["b", "B 面 · 做选择"], ["d", "D 面 · 验需求"]], give: "一页纸：一句话定义、三个圈、唯一的核心功能、不做清单、北极星指标、最小实验。" },
    { t: "做第一版", min: 20, uses: [["vc", "Vibe Coding"]], give: "写给 AI 的需求说明，和第一版的链接或截图说明。" },
    { t: "互评", min: 10, uses: [["b", "B 面 · 做选择"]], give: "给一组打分、写建议；根据收到的评价写改进清单，导出作品卡。" }
  ];

  const IDEAS = {
    own: {
      title: "我自己的点子", desc: "接着用你在前几课写的点子",
      stages: ["第一次听说", "第一次用", "每次用的时候", "用完以后", "推荐给别人"],
      outline: [
        "上一次遇到这个麻烦，是什么时候？当时在做什么？",
        "你当时是怎么解决的？一步一步说给我听。",
        "这几步里，最花时间、最烦的是哪一步？",
        "你还试过别的办法吗？为什么没用下去？",
        "要是这个麻烦一直不解决，会怎么样？",
        "如果有个工具帮你，你最希望它先帮你做哪一件事？"
      ]
    },
    essay: {
      title: "AI 西语作文批改", desc: "“我想要一个能帮我改西语作文的 AI。”",
      stages: ["写之前", "写的时候", "改的时候", "交之后", "复盘"],
      outline: [
        "上一次写西语作文是什么时候？写的是什么题目？",
        "写完以后，你是怎么检查的？一步一步说给我听。",
        "检查的时候，最花时间、最烦的是哪一步？",
        "老师改回来的作文，你会怎么看？上一次看完做了什么？",
        "你用过哪些工具帮你改？哪里好用，哪里不好用？",
        "要是有人帮你改，你最希望他告诉你什么？"
      ]
    },
    mail: {
      title: "外贸西语邮件助手", desc: "“我想要一个帮我写西语外贸邮件的工具。”",
      stages: ["收到询价", "写回复", "检查语气", "发出之后", "跟进"],
      outline: [
        "上一封西语邮件是什么时候写的？写给谁？",
        "从收到客户来信到回出去，你都做了哪些事？",
        "哪一步最慢、最没把握？",
        "写完会请谁帮你看？上一次请人看是什么情况？",
        "有没有因为语气或者称呼出过问题？后来怎么处理的？",
        "现在用什么工具帮忙？哪里不够用？"
      ]
    },
    buddy: {
      title: "西语角语伴匹配", desc: "“我想找个拉美同学练口语。”",
      stages: ["找语伴", "约时间", "聊的时候", "聊完以后", "长期坚持"],
      outline: [
        "上一次用西语和人聊天是什么时候？和谁，聊了什么？",
        "你是怎么找到这个人的？",
        "聊的时候卡住过吗？卡住了怎么办？",
        "有没有聊着聊着就断了的？为什么断了？",
        "要是每周固定聊一次，你最担心什么？",
        "（问留学生）你想练中文吗？上一次练是什么时候？"
      ]
    }
  };
  const LAST_Q = "最后：还有谁也会遇到这个麻烦？能介绍我们认识吗？";
  const TIPS = [
    ["问上一次", "别问“你平时……”"],
    ["问怎么做的", "别问“你想不想要……”"],
    ["听到“还行”", "追问：具体是哪一次？"],
    ["别替他回答", "不说“你是不是也觉得……”"],
    ["听到一个办法", "问三次“为什么”"],
    ["记原话", "别记你的总结"]
  ];
  const VERD = [["real", "真需求"], ["fake", "伪需求"], ["ask", "再问问"]];
  const RATES = [["s1", "打中了用户最痛的点"], ["s2", "比用户现在的办法好"], ["s3", "用上了这组人的优势"]];

  // ---------- 存档 ----------
  const KEY = "pt.ws.v1";
  const blank = () => ({
    cur: 0, done: [0, 0, 0, 0, 0, 0], seq: 0,
    team: { name: "", members: ["", "", "", ""] },
    idea: "own", ideaName: "",
    quotes: [], gem: "", stages: IDEAS.own.stages.slice(),
    plan: { who: "", when: "", problem: "", goal: "", pain: "", weak: "", edge: "", core: "", notdo: "", star: "", test: "" },
    v1: { link: "", tool: "", note: "" },
    review: { group: "", s1: 0, s2: 0, s3: 0, c1: false, c2: false, c3: false, advice: "" },
    todo: ""
  });
  // 读前几课的存档
  const L = {
    card: PT.store.get("pt.card.v1", null),
    op: PT.store.get("pt.onepager.v1", null),
    pool: PT.store.get("pt.pool.v1", null),
    ver: PT.store.get("pt.verify.v1", null)
  };
  const filledObj = (o) => !!o && Object.values(o).some((x) => typeof x === "string" && x.trim());
  const has = {
    card: !!(L.card && filledObj(L.card.values)),
    op: !!(L.op && filledObj(L.op.values)),
    pool: !!(L.pool && Array.isArray(L.pool.rows) && L.pool.rows.some((r) => r && (r.t || "").trim())),
    ver: !!(L.ver && filledObj(L.ver.values))
  };
  // 只往空着的地方填
  function fromLessons(st) {
    const fill = (obj, k, v) => { if (v && !(obj[k] || "").trim()) obj[k] = String(v).trim(); };
    const ideaOf = [has.op && L.op.idea, has.pool && L.pool.idea, has.ver && L.ver.idea, has.card && L.card.idea].find((x) => x && IDEAS[x]);
    if (ideaOf && st.idea === "own" && !st.ideaName) st.idea = ideaOf;
    fill(st, "ideaName", (has.op && L.op.values.name) || (has.pool && L.pool.name) || (has.ver && L.ver.name) || (has.card && L.card.values.name));
    if (has.op) {
      const o = L.op.values;
      ["who", "when", "problem", "goal", "pain", "weak", "edge", "core", "test"].forEach((k) => fill(st.plan, k, o[k]));
      fill(st.plan, "notdo", [o.dropped, o.notdo].filter((x) => (x || "").trim()).join("；"));
    }
    if (has.ver) {
      const v = L.ver.values;
      fill(st.plan, "star", v.star);
      fill(st.plan, "test", [v.exWhat, v.exMetric && "看" + v.exMetric, v.exWho, v.exLong].filter((x) => (x || "").trim()).join("，"));
    }
    // 环节没改过，就换成这个点子的默认环节；C 面需求池里是同一个点子，就沿用那里的环节
    const untouched = [IDEAS.own.stages.join(), IDEAS[st.idea].stages.join()].includes(st.stages.join());
    if (untouched) {
      st.stages = has.pool && L.pool.idea === st.idea && Array.isArray(L.pool.stages) && L.pool.stages.some(Boolean)
        ? L.pool.stages.map((s, k) => s || IDEAS[st.idea].stages[k])
        : IDEAS[st.idea].stages.slice();
    }
    return st;
  }
  let state = PT.store.get(KEY, null);
  if (!state || !state.plan || !IDEAS[state.idea]) {
    state = fromLessons(blank());
  }
  let timer = 0;
  function save() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const ok = PT.store.set(KEY, state);
      const t = new Date();
      const msg = ok ? "已自动保存 " + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0") : "这个浏览器存不了，记得导出作品卡";
      $$(".stage-nav .saved").forEach((n) => { n.textContent = msg; });
    }, 300);
  }
  const getPath = (k) => k.split(".").reduce((o, p) => (o == null ? o : o[p]), state);
  function setPath(k, v) {
    const ps = k.split(".");
    const last = ps.pop();
    const o = ps.reduce((a, p) => a[p], state);
    o[last] = v;
  }

  // ---------- 环节切换 ----------
  const studio = $("#studio"), rail = $("#rail"), panels = $$(".stage", studio);
  STAGES.forEach((s, i) => {
    const li = document.createElement("li");
    li.innerHTML = '<button type="button" data-go="' + i + '"><span class="n">' + (i + 1) + '</span><span class="t">' + s.t + '</span><span class="m">' + s.min + " 分钟</span></button>";
    rail.append(li);
    const fl = document.createElement("li");
    fl.innerHTML = '<a href="#studio" data-go="' + i + '"><span class="no">' + String(i + 1).padStart(2, "0") + '</span><span class="t">' + s.t + '</span><span class="d">' + s.min + " 分钟</span></a>";
    $("#flow-list").append(fl);
    const p = panels[i];
    $("[data-give]", p).textContent = s.give;
    $("[data-uses]", p).innerHTML = s.uses.map(([c, t]) => '<span class="use ' + c + '">' + t + "</span>").join("");
    const nav = $(".stage-nav", p);
    nav.innerHTML = (i ? '<button class="btn" type="button" data-go="' + (i - 1) + '">← 上一步</button>' : "") +
      '<span class="spacer"></span><span class="saved" aria-live="polite"></span>' +
      (i < STAGES.length - 1 ? '<button class="btn primary" type="button" data-next="' + (i + 1) + '">下一步：' + STAGES[i + 1].t + " →</button>" : "");
  });
  function go(i, scroll) {
    state.cur = i;
    panels.forEach((p, k) => p.classList.toggle("on", k === i));
    $$("button", rail).forEach((b, k) => {
      if (k === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      b.classList.toggle("done", !!state.done[k] && k !== i);
      $(".n", b).textContent = state.done[k] && k !== i ? "✓" : String(k + 1);
    });
    if (i === 4) renderPrompt(false);
    save();
    if (scroll) studio.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }
  document.addEventListener("click", (e) => {
    const g = e.target.closest("[data-go]");
    if (g && document.body.contains(g) && !g.closest("#proj")) {
      e.preventDefault();
      go(+g.dataset.go, true);
      return;
    }
    const n = e.target.closest("[data-next]");
    if (n) {
      state.done[state.cur] = 1;
      go(+n.dataset.next, true);
    }
  });

  // ---------- 通用输入绑定 ----------
  function bind() {
    $$("[data-k]", studio).forEach((f) => {
      const v = getPath(f.dataset.k);
      if (f.type === "checkbox") f.checked = !!v;
      else f.value = v == null ? "" : v;
    });
    $$("textarea", studio).forEach(fit);
  }
  function fit(ta) { requestAnimationFrame(() => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + 2 + "px"; }); }
  studio.addEventListener("input", (e) => {
    const f = e.target, k = f.dataset && f.dataset.k;
    if (f.tagName === "TEXTAREA") fit(f);
    if (!k) return;
    setPath(k, f.type === "checkbox" ? f.checked : f.value);
    if (k.startsWith("plan.")) renderSentence();
    save();
  });

  // ---------- 环节 1：组队选题 ----------
  const ideasBox = $("#w-ideas");
  Object.entries(IDEAS).forEach(([id, it]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "idea";
    b.dataset.id = id;
    b.innerHTML = "<b>" + it.title + "</b><span>" + it.desc + "</span>";
    b.addEventListener("click", () => {
      if (state.idea === id) return;
      const untouched = state.stages.join() === IDEAS[state.idea].stages.join();
      state.idea = id;
      if (untouched) state.stages = IDEAS[id].stages.slice();
      renderIdea();
      renderOutline();
      renderStagesEdit();
      renderMap();
      save();
    });
    ideasBox.append(b);
  });
  function renderIdea() {
    $$(".idea", ideasBox).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === state.idea ? "true" : "false"));
    $("#w-idea-name").placeholder = state.idea === "own" ? "点子的名字，比如：西语作文小老师" : "给它起个名字（可以不填，默认叫“" + IDEAS[state.idea].title + "”）";
  }
  function renderFound() {
    const items = [
      ["A 面 · 需求体检卡", has.card, () => "读到了：" + ((L.card.values.name || "").trim() || (IDEAS[L.card.idea] || IDEAS.own).title)],
      ["B 面 · 一页纸", has.op, () => "读到了：" + ((L.op.values.name || "").trim() || (IDEAS[L.op.idea] || IDEAS.own).title) + "，会填进“定方案”"],
      ["C 面 · 需求池", has.pool, () => "读到了 " + L.pool.rows.filter((r) => r && (r.t || "").trim()).length + " 条需求，可以拿进“理需求”"],
      ["D 面 · 验证计划", has.ver, () => "读到了" + ((L.ver.values.star || "").trim() ? "北极星：" + L.ver.values.star.trim() : "验证计划") + "，会填进“定方案”"]
    ];
    $("#w-found").innerHTML = items.map(([t, ok, say]) =>
      '<li class="' + (ok ? "yes" : "") + '"><b>' + t + "</b><span>" + (ok ? esc(say()) : "这台电脑上没有，从空白开始也可以") + "</span></li>").join("");
  }
  $("#w-reload").addEventListener("click", () => {
    fromLessons(state);
    bind();
    renderIdea();
    renderSentence();
    renderStagesEdit();
    renderMap();
    save();
    const b = $("#w-reload");
    b.textContent = "✓ 已补进空着的地方";
    setTimeout(() => { b.textContent = "↻ 再读一次，补进空着的地方"; }, 2000);
  });

  // ---------- 环节 2：互访 ----------
  function renderOutline() {
    $("#w-outline").innerHTML = IDEAS[state.idea].outline.concat(LAST_Q).map((q) => "<li>" + esc(q) + "</li>").join("");
  }
  $("#w-tips").innerHTML = TIPS.map(([a, b]) => "<li><b>" + a + "</b>" + b + "</li>").join("");
  let fresh = "";
  function addQuote(t, who, st) {
    state.seq += 1;
    fresh = "q" + state.seq;
    state.quotes.push({ id: "q" + state.seq, t: t.trim(), who: (who || "").trim(), st: st == null ? "" : String(st), v: "" });
  }
  $("#q-add").addEventListener("click", () => {
    const t = $("#q-text").value;
    if (!t.trim()) { $("#q-text").focus(); return; }
    addQuote(t, $("#q-who").value);
    $("#q-text").value = "";
    $("#q-text").focus();
    renderQuotes();
    renderMap();
    save();
  });
  $("#q-text").addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); $("#q-add").click(); }
  });
  function renderQuotes() {
    const box = $("#w-quotes");
    box.innerHTML = state.quotes.map((q) =>
      '<div class="qc' + (q.id === fresh ? " new" : "") + '" data-id="' + q.id + '"><div class="tx">' + esc(q.t) + '</div><div class="who">' + esc(q.who || "没写是谁") + "</div>" +
      '<button class="del" type="button" aria-label="删掉这张卡" title="删掉">×</button></div>').join("");
    fresh = "";
    const n = state.quotes.length;
    $("#q-count").innerHTML = "已经记了 <b>" + n + "</b> 张" + (n < 6 ? "，至少再记 " + (6 - n) + " 张。" : "。够了，可以去理需求。");
    // A 面体检卡里的原话
    const imp = $("#q-import");
    const said = has.card && (L.card.values.said || "").trim();
    if (said && !state.quotes.some((q) => q.t === said)) {
      imp.innerHTML = '<button class="btn" type="button" style="margin-top:10px">＋ 加入 A 面体检卡里记下的原话</button>';
      $("button", imp).onclick = () => { addQuote(said, "A 面体检卡"); renderQuotes(); renderMap(); save(); };
    } else imp.innerHTML = "";
  }
  $("#w-quotes").addEventListener("click", (e) => {
    const d = e.target.closest(".del");
    if (!d) return;
    const id = d.closest(".qc").dataset.id;
    state.quotes = state.quotes.filter((q) => q.id !== id);
    if (state.gem === id) state.gem = "";
    renderQuotes();
    renderMap();
    save();
  });

  // ---------- 环节 3：理需求 ----------
  const tray = $("#w-tray"), cols = $("#w-cols");
  let picked = null;
  function renderStagesEdit() {
    const box = $("#w-stages");
    box.innerHTML = "";
    state.stages.forEach((s, k) => {
      const inp = document.createElement("input");
      inp.type = "text";
      inp.value = s;
      inp.maxLength = 12;
      inp.setAttribute("aria-label", "环节 " + (k + 1));
      inp.addEventListener("input", () => {
        state.stages[k] = inp.value.trim();
        const h = $$(".qcol h4 b", cols)[k];
        if (h) h.textContent = stageName(k);
        save();
      });
      box.append(inp);
    });
  }
  const stageName = (k) => state.stages[k] || "环节 " + (k + 1);
  function mqHTML(q) {
    return '<div class="mq' + (q.v ? " v-" + q.v : "") + '" data-id="' + q.id + '" tabindex="0" role="button" aria-pressed="' + (picked === q.id) + '">' +
      '<div class="tx">' + esc(q.t) + '</div><div class="who">' + esc(q.who || "") + '</div><div class="vb">' +
      VERD.map(([v, t]) => '<button type="button" class="' + v + '" data-v="' + v + '" aria-pressed="' + (q.v === v) + '">' + t + "</button>").join("") +
      '<button type="button" class="gem" aria-pressed="' + (state.gem === q.id) + '" aria-label="标成长尾里的金子" title="长尾里的金子">★</button></div></div>';
  }
  function renderMap() {
    tray.innerHTML = state.quotes.filter((q) => q.st === "" || +q.st >= state.stages.length).map(mqHTML).join("");
    cols.innerHTML = state.stages.map((s, k) => {
      const list = state.quotes.filter((q) => q.st === String(k));
      return '<div class="qcol" data-col="' + k + '" tabindex="0" role="button" aria-label="放进“' + esc(stageName(k)) + '”"><h4><b>' + esc(stageName(k)) + "</b><span>" + list.length + "</span></h4>" + list.map(mqHTML).join("") + "</div>";
    }).join("");
    armed(!!picked);
    // C 面需求池
    const imp = $("#p-import");
    const rows = has.pool ? L.pool.rows.filter((r) => r && (r.t || "").trim() && !state.quotes.some((q) => q.t === r.t.trim())) : [];
    if (rows.length) {
      imp.innerHTML = '<button class="btn" type="button">＋ 拿进 C 面需求池里的 ' + rows.length + " 条</button>";
      $("button", imp).onclick = () => {
        const same = L.pool.idea === state.idea;
        rows.forEach((r) => addQuote(r.t, "C 面需求池" + (r.src ? " · " + r.src : ""), same && r.st !== "" ? r.st : ""));
        renderQuotes();
        renderMap();
        save();
      };
    } else imp.innerHTML = "";
    const qs = state.quotes, cnt = (v) => qs.filter((q) => q.v === v).length;
    const placed = qs.filter((q) => q.st !== "" && +q.st < state.stages.length).length;
    $("#map-count").innerHTML = qs.length
      ? "共 <b>" + qs.length + "</b> 张：已放进环节 <b>" + placed + "</b> 张 · 真需求 " + cnt("real") + " · 伪需求 " + cnt("fake") + " · 再问问 " + cnt("ask") + " · ★ 金子" + (state.gem ? "已挑" : "还没挑")
      : "还没有原话卡。先回到“互访”记几张。";
  }
  function armed(on) {
    tray.classList.toggle("armed", on);
    $$(".qcol", cols).forEach((c) => c.classList.toggle("armed", on));
  }
  function moveTo(id, col) {
    const q = state.quotes.find((x) => x.id === id);
    if (!q) return;
    q.st = col == null ? "" : String(col);
    picked = null;
    renderMap();
    save();
  }
  function onMapClick(e) {
    const vb = e.target.closest(".vb button");
    if (vb) {
      const id = vb.closest(".mq").dataset.id, q = state.quotes.find((x) => x.id === id);
      if (vb.classList.contains("gem")) state.gem = state.gem === id ? "" : id;
      else q.v = q.v === vb.dataset.v ? "" : vb.dataset.v;
      renderMap();
      save();
      return;
    }
    const card = e.target.closest(".mq");
    if (card && !picked) { pick(card.dataset.id); return; }
    if (card && picked === card.dataset.id) { pick(null); return; }
    const col = e.target.closest(".qcol");
    if (picked && col) { moveTo(picked, +col.dataset.col); return; }
    if (picked && e.target.closest("#w-tray")) { moveTo(picked, null); return; }
    if (card) pick(card.dataset.id);
  }
  function pick(id) {
    picked = id;
    $$(".mq", studio).forEach((m) => m.setAttribute("aria-pressed", m.dataset.id === id ? "true" : "false"));
    armed(!!id);
  }
  [tray, cols].forEach((root) => {
    root.addEventListener("click", (e) => {
      if (dragJustEnded) return;
      onMapClick(e);
    });
    root.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      if (e.target.closest(".vb button")) return;
      e.preventDefault();
      onMapClick(e);
    });
  });
  // 拖放
  let drag = null, dragJustEnded = false;
  studio.addEventListener("pointerdown", (e) => {
    const card = e.target.closest(".mq");
    if (!card || e.target.closest("button") || e.button > 0) return;
    drag = { card, id: card.dataset.id, x: e.clientX, y: e.clientY, on: false, over: null, pid: e.pointerId };
  });
  studio.addEventListener("pointermove", (e) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on && Math.hypot(dx, dy) > 6) {
      drag.on = true;
      try { drag.card.setPointerCapture(drag.pid); } catch (err) { /* 拿不到也能拖 */ }
      drag.card.classList.add("dragging");
      drag.card.style.pointerEvents = "none";
      pick(null);
    }
    if (!drag.on) return;
    drag.card.style.transform = "translate(" + dx + "px," + dy + "px) rotate(" + Math.max(-3, Math.min(3, dx / 40)) + "deg)";
    const hit = document.elementFromPoint(e.clientX, e.clientY);
    const t = hit && (hit.closest(".qcol") || hit.closest("#w-tray"));
    if (t !== drag.over) {
      drag.over && drag.over.classList.remove("over");
      drag.over = t;
      t && t.classList.add("over");
    }
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.pid) return;
    const d = drag;
    drag = null;
    if (!d.on) return;
    dragJustEnded = true;
    setTimeout(() => { dragJustEnded = false; }, 0);
    d.card.style.pointerEvents = "";
    d.card.classList.remove("dragging");
    if (d.over) {
      d.over.classList.remove("over");
      moveTo(d.id, d.over.id === "w-tray" ? null : +d.over.dataset.col);
    } else {
      d.card.style.transform = "";
    }
  };
  studio.addEventListener("pointerup", endDrag);
  studio.addEventListener("pointercancel", endDrag);

  // ---------- 环节 4：定方案 ----------
  const pv = (k) => (state.plan[k] || "").trim();
  const or = (k) => pv(k) || "（待补充）";
  const sentence = () => (pv("who") || pv("when") || pv("problem") || pv("goal"))
    ? "为" + or("who") + "，在" + or("when") + "，解决" + or("problem") + "，让他们能" + or("goal") + "。"
    : "";
  function renderSentence() { $("#w-sentence").textContent = sentence(); }

  // ---------- 环节 5：做第一版 ----------
  const ideaTitle = () => (state.ideaName || "").trim() || IDEAS[state.idea].title;
  function prompt() {
    const real = state.quotes.filter((q) => q.v === "real").slice(0, 3);
    return [
      "【背景】我们是西语专业的学生，不会写代码，想请你帮我们做一个小工具。",
      "【要做什么】" + ideaTitle() + "：" + (sentence() || "（待补充）"),
      real.length ? "【用户的原话】\n" + real.map((q) => "· “" + q.t + "”" + (q.who ? "（" + q.who + "）" : "")).join("\n") : "",
      "【为什么从这里切入】用户最痛的点：" + or("pain") + "；现有办法的弱点：" + or("weak") + "；我们的优势：" + or("edge") + "。",
      "【第一版只做这一个核心功能】" + or("core"),
      "【第一版暂时不要做】" + or("notdo") + "。请不要自作主张加功能。",
      "【怎么算做成了】我们会看这个数：" + or("star") + "。",
      "【请先不要写代码】先用你自己的话复述你对这个工具的理解，再列出你的疑问。我们对齐之后，再开始做第一个版本。"
    ].filter(Boolean).join("\n\n");
  }
  function renderPrompt(show) {
    $("#w-prompt-text").textContent = prompt();
    if (show) $("#w-prompt").classList.add("show");
  }
  $("#w-gen").addEventListener("click", () => {
    renderPrompt(true);
    $("#w-prompt").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
  $("#w-prompt-copy").addEventListener("click", async () => {
    const ok = await PT.copy(prompt());
    flash(ok ? "需求说明已复制，可以直接粘贴给 AI" : "复制没成功，请手动选中文字复制");
  });
  function flash(msg) { $$(".stage-nav .saved").forEach((n) => { n.textContent = msg; }); }

  // ---------- 环节 6：互评与作品卡 ----------
  $("#w-rates").innerHTML = RATES.map(([k, t]) =>
    '<div class="rate-row"><span>' + t + '</span><span class="rate" role="group" aria-label="' + t + '">' +
    [1, 2, 3, 4, 5].map((n) => '<button type="button" data-r="' + k + '" data-n="' + n + '" aria-label="' + n + ' 分">' + n + "</button>").join("") + "</span></div>").join("");
  function renderRates() {
    $$("#w-rates button").forEach((b) => b.setAttribute("aria-pressed", state.review[b.dataset.r] === +b.dataset.n ? "true" : "false"));
  }
  $("#w-rates").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-r]");
    if (!b) return;
    state.review[b.dataset.r] = state.review[b.dataset.r] === +b.dataset.n ? 0 : +b.dataset.n;
    renderRates();
    save();
  });
  const team = () => (state.team.name || "").trim() || "我们组";
  function reviewRows() {
    const r = state.review;
    return [
      { label: "三个圈", text: RATES.map(([k, t]) => t + "：" + (r[k] ? r[k] + " / 5" : "—")).join("\n") },
      { label: "口碑三条件", text: [["c1", "超出预期"], ["c2", "乐意传播"], ["c3", "用户够多"]].map(([k, t]) => (r[k] ? "✓ " : "· ") + t + (r[k] ? "" : "（还没做到）")).join("\n") },
      { label: "一句建议", text: (r.advice || "").trim() }
    ];
  }
  const reviewTitle = () => "给" + ((state.review.group || "").trim() ? "「" + state.review.group.trim() + "」" : "别组") + "的互评";
  $("#w-review-png").addEventListener("click", async () => {
    try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
    const c = PT.cardImage({ kicker: "互评卡 · Bonus Track", title: reviewTitle(), rows: reviewRows(), footer: "来自 " + team() + " · AI产品思维 录音棚", accent: INK });
    PT.download(c, "互评卡-" + ((state.review.group || "").trim() || "别组") + ".png");
  });
  $("#w-review-copy").addEventListener("click", async () => {
    const text = "【" + reviewTitle() + "】来自 " + team() + "\n\n" + reviewRows().map((r) => r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
    flash((await PT.copy(text)) ? "互评已复制" : "复制没成功，请手动选中文字复制");
  });
  function cardRows() {
    const m = state.team.members.map((x) => (x || "").trim()).filter(Boolean);
    const v1 = [state.v1.link, state.v1.tool && "用的 AI：" + state.v1.tool, state.v1.note].map((x) => (x || "").trim()).filter(Boolean).join("\n");
    return [
      { label: "小组", text: [team(), m.join("、")].filter(Boolean).join("\n") },
      { label: "一句话定义", text: sentence() },
      { label: "唯一的核心功能", text: pv("core") },
      { label: "北极星指标", text: pv("star") },
      { label: "第一版", text: v1 },
      { label: "改进清单", text: (state.todo || "").trim() }
    ];
  }
  $("#w-card-png").addEventListener("click", async () => {
    try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
    const c = PT.cardImage({ kicker: "作品卡 · Bonus Track 录音棚", title: ideaTitle(), rows: cardRows(), footer: "AI产品思维 · 26 Fall", accent: INK });
    PT.download(c, "作品卡-" + team() + ".png");
  });
  $("#w-card-copy").addEventListener("click", async () => {
    const text = "【作品卡】" + ideaTitle() + "\n\n" + cardRows().map((r, i) => (i + 1) + ". " + r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
    flash((await PT.copy(text)) ? "作品卡文字已复制" : "复制没成功，请手动选中文字复制");
  });
  const clearBtn = $("#w-clear");
  let armedClear = 0;
  clearBtn.addEventListener("click", () => {
    if (!armedClear) {
      clearBtn.textContent = "再点一次，清空六个环节";
      armedClear = setTimeout(() => { armedClear = 0; clearBtn.textContent = "清空全部"; }, 3000);
      return;
    }
    clearTimeout(armedClear); armedClear = 0; clearBtn.textContent = "清空全部";
    state = fromLessons(blank());
    renderAll();
    go(0, true);
  });

  function renderAll() {
    bind();
    renderIdea();
    renderFound();
    renderOutline();
    renderQuotes();
    renderStagesEdit();
    renderMap();
    renderSentence();
    renderRates();
  }
  renderAll();
  go(state.cur || 0, false);

  // ---------- 投屏模式 ----------
  const PKEY = "pt.ws.proj.v1";
  const proj = $("#proj");
  const full = (i) => STAGES[i].min * 60000;
  let pj = PT.store.get(PKEY, null);
  if (!pj || !(pj.stage >= 0 && pj.stage < STAGES.length)) pj = { stage: 0, left: full(0), endsAt: 0, running: false };
  let tickId = 0;
  const savePj = () => PT.store.set(PKEY, pj);
  const remaining = () => (pj.running ? pj.endsAt - Date.now() : pj.left);
  const mmss = (ms) => {
    const s = Math.max(0, Math.ceil(ms / 1000));
    return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0");
  };
  $("#pj-dots").innerHTML = STAGES.map(() => "<i></i>").join("");
  function paintStatic() {
    const s = STAGES[pj.stage], nx = STAGES[pj.stage + 1];
    $("#pj-k").textContent = "环节 " + (pj.stage + 1) + " / " + STAGES.length + " · " + s.min + " 分钟";
    $("#pj-title").textContent = s.t;
    $("#pj-give").textContent = s.give;
    $("#pj-nexttext").textContent = nx ? "下一步：" + nx.t + " · " + nx.min + " 分钟" : "最后一步了：导出作品卡，交到学习通或者群里。";
    $$("#pj-dots i").forEach((d, k) => { d.className = k < pj.stage ? "done" : k === pj.stage ? "on" : ""; });
    $("#pj-prev").disabled = pj.stage === 0;
    $("#pj-next").disabled = pj.stage === STAGES.length - 1;
  }
  function tick() {
    const ms = remaining(), over = ms <= 0;
    const t = $("#pj-time");
    if (over) {
      const s = Math.floor(-ms / 1000);
      t.innerHTML = "00:00<small>时间到" + (s >= 1 ? " · 超时 " + Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0") : "") + "</small>";
    } else t.textContent = mmss(ms);
    proj.classList.toggle("over", over);
    proj.classList.toggle("paused", !pj.running && !over);
    $("#pj-bar").style.width = Math.min(100, Math.max(0, (1 - ms / full(pj.stage)) * 100)) + "%";
    $("#pj-toggle").textContent = pj.running ? "⏸ 暂停" : over ? "▶ 继续计时" : pj.left === full(pj.stage) ? "▶ 开始" : "▶ 继续";
  }
  function toggle() {
    if (pj.running) { pj.left = pj.endsAt - Date.now(); pj.running = false; }
    else { pj.endsAt = Date.now() + pj.left; pj.running = true; }
    savePj(); tick();
  }
  function addMinute() {
    if (pj.running) pj.endsAt += 60000; else pj.left += 60000;
    savePj(); tick();
  }
  function setStage(i) {
    if (i < 0 || i >= STAGES.length) return;
    pj = { stage: i, left: full(i), endsAt: 0, running: false };
    savePj(); paintStatic(); tick();
  }
  function openProj() {
    proj.hidden = false;
    document.body.classList.add("proj-open");
    paintStatic(); tick();
    clearInterval(tickId);
    tickId = setInterval(tick, 250);
    try { const r = document.documentElement.requestFullscreen && document.documentElement.requestFullscreen(); r && r.catch && r.catch(() => {}); } catch (e) { /* 不支持全屏也照样用 */ }
    $("#pj-toggle").focus({ preventScroll: true });
  }
  function closeProj() {
    proj.hidden = true;
    document.body.classList.remove("proj-open");
    clearInterval(tickId);
    try { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); } catch (e) { /* 忽略 */ }
    $("#proj-open").focus({ preventScroll: true });
  }
  $("#proj-open").addEventListener("click", openProj);
  $("#pj-exit").addEventListener("click", closeProj);
  $("#pj-toggle").addEventListener("click", toggle);
  $("#pj-add").addEventListener("click", addMinute);
  $("#pj-reset").addEventListener("click", () => setStage(pj.stage));
  $("#pj-prev").addEventListener("click", () => setStage(pj.stage - 1));
  $("#pj-next").addEventListener("click", () => setStage(pj.stage + 1));
  document.addEventListener("keydown", (e) => {
    if (proj.hidden || e.altKey || e.metaKey || e.ctrlKey) return;
    if (e.key === " " || e.code === "Space") { e.preventDefault(); toggle(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); setStage(pj.stage + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); setStage(pj.stage - 1); }
    else if (e.key === "+" || e.key === "=") { e.preventDefault(); addMinute(); }
    else if (e.key === "Escape") { closeProj(); }
  });
  // 按钮获得焦点时，空格不再额外触发一次点击
  document.addEventListener("keyup", (e) => {
    if (!proj.hidden && (e.key === " " || e.code === "Space")) e.preventDefault();
  });
})();
