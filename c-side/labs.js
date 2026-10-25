/* 第三课 · 收需求：各练习的内容与逻辑 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // ============ ① 渠道连连看 ============
  (function lab1() {
    const opts = {
      left: [
        { id: "app", html: "<b>产品内反馈</b>" },
        { id: "tieba", html: "<b>贴吧</b>" },
        { id: "weibo", html: "<b>微博</b>" },
        { id: "wechat", html: "<b>微信群</b>" },
        { id: "zhihu", html: "<b>知乎</b>" }
      ],
      right: [
        { id: "heavy", html: "重度用户多，爱之深、责之切" },
        { id: "young", html: "年龄偏低" },
        { id: "voice", html: "爱发表观点，偶尔有启发" },
        { id: "lively", html: "热闹，一点就能引出一串讨论" },
        { id: "deep", html: "会写长长的深度解析" }
      ],
      pairs: { app: "heavy", tieba: "young", weibo: "voice", wechat: "lively", zhihu: "deep" },
      hints: {
        app: "会在 App 里专门找到反馈入口的，多半是天天在用的人。",
        tieba: "贴吧里中学生不少。",
        weibo: "微博上人人都能发表看法，转来转去，偶尔冒出一个好点子。",
        wechat: "群里一个人提一句，马上有一串人接话。",
        zhihu: "知乎上的回答，常常一写就是几千字。"
      },
      onDone() { $("#reveal1").classList.add("show"); }
    };
    PT.matcher($("#matcher1"), opts);
    $("#lab1-reset").addEventListener("click", () => {
      $("#reveal1").classList.remove("show");
      PT.matcher($("#matcher1"), opts);
    });
  })();

  // ============ ② 一天的反馈 ============
  (function lab2() {
    const data = [
      { src: "产品内反馈", tx: "每日推荐连着三天都有同一首歌，能不能别重复了？", back: "天天看每日推荐的人才会发现重复。这是“发现音乐”那一环的真问题。" },
      { src: "老板 · 电梯里", tx: "我觉得首页应该放一个大大的排行榜。", back: "把老板当成一个普通用户：他想要的，也许是“一打开就知道听什么”。" },
      { src: "贴吧", tx: "垃圾 App！！！我收藏的歌找不到了！！！", back: "火气很大，可背后是“找不到歌”的麻烦：管理音乐那一环可能出了问题。" },
      { src: "微博", tx: "要是听歌的时候，能看到别人怎么评价这首歌就好了。", back: "这一条，后来长成了整个评论区。" },
      { src: "同事 · 午饭时随口一说", tx: "能不能把歌词做成一张图，分享到朋友圈？", back: "随口一说的点子，也是在说“想分享”。讨论和分享那一格，正缺这样的需求。" },
      { src: "知乎", tx: "从别的 App 换过来，最痛苦的是几百首收藏的歌带不过来。", back: "提的人不多，却说中了换 App 时最大的麻烦。下一首 Track 会再见到它。" },
      { src: "微信群", tx: "有没有夜间模式？晚上躺床上看，太亮了。", back: "群里一个人提，一串人跟着说“+1”。这是很多人都有的小麻烦。" },
      { src: "看起来很离谱", tx: "能不能让我养一只陪我听歌的电子宠物？", back: "现在看很离谱，但它说明有人想要“有个伴一起听”。时间和环境一变，也许就有用。" },
      { src: "朋友 · 饭桌上", tx: "你们的 App 太费流量了，我都不敢在外面听。", back: "朋友的抱怨也是需求。流量贵的时候，“下载下来没网也能听”就是大事。" },
      { src: "产品内反馈", tx: "又闪退了！！！第三次了！！！", back: "情绪越大，越可能指着一个真问题。先收下，再去查是哪台手机、哪一步。" },
      { src: "贴吧", tx: "求一个能和同学一起听同一首歌的功能。", back: "这是“一起听”的需求，和分享、陪伴都有关系。先放进池子里。" },
      { src: "路人 · 地铁上听到的", tx: "听歌软件不都差不多吗，有啥好选的。", back: "连“都差不多”也是信息：用户还没感觉到你和别人有什么不一样。" }
    ];
    const feed = $("#feed"), jarN = $("#jar-n"), left = $("#jar-left"), reveal = $("#reveal2");
    let i = 0, kept = 0, tossed = 0;
    function next() {
      if (i >= data.length) {
        left.textContent = "今天的反馈处理完了";
        $("#reveal2 .sum") && $("#reveal2 .sum").remove();
        const p = document.createElement("p");
        p.className = "sum";
        p.innerHTML = tossed
          ? "你删掉了 <b>" + tossed + "</b> 条，它们都被追了回来。"
          : "你一条都没删。这就对了。";
        reveal.insertBefore(p, reveal.children[1]);
        reveal.classList.add("show");
        return;
      }
      const d = data[i];
      const row = document.createElement("div");
      row.className = "fb";
      row.innerHTML = '<div><span class="src">' + esc(d.src) + '</span><div class="tx">' + esc(d.tx) + "</div></div>" +
        '<div class="acts"><button class="btn primary" type="button" data-a="keep">收进需求池</button><button class="btn" type="button" data-a="toss">删掉</button></div>';
      row.addEventListener("click", (e) => {
        const b = e.target.closest("button[data-a]");
        if (!b) return;
        const hadFocus = document.activeElement === b;
        const acts = $(".acts", row);
        if (b.dataset.a === "toss") {
          tossed += 1;
          const back = document.createElement("p");
          back.className = "back";
          back.innerHTML = "<b>追回来了：</b>" + esc(d.back);
          row.append(back);
        }
        acts.innerHTML = '<span class="src">' + (b.dataset.a === "toss" ? "↩ 已追回" : "✓ 已收下") + "</span>";
        row.classList.add("in-pool");
        kept += 1;
        jarN.textContent = kept;
        i += 1;
        left.textContent = i < data.length ? "还剩 " + (data.length - i) + " 条没处理" : "";
        next();
        const nb = $(".fb:last-child .btn.primary", feed);
        if (nb && hadFocus) nb.focus({ preventScroll: true });
      });
      feed.append(row);
    }
    function start() {
      feed.innerHTML = "";
      i = 0; kept = 0; tossed = 0;
      jarN.textContent = "0";
      left.textContent = "还剩 " + data.length + " 条没处理";
      reveal.classList.remove("show");
      next();
    }
    $("#lab2-reset").addEventListener("click", start);
    start();
  })();

  // ============ ③ 需求地图 ============
  (function lab3() {
    const bins = [
      { id: "make", label: "生产音乐" },
      { id: "find", label: "发现音乐" },
      { id: "keep", label: "管理音乐" },
      { id: "play", label: "听音乐" },
      { id: "share", label: "讨论 & 分享" },
      { id: "more", label: "音乐的其他消费" }
    ];
    const data = [
      { bin: "make", t: "独立音乐人想把自己写的歌传上来", hint: "这是做音乐的人的需求，在最前面那一环。" },
      { bin: "make", t: "翻唱的歌，想标上原唱是谁", hint: "这是发布一首歌时的事，属于生产音乐。" },
      { bin: "find", t: "每天推荐几首没听过、但会喜欢的歌", hint: "这是在帮用户找到新歌。" },
      { bin: "find", t: "想知道最近大家都在听什么", hint: "这是在找歌：看看别人在听什么。" },
      { bin: "find", t: "听到一首好歌，想找同一种风格的歌单", hint: "顺着一首歌找更多的歌，属于发现音乐。" },
      { bin: "keep", t: "把别的 App 里收藏的歌单搬过来", hint: "这是在整理自己已有的歌。" },
      { bin: "keep", t: "收藏的歌太多，想分文件夹", hint: "分文件夹是在管理已经收藏的歌。" },
      { bin: "keep", t: "把歌下载下来，没网也能听", hint: "下载是在把歌存到自己手里，属于管理音乐。" },
      { bin: "play", t: "音质想再好一点", hint: "音质好不好，是听的时候的体验。" },
      { bin: "play", t: "睡前听歌，想定时关闭", hint: "这是听的过程中的需求。" },
      { bin: "play", t: "歌词跟着歌声一句一句滚动", hint: "边听边看歌词，属于听音乐那一环。" },
      { bin: "share", t: "听到一首歌，想马上发给朋友", hint: "发给朋友，就是在分享。" },
      { bin: "share", t: "想看看别人听这首歌时，都想起了什么", hint: "看别人的感受、和别人交流，属于讨论 & 分享。" },
      { bin: "more", t: "想买喜欢的歌手的演唱会门票", hint: "演唱会是在 App 之外的消费。" },
      { bin: "more", t: "想买歌手的周边", hint: "周边也是音乐之外的消费。" }
    ];
    const root = $("#sorter3"), lab = $("#lab3"), reveal = $("#reveal3");
    const opts = {
      items: data.map((d, i) => ({ id: "n" + i, bin: d.bin, hint: d.hint, html: '<div class="need">' + esc(d.t) + "</div>" })),
      bins,
      binsClass: "six",
      onDone() {
        lab.classList.add("revealed");
        const share = $('.bin[data-bin="share"]', root);
        share && share.classList.add("glow");
        reveal.classList.add("show");
      }
    };
    PT.sorter(root, opts);
    $("#lab3-reset").addEventListener("click", () => {
      lab.classList.remove("revealed");
      root.classList.remove("revealed");
      reveal.classList.remove("show");
      PT.sorter(root, opts);
    });
  })();

  // ============ ④ 长尾淘金 ============
  (function lab4() {
    const HEAD = 12; // 前 12 条是热门需求，后面是长尾
    const data = [
      { t: "排行榜", n: 2400 },
      { t: "音质更好", n: 1500 },
      { t: "歌更全", n: 1100 },
      { t: "每日推荐更准", n: 820 },
      { t: "夜间模式", n: 600 },
      { t: "下载更快", n: 450 },
      { t: "歌词滚动", n: 340 },
      { t: "定时关闭", n: 260 },
      { t: "桌面歌词", n: 200 },
      { t: "换皮肤", n: 150 },
      { t: "均衡器", n: 110 },
      { t: "分享到朋友圈", n: 80 },
      { t: "播放器里加天气预报", n: 40, why: "离题了：和听音乐没什么关系。" },
      { t: "把正在听的歌设成手机铃声", n: 26, why: "不错，但不是什么大麻烦。" },
      { t: "支持更多冷门音频格式", n: 18, why: "受众太小，对手也随时能做。" },
      { t: "歌曲按节拍快慢排序", n: 12, why: "只有少数人用得上。" },
      { t: "摇一摇，换一首", n: 9, why: "好玩，但对手很容易照着做。" },
      { t: "看看别人听这首歌时，都想起了什么", n: 7, gold: true },
      { t: "给歌单换一张封面", n: 5, why: "一个小修补，不是大麻烦。" },
      { t: "自动跳过前奏", n: 4, why: "有人喜欢，但不痛不痒。" },
      { t: "把别的 App 里收藏的歌单导进来", n: 3, gold: true },
      { t: "听歌时显示歌手的星座", n: 3, why: "离题了，和找歌、听歌都没关系。" },
      { t: "唱片转动的动画更逼真", n: 2, why: "好看，但没解决什么麻烦。" },
      { t: "用方言播报歌名", n: 1, why: "受众太小。" }
    ];
    const tail = $("#tail"), info = $("#tail-info"), pickBtn = $("#pick-btn"), revealBtn = $("#reveal-btn"), reveal = $("#reveal4");
    const slots = [$("#pick0"), $("#pick1")];
    const max = data[0].n;
    let cur = -1, picks = [], revealed = false;
    const bars = [];

    const zone = document.createElement("div");
    zone.className = "zone";
    zone.innerHTML = "<span>长尾</span>";
    tail.append(zone);
    data.forEach((d, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-pressed", "false");
      b.setAttribute("aria-label", (i + 1) + "：" + d.t + "，被提 " + d.n + " 次");
      b.innerHTML = '<i style="height:' + (d.n / max * 100).toFixed(2) + '%"></i>';
      b.addEventListener("click", () => select(i));
      tail.append(b);
      bars.push(b);
    });
    // 长尾区域从第 HEAD 根柱子开始（柱宽 =（容器宽 − 左右各 4px − 柱间 4px）÷ 柱数）
    zone.style.left = "calc(2px + " + HEAD + " * ((100% - " + (8 + 4 * (data.length - 1)) + "px) / " + data.length + " + 4px))";

    function select(i) {
      cur = i;
      bars.forEach((b, k) => b.setAttribute("aria-pressed", k === i ? "true" : "false"));
      const d = data[i];
      let why;
      if (i < HEAD) why = "热门需求：要做好，可对手早就做了，很难靠它突围。";
      else if (!revealed) why = "长尾需求：提的人少。它是不是金子？用三条标准判断。";
      else why = d.gold ? "金子：被提得很少，却说中了用户的大麻烦，别人也很难照搬。" : d.why;
      info.innerHTML = "<b>" + esc(d.t) + '</b><span class="meta2">被提 ' + PT.fmt(d.n) + ' 次</span><p class="why">' + why + "</p>";
      pickBtn.disabled = revealed || picks.length >= 2 || picks.includes(i);
    }
    pickBtn.addEventListener("click", () => {
      if (cur < 0 || picks.length >= 2 || picks.includes(cur)) return;
      if (cur < HEAD) {
        info.querySelector(".why").textContent = "这根在头部，是热门需求。金子要去右边的长尾里找。";
        return;
      }
      picks.push(cur);
      paint();
    });
    slots.forEach((s, k) => s.addEventListener("click", () => {
      if (revealed || picks[k] === undefined) return;
      picks.splice(k, 1);
      paint();
    }));
    function paint() {
      slots.forEach((s, k) => {
        const p = picks[k];
        s.classList.toggle("filled", p !== undefined);
        s.disabled = p === undefined || revealed;
        s.textContent = p !== undefined ? "★ " + data[p].t : "金子 " + (k + 1);
        if (p !== undefined && !revealed) s.title = "点一下，放回去";
      });
      bars.forEach((b, i) => b.classList.toggle("picked", picks.includes(i)));
      pickBtn.disabled = revealed || picks.length >= 2 || cur < 0 || picks.includes(cur);
      revealBtn.disabled = revealed || picks.length < 2;
    }
    revealBtn.addEventListener("click", () => {
      revealed = true;
      const hit = picks.filter((p) => data[p].gold).length;
      bars.forEach((b, i) => { b.classList.remove("picked"); b.classList.toggle("gold", !!data[i].gold); });
      $("#reveal4-h").textContent = hit === 2 ? "两块都淘中了" : hit === 1 ? "淘中了一块" : "这两块不是金子";
      reveal.classList.add("show");
      paint();
      if (cur >= 0) select(cur);
    });
    $("#lab4-reset").addEventListener("click", () => {
      revealed = false; picks = []; cur = -1;
      bars.forEach((b) => { b.classList.remove("gold", "picked"); b.setAttribute("aria-pressed", "false"); });
      info.innerHTML = '<span class="lab-hint" style="margin:0">点任意一根柱子。</span>';
      reveal.classList.remove("show");
      paint();
    });
    paint();
  })();

  // ============ ⑤ 下个版本 ============
  (function lab5() {
    const data = [
      { bin: "fix", t: "播放列表一滑就卡", d: 3, hint: "这是把已有的功能修顺。" },
      { bin: "fix", t: "下载到一半断网，要从头再下", d: 4, hint: "下载早就有了，这是在修它的毛病。" },
      { bin: "fix", t: "歌词和歌声对不上", d: 3, hint: "歌词功能已经有了，这是修补。" },
      { bin: "star", t: "一键导入别的 App 里的歌单", d: 6, hint: "这是这一版拿出去最值得说的东西。" },
      { bin: "star", t: "每日推荐 30 首", d: 6, hint: "这是这一版的大招，用户一打开就能感觉到。" },
      { bin: "long", t: "评论区：每首歌下面都能留言", d: 8, hint: "评论一开始没多少人用，是在为以后的社区攒力量。" },
      { bin: "long", t: "歌单广场：用户自己做歌单给别人听", d: 6, hint: "要等很多人做歌单，才看得出效果。这是长远布局。" },
      { bin: "long", t: "邀请独立音乐人入驻", d: 5, hint: "音乐人要一个个请来，一两年后才见效。" },
      { bin: "long", t: "给歌打上风格标签，攒下以后做推荐用的数据", d: 3, hint: "现在看不出用处，是在为以后的推荐攒数据。" }
    ];
    const root = $("#sorter5"), sEl = $("#r-short"), lEl = $("#r-long"), bar = $("#r-bar"), note = $("#r-note");
    let short = 0, long = 0;
    const total = data.length;
    let placed = 0;
    function paint() {
      sEl.textContent = short;
      lEl.textContent = long;
      bar.style.width = (short + long ? short / (short + long) * 100 : 50) + "%";
      if (!placed) note.textContent = "";
      else if (placed === total) note.textContent = "眼前 " + short + " 人天，长远 " + long + " 人天，正好一比一。评论区就是这样攒出来的：刚上线时没火，攒够了才爆发。";
      else if (!long) note.textContent = "天平全倒向眼前了。小明的规矩：眼前和长远，精力至少一比一。";
      else if (short > long) note.textContent = "眼前的还多一些，长远布局还不够。";
      else note.textContent = "长远布局追上来了。";
    }
    const opts = {
      items: data.map((d, i) => ({ id: "v" + i, bin: d.bin, hint: d.hint, html: '<div class="need">' + esc(d.t) + '<small style="display:block;color:var(--muted);font:500 12px/1.6 var(--mono)">约 ' + d.d + " 人天</small></div>" })),
      bins: [{ id: "fix", label: "体验修补" }, { id: "star", label: "主打亮点" }, { id: "long", label: "长远布局" }],
      binsClass: "three",
      onPlace(it, bin) {
        const d = data[+it.id.slice(1)].d;
        if (bin === "long") long += d; else short += d;
        placed += 1;
        paint();
      }
    };
    function start() { short = long = placed = 0; paint(); PT.sorter(root, opts); }
    $("#lab5-reset").addEventListener("click", () => { root.classList.remove("revealed"); start(); });
    start();
  })();

  // ============ ⑥ 我的需求池 ============
  (function lab6() {
    const KEY = "pt.pool.v1";
    const SRC = ["自己想的", "访谈同学", "网上评论", "老师或家人", "其他"];
    const KIND = [["fix", "体验修补"], ["star", "主打亮点"], ["long", "长远布局"], ["later", "先放着"]];
    const IDEAS = {
      own: {
        title: "我自己的点子", desc: "比如你在 Vibe Coding 课上设计的小工具",
        stages: ["第一次听说", "第一次用", "每次用的时候", "用完以后", "推荐给别人"],
        ex: ["它解决的第一个麻烦", "朋友会怎么跟别人介绍它", "第一次打开时最想看到什么", "用的时候最常卡在哪一步", "用完以后想留下什么", "什么情况下会再打开它", "有人在网上抱怨过的类似问题", "一个现在看有点离谱的想法"]
      },
      essay: {
        title: "AI 西语作文批改", desc: "“我想要一个能帮我改西语作文的 AI。”",
        stages: ["写之前", "写的时候", "改的时候", "交之后", "复盘"],
        ex: ["写之前想看几篇同题目的范文", "写的时候查不到合适的连接词", "性数配合的错误要标出来", "虚拟式用错了要讲清楚为什么", "老师打回来的作文，想看改了哪里", "想知道自己最常错的是哪一类", "期末前想把错过的句子再练一遍", "想把写得好的句子收藏起来"]
      },
      mail: {
        title: "外贸西语邮件助手", desc: "“我想要一个帮我写西语外贸邮件的工具。”",
        stages: ["收到询价", "写回复", "检查语气", "发出之后", "跟进"],
        ex: ["客户来信先帮我看懂重点", "报价邮件想要现成的结构", "usted 还是 tú 帮我判断", "墨西哥和西班牙客户的说法不一样", "发之前查一遍礼貌用语", "客户三天没回，提醒我跟进", "常用的句子能存成模板", "老同事改过的地方想记下来"]
      },
      buddy: {
        title: "西语角语伴匹配", desc: "“我想找个拉美同学练口语。”",
        stages: ["找语伴", "约时间", "聊的时候", "聊完以后", "长期坚持"],
        ex: ["想按空闲时间找人", "想知道对方是哪个国家的口音", "第一次聊不知道说什么", "聊的时候卡壳想看提示", "聊完想记下新学的说法", "对方也想练中文，要公平", "聊了两次就断了怎么办", "想找固定的语伴每周聊"]
      }
    };
    const rowsBox = $("#rows"), stagesBox = $("#stages"), ideasBox = $("#ideas"), saved = $("#pool-saved"), nameIn = $("#p-name");
    const blank = () => ({ t: "", src: "", st: "", kind: "" });
    function fresh(idea) {
      return { idea, name: "", stages: IDEAS[idea].stages.slice(), rows: Array.from({ length: 8 }, blank), gem: -1 };
    }
    let state = PT.store.get(KEY, null);
    if (!state || !IDEAS[state.idea] || !Array.isArray(state.rows)) {
      // 默认沿用 A 面需求体检卡选过的点子和名字
      const card = PT.store.get("pt.card.v1", null);
      const idea = card && IDEAS[card.idea] ? card.idea : "own";
      state = fresh(idea);
      if (card && card.values && card.values.name) state.name = card.values.name;
    }

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
        render();
        save();
      });
      ideasBox.append(b);
    });

    function renderStages() {
      stagesBox.innerHTML = "";
      state.stages.forEach((s, k) => {
        const inp = document.createElement("input");
        inp.type = "text";
        inp.value = s;
        inp.maxLength = 12;
        inp.setAttribute("aria-label", "环节 " + (k + 1));
        inp.placeholder = IDEAS[state.idea].stages[k];
        inp.addEventListener("input", () => {
          state.stages[k] = inp.value.trim();
          $$('select[data-k="st"]', rowsBox).forEach((sel) => { sel.options[k + 1].textContent = stageName(k); });
          save();
        });
        stagesBox.append(inp);
      });
    }
    const stageName = (k) => state.stages[k] || "环节 " + (k + 1);

    function select(key, label, list, val) {
      const s = document.createElement("select");
      s.dataset.k = key;
      s.setAttribute("aria-label", label);
      s.innerHTML = '<option value="">' + label + "</option>" + list.map(([v, t]) => '<option value="' + v + '">' + esc(t) + "</option>").join("");
      s.value = val || "";
      return s;
    }
    function renderRows() {
      rowsBox.innerHTML = "";
      const ex = IDEAS[state.idea].ex;
      state.rows.forEach((r, i) => {
        const row = document.createElement("div");
        row.className = "prow";
        row.dataset.i = i;
        const n = document.createElement("span");
        n.className = "n";
        n.textContent = String(i + 1).padStart(2, "0");
        const inp = document.createElement("input");
        inp.type = "text";
        inp.dataset.k = "t";
        inp.value = r.t;
        inp.setAttribute("aria-label", "需求 " + (i + 1));
        inp.placeholder = ex[i] ? (state.idea === "own" ? "" : "示范：") + ex[i] : "再写一条需求";
        const sel3 = document.createElement("div");
        sel3.className = "sel3";
        sel3.append(
          select("src", "来源", SRC.map((s) => [s, s]), r.src),
          select("st", "环节", state.stages.map((s, k) => [String(k), stageName(k)]), r.st),
          select("kind", "下个版本", KIND, r.kind)
        );
        const gem = document.createElement("button");
        gem.type = "button";
        gem.className = "gem";
        gem.textContent = "★";
        gem.title = "标成长尾里的金子";
        gem.setAttribute("aria-label", "把第 " + (i + 1) + " 条标成长尾里的金子");
        gem.setAttribute("aria-pressed", state.gem === i ? "true" : "false");
        row.append(n, inp, sel3, gem);
        rowsBox.append(row);
      });
    }
    rowsBox.addEventListener("input", (e) => {
      const row = e.target.closest(".prow");
      const k = e.target.dataset.k;
      if (!row || !k) return;
      state.rows[+row.dataset.i][k] = e.target.value;
      check();
      save();
    });
    rowsBox.addEventListener("change", (e) => {
      if (e.target.tagName === "SELECT") { check(); save(); }
    });
    rowsBox.addEventListener("click", (e) => {
      const g = e.target.closest(".gem");
      if (!g) return;
      const i = +g.closest(".prow").dataset.i;
      state.gem = state.gem === i ? -1 : i;
      $$(".gem", rowsBox).forEach((b, k) => b.setAttribute("aria-pressed", state.gem === k ? "true" : "false"));
      check();
      save();
    });
    $("#add-row").addEventListener("click", () => {
      if (state.rows.length >= 20) return;
      state.rows.push(blank());
      renderRows();
      $$('.prow input[data-k="t"]', rowsBox).pop().focus();
      save();
    });
    nameIn.addEventListener("input", () => { state.name = nameIn.value; save(); });

    const filled = () => state.rows.map((r, i) => ({ ...r, i })).filter((r) => r.t.trim());
    function check() {
      const f = filled();
      let s = 0, l = 0;
      f.forEach((r) => { if (r.kind === "long") l += 1; else if (r.kind === "fix" || r.kind === "star") s += 1; });
      $("#m-short").textContent = s;
      $("#m-long").textContent = l;
      $("#m-bar").style.width = (s + l ? s / (s + l) * 100 : 50) + "%";
      const srcs = new Set(f.map((r) => r.src).filter(Boolean)).size;
      const todo = [];
      if (f.length < 8) todo.push("再写 " + (8 - f.length) + " 条需求");
      if (srcs < 2) todo.push("来源再多一种");
      if (f.some((r) => r.st === "")) todo.push("给每条选一个环节");
      if (state.gem < 0 || !(state.rows[state.gem] && state.rows[state.gem].t.trim())) todo.push("标一块 ★ 金子");
      if (s && l < s) todo.push("长远布局还不到一比一");
      $("#m-note").textContent = todo.length ? "还差：" + todo.join("；") + "。" : "齐了：" + f.length + " 条需求，来自 " + srcs + " 种渠道，眼前和长远一比一。";
    }

    function render() {
      $$(".idea", ideasBox).forEach((b) => b.setAttribute("aria-pressed", b.dataset.id === state.idea ? "true" : "false"));
      nameIn.value = state.name || "";
      nameIn.placeholder = state.idea === "own" ? "给你的小工具起个名字" : "示范：" + IDEAS[state.idea].title;
      renderStages();
      renderRows();
      check();
    }

    let timer = 0;
    // 关页面前，把还没来得及存的改动存上
    addEventListener("pagehide", () => { if (timer) { clearTimeout(timer); timer = 0; PT.store.set(KEY, state); } });
    function save() {
      clearTimeout(timer);
      timer = setTimeout(() => {
        timer = 0;
        const ok = PT.store.set(KEY, state);
        const t = new Date();
        saved.textContent = ok ? "已自动保存 " + String(t.getHours()).padStart(2, "0") + ":" + String(t.getMinutes()).padStart(2, "0") : "这个浏览器存不了草稿，记得复制或下载";
      }, 350);
    }

    const title = () => (state.name || "").trim() || IDEAS[state.idea].title;
    const kindName = (k) => (KIND.find(([v]) => v === k) || [, ""])[1];
    function sections() {
      const f = filled();
      const out = [];
      state.stages.forEach((s, k) => {
        const list = f.filter((r) => r.st === String(k));
        if (list.length) out.push({ label: stageName(k), text: list.map(line).join("\n") });
      });
      const none = f.filter((r) => r.st === "");
      if (none.length) out.push({ label: "还没归到环节", text: none.map(line).join("\n") });
      const gem = state.gem >= 0 && state.rows[state.gem] && state.rows[state.gem].t.trim();
      out.push({ label: "长尾里的金子", text: gem ? "★ " + gem : "" });
      const plan = KIND.slice(0, 3).map(([v, t]) => {
        const list = f.filter((r) => r.kind === v).map((r) => r.t.trim());
        return list.length ? t + "：" + list.join("、") : "";
      }).filter(Boolean).join("\n");
      out.push({ label: "下个版本", text: plan });
      return out;
    }
    function line(r) {
      const tags = [r.src, kindName(r.kind)].filter(Boolean).join(" · ");
      return (state.gem === r.i ? "★ " : "· ") + r.t.trim() + (tags ? "（" + tags + "）" : "");
    }
    $("#pool-png").addEventListener("click", async () => {
      try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
      const canvas = PT.cardImage({
        kicker: "需求池 · C 面",
        title: title(),
        rows: sections(),
        footer: "AI产品思维 · C 面 收需求"
      });
      PT.download(canvas, "需求池-" + title() + ".png");
    });
    $("#pool-copy").addEventListener("click", async () => {
      const text = "【需求池】" + title() + "\n\n" + sections().map((r) => "■ " + r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
      const ok = await PT.copy(text);
      saved.textContent = ok ? "已复制，可以粘贴到任何地方" : "复制没成功，请手动选中文字复制";
    });
    const clearBtn = $("#pool-clear");
    let armed = 0;
    clearBtn.addEventListener("click", () => {
      if (!armed) {
        clearBtn.textContent = "再点一次确认清空";
        armed = setTimeout(() => { armed = 0; clearBtn.textContent = "清空"; }, 3000);
        return;
      }
      clearTimeout(armed); armed = 0; clearBtn.textContent = "清空";
      state = fresh(state.idea);
      render();
      save();
    });
    render();
  })();

  // ============ 自测题 ============
  PT.quiz($("#quiz"), [
    {
      q: "小明每天花一个小时看用户反馈，用户多了也没停。这件事最大的收获是？",
      options: ["能及时删掉没用的意见", "看到不同渠道里不同的用户；认真回应，还攒下了口碑", "可以统计哪个需求被提得最多，直接照着做"],
      answer: 1,
      why: "不同渠道的用户各不一样，只看一个渠道就只听到一种声音。团队认真回复，用户也愿意逢人推荐。"
    },
    {
      q: "老板在电梯里说：“首页应该放一个大大的排行榜。”你和老板关系一般，应该？",
      options: ["先不管，老板的需求一般不靠谱", "先收进需求池，把老板当成一个普通用户来分析", "马上照做"],
      answer: 1,
      why: "收需求时要把需求和提需求的人分开。老板也是用户，先收下，判断留到后面。"
    },
    {
      q: "按用户的使用环节理需求，最大的好处是？",
      options: ["需求的数量变少了", "看清产品怎样一步步影响用户，还能发现没人做的空格子", "每个环节可以分给一个人负责"],
      answer: 1,
      why: "网易云理完六个环节，才看清“讨论和分享”那一格几乎没人做。"
    },
    {
      q: "导入歌单当年被提的次数，比排行榜少了成百上千倍。这说明？",
      options: ["被提得少的需求不值得做", "只按被提的次数排需求，可能错过最关键的机会", "排行榜没有用"],
      answer: 1,
      why: "热门需求对手早就做了。次数只说明多少人提，说明不了值不值得做。"
    },
    {
      q: "下面哪一条最像“长远布局”？",
      options: ["修好下载到一半断网就要重下的问题", "这一版主打的一键导入歌单", "上线评论区：现在还没多少人用，但在为以后的社区攒力量"],
      answer: 2,
      why: "第一条是体验修补，第二条是主打亮点。长远布局现在看不出效果，要靠一两年攒出来。"
    },
    {
      q: "你要给“AI 西语作文批改”收需求。下面哪种做法最好？",
      options: ["只问自己宿舍的同学", "自己想的、访谈同学、网上评论、问老师都收，再按“写之前、写的时候、改的时候……”理一遍", "先统计哪个功能被提得最多，只做那一个"],
      answer: 1,
      why: "渠道越多看到的用户越全；按环节理清，才看得出哪一格还空着。"
    }
  ]);
})();
