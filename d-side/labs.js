/* 第四课 · 验需求：各练习的内容与逻辑 */
(function () {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // ============ ① 猜北极星 ============
  (function lab1() {
    const data = [
      { id: "play", t: "播放率", d: "点开歌单就播放的比例", w: 40, c: "点开就播，可能听两首就走了" },
      { id: "down", t: "下载率", d: "把歌单里的歌下载下来的比例", w: 52, c: "下载的只是一部分人" },
      { id: "fav", t: "收藏率", d: "把歌单收藏起来的比例", w: 92, c: "和留存关系最大", star: true },
      { id: "share", t: "分享率", d: "把歌单分享出去的比例", w: 30, c: "分享的人更少" }
    ];
    const box = $("#metrics"), reveal = $("#reveal1");
    function render() {
      box.innerHTML = "";
      box.classList.remove("done");
      reveal.classList.remove("show");
      data.forEach((m) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "metric";
        b.innerHTML = "<b>" + m.t + "</b><span>" + m.d + '</span><span class="corr"><i style="--w:' + m.w + '%"></i><em>' + m.c + "</em></span>";
        b.addEventListener("click", () => pick(m, b));
        box.append(b);
      });
    }
    function pick(m, b) {
      box.classList.add("done");
      $$(".metric", box).forEach((x, i) => {
        x.disabled = true;
        if (data[i].star) x.classList.add("star");
      });
      const you = document.createElement("span");
      you.className = "you";
      you.textContent = "你选的";
      b.append(you);
      $("#reveal1-h").textContent = m.star ? "猜对了：是收藏" : "答案是收藏";
      reveal.classList.add("show");
    }
    $("#lab1-reset").addEventListener("click", render);
    render();
  })();

  // ============ ② 问卷体检 ============
  (function lab2() {
    const DIAG = ["没毛病", "隐私题放在了最前面", "一道题问了两件事", "引导式提问", "开放题，答起来太累", "题目太长、太绕"];
    const data = [
      { q: "你的月收入是多少？（必填）", o: "2000 以下 / 2000–5000 / 5000 以上", d: 1,
        hint: "第一题就问钱，很多人会直接关掉问卷。",
        fix: "挪到最后一题，并改成选填：“你每月的生活费大概在哪个区间？（选填）”" },
      { q: "你平时用哪些 App 学西语？（多选）", o: "词典 / 背单词 / 网课 / 其他", d: 0,
        hint: "这道题好回答、不用动脑，放在前面正合适。",
        fix: "这道题没毛病：多选、好回答，适合放在开头。" },
      { q: "你对《小西》的课程内容和界面设计满意吗？", o: "满意 / 一般 / 不满意", d: 2,
        hint: "如果有人喜欢课程、讨厌界面，他该怎么选？",
        fix: "拆成两道：“你对课程内容满意吗？”和“你对界面设计满意吗？”" },
      { q: "你是不是也觉得，每天用 AI 练口语非常有必要？", o: "是 / 否", d: 3,
        hint: "“你是不是也觉得”，已经在替对方回答了。",
        fix: "改成问事实：“过去一周，你练了几次西语口语？” 0 次 / 1–2 次 / 3 次以上" },
      { q: "请详细描述你学西语以来遇到的所有困难，以及你认为造成这些困难的原因。", o: "（填空）", d: 4,
        hint: "要写一大段话的题，大多数人会跳过，或者随便写两个字。",
        fix: "改成多选：“学西语时，你最头疼的是？（最多选 2 项）”动词变位 / 听力 / 口语 / 写作 / 其他" },
      { q: "你一周大概学几次西语？", o: "每天 / 3–5 次 / 1–2 次 / 很少", d: 0,
        hint: "这道题问的是事实，选项也清楚。",
        fix: "这道题没毛病：问的是事实，选项清楚、不重叠。" },
      { q: "考虑到目前市面上大多数学习类 App 都存在内容同质化、缺少个性化、交互体验不够友好等问题，如果我们推出一个结合 AI 口语陪练、语法纠错、文化知识讲解和社区互动的新功能，你愿意每月花多少钱订阅？", o: "0 元 / 10 元以内 / 10–30 元 / 30 元以上", d: 5,
        hint: "读到最后，已经忘了前面在问什么。",
        fix: "删掉铺垫，只问一件事：“如果有 AI 口语陪练，你愿意每月为它花多少钱？”" },
      { q: "你还有什么想对我们说的吗？（选填）", o: "（填空）", d: 0,
        hint: "最后留一道选填的开放题，是可以的。",
        fix: "这道题没毛病：开放题不是不能有，是要少，放在最后、选填就好。" }
    ];
    const CH = [
      { t: "《小西》自己的粉丝群", ok: false, msg: "粉丝群里都是本来就喜欢《小西》的人，结果会偏乐观。" },
      { t: "全校公众号，谁都能填", ok: false, msg: "人多不等于对：大多数人不学西语，他们的答案帮不上忙。渠道要和人群对上。" },
      { t: "西语专业各年级的班级群", ok: true, msg: "对上了：填的都是学西语的人。每个年级至少收 50 份，才看得出年级之间的差别。" }
    ];
    const survey = $("#survey"), chBox = $("#channels"), chMsg = $("#channel-msg"), reveal = $("#reveal2");
    let solved = 0, chOk = false;
    function check() { if (solved === data.length && chOk) reveal.classList.add("show"); }
    function render() {
      solved = 0; chOk = false;
      reveal.classList.remove("show");
      survey.innerHTML = "";
      data.forEach((it, i) => {
        const row = document.createElement("div");
        row.className = "sq";
        row.innerHTML = '<span class="no">' + (i + 1) + '.</span><div class="qt">' + esc(it.q) + '<span class="qo">' + esc(it.o) + "</span></div>";
        const diag = document.createElement("div");
        diag.className = "diag";
        const sel = document.createElement("select");
        sel.setAttribute("aria-label", "第 " + (i + 1) + " 题的诊断");
        sel.innerHTML = '<option value="">诊断一下……</option>' + DIAG.map((d, k) => '<option value="' + k + '">' + d + "</option>").join("");
        diag.append(sel);
        const msg = document.createElement("p");
        msg.className = "msg";
        row.append(diag, msg);
        sel.addEventListener("change", () => {
          if (sel.value === "") return;
          if (+sel.value === it.d) {
            sel.disabled = true;
            row.classList.add("ok");
            if (it.d) row.classList.add("fixed");
            msg.remove();
            const fix = document.createElement("p");
            fix.className = "fix";
            fix.innerHTML = it.d ? "<b>改成：</b>" + esc(it.fix) : esc(it.fix);
            row.append(fix);
            solved += 1;
            check();
          } else {
            msg.textContent = it.hint;
            row.classList.remove("shake");
            void row.offsetWidth;
            row.classList.add("shake");
          }
        });
        survey.append(row);
      });
      chBox.innerHTML = "";
      chMsg.textContent = "";
      CH.forEach((c) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.textContent = c.t;
        b.addEventListener("click", () => {
          chMsg.textContent = c.msg;
          if (c.ok) {
            chOk = true;
            $$(".choice", chBox).forEach((x) => { x.disabled = true; });
            b.classList.add("right");
            check();
            if (solved < data.length) chMsg.textContent += " 上面还有题没诊断完。";
          } else {
            b.classList.add("wrong");
          }
        });
        chBox.append(b);
      });
    }
    $("#lab2-reset").addEventListener("click", render);
    render();
  })();

  // ============ ③ 数据侦探 ============
  (function lab3() {
    const data = [
      { q: "超过 100 条评论的歌，占多少？", big: "80%", small: "的评论，挤在 1% 的歌下面", w: 80, say: "评论都挤在热门歌下面，大多数歌底下冷冷清清。" },
      { q: "点赞是不是集中在少数评论上？", big: "90%", small: "的赞，落在前 1% 的评论上", w: 90, say: "马太效应：赞多的越来越多，别的评论没人看。" },
      { q: "新的精彩评论，有多少被人看到了？", big: "3%", small: "的新评论，进过“精彩评论”区", w: 3, say: "新来的好评论，几乎没有机会被看见。" },
      { q: "用户之间互相回复的比例有多高？", big: "2%", small: "的评论收到过回复", w: 2, say: "大家各说各的，很少真的在交流。" }
    ];
    const drill = $("#drill"), btn = $("#drill-btn"), left = $("#drill-left"), judge = $("#judge"), jBox = $("#judge-choices"), reveal = $("#reveal3");
    let opened = 0;
    function render() {
      opened = 0;
      drill.innerHTML = "";
      data.forEach((d, i) => {
        const c = document.createElement("div");
        c.className = "dcard";
        c.innerHTML = '<div class="dq">' + (i + 1) + ". " + esc(d.q) + '</div><div class="body"><div class="big">' + d.big + "<small>" + esc(d.small) + '</small></div><div class="bar"><i style="--w:' + d.w + '%"></i></div><p class="say">' + esc(d.say) + "</p></div>";
        drill.append(c);
      });
      btn.disabled = false;
      left.textContent = "还有 4 层";
      judge.hidden = true;
      reveal.classList.remove("show");
      jBox.innerHTML = "";
      [["真繁荣，继续保持", false], ["虚假繁荣，得想办法", true]].forEach(([t, ok]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "choice";
        b.textContent = t;
        b.addEventListener("click", () => {
          $$(".choice", jBox).forEach((x, k) => { x.disabled = true; if (k === 1) x.classList.add("right"); });
          if (!ok) b.classList.add("wrong");
          $("#reveal3-h").textContent = ok ? "看起来热闹，其实是虚假繁荣" : "再看看这四张卡：其实是虚假繁荣";
          reveal.classList.add("show");
        });
        jBox.append(b);
      });
    }
    btn.addEventListener("click", () => {
      const cards = $$(".dcard", drill);
      if (opened >= cards.length) return;
      cards[opened].classList.add("open");
      opened += 1;
      left.textContent = opened < cards.length ? "还有 " + (cards.length - opened) + " 层" : "切到底了";
      if (opened === cards.length) { btn.disabled = true; judge.hidden = false; }
    });
    $("#lab3-reset").addEventListener("click", render);
    render();
  })();

  // ============ ④ 软文挤水分 ============
  (function lab4() {
    const WANT = { total: 1000, dau: 28, mau: 120, d1: 42 };
    const G = [
      { k: "dr", t: "日活 ÷ 总用户", bench: 5 },
      { k: "mr", t: "月活 ÷ 总用户", bench: 20 },
      { k: "d1", t: "次日留存", bench: 40 }
    ];
    const calc = $("#calc"), gauges = $("#gauges"), msg = $("#calc-msg"), reveal = $("#reveal4");
    const els = {};
    G.forEach((g) => {
      const row = document.createElement("div");
      row.className = "gauge";
      row.innerHTML = '<div class="lbl">' + g.t + "<small>经验值约 " + g.bench + '%</small></div><div class="scale empty"><i></i></div><div class="val">—<small></small></div>';
      gauges.append(row);
      els[g.k] = row;
    });
    function num(k) {
      const raw = ($('input[data-k="' + k + '"]', calc).value || "").replace(/[,，\s万%]/g, "");
      if (raw === "") return null;
      let v = parseFloat(raw);
      if (!isFinite(v)) return null;
      if ((k === "total" || k === "dau" || k === "mau") && v >= 100000) v = v / 10000; // 按“人”填的，换成“万”
      if (k === "d1" && v > 0 && v <= 1) v = v * 100; // 按小数填的留存
      return v;
    }
    function paint() {
      const n = { total: num("total"), dau: num("dau"), mau: num("mau"), d1: num("d1") };
      const val = {
        dr: n.total && n.dau != null ? n.dau / n.total * 100 : null,
        mr: n.total && n.mau != null ? n.mau / n.total * 100 : null,
        d1: n.d1
      };
      G.forEach((g) => {
        const row = els[g.k], v = val[g.k];
        const scale = $(".scale", row), out = $(".val", row);
        if (v == null) {
          scale.classList.add("empty");
          out.className = "val";
          out.innerHTML = "—<small></small>";
          return;
        }
        const r = v / g.bench;
        scale.classList.remove("empty");
        $("i", scale).style.setProperty("--x", Math.min(r / 1.5, 1) * 100 + "%");
        const [cls, word] = r < 0.75 ? ["water", "有水分"] : r < 1 ? ["low", "偏低"] : ["fine", "健康"];
        out.className = "val " + cls;
        out.innerHTML = (Math.round(v * 10) / 10) + "%<small>" + word + "</small>";
      });
      const all = Object.keys(WANT).every((k) => n[k] != null);
      const right = all && Object.keys(WANT).every((k) => Math.abs(n[k] - WANT[k]) < 0.01);
      msg.textContent = all && !right ? "有的数字和软文对不上，再看一眼。" : "";
      reveal.classList.toggle("show", right);
    }
    calc.addEventListener("input", paint);
    $("#lab4-reset").addEventListener("click", () => {
      $$("input", calc).forEach((i) => { i.value = ""; });
      paint();
    });
    paint();
  })();

  // ============ ⑤ 设计一个 A/B 测试 ============
  (function lab5() {
    const rows = [
      { k: "改什么", opts: [
        ["只改排序方式：按播放量 → 按收藏率", true, "一次只改一处，结果才说得清是谁的功劳。"],
        ["改排序方式，顺便把歌单封面也换成新设计", false, "改了两处。B 组更好时，你分不清是排序的功劳，还是封面的功劳。"],
        ["把整个首页重新设计一遍", false, "改得太多，结果好坏都说不清原因。"]] },
      { k: "看哪个数", opts: [
        ["歌单收藏率，和 7 日留存", true, "对准了目标：团队想要的是用户更常回来。"],
        ["歌单被点开的次数", false, "点开不等于喜欢。目标是留存，就看和留存有关的数。"],
        ["问用户觉得新首页好不好看", false, "这是问卷，不是实验。实验要看用户实际做了什么。"]] },
      { k: "怎么分人", opts: [
        ["随机抽 2% 的用户，平分成 A、B 两组", true, "随机分，两组才一样；每组的人数也够。"],
        ["A 组是所有老用户，B 组是 20 个同事", false, "两组人本来就不一样，同事也不是真实用户，人还太少。"],
        ["让用户自己选进哪一组", false, "自己选的人本来就不一样，比较起来不公平。"]] },
      { k: "跑多久", opts: [
        ["至少一周，工作日和周末都覆盖", true, "工作日和周末的听歌习惯不一样，至少跑满一周。"],
        ["一个下午", false, "时间太短，数还没稳下来。"],
        ["B 组一领先，就马上停", false, "一领先就停，很可能只是运气。定好时间，跑完再看。"]] }
    ];
    const box = $("#abt"), msg = $("#ab-msg"), reveal = $("#reveal5");
    function render() {
      box.innerHTML = "";
      msg.textContent = "";
      reveal.classList.remove("show");
      rows.forEach((r, i) => {
        const row = document.createElement("div");
        row.className = "row";
        const order = shuffle(r.opts.map((o, k) => k));
        row.innerHTML = '<span class="k">' + r.k + '</span><select aria-label="' + r.k + '"><option value="">选一个……</option>' +
          order.map((k) => '<option value="' + k + '">' + esc(r.opts[k][0]) + "</option>").join("") + '</select><p class="fbk"></p>';
        $("select", row).addEventListener("change", () => { const f = $(".fbk", row); f.textContent = ""; f.className = "fbk"; });
        row.dataset.i = i;
        box.append(row);
      });
    }
    $("#ab-check").addEventListener("click", () => {
      let bad = 0, empty = 0;
      $$(".row", box).forEach((row) => {
        const r = rows[+row.dataset.i], v = $("select", row).value, f = $(".fbk", row);
        if (v === "") { empty += 1; f.className = "fbk no"; f.textContent = "这一格还没选。"; return; }
        const o = r.opts[+v];
        f.className = "fbk " + (o[1] ? "ok" : "no");
        f.textContent = (o[1] ? "✓ " : "✗ ") + o[2];
        if (!o[1]) bad += 1;
      });
      const n = bad + empty;
      msg.textContent = n ? "还有 " + n + " 格要改。" : "";
      reveal.classList.toggle("show", !n);
    });
    $("#lab5-reset").addEventListener("click", render);
    render();
  })();

  // ============ ⑥ 我的验证计划 ============
  (function lab6() {
    const KEY = "pt.verify.v1";
    const IDEAS = {
      own: {
        title: "我自己的点子", desc: "比如你在 Vibe Coding 课上设计的小工具",
        ex: {
          star: "比如：每周至少用两次的人数", starWhy: "为什么是它？它和“用户真的被帮到了”有什么关系？",
          dim1: "维度一，比如：年级", dim2: "维度二，比如：用得多还是用得少",
          q1: "先问一个不用动脑的事实题", q2: "再问他现在怎么凑合", q3: "最后才问隐私题（选填）",
          channel: "发到哪里，才找得到这几类人？", exWhat: "做一个最简陋的版本，或者只改一处",
          exMetric: "看用户实际做了什么", exWho: "每组多少人，怎么分", exLong: "至少多久"
        }
      },
      essay: {
        title: "AI 西语作文批改", desc: "“我想要一个能帮我改西语作文的 AI。”",
        ex: {
          star: "每周至少用它改两篇作文的人数", starWhy: "改得勤、还愿意回来，说明它真的帮上忙了。",
          dim1: "年级（大一到大四）", dim2: "写作水平（常出错 / 偶尔出错）",
          q1: "你上一次写西语作文是什么时候？", q2: "写完以后，你一般怎么检查？（多选）", q3: "你现在读几年级？",
          channel: "西语专业各年级的班级群，每个年级至少 50 份", exWhat: "批改结果按错误类型分组 vs 按句子顺序排",
          exMetric: "一周内回来再改一篇的比例", exWho: "60 个同学，随机分两组", exLong: "两周"
        }
      },
      mail: {
        title: "外贸西语邮件助手", desc: "“我想要一个帮我写西语外贸邮件的工具。”",
        ex: {
          star: "每周用它发出去的邮件数", starWhy: "真发出去了，才说明写出来的邮件能用。",
          dim1: "工作年限（新人 / 老手）", dim2: "客户地区（墨西哥 / 西班牙 / 其他）",
          q1: "你每天大概要回几封西语邮件？", q2: "写完邮件，你会请谁帮你看？", q3: "你在这家公司做了多久？",
          channel: "外贸业务员的行业群、学院的校友群", exWhat: "先不写代码：一个共享文档 + 人工帮写",
          exMetric: "有多少人连续一周每天都来", exWho: "10 位刚入职的业务员", exLong: "一周"
        }
      },
      buddy: {
        title: "西语角语伴匹配", desc: "“我想找个拉美同学练口语。”",
        ex: {
          star: "每周聊满 30 分钟的语伴对数", starWhy: "配上了还能聊下去，才算真的帮到了双方。",
          dim1: "身份（中国学生 / 拉美留学生）", dim2: "想练的频率（每周 / 偶尔）",
          q1: "上周你用西语和人聊过几次？", q2: "你一般什么时候有空聊？（多选）", q3: "你来自哪个国家或地区？",
          channel: "西语角现场 + 留学生群，两类人各至少 50 份", exWhat: "先用一张报名表 + 人工配对",
          exMetric: "两周后还在聊的有几对", exWho: "20 个中国学生、20 个留学生", exLong: "两周"
        }
      }
    };
    const form = $("#vform"), ideasBox = $("#ideas"), saved = $("#v-saved"), qrows = $("#qrows");
    // 3 道问卷题
    [1, 2, 3].forEach((n) => {
      const r = document.createElement("div");
      r.className = "qrow";
      r.innerHTML = '<input type="text" data-k="q' + n + '" aria-label="问卷第 ' + n + ' 题"><div class="lint" data-lint="q' + n + '"></div>';
      qrows.append(r);
    });
    const fields = $$("[data-k]", form);

    let state = PT.store.get(KEY, null);
    if (!state || !IDEAS[state.idea] || !state.values) {
      const pool = PT.store.get("pt.pool.v1", null), card = PT.store.get("pt.card.v1", null);
      const idea = pool && IDEAS[pool.idea] ? pool.idea : card && IDEAS[card.idea] ? card.idea : "own";
      const name = (pool && pool.name) || (card && card.values && card.values.name) || "";
      state = { idea, name, values: {} };
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

    // 问卷题检查：对照 Track 02 的规则
    const RULES = [
      { re: /(是不是也|难道|你一定|你不觉得|不觉得吗|对吧|是不是很|非常有必要|大家都)/, say: "像在引导对方回答" },
      { re: /(以及|并且|和|、).+(满意|喜欢|好用|有用|怎么样|如何)/, say: "可能一题问了两件事" },
      { re: /(描述|说说|谈谈|为什么|怎么看|请写|有什么建议)/, say: "开放题，能改成选择题吗" }
    ];
    const PRIVATE = /(收入|工资|生活费|手机号|电话|身份证|住址|家庭|微信号|姓名)/;
    function lint() {
      [1, 2, 3].forEach((n) => {
        const box = $('[data-lint="q' + n + '"]', form);
        const t = (state.values["q" + n] || "").trim();
        const out = [];
        if (t) {
          RULES.forEach((r) => { if (r.re.test(t)) out.push(["warn", r.say]); });
          if (PRIVATE.test(t) && n < 3) out.push(["warn", "隐私题放到最后"]);
          if (t.length > 40) out.push(["warn", "题目有点长，能删短吗"]);
          if (!out.length) out.push(["good", "✓ 没发现问题"]);
        }
        box.innerHTML = out.map(([c, s]) => '<span class="' + c + '">' + s + "</span>").join("");
      });
    }

    function load() {
      fields.forEach((f) => { f.value = state.values[f.dataset.k] || ""; });
      paintIdea();
      lint();
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
      if (/^q\d$/.test(k)) lint();
      save();
    });
    $$("textarea", form).forEach((ta) => {
      const fit = () => { ta.style.height = "auto"; ta.style.height = ta.scrollHeight + 2 + "px"; };
      ta.addEventListener("input", fit);
      requestAnimationFrame(fit);
    });

    const v = (k) => (state.values[k] || "").trim();
    const title = () => (state.name || "").trim() || IDEAS[state.idea].title;
    function rows() {
      const dims = [v("dim1"), v("dim2")].filter(Boolean).join(" × ");
      const qs = ["q1", "q2", "q3"].map((k, i) => v(k) && (i + 1) + ". " + v(k)).filter(Boolean).join("\n");
      const ex = [["改什么", "exWhat"], ["看哪个数", "exMetric"], ["找多少人", "exWho"], ["跑多久", "exLong"]]
        .map(([l, k]) => v(k) && l + "：" + v(k)).filter(Boolean).join("\n");
      return [
        { label: "北极星指标", text: [v("star"), v("starWhy")].filter(Boolean).join("\n") },
        { label: "用户分群", text: dims },
        { label: "问卷题", text: qs },
        { label: "投放渠道", text: v("channel") },
        { label: "最小实验", text: ex }
      ];
    }
    $("#v-png").addEventListener("click", async () => {
      try { await document.fonts.ready; } catch (e) { /* 字体没加载也照样画 */ }
      const canvas = PT.cardImage({
        kicker: "验证计划 · D 面",
        title: title(),
        rows: rows(),
        footer: "AI产品思维 · D 面 验需求"
      });
      PT.download(canvas, "验证计划-" + title() + ".png");
    });
    $("#v-copy").addEventListener("click", async () => {
      const text = "【验证计划】" + title() + "\n\n" + rows().map((r, i) => (i + 1) + ". " + r.label + "\n" + (r.text || "（还没填）")).join("\n\n");
      const ok = await PT.copy(text);
      saved.textContent = ok ? "已复制，可以粘贴到任何地方" : "复制没成功，请手动选中文字复制";
    });
    const clearBtn = $("#v-clear");
    let armed = 0;
    clearBtn.addEventListener("click", () => {
      if (!armed) {
        clearBtn.textContent = "再点一次确认清空";
        armed = setTimeout(() => { armed = 0; clearBtn.textContent = "清空"; }, 3000);
        return;
      }
      clearTimeout(armed); armed = 0; clearBtn.textContent = "清空";
      state = { idea: state.idea, name: state.name, values: {} };
      load();
      $$("textarea", form).forEach((ta) => { ta.style.height = "auto"; });
      save();
    });
    load();
  })();

  // ============ 自测题 ============
  PT.quiz($("#quiz"), [
    {
      q: "网易云为什么把收藏率当作首页歌单推荐的优化目标？",
      options: ["收藏的按钮最显眼", "团队最想提高留存，而收藏率和留存关系最大", "收藏率的数字最好看"],
      answer: 1,
      why: "先想清楚最想提高什么，再找和它关系最大的那个数。收藏了的人，还会回来再听。"
    },
    {
      q: "想比较“资深乐迷”和“普通听众”两类人，问卷至少要收多少份？",
      options: ["一共 50 份就够", "每一类至少 50 份", "不用分类，越多越好"],
      answer: 1,
      why: "每一类用户至少 50 份，才能比较两类人的差别。只看总数，少的那一类会被淹没。"
    },
    {
      q: "下面哪道问卷题问得最好？",
      options: ["你是不是也觉得 AI 陪练很有用？", "你的月收入是多少？（放在第一题）", "上周你用西语和别人聊过几次？"],
      answer: 2,
      why: "第一题在引导，第二题把隐私题放在了最前面。问具体发生过的事，答案最可靠。"
    },
    {
      q: "评论总数一直在涨。下一步最该问什么？",
      options: ["怎么让总数涨得更快", "评论是不是都挤在少数热门歌下面", "要不要把评论按钮做大一点"],
      answer: 1,
      why: "总数在涨，可能是虚假繁荣。往下切一层，看集中度，问题才会露出来。"
    },
    {
      q: "一个 App 说“用户突破 1000 万”，日活 28 万。这说明什么？",
      options: ["日活只有总用户的 2.8%，远低于约 5% 的经验值，有水分", "日活占 28%，非常健康", "只有 1000 万这个数重要"],
      answer: 0,
      why: "累计用户只涨不跌。算一算日活、月活和留存，和经验值比，水分就出来了。"
    },
    {
      q: "两个首页方案争执不下，最好的办法是？",
      options: ["听职位最高的人的", "做一次 A/B 测试：一次只改一处，随机分组，跑满一周", "两个方案都上线，看大家喜欢哪个"],
      answer: 1,
      why: "多数决定只有五成把握。用最低的成本做实验，让数来说话。"
    }
  ]);
})();
