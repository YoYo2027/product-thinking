/* 第一课 · 看见人：各练习的内容与逻辑 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // ============ ① 评论分拣 ============
  (function lab1() {
    const C = ["#A9472E", "#1E2235", "#2E5E5A", "#8C6A3F", "#5E5A8C"];
    const heart = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.5 1.1 4.3 2.4.8-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>';
    const data = [
      { id: "s1", bin: "song", who: "晚风", likes: 12, txt: "前奏的钢琴一出来就知道稳了，编曲太高级。", hint: "这条在夸编曲，说的是歌本身。" },
      { id: "s2", bin: "song", who: "橘子汽水", likes: 26, txt: "副歌那一下转调，鸡皮疙瘩全起来了。", hint: "转调、副歌，都是在评价这首歌。" },
      { id: "s3", bin: "song", who: "Sol", likes: 8, txt: "这唱功，现场应该更炸。", hint: "唱功是歌手的事，不是写评论的人自己的事。" },
      { id: "s4", bin: "song", who: "阿北北", likes: 41, txt: "单曲循环第 37 遍，越听越上头。", hint: "这条只说了“好听、爱听”，没有讲自己的经历。" },
      { id: "s5", bin: "song", who: "木子", likes: 19, txt: "歌词写得很克制，没有一句在喊疼。", hint: "这条在评价歌词写得好不好。" },
      { id: "m1", bin: "self", who: "小满", likes: 21400, txt: "高三晚自习，同桌分我一只耳机，听的就是这首。后来她去了北京，我留在杭州。", hint: "这条里有一段自己的经历：高三、同桌、分开。" },
      { id: "m2", bin: "self", who: "海盐", likes: 8640, txt: "小时候爸爸骑车载我去外婆家，车筐里的收音机放的就是它。", hint: "这条在讲童年的一段记忆。" },
      { id: "m3", bin: "self", who: "Kiko", likes: 13200, txt: "出国前一晚收拾行李，正好放到这首，突然就不想走了。", hint: "这条在讲自己出国前的那一晚。" },
      { id: "m4", bin: "self", who: "默默", likes: 5212, txt: "第一次一个人在外地过年，宿舍楼就剩我一个。外卖到的时候，正好放到副歌。", hint: "这条在讲自己一个人过年的经历。" },
      { id: "m5", bin: "self", who: "Lumi", likes: 34000, txt: "分手那天坐出租车，司机的电台放了这首。我忍到下车才哭。", hint: "这条在讲自己分手那天。" }
    ];
    const items = data.map((d, i) => ({
      id: d.id, bin: d.bin, hint: d.hint,
      html: '<div class="cmt"><span class="av" style="--c:' + C[i % C.length] + '">' + d.who.slice(0, 1) + '</span>' +
        '<div><div class="who">' + d.who + '</div><div class="txt">' + d.txt + '</div>' +
        '<span class="like">' + heart + '<span data-likes="' + d.likes + '">0</span></span></div></div>'
    }));
    const root = $("#sorter1"), lab = $("#lab1"), reveal = $("#reveal1");
    const opts = {
      items,
      bins: [{ id: "song", label: "在评价这首歌" }, { id: "self", label: "在讲自己的故事" }],
      onDone() {
        lab.classList.add("revealed");
        reveal.classList.add("show");
        $$("[data-likes]", root).forEach((n) => PT.countUp(n, +n.dataset.likes, 1400));
      }
    };
    PT.sorter(root, opts);
    $("#lab1-reset").addEventListener("click", () => {
      lab.classList.remove("revealed");
      root.classList.remove("revealed");
      reveal.classList.remove("show");
      PT.sorter(root, opts);
    });
  })();

  // ============ ② 访谈侦探 ============
  (function lab2() {
    const CRIT = {
      lead: "引导式提问：问题里已经藏着答案，她只能顺着你说。",
      yes: "是非题：只能换来一个“是”或“还行”，你什么也没多知道。"
    };
    const claims = [
      {
        said: "我是许嵩的老粉了，喜欢他五六年。",
        short: "老粉，喜欢五六年",
        real: "被同学带着喜欢上的，更爱的是歌",
        opts: [
          { k: "good", q: "还记得第一次听他的歌是什么时候吗？当时是怎么听到的？", a: "初中时被同桌带着听的。同桌是铁杆粉丝，班里好几个人都是被她带入坑的。她自己更喜欢的是他的歌：特立独行、积极向上，能给自己打气，而不是他这个人。" },
          { k: "lead", q: "你一定特别爱他吧？", a: "“嗯，挺喜欢的。”" },
          { k: "yes", q: "你是老粉吗？", a: "“是啊。”" }
        ]
      },
      {
        said: "他的专辑我从第一张就开始买。",
        short: "每张专辑都买",
        real: "每张只买一张，会算算钱",
        opts: [
          { k: "good", q: "每张专辑你一般买几张？最近一次是什么时候买的？", a: "每张只买一张。她不太理解有人一买好几十张来支持偶像，她会算算钱。" },
          { k: "lead", q: "买了这么多张，花了不少钱吧？", a: "“还好吧……”" },
          { k: "yes", q: "每一张都买了吗？", a: "“差不多。”" }
        ]
      },
      {
        said: "我去过他的歌友会和演唱会。",
        short: "去过歌友会和演唱会",
        real: "只去离家近的，从不堵酒店",
        opts: [
          { k: "good", q: "去过几场？都在哪个城市？那天是怎么过的？", a: "只去过几场，都在离家近的城市，远的不去：要花钱，家里也不放心。见到偶像、要到签名很激动，但没去酒店堵人，她觉得那样不礼貌。" },
          { k: "lead", q: "你应该每场都去吧？", a: "“能去就去……”" },
          { k: "yes", q: "演唱会好看吗？", a: "“好看！”" }
        ]
      },
      {
        said: "我在他的粉丝 QQ 群里。",
        short: "在粉丝群里",
        real: "基本潜水，只用来收消息",
        opts: [
          { k: "good", q: "平时在群里一般做些什么？上一次说话是什么时候？", a: "她在群里很少说话，只和几个熟悉的群友私聊。群主要用来收消息：什么时候出新专辑、什么时候有演出、什么时候一起去刷榜。" },
          { k: "lead", q: "群里一定很热闹吧？", a: "“挺热闹的。”" },
          { k: "yes", q: "你常在群里聊天吗？", a: "“还行。”" }
        ]
      },
      {
        said: "他的周边我也买过。",
        short: "买过周边",
        real: "十块钱的地摊钥匙扣",
        opts: [
          { k: "good", q: "买过什么？在哪儿买的？多少钱？", a: "一个钥匙扣，十块钱左右，地摊上买的。她不在意是不是官方出的，买的时候开心，挂在身边也开心。" },
          { k: "lead", q: "官方周边挺贵的吧？", a: "“还好……”" },
          { k: "yes", q: "周边你喜欢吗？", a: "“喜欢。”" }
        ]
      }
    ];
    const box = $("#claims"), reveal = $("#reveal2");

    function render() {
      box.innerHTML = "";
      reveal.classList.remove("show");
      let solved = 0;
      claims.forEach((c) => {
        const card = document.createElement("div");
        card.className = "claim";
        card.innerHTML = '<div class="said"><span class="av">她</span><p>' + c.said + '</p></div>' +
          '<div class="ask"><p class="lbl">你追问：</p><div class="choices"></div></div><div class="answer" aria-live="polite"></div>';
        const ch = $(".choices", card), ans = $(".answer", card);
        shuffle(c.opts.slice()).forEach((o) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "choice";
          b.textContent = o.q;
          b.addEventListener("click", () => {
            ans.className = "answer show " + (o.k === "good" ? "good" : "meh");
            if (o.k === "good") {
              ans.innerHTML = "<b>追问后：</b>" + o.a + '<span class="crit" style="color:var(--ok)">好追问：问具体经过、时间、数字，她就得讲真实发生的事。</span>';
              card.classList.add("solved");
              solved += 1;
              if (solved === claims.length) finish();
            } else {
              b.disabled = true;
              b.classList.add("wrong");
              ans.innerHTML = "她说：" + o.a + '<span class="crit">' + CRIT[o.k] + " 再换一个问法。</span>";
            }
          });
          ch.append(b);
        });
        box.append(card);
      });
    }
    function finish() {
      $("#compare").innerHTML =
        '<div><h5>她自己说的</h5><ul>' + claims.map((c) => "<li>" + c.short + "</li>").join("") + '</ul><p class="verdict" style="color:var(--muted)">看起来：狂热粉丝</p></div>' +
        '<div><h5>追问后的她</h5><ul>' + claims.map((c) => "<li>" + c.real + "</li>").join("") + '</ul><p class="verdict" style="color:var(--ok)">其实：喜欢多年，但不是狂热粉</p></div>';
      reveal.classList.add("show");
    }
    render();
    $("#lab2-reset").addEventListener("click", render);
  })();

  // ============ ③ 剥洋葱 + 跑步题 ============
  (function lab3() {
    const motives = [
      { t: "想被看见", q: "我在这儿泡了这么久，总得有点东西能亮出来吧。" },
      { t: "想重新找回动力", q: "用了好几年，新鲜劲早过了。有个目标去攒，也许能找回点劲头。" },
      { t: "收集癖", q: "不管有没有用，凑齐了我才舒服。" },
      { t: "想换点实际好处", q: "攒了这么多，能换点官方周边吗？" },
      { t: "觉得好看、新鲜", q: "头像旁边挂一排小图标，好看。" }
    ];
    const onion = $("#onion"), list = $("#motives"), left = $("#onion-left"), ask = $("#ask3"), reveal = $("#reveal3");
    const rings = $$(".ring", onion);
    let n = 0;
    const placeholder = list.innerHTML;

    function reset() {
      n = 0;
      rings.forEach((r) => r.classList.remove("gone"));
      list.innerHTML = placeholder;
      left.textContent = "还有 5 层";
      onion.disabled = false;
      ask.classList.remove("show");
      reveal.classList.remove("show");
      $$(".choice", ask).forEach((b) => { b.disabled = false; b.classList.remove("picked"); });
    }
    onion.addEventListener("click", () => {
      if (n >= motives.length) return;
      if (n === 0) list.innerHTML = "";
      rings[n].classList.add("gone");
      const m = motives[n];
      const li = document.createElement("li");
      li.innerHTML = '<span class="k">' + (n + 1) + '</span><div><b>' + m.t + '</b><q>' + m.q + '</q></div>';
      list.append(li);
      n += 1;
      left.textContent = n < motives.length ? "还有 " + (motives.length - n) + " 层" : "剥完了";
      if (n === motives.length) { onion.disabled = true; ask.classList.add("show"); }
    });
    $$(".choice", ask).forEach((b) => b.addEventListener("click", () => {
      $$(".choice", ask).forEach((x) => { x.disabled = true; });
      b.classList.add("picked");
      $("#reveal3-h").textContent = b.dataset.v === "yes" ? "小明的判断正好相反：不做" : "和小明想的一样：不一定要做";
      reveal.classList.add("show");
    }));
    $("#lab3-reset").addEventListener("click", reset);
    $("#run-open").addEventListener("click", () => $("#reveal3b").classList.add("show"));
  })();

  // ============ ④ 拆 AA 收款 ============
  (function lab4() {
    const steps = PT.steps($("#aa-steps"));
    const roleBox = $("#aa-role"), roleWhy = $("#aa-role-why"), next1 = $("#aa-next1"), next2 = $("#aa-next2");

    // 角色
    $$(".choice", roleBox).forEach((b) => b.addEventListener("click", () => {
      $$(".choice", roleBox).forEach((x) => {
        x.disabled = true;
        if (x.dataset.v === "payee") x.classList.add("right");
        else if (x === b) x.classList.add("wrong");
      });
      roleWhy.classList.add("show");
      next1.disabled = false;
    }));
    $$(".role", roleWhy).forEach((r) => r.addEventListener("click", () => {
      r.setAttribute("aria-expanded", r.getAttribute("aria-expanded") === "true" ? "false" : "true");
    }));
    next1.addEventListener("click", () => { steps.done(0); steps.unlock(1); steps.go(1); paintScene(+range.value, true); });

    // 场景：天平
    const range = $("#aa-time"), cap = $("#aa-caption"), sceneWhy = $("#aa-scene-why");
    const captions = [
      "大家都还在桌边。一个人买了单，其他人当场就转钱：不给的话，显得不合群。这时收款方说了算。",
      "回到宿舍，饭桌上的那点压力已经散了，没人急着转钱。",
      "第二天，钱还没收齐。要不要提醒一下？好像显得自己小气。",
      "三天后，收款方开始琢磨怎么开口，付款方早就忘了这回事。",
      "一周后再催，谁都尴尬。老话说：欠钱的都是大爷。"
    ];
    const angles = [-14, -4, 6, 11, 15];
    const beam = $("#aa-beam"), panL = $("#aa-panL"), panR = $("#aa-panR");
    let cur = angles[0], raf = 0;
    function drawBalance(deg) {
      const r = deg * Math.PI / 180, L = 100, cx = 160, cy = 60;
      const xl = cx - L * Math.cos(r), yl = cy - L * Math.sin(r), xr = cx + L * Math.cos(r), yr = cy + L * Math.sin(r);
      beam.setAttribute("x1", xl); beam.setAttribute("y1", yl); beam.setAttribute("x2", xr); beam.setAttribute("y2", yr);
      panL.setAttribute("transform", "translate(" + xl + "," + yl + ")");
      panR.setAttribute("transform", "translate(" + xr + "," + yr + ")");
    }
    function paintScene(i, instant) {
      cap.textContent = captions[i];
      const to = angles[i], from = cur, t0 = performance.now();
      cancelAnimationFrame(raf);
      if (instant || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { cur = to; drawBalance(to); return; }
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - k, 3);
        cur = from + (to - from) * e;
        drawBalance(cur);
        if (k < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }
    range.addEventListener("input", () => {
      const i = +range.value;
      paintScene(i);
      if (i >= 3) { sceneWhy.classList.add("show"); next2.disabled = false; }
    });
    next2.addEventListener("click", () => { steps.done(1); steps.unlock(2); steps.go(2); paintFlows(era); });

    // 流程
    const FLOWS = {
      "2009": {
        a: [["问到每个人的支付账号（那时大多是邮箱）", 1], ["打开网站，填收款表"], ["发起收款"], ["再挨个通知大家去付款", 1], ["隔几天登录看看谁付了"], ["没付的，还得自己去催", 1]],
        bTitle: "饭桌上当场收现金",
        b: [["当场说一句：每人 60"], ["大家掏钱"], ["收齐"]]
      },
      now: {
        a: [["打开钱包"], ["点进 AA 收款"], ["填金额和人数"], ["把收款信息发给大家"], ["等着收钱；没付的还得自己催", 1]],
        bTitle: "直接在群里说一声",
        b: [["拉个群（或者就在饭桌上）"], ["说一句：每人 60，转我"], ["收钱"]]
      }
    };
    let era = "2009";
    function fill(flowEl, title, arr) {
      if (title) flowEl.querySelector("h5").firstChild.nodeValue = title;
      const ol = $("ol", flowEl);
      ol.innerHTML = "";
      arr.forEach(([txt, pain], i) => {
        const li = document.createElement("li");
        li.textContent = txt;
        if (pain) li.className = "pain";
        li.style.animationDelay = i * 70 + "ms";
        ol.append(li);
      });
      const cnt = $(".cnt", flowEl);
      cnt.innerHTML = '<span>0</span><small>步</small>';
      PT.countUp(cnt.firstChild, arr.length, 500);
    }
    function paintFlows(e) {
      era = e;
      $$(".seg button", $("#aa-p3")).forEach((b) => b.setAttribute("aria-pressed", b.dataset.era === e ? "true" : "false"));
      fill($("#aa-flowA"), null, FLOWS[e].a);
      fill($("#aa-flowB"), FLOWS[e].bTitle, FLOWS[e].b);
    }
    $$(".seg button", $("#aa-p3")).forEach((b) => b.addEventListener("click", () => paintFlows(b.dataset.era)));

    function reset() {
      $$(".choice", roleBox).forEach((x) => { x.disabled = false; x.classList.remove("right", "wrong"); });
      roleWhy.classList.remove("show");
      $$(".role", roleWhy).forEach((r) => r.setAttribute("aria-expanded", "false"));
      next1.disabled = true; next2.disabled = true;
      range.value = 0; cur = angles[0]; drawBalance(cur); cap.textContent = captions[0];
      sceneWhy.classList.remove("show");
      $$('#aa-steps [role="tab"]').forEach((t, i) => { t.classList.remove("done"); if (i) t.disabled = true; });
      steps.go(0);
    }
    $("#lab4-reset").addEventListener("click", reset);
    drawBalance(cur);
    cap.textContent = captions[0];
  })();

  // ============ ⑤ 需求体检卡 ============
  (function lab5() {
    const KEY = "pt.card.v1";
    const IDEAS = {
      own: {
        title: "我自己的点子", desc: "比如你在 Vibe Coding 课上设计的小工具",
        ex: {
          name: "给你的小工具起个名字", said: "写下用户最初说的那句话", why1: "为什么想要它？", why2: "为什么会这样？", why3: "再往下问一层，直到找到动机",
          role: "会用到它的有哪几种人？谁最需要？", scene: "什么时候、在哪、之前之后发生了什么",
          now: "他现在怎么凑合：第一步 → 第二步 → ……", mine: "用你的工具：第一步 → 第二步 → ……", reason: "一句理由"
        }
      },
      essay: {
        title: "AI 西语作文批改", desc: "“我想要一个能帮我改西语作文的 AI。”",
        ex: {
          name: "西语作文小老师", said: "我想要一个能帮我改西语作文的 AI。",
          why1: "为什么要改？交作业前想少丢点分。", why2: "为什么会丢分？性数配合、虚拟式老出错，自己看不出来。", why3: "为什么看不出来？不知道自己哪类错最多，每次都从头查。",
          role: "大二西语专业学生（写作文的人）、任课老师（批改的人）。最需要它的是学生。",
          scene: "周日晚上十点，作文周一早上交。写完 300 词，想自己先查一遍，但室友睡了，也不好意思再问老师。",
          now: "复制进翻译软件 → 翻回中文看意思 → 再问 AI 有没有语法错 → 自己逐条对照改",
          mine: "粘贴作文 → 错误按类型标出来 → 看到“你最常错的是虚拟式”",
          verdict: "真需求", reason: "每周都要写，错误类型还能攒下来，比现在的办法省事。"
        }
      },
      mail: {
        title: "外贸西语邮件助手", desc: "“我想要一个帮我写西语外贸邮件的工具。”",
        ex: {
          name: "西语邮件小秘书", said: "我想要一个帮我写西语外贸邮件的工具。",
          why1: "为什么要帮忙写？每天要回十几封墨西哥客户的邮件。", why2: "为什么写得慢？怕语气不对，客户觉得不礼貌。", why3: "为什么怕语气不对？不同国家的客户习惯不一样，usted 还是 tú 拿不准。",
          role: "外贸公司刚入职的业务员（写邮件的人）、客户（读邮件的人）、带他的老同事（帮他把关的人）。",
          scene: "下午四点，墨西哥客户催报价。业务员要赶在对方上班前，回一封既专业又不生硬的邮件。",
          now: "用中文写好 → 丢进翻译软件 → 拿给老同事看 → 改完再发",
          mine: "选客户的国家和关系 → 写中文要点 → 生成语气合适的西语邮件 → 一键检查称呼和礼貌用语",
          verdict: "还得去问人", reason: "要先问问业务员：找老同事把关这一步，到底有多麻烦、多尴尬。"
        }
      },
      buddy: {
        title: "西语角语伴匹配", desc: "“我想找个拉美同学练口语。”",
        ex: {
          name: "语伴速配", said: "我想找个拉美同学练口语。",
          why1: "为什么要练？下学期要去交换。", why2: "为什么想找拉美同学？想听真实的口音和日常说法。", why3: "为什么一直没找到？认识的留学生少，主动搭话又不好意思。",
          role: "想练西语口语的中国学生、想练中文的拉美留学生。双方都得愿意，才配得起来。",
          scene: "周三下午没课，想找人聊半小时，但不知道谁有空、谁愿意。",
          now: "去西语角碰运气 → 加了微信不知道聊什么 → 聊两次就断了",
          mine: "填空闲时间和想聊的话题 → 匹配一位留学生 → 拿到当天的聊天话题卡",
          verdict: "还得去问人", reason: "要问问拉美留学生：他们真的想练中文吗？只有一方想要，匹配不起来。"
        }
      }
    };
    const form = $("#card-form"), ideasBox = $("#ideas"), saved = $("#card-saved");
    const fields = $$("[data-k]", form);
    let state = PT.store.get(KEY, null) || { idea: "own", values: {}, verdict: "" };

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
    function load() {
      fields.forEach((f) => { f.value = state.values[f.dataset.k] || ""; });
      $$('input[name="verdict"]', form).forEach((r) => { r.checked = r.value === state.verdict; });
      paintIdea();
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
    form.addEventListener("input", (e) => {
      const k = e.target.dataset && e.target.dataset.k;
      if (k) state.values[k] = e.target.value;
      if (e.target.name === "verdict") state.verdict = e.target.value;
      save();
    });
    // 输入框随内容长高
    $$("textarea", form).forEach((ta) => {
      const fit = () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + 2 + "px"; };
      ta.addEventListener("input", fit);
      requestAnimationFrame(fit);
    });

    const v = (k) => (state.values[k] || "").trim();
    function rows() {
      const whys = ["why1", "why2", "why3"].map((k, i) => v(k) && "为什么" + "①②③"[i] + " " + v(k)).filter(Boolean).join("\n");
      return [
        { label: "用户的原话", text: v("said") },
        { label: "追问三次“为什么”", text: whys },
        { label: "主要角色", text: v("role") },
        { label: "一个具体场景", text: v("scene") },
        { label: "他现在怎么凑合", text: v("now") },
        { label: "用我的工具", text: v("mine") },
        { label: "体检结论", text: [state.verdict, v("reason")].filter(Boolean).join("：") }
      ];
    }
    $("#card-png").addEventListener("click", async () => {
      try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
      const canvas = PT.cardImage({
        kicker: "需求体检卡 · A 面",
        title: v("name") || IDEAS[state.idea].title,
        rows: rows(),
        footer: "AI产品思维 · A 面 看见人"
      });
      PT.download(canvas, "需求体检卡-" + (v("name") || "我的点子") + ".png");
    });
    $("#card-copy").addEventListener("click", async () => {
      const text = "【需求体检卡】" + (v("name") || IDEAS[state.idea].title) + "\n\n" +
        rows().map((r, i) => (i + 1) + ". " + r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
      const ok = await PT.copy(text);
      saved.textContent = ok ? "已复制，可以粘贴到任何地方" : "复制没成功，请手动选中文字复制";
    });
    const clearBtn = $("#card-clear");
    let armed = 0;
    clearBtn.addEventListener("click", () => {
      if (!armed) {
        clearBtn.textContent = "再点一次确认清空";
        armed = setTimeout(() => { armed = 0; clearBtn.textContent = "清空"; }, 3000);
        return;
      }
      clearTimeout(armed); armed = 0; clearBtn.textContent = "清空";
      state = { idea: state.idea, values: {}, verdict: "" };
      load();
      $$("textarea", form).forEach((ta) => { ta.style.height = "auto"; });
      save();
    });
    load();
  })();

  // ============ 自测题 ============
  PT.quiz($("#quiz"), [
    {
      q: "问卷说只有 5% 的人想评论音乐，后来评论区却火了。最主要的原因是？",
      options: ["问卷做错了，样本太少", "用户说不出自己真正想要的：他们要的不是“评论音乐”，而是共鸣", "后来请了很多专业乐评人来写评论"],
      answer: 1,
      why: "问卷问的是用户想不想要某个功能，可用户真正想要的是“被懂得”。这要靠去看评论、去想原因才发现得了。"
    },
    {
      q: "招募访谈对象时，怎样最能确认对方真是“资深欧美乐迷”？",
      options: ["直接问他：“你是资深欧美乐迷吗？”", "请他打开手机，看看听歌记录", "看他的穿衣风格"],
      answer: 1,
      why: "记录不会说谎。小明就遇到过自称资深乐迷、记录里却只有一百多首 KTV 歌的人。"
    },
    {
      q: "下面哪个是“好追问”？",
      options: ["“你一定很喜欢这个 App 吧？”", "“你常用这个 App 吗？”", "“上一次打开它是什么时候？当时在做什么？”"],
      answer: 2,
      why: "第一个是引导式提问，第二个是是非题。问具体的时间和经过，对方才会讲真实发生的事。"
    },
    {
      q: "用户说：“我想要一个勋章系统。”你第一步该做什么？",
      options: ["马上排期开发", "追问他为什么想要勋章", "先看看竞品有没有勋章"],
      answer: 1,
      why: "用户提的是一个办法。同一句话背后可能有五种动机，每一种都可能有比勋章更好的办法。"
    },
    {
      q: "线上 AA 收款为什么一直没什么人用？",
      options: ["界面不够好看", "付钱的人操作太麻烦", "它没解决收款人“催钱难开口”的麻烦，反而让他多走了几步"],
      answer: 2,
      why: "小明把交互改了又改也没用。这个功能的主角是收款方；离开饭桌之后，收款方反而成了弱势的一方。"
    },
    {
      q: "你想做一个“AI 西语作文批改”工具。下面哪个问题最该先问？",
      options: ["主色用什么颜色好？", "同学们现在是怎么检查作文的？新工具比它好在哪？", "要不要加一个排行榜？"],
      answer: 1,
      why: "先看用户现在怎么凑合。新工具要比这个办法更省事、更不尴尬，才会有人用。"
    }
  ]);
})();
