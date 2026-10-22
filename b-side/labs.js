/* 第二课 · 做选择：各练习的内容与逻辑 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ============ ① 你先做哪个 ============
  (function lab1() {
    const reqs = $$("#duel .req"), reveal = $("#reveal1");
    reqs.forEach((b) => b.addEventListener("click", () => {
      reqs.forEach((x) => { x.disabled = true; });
      b.classList.add("picked");
      $('#duel .req[data-v="import"]').classList.add("winner");
      $("#reveal1-h").textContent = b.dataset.v === "import" ? "你和小明选的一样：先做导入歌单" : "大多数人会这么选。可小明先做的是导入歌单";
      reveal.classList.add("show");
    }));
    $("#lab1-reset").addEventListener("click", () => {
      reqs.forEach((x) => { x.disabled = false; x.classList.remove("picked", "winner"); });
      reveal.classList.remove("show");
    });
  })();

  // ============ ② 三个圈 ============
  (function lab2() {
    const clues = [
      { id: "u1", bin: "user", txt: "换一个 App，之前收藏的几百首歌，要一首首重新加", hint: "这是用户换 App 时最大的成本，属于“用户最痛的点”。" },
      { id: "u2", bin: "user", txt: "资深乐迷想发现更多好音乐，现有的产品帮不上", hint: "这是资深乐迷没被满足的需求，属于“用户最痛的点”。" },
      { id: "r1", bin: "rival", txt: "某 FM 产品：收藏的歌不能下载，也不能点播", hint: "这是对手产品的短板，属于“对手的弱点”。" },
      { id: "r2", bin: "rival", txt: "另一家：下载歌曲要付费", hint: "下载要付费，是对手的短板，属于“对手的弱点”。" },
      { id: "e1", bin: "edge", txt: "曲库提供 320K 高品质音乐，免费下载", hint: "这是网易云自己能做到、对手做不到的，属于“自己的优势”。" },
      { id: "e2", bin: "edge", txt: "已经有一批资深乐迷做的优质歌单", hint: "优质歌单是网易云手里的牌，属于“自己的优势”。" },
      { id: "n1", bin: "none", txt: "“加排行榜”被提了上千次", hint: "呼声高，不等于切入点。何况对手们都有排行榜。放进“都不是”。" },
      { id: "n2", bin: "none", txt: "对手有十年的用户积累", hint: "这是对手的优势，不是它的弱点。放进“都不是”。" },
      { id: "n3", bin: "none", txt: "花大钱买更多版权", hint: "成本太高，算不上四两拨千斤。放进“都不是”。" }
    ];
    const root = $("#sorter2"), reveal = $("#reveal2"), venn = $("#venn");
    const opts = {
      items: clues.map((c) => ({ id: c.id, bin: c.bin, hint: c.hint, html: '<span class="clue">' + c.txt + "</span>" })),
      bins: [
        { id: "user", label: "用户最痛的点" },
        { id: "rival", label: "对手的弱点" },
        { id: "edge", label: "自己的优势" },
        { id: "none", label: "都不是" }
      ],
      binsClass: "four",
      onDone() {
        reveal.classList.add("show");
        setTimeout(() => venn.classList.add("lit"), 60);
      }
    };
    PT.sorter(root, opts);
    $("#road2").addEventListener("click", () => { $("#road2-a").hidden = false; });
    $("#lab2-reset").addEventListener("click", () => {
      reveal.classList.remove("show");
      venn.classList.remove("lit");
      $("#road2-a").hidden = true;
      PT.sorter(root, opts);
    });
  })();

  // ============ ③ 只能留一个 ============
  (function lab3() {
    const steps = PT.steps($("#cut-steps"));
    const cands = [
      { id: "list", t: "歌单", d: "用户把喜欢的歌编成一张张主题歌单", keep: true },
      { id: "tag", t: "标签", d: "给歌打上风格、情绪、场景的标签，按标签找歌", keep: true },
      { id: "radio", t: "电台", d: "点一下就开始放，不喜欢就切", why: "当时用户最想要的还是点播和下载。一上来就做电台，撬不动大众，适合以后再做。" },
      { id: "mv", t: "MV", d: "看音乐视频", why: "市场体量不如音乐，也不是刚需，适合以后再做。" },
      { id: "live", t: "音频直播聊天室", d: "乐迷在线上边听边聊", why: "受众太小，用户门槛也太高。" }
    ];
    const box = $("#cands"), next1 = $("#cut-next1"), next2 = $("#cut-next2");
    let aside = 0;
    function renderCands() {
      box.innerHTML = "";
      aside = 0;
      cands.forEach((c) => {
        const el = document.createElement("div");
        el.className = "cand";
        el.innerHTML = "<b>" + c.t + "</b><small>" + c.d + '</small><button class="btn" type="button">放一边</button><span class="note" aria-live="polite"></span>';
        const note = $(".note", el);
        $(".btn", el).addEventListener("click", () => {
          if (c.keep) {
            note.textContent = "先别放，它还在决赛圈里。";
            note.classList.remove("show"); void note.offsetWidth; note.classList.add("show");
            return;
          }
          el.classList.add("aside");
          note.textContent = c.why;
          note.classList.add("show");
          aside += 1;
          if (aside === 3) next1.disabled = false;
        });
        box.append(el);
      });
    }
    next1.addEventListener("click", () => { steps.done(0); steps.unlock(1); steps.go(1); });

    const opts2 = $$("#cut-p2 .opt");
    opts2.forEach((o) => $(".btn", o).addEventListener("click", () => {
      opts2.forEach((x) => { $(".btn", x).disabled = true; });
      o.classList.add("chosen");
      $("#cut-why2-h").textContent = o.dataset.v === "list" ? "和小明的选择一样：歌单" : "标签也说得通，但小明选了歌单";
      $("#cut-why2").classList.add("show");
      next2.disabled = false;
    }));
    next2.addEventListener("click", () => { steps.done(1); steps.unlock(2); steps.go(2); });

    const q3 = $$("#cut-q3 .choice");
    q3.forEach((b) => b.addEventListener("click", () => {
      q3.forEach((x) => {
        x.disabled = true;
        if (x.dataset.v === "cut") x.classList.add("right");
        else if (x === b) x.classList.add("wrong");
      });
      $("#cut-why3-h").textContent = b.dataset.v === "cut" ? "全砍掉，和小明一样" : "小明的做法是：全砍掉";
      $("#cut-why3").classList.add("show");
      steps.done(2);
    }));

    function reset() {
      renderCands();
      next1.disabled = true; next2.disabled = true;
      opts2.forEach((x) => { x.classList.remove("chosen"); $(".btn", x).disabled = false; });
      $("#cut-why2").classList.remove("show");
      q3.forEach((x) => { x.disabled = false; x.classList.remove("right", "wrong"); });
      $("#cut-why3").classList.remove("show");
      $$('#cut-steps [role="tab"]').forEach((t, i) => { t.classList.remove("done"); if (i) t.disabled = true; });
      steps.go(0);
    }
    $("#lab3-reset").addEventListener("click", reset);
    renderCands();
  })();

  // ============ ④ 做还是不做 ============
  (function lab4() {
    const cards = [
      {
        h: "场景电台", tag: "决策卡 1",
        voice: "别家都有学习、运动、开车的场景电台了，你们为什么还不做？",
        opts: [["do", "马上做"], ["no", "不做"], ["later", "以后再做"]], answer: "no",
        body:
          '<p>场景电台很省事，点一下就能听。可网易云的核心是歌单：乐迷做歌单，大家来听，做歌单的人收获成就感。场景电台一多，会发生这样一串事：</p>' +
          '<div class="dominoes"><div class="domino">场景电台多了</div><div class="domino">同类场景歌单没人听</div><div class="domino">做歌单的人没了成就感</div><div class="domino">好歌单越来越少</div><div class="domino">听众也跟着流失</div></div>' +
          "<p>所以小明没有做通用的场景电台，宁可让用户麻烦一点，去按标签找场景歌单。他只挑了两个对音乐有特殊要求的场景：开车要操作少、能解闷，做了车载模式；跑步要配上步频，做了跑步 FM。</p>"
      },
      {
        h: "下载必须先选歌单", tag: "决策卡 2",
        voice: "下载一首歌还得先选歌单，太麻烦了！能不能点一下就直接下载？",
        opts: [["direct", "改成直接下载"], ["keep", "坚持先选歌单"]], answer: "keep",
        body:
          "<p>小明坚持了下来。网易云的长期目标是<strong>云同步</strong>：歌放进歌单，手机和电脑上都能找到，再也不用从电脑往手机里拷歌。要是直接下载，歌只留在这台手机里；以后还得再做一个“下载记录漫游”来补救，产品反而更复杂。</p>" +
          "<p>同时，能省的地方他都省了：在私人 FM 里下载，歌直接进“我喜欢的音乐”；下载自己的歌单或收藏的歌单，不用再选。</p>"
      },
      {
        h: "收藏专辑", tag: "决策卡 3",
        voice: "我习惯听整张专辑，为什么不能收藏专辑？",
        opts: [["do", "马上做"], ["no", "不做"], ["later", "以后再做"]], answer: "later",
        body:
          "<p>早期不做，是为了突出歌单：“我的音乐”里只有歌单，概念最简单。到 2016 年，用户过了两亿，大家都习惯了用歌单管理音乐，这个目标已经实现。</p>" +
          "<p>这时再做收藏专辑，正好能留住那些还坚持听整张专辑的资深乐迷。<strong>目标变了，答案也跟着变。</strong></p>"
      }
    ];
    const box = $("#decisions");
    function render() {
      box.innerHTML = "";
      cards.forEach((c) => {
        const el = document.createElement("div");
        el.className = "dec";
        el.innerHTML = '<div class="dec-h"><span>' + c.tag + "</span><b>" + c.h + '</b></div><p class="voice">' + c.voice + '</p><div class="choices"></div><div class="reveal" aria-live="polite"><h4></h4>' + c.body + "</div>";
        const ch = $(".choices", el), rv = $(".reveal", el);
        c.opts.forEach(([v, label]) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "choice";
          b.textContent = label;
          b.addEventListener("click", () => {
            $$(".choice", ch).forEach((x, i) => {
              x.disabled = true;
              if (c.opts[i][0] === c.answer) x.classList.add("right");
              else if (x === b) x.classList.add("wrong");
            });
            $("h4", rv).textContent = v === c.answer ? "和小明的选择一样" : "小明的选择不同";
            rv.classList.add("show");
            const dom = $(".dominoes", rv);
            if (dom && !reduce()) {
              $$(".domino", dom).forEach((d, i) => { d.style.animationDelay = 300 + i * 260 + "ms"; });
              requestAnimationFrame(() => dom.classList.add("fall"));
            }
          });
          ch.append(b);
        });
        box.append(el);
      });
    }
    render();
    $("#lab4-reset").addEventListener("click", render);
  })();

  // ============ ⑤ 口碑预测 ============
  (function lab5() {
    const items = [
      { t: "把音效再优化一点", a: "no", tag: "同一维度", why: "做得再好，也和“听歌”在同一个维度上。用户觉得这是应该的，很难拉开差距。" },
      { t: "在每首歌下面开评论区", a: "yes", tag: "换维度", why: "听歌之外多了一个维度：在评论里遇见有同样记忆的人。差距一下子拉开了。" },
      { t: "把一句歌词做成好看的分享图", a: "yes", tag: "深 · 展示自己", why: "很多人小时候在本子上抄过歌词。这个功能重现了那段经历，用户也乐意发到朋友圈。" },
      { t: "支持微信登录", a: "no", tag: "理所当然", why: "大家都有的功能，没人会因此昭告天下。除非你是最早支持的那一批。" },
      { t: "团队每个人都去回复用户反馈", a: "yes", tag: "深", why: "团队的人都去微博、贴吧、知乎回复用户。被认真对待的用户，会逢人推荐。" }
    ];
    const box = $("#wows"), score = $("#wow-score");
    let done = 0, right = 0;
    function render() {
      box.innerHTML = ""; done = 0; right = 0; score.textContent = "";
      items.forEach((it) => {
        const el = document.createElement("div");
        el.className = "wow";
        el.innerHTML = "<b>" + it.t + '</b><span class="q2">会有人主动安利吗？</span><div class="choices"><button class="choice" type="button" data-v="yes">会</button><button class="choice" type="button" data-v="no">不会</button></div><p class="res" aria-live="polite"></p>';
        const res = $(".res", el), bs = $$(".choice", el);
        bs.forEach((b) => b.addEventListener("click", () => {
          bs.forEach((x) => {
            x.disabled = true;
            if (x.dataset.v === it.a) x.classList.add("right");
            else if (x === b) x.classList.add("wrong");
          });
          const ok = b.dataset.v === it.a;
          done += 1; if (ok) right += 1;
          res.innerHTML = '<span class="tag' + (it.a === "no" ? " dim" : "") + '">' + it.tag + "</span>" + it.why;
          res.classList.add("show");
          if (done === items.length) score.textContent = "你判断对了 " + right + " / " + items.length + " 个。";
        }));
        box.append(el);
      });
    }
    render();
    $("#lab5-reset").addEventListener("click", render);
    // 维度示意图：进入视口时播放一次
    const dims = $("#dims");
    if (reduce() || !("IntersectionObserver" in window)) { dims.classList.add("go"); return; }
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { setTimeout(() => dims.classList.add("go"), 500); io.disconnect(); }
    }, { threshold: 0.6 });
    io.observe(dims);
  })();

  // ============ ⑥ 我的产品一页纸 ============
  (function lab6() {
    const KEY = "pt.onepager.v1";
    const IDEAS = {
      own: {
        title: "我自己的点子", desc: "接着你在 A 面写的那张体检卡",
        ex: {
          name: "你的小工具叫什么", who: "具体到一群人", when: "什么时候、在哪", problem: "他的麻烦是什么", goal: "用了以后能做到什么",
          first: "最先服务谁？为什么是他们？", pain: "用户最痛的点", weak: "他现在用的办法差在哪", edge: "你有什么别人没有的",
          core: "只写一个", dropped: "为了它放弃了什么", notdo: "暂时不做的功能和理由", wow: "让人想截图发给朋友的地方", test: "一周、不写代码的验证办法"
        }
      },
      essay: {
        title: "AI 西语作文批改", desc: "西语作文小老师",
        ex: {
          name: "西语作文小老师", who: "西语专业大一、大二的学生", when: "交作文的前一晚，想自己先查一遍", problem: "性数配合、虚拟式老出错，自己看不出来", goal: "知道自己最常错在哪，交之前改掉",
          first: "先服务西语专业大二学生：每周都写作文，痛点明确；他们还会在班级群里互相推荐。",
          pain: "不知道自己最常错哪一类，每次都从头查", weak: "翻译软件只会改句子，不会告诉你“你总错在虚拟式”", edge: "我自己就是西语学生，知道老师最在意哪些错，身边全是用户",
          core: "按错误类型标出问题，并统计“你最常错的三类”", dropped: "放弃了自动打分和范文推荐",
          notdo: "排行榜：比分数会让人焦虑；发音评测：和写作文不是一件事", wow: "每周生成一张“我的错误地图”，看得见自己在进步，愿意发朋友圈",
          test: "找 5 个同学把作文发给我，我用 AI 分析后手动回一张错误清单，看他们下周还要不要"
        }
      },
      mail: {
        title: "外贸西语邮件助手", desc: "西语邮件小秘书",
        ex: {
          name: "西语邮件小秘书", who: "刚入职的外贸业务员", when: "要赶在拉美客户上班前回邮件", problem: "怕语气不对，客户觉得不礼貌", goal: "十分钟内发出一封专业又不生硬的西语邮件",
          first: "先服务做墨西哥市场的新人业务员：邮件多、最怕出错，老同事带不过来。",
          pain: "每封都要找老同事把关，耽误时间也欠人情", weak: "翻译软件只管翻译，不管称呼、礼貌用语和不同国家的习惯", edge: "懂西语，也懂拉美不同国家的说话习惯",
          core: "按客户国家和关系，生成语气合适的邮件，并标出称呼和礼貌用语", dropped: "放弃了自动回复和客户管理",
          notdo: "多语言：先把西语做好；报价计算：和写邮件不是一件事", wow: "每封邮件附一段“为什么这样写”的小注释，新人愿意转给同事看",
          test: "找 3 位外贸业务员，一周内把要发的邮件发给我，我用 AI 加人工改好再给他们，看他们会不会继续找我"
        }
      },
      buddy: {
        title: "西语角语伴匹配", desc: "语伴速配",
        ex: {
          name: "语伴速配", who: "想练西语口语的中国学生，和想练中文的拉美留学生", when: "没课的下午，想找人聊半小时", problem: "不知道谁有空、谁愿意，聊两次就断了", goal: "每周稳定聊一两次，每次都有话可聊",
          first: "先服务准备去交换的西语专业学生：最着急练口语。但也得先确认，拉美留学生想不想练中文。",
          pain: "找不到人，找到了也不知道聊什么", weak: "西语角时间固定、人多嘈杂；微信加了就断", edge: "学院里就有拉美留学生，我能直接去问、去拉人",
          core: "按空闲时间和话题匹配，每次附一张话题卡", dropped: "放弃了视频通话和打分评价",
          notdo: "陌生人广场：安全和尴尬的问题多；积分勋章：新鲜感过得太快", wow: "每次聊完生成一张“今天学会的 5 个说法”双语卡片，两边都愿意发",
          test: "这周先用一个问卷加一个微信群，手动帮 5 对同学配对，看两周后还有几对在聊"
        }
      }
    };
    const aCard = PT.store.get("pt.card.v1", null);
    const hasA = aCard && aCard.values && Object.values(aCard.values).some((x) => (x || "").trim());
    const form = $("#op-form"), ideasBox = $("#ideas"), saved = $("#op-saved");
    const fields = $$("[data-k]", form);
    let state = PT.store.get(KEY, null);
    if (!state) {
      state = { idea: (aCard && aCard.idea) || "own", values: {} };
      if (hasA && aCard.values.name) state.values.name = aCard.values.name;
    }

    // A 面体检卡
    const fromA = $("#from-a");
    if (hasA) {
      const a = aCard.values, esc = (s) => String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
      const rows = [["用户的原话", a.said], ["主要角色", a.role], ["具体场景", a.scene], ["现在怎么凑合", a.now], ["体检结论", [aCard.verdict, a.reason].filter(Boolean).join("：")]].filter((r) => (r[1] || "").trim());
      fromA.innerHTML = "<span>已读到你在 A 面写的体检卡：<b>" + esc(a.name || "我的点子") + "</b>。写一页纸时可以对照着看。</span>" +
        "<details><summary>展开 A 面的体检卡</summary><dl>" + rows.map((r) => "<dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd>").join("") + "</dl></details>";
    } else {
      fromA.innerHTML = '<span>没找到你在 A 面写的体检卡。可以先去 <a href="../a-side/#t05">A 面 Track 05</a> 写一张，也可以直接从这里开始。</span>';
    }

    Object.entries(IDEAS).forEach(([id, it]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "idea";
      b.dataset.id = id;
      b.innerHTML = "<b>" + it.title + "</b><span>" + it.desc + "</span>";
      b.addEventListener("click", () => { state.idea = id; paintIdea(); save(); });
      ideasBox.append(b);
    });
    function paintIdea() {
      $$(".idea", ideasBox).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === state.idea ? "true" : "false"));
      const ex = IDEAS[state.idea].ex;
      fields.forEach((f) => { f.placeholder = (state.idea === "own" ? "" : "示范：") + (ex[f.dataset.k] || ""); });
    }
    const fit = (ta) => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + 2 + "px"; };
    function load() {
      fields.forEach((f) => { f.value = state.values[f.dataset.k] || ""; });
      paintIdea();
      $$("textarea", form).forEach((ta) => requestAnimationFrame(() => fit(ta)));
    }
    let timer = 0;
    function save() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const ok = PT.store.set(KEY, state);
        const t = new Date();
        saved.textContent = ok ? "已自动保存 " + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0") : "这个浏览器存不了草稿，记得复制或下载";
      }, 350);
    }
    form.addEventListener("input", (e) => {
      const k = e.target.dataset && e.target.dataset.k;
      if (!k) return;
      state.values[k] = e.target.value;
      if (e.target.tagName === "TEXTAREA") fit(e.target);
      save();
    });

    const v = (k) => (state.values[k] || "").trim();
    const or = (k) => v(k) || "（待补充）";
    const sentence = () => (v("who") || v("when") || v("problem") || v("goal"))
      ? "为" + or("who") + "，在" + or("when") + "，解决" + or("problem") + "，让他们能" + or("goal") + "。"
      : "";
    const name = () => v("name") || IDEAS[state.idea].title;
    function rows() {
      return [
        { label: "一句话定义", text: sentence() },
        { label: "最先服务的人", text: v("first") },
        { label: "三个圈", text: [v("pain") && "用户最痛的点：" + v("pain"), v("weak") && "现有办法的弱点：" + v("weak"), v("edge") && "我的优势：" + v("edge")].filter(Boolean).join("\n") },
        { label: "唯一的核心功能", text: [v("core"), v("dropped") && "为此放弃：" + v("dropped")].filter(Boolean).join("\n") },
        { label: "不做清单", text: v("notdo") },
        { label: "口碑点", text: v("wow") },
        { label: "最小实验", text: v("test") }
      ];
    }
    function prompt() {
      return [
        "【背景】我是西语专业的学生，不会写代码，想请你帮我做一个小工具。",
        "【要做什么】" + name() + "：" + (sentence() || "（待补充）"),
        "【用户】" + or("first"),
        "【为什么从这里切入】用户最痛的点：" + or("pain") + "；现有办法的弱点：" + or("weak") + "；我的优势：" + or("edge") + "。",
        "【第一版只做这一个核心功能】" + or("core"),
        "【第一版暂时不要做】" + [v("dropped"), v("notdo")].filter(Boolean).join("；") + (v("dropped") || v("notdo") ? "" : "（待补充）") + "。请不要自作主张加功能。",
        "【希望用户愿意分享的地方】" + or("wow"),
        "【请先不要写代码】先用你自己的话复述你对这个工具的理解，再列出你的疑问。我们对齐之后，再开始做第一个版本。"
      ].join("\n\n");
    }
    $("#op-prompt").addEventListener("click", () => {
      $("#prompt-text").textContent = prompt();
      const out = $("#prompt-out");
      out.classList.add("show");
      out.scrollIntoView({ behavior: reduce() ? "auto" : "smooth", block: "nearest" });
    });
    $("#prompt-copy").addEventListener("click", async () => {
      const ok = await PT.copy($("#prompt-text").textContent);
      saved.textContent = ok ? "需求说明已复制，可以直接粘贴给 AI" : "复制没成功，请手动选中文字复制";
    });
    $("#op-png").addEventListener("click", async () => {
      try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
      const canvas = PT.cardImage({ kicker: "我的产品一页纸 · B 面", title: name(), rows: rows(), footer: "AI产品思维 · B 面 做选择" });
      PT.download(canvas, "产品一页纸-" + name() + ".png");
    });
    $("#op-copy").addEventListener("click", async () => {
      const text = "【我的产品一页纸】" + name() + "\n\n" + rows().map((r, i) => (i + 1) + ". " + r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
      const ok = await PT.copy(text);
      saved.textContent = ok ? "已复制，可以粘贴到任何地方" : "复制没成功，请手动选中文字复制";
    });
    const clearBtn = $("#op-clear");
    let armed = 0;
    clearBtn.addEventListener("click", () => {
      if (!armed) {
        clearBtn.textContent = "再点一次确认清空";
        armed = setTimeout(() => { armed = 0; clearBtn.textContent = "清空"; }, 3000);
        return;
      }
      clearTimeout(armed); armed = 0; clearBtn.textContent = "清空";
      state = { idea: state.idea, values: {} };
      load();
      $("#prompt-out").classList.remove("show");
      save();
    });
    load();
  })();

  // ============ 自测题 ============
  PT.quiz($("#quiz"), [
    {
      q: "需求池里，“加排行榜”被提了上千次，“导入歌单”只有几个人提。小明为什么先做导入歌单？",
      options: ["排行榜技术上太难做", "导入歌单同时打中了用户最痛的点、对手的弱点和自己的优势", "老板指定要做导入歌单"],
      answer: 1,
      why: "排行榜对手都有，显不出不同；导入歌单解决了换 App 最大的成本，对手的歌不能下载或要付费，网易云却能免费下载高品质音乐。"
    },
    {
      q: "下面哪一组是找切入点的“三个圈”？",
      options: ["用户最痛的点、对手的弱点、自己的优势", "价格、渠道、广告", "功能多、界面美、速度快"],
      answer: 0,
      why: "三样凑齐，才能用很小的成本撬动很大的结果。"
    },
    {
      q: "网易云最先服务的是哪群人？",
      options: ["所有用户，越多越好", "资深音乐爱好者：需求没被满足、能影响别人、还没有对手做好", "中老年用户，因为竞争少"],
      answer: 1,
      why: "这叫细分：先在一小群有影响力的人里站稳，再影响更多的人。"
    },
    {
      q: "第一版为什么只留歌单，连用户常用的排行榜都砍掉？",
      options: ["排行榜没人用", "让用户一打开就知道这是个以歌单为主的产品，核心一眼可见", "为了省服务器的钱"],
      answer: 1,
      why: "新产品功能一多，用户反而看不清它是干什么的。拿掉排行榜，产品照样能用：还有搜索和歌单。"
    },
    {
      q: "用户呼声很高的场景电台，网易云为什么一直没做？",
      options: ["技术上做不出来", "用户其实不需要", "它会抢走场景歌单的播放量，伤到做歌单的人，最后伤到整个歌单系统"],
      answer: 2,
      why: "这是往上层思考：把一个功能放进整个产品里看，看它会推倒什么。"
    },
    {
      q: "下面哪个功能最可能带来口碑？",
      options: ["把音效再优化一点", "支持微信登录", "在听歌之外，让人在评论里遇见有同样记忆的人"],
      answer: 2,
      why: "前两个和用户的基本感受在同一个维度上，用户觉得理所当然。评论区换了一个维度，差距一下子拉开了。"
    }
  ]);
})();
