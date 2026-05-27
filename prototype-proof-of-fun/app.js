/*
  THROWAWAY PROTOTYPE.
  Question: can B variant turn funny choices into a 60-second game with goals,
  soft penalties, OKR progress, and "one more round" pressure?

  AI boundary for later:
  AI may rewrite agenda.title, agenda.proposal, option.label, option.reaction.
  AI must not control option.strategy, option.deltas, crisis rules, ratings, or OKR.
*/

const app = document.querySelector("#app");
const targetZone = { min: 42, max: 68 };
const dangerZone = { low: 25, high: 80 };
const variants = [
  ["A", "会议桌"],
  ["B", "KPI 指挥台"],
  ["C", "财报压力"]
];

const kpiMeta = {
  cash: { name: "现金流", icon: "氧", lowRisk: "现金流赤字 +1", highRisk: "预算闲置 +1" },
  morale: { name: "士气", icon: "心", lowRisk: "士气塌方 +1", highRisk: "士气过热 +1" },
  growth: { name: "增长", icon: "泵", lowRisk: "增长停摆 +1", highRisk: "增长过载 +1" },
  bubble: { name: "泡沫", icon: "泡", lowRisk: "叙事真空 +1", highRisk: "泡沫审计 +1" }
};

const strategyMeta = {
  vision: { label: "愿景型", icon: "饼", className: "strategy-vision" },
  comfort: { label: "安抚型", icon: "糖", className: "strategy-comfort" },
  push: { label: "推进型", icon: "冲", className: "strategy-push" },
  deflect: { label: "转移型", icon: "锅", className: "strategy-deflect" }
};

const characters = [
  { id: "legs", name: "腿部事业群", face: "🦵" },
  { id: "heart", name: "心肺财务部", face: "🫀" },
  { id: "brain", name: "大脑战略部", face: "🧠" },
  { id: "abs", name: "腹部传说部", face: "▦" }
];

const agenda = [
  {
    id: "stairs-spinout",
    speaker: "腿部事业群",
    speakerId: "legs",
    title: "楼梯业务剥离案",
    proposal: "腿部事业群要求把楼梯从主营业务中剥离，只保留电梯生态合作。",
    options: [
      {
        id: "stairs-vision",
        label: "包装成下肢基建升级",
        strategy: "vision",
        strategyLabel: "愿景型",
        reaction: "愿景落章: 腿部接受了“每一级台阶都是增长曲线”的融资故事。",
        deltas: { cash: -2, morale: 4, growth: 13, bubble: 14 }
      },
      {
        id: "stairs-comfort",
        label: "给膝盖发缓冲补贴",
        strategy: "comfort",
        strategyLabel: "安抚型",
        reaction: "安抚落章: 膝盖停止拍桌，心肺财务部把预算表翻到背面。",
        deltas: { cash: -12, morale: 13, growth: 2, bubble: -4 }
      },
      {
        id: "stairs-push",
        label: "敲钟宣布立刻复工",
        strategy: "push",
        strategyLabel: "推进型",
        reaction: "推进落章: 腿部宣布冲刺基建奇迹，会议桌自己抖了一下。",
        deltas: { cash: -9, morale: -5, growth: 18, bubble: 7 }
      },
      {
        id: "stairs-deflect",
        label: "归档为历史遗留问题",
        strategy: "deflect",
        strategyLabel: "转移型",
        reaction: "转移落章: 楼梯问题移交膝盖风控委员会，会议室安静了三秒。",
        deltas: { cash: 4, morale: -3, growth: 0, bubble: -13 },
        riskTag: "历史遗留 +1",
        nextHint: "下轮: 膝盖风控委员会可能带着旧账回来。"
      }
    ]
  },
  {
    id: "cash-burn",
    speaker: "心肺财务部",
    speakerId: "heart",
    title: "现金流预警",
    proposal: "心肺财务部表示刚才那组把氧气预算烧成了团建经费。",
    options: [
      {
        id: "cash-vision",
        label: "包装成战略融资窗口",
        strategy: "vision",
        strategyLabel: "愿景型",
        reaction: "愿景落章: CFO 听见“战略融资”后短暂恢复呼吸。",
        deltas: { cash: 2, morale: 1, growth: 8, bubble: 11 }
      },
      {
        id: "cash-comfort",
        label: "塞糖堵住财务质询",
        strategy: "comfort",
        strategyLabel: "安抚型",
        reaction: "安抚落章: 肺部拿到糖水，心脏在角落里做深呼吸。",
        deltas: { cash: -10, morale: 12, growth: 1, bubble: -2 }
      },
      {
        id: "cash-push",
        label: "签署加班供氧令",
        strategy: "push",
        strategyLabel: "推进型",
        reaction: "推进落章: 心脏开始加班，肺部提交了离职意向书草稿。",
        deltas: { cash: -15, morale: 6, growth: 15, bubble: 4 }
      },
      {
        id: "cash-deflect",
        label: "暂扣大脑部门预算",
        strategy: "deflect",
        strategyLabel: "转移型",
        reaction: "转移落章: 大脑战略部被扣预算，大家突然很会省气。",
        deltas: { cash: 13, morale: -2, growth: -2, bubble: -7 },
        riskTag: "预算黑箱 +1",
        nextHint: "下轮: 大脑战略部可能优先发难。"
      }
    ]
  },
  {
    id: "rest-ppt",
    speaker: "大脑战略部",
    speakerId: "brain",
    title: "休息延长提案",
    proposal: "大脑战略部携 12 页 PPT 建议把休息命名为“恢复型战略沉淀”。",
    options: [
      {
        id: "rest-vision",
        label: "命名为恢复型战略沉淀",
        strategy: "vision",
        strategyLabel: "愿景型",
        reaction: "愿景落章: PPT 获得掌声，泡沫开始申请独立办公室。",
        deltas: { cash: 4, morale: 0, growth: 4, bubble: 17 }
      },
      {
        id: "rest-comfort",
        label: "给大脑一颗甜头闭麦",
        strategy: "comfort",
        strategyLabel: "安抚型",
        reaction: "安抚落章: 大脑安静吃糖，但已经把下一页标题写好了。",
        deltas: { cash: -8, morale: 10, growth: -3, bubble: 2 }
      },
      {
        id: "rest-push",
        label: "把恐惧包装成使命感",
        strategy: "push",
        strategyLabel: "推进型",
        reaction: "推进落章: 恐惧被包装成使命感，腿部假装没听见。",
        deltas: { cash: -7, morale: -8, growth: 13, bubble: 9 }
      },
      {
        id: "rest-deflect",
        label: "把 PPT 扔进待办池",
        strategy: "deflect",
        strategyLabel: "转移型",
        reaction: "转移落章: PPT 被归档为历史遗留问题，泡沫当场瘪了一层。",
        deltas: { cash: 1, morale: -1, growth: -4, bubble: -15 },
        riskTag: "PPT 债务 +1",
        nextHint: "下轮: 大脑战略部会带着更厚的附件回来。"
      }
    ]
  },
  {
    id: "abs-headcount",
    speaker: "腹部传说部",
    speakerId: "abs",
    title: "存在感维权",
    proposal: "腹部传说部称自己长期被画进组织架构，却没有实际编制。",
    options: [
      {
        id: "abs-vision",
        label: "设立明年可见化专项",
        strategy: "vision",
        strategyLabel: "愿景型",
        reaction: "愿景落章: 腹部获得“明年可见化专项”，现场没人敢问年份。",
        deltas: { cash: -1, morale: 4, growth: 11, bubble: 13 }
      },
      {
        id: "abs-comfort",
        label: "补发试用员工工牌",
        strategy: "comfort",
        strategyLabel: "安抚型",
        reaction: "安抚落章: 腹部把试用员工工牌擦亮，士气回到地面以上。",
        deltas: { cash: -9, morale: 12, growth: 4, bubble: 1 }
      },
      {
        id: "abs-push",
        label: "要求概念形态出席",
        strategy: "push",
        strategyLabel: "推进型",
        reaction: "推进落章: 腹部宣布参与下一轮，但只以概念形态出席。",
        deltas: { cash: -8, morale: 3, growth: 16, bubble: 6 }
      },
      {
        id: "abs-deflect",
        label: "移交给灯光组处理",
        strategy: "deflect",
        strategyLabel: "转移型",
        reaction: "转移落章: 可见度问题交给灯光组，腹部先保留神秘感。",
        deltas: { cash: 5, morale: -1, growth: 2, bubble: -12 },
        riskTag: "灯光背锅 +1",
        nextHint: "下轮: 腹部传说部可能要求更多曝光预算。"
      }
    ]
  },
  {
    id: "resume-vote",
    speaker: "腿部事业群",
    speakerId: "legs",
    title: "复工前最终决议",
    proposal: "腿部同意继续营业，但要求把“站起来”从高风险动作降级为常规流程。",
    options: [
      {
        id: "resume-vision",
        label: "宣布站起是组织升级",
        strategy: "vision",
        strategyLabel: "愿景型",
        reaction: "愿景落章: 公司宣布站起来是组织升级，不是个人苦难。",
        deltas: { cash: 1, morale: 3, growth: 10, bubble: 10 }
      },
      {
        id: "resume-comfort",
        label: "发放复工边缘补贴",
        strategy: "comfort",
        strategyLabel: "安抚型",
        reaction: "安抚落章: 腿部拿到复工补贴，愿意先从椅子边缘试运行。",
        deltas: { cash: -11, morale: 15, growth: -1, bubble: -3 }
      },
      {
        id: "resume-push",
        label: "吹响下组复工号角",
        strategy: "push",
        strategyLabel: "推进型",
        reaction: "推进落章: 复工号角吹响，心肺财务部开始用眼神报警。",
        deltas: { cash: -12, morale: -2, growth: 19, bubble: 5 }
      },
      {
        id: "resume-deflect",
        label: "归责给地心引力",
        strategy: "deflect",
        strategyLabel: "转移型",
        reaction: "转移落章: 老板宣布由地心引力承担主要责任，众人勉强通过。",
        deltas: { cash: 7, morale: -2, growth: -3, bubble: -10 },
        riskTag: "重力争议 +1",
        nextHint: "下轮: 地心引力可能拒绝背锅。"
      }
    ]
  }
];

let variant = getVariant();
let timer = null;
let stampTimer = null;

const state = {
  phase: "opening",
  setNumber: 1,
  completedMeetings: 0,
  review: "",
  timeLeft: 60,
  activeAgenda: agenda,
  agendaIndex: 0,
  kpis: { cash: 54, morale: 50, growth: 45, bubble: 47 },
  history: [],
  strategyCounts: { vision: 0, comfort: 0, push: 0, deflect: 0 },
  crisisWatch: resetCrisisWatch(),
  crisisEvents: [],
  riskTags: [],
  roundRiskStartIndex: 0,
  roundCrisisStartIndex: 0,
  extensionSegments: 0,
  auditFocus: "",
  nextRoundHint: "下轮: 腿部事业群会继续讨价还价。",
  okr: { name: "下肢基建稳定交付", initial: 35, value: 35, roundStart: 35, lastDelta: 0 },
  lastResult: null,
  lastStamp: null,
  rating: null,
  report: null,
  isStamped: false,
  isExtension: false
};

render();

document.addEventListener("keydown", (event) => {
  if (["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
});

function getVariant() {
  const value = new URLSearchParams(window.location.search).get("variant") || "B";
  return variants.some(([key]) => key === value) ? value : "A";
}

function setVariant(next) {
  variant = next;
  const url = new URL(window.location.href);
  url.searchParams.set("variant", next);
  window.history.replaceState({}, "", url);
  render();
}

function cycleVariant(direction) {
  const index = variants.findIndex(([key]) => key === variant);
  const next = variants[(index + direction + variants.length) % variants.length][0];
  setVariant(next);
}

function render() {
  app.innerHTML = `
    <section class="phone ${needsShake() ? "shake-danger" : ""}">
      <div class="screen">
        ${renderPhase()}
      </div>
    </section>
    ${renderSwitcher()}
  `;
  bindActions();
}

function renderPhase() {
  if (state.phase === "opening") return renderOpening();
  if (state.phase === "training") return renderTraining();
  if (state.phase === "review") return renderReview();
  if (state.phase === "meeting") return renderMeeting();
  if (state.phase === "rating") return renderRating();
  return renderReport();
}

function renderOpening() {
  return `
    <section class="hero">
      <div>
        <p class="micro">Body Inc.</p>
        <h1 class="hero-title">下一组<br />再议</h1>
        <p class="hero-subtitle">下一组前，先开个小会。</p>
      </div>
      <div class="quick-config">
        <div class="locked-choice">
          <span class="micro">今日主练部门</span>
          <strong class="title-locked">腿部事业群</strong>
          <span class="hint">安全帽已戴好，膝盖暂未同意。</span>
        </div>
        <div class="choice-row">
          <div class="choice">30 秒<br /><span class="hint">碰头会</span></div>
          <div class="choice active">60 秒<br /><span class="hint">标准小会</span></div>
        </div>
      </div>
      <button class="primary-action" data-action="start">开始今日营业</button>
    </section>
  `;
}

function renderTraining() {
  return `
    <section class="training-screen">
      <div class="training-card">
        <p class="micro">腿部事业群</p>
        <h1>第 ${state.setNumber} 组业务冲刺中</h1>
        <div class="pulse-meter" aria-hidden="true"></div>
        <p class="hint">${state.nextRoundHint}</p>
      </div>
      <button class="primary-action" data-action="complete-set">完成本组</button>
      <button class="secondary-action" data-action="shutdown">今日歇业</button>
    </section>
  `;
}

function renderReview() {
  const options = [
    ["超额完成", "这组很轻松，甚至有点膨胀。"],
    ["正常交付", "刚刚好，符合预期。"],
    ["濒临破产", "累得不行，但还活着。"],
    ["疑似注水", "感觉练了，但身体不认账。"]
  ];

  return `
    <section class="review">
      <p class="micro">本组业绩复盘</p>
      <h1>本组业绩如何？</h1>
      ${options
        .map(
          ([title, copy]) => `
            <button class="secondary-action review-option" data-action="review" data-review="${title}">
              <strong>${title}</strong>
              <span class="hint">${copy}</span>
            </button>
          `
        )
        .join("")}
    </section>
  `;
}

function renderMeeting() {
  const issue = currentIssue();
  const variantClass = `variant-${variant.toLowerCase()}`;
  const commonTop = renderTopbar();
  if (variant === "B") {
    return `
      <section class="variant-layout ${variantClass}">
        ${commonTop}
        ${renderAuditCrisisPanel()}
        ${renderKpis("large")}
        ${renderProposal(issue, true)}
        ${renderOptions(issue)}
        ${renderResult()}
      </section>
    `;
  }
  if (variant === "C") {
    return `
      <section class="variant-layout ${variantClass}">
        ${commonTop}
        ${renderAgendaStack()}
        ${renderProposal(issue)}
        <div class="snapshot">
          <h3>复工窗口</h3>
          ${renderKpis()}
          ${renderResult()}
        </div>
        ${renderOptions(issue)}
      </section>
    `;
  }
  return `
    <section class="variant-layout ${variantClass}">
      ${commonTop}
      ${renderScene(issue)}
      ${renderKpis()}
      ${renderProposal(issue)}
      ${renderResult()}
      ${renderOptions(issue)}
    </section>
  `;
}

function renderTopbar() {
  return `
    <div class="topbar">
      <div class="brand">
        <strong>组间小会</strong>
        <span>第 ${state.setNumber} 组后 · ${state.review || "正常交付"}</span>
      </div>
      <div class="timer ${state.timeLeft <= 10 ? "danger" : ""}">
        <strong>${String(state.timeLeft).padStart(2, "0")}</strong>
        <span>秒</span>
      </div>
    </div>
    <div class="status-strip">
      <span class="agenda-count">议题 ${Math.min(state.agendaIndex + 1, state.activeAgenda.length)} / ${state.activeAgenda.length}</span>
      <button class="tiny-action" data-action="early">提前复工</button>
    </div>
  `;
}

function renderAuditCrisisPanel() {
  const warnings = getActiveWarnings();
  const recentCrises = getRoundCrisisEvents().slice(-2);
  const crisisText = [...warnings, ...recentCrises.map((item) => `危机: ${item.label}`)];
  return `
    <section class="audit-panel">
      <div>
        <span class="micro">本轮审计重点</span>
        <strong>${state.auditFocus}</strong>
      </div>
      <div class="crisis-strip ${crisisText.length ? "has-crisis" : ""}">
        <span class="micro">危机提示区</span>
        <strong>${crisisText.length ? crisisText.join(" / ") : "暂无危机，审计员还在喝水。"}</strong>
      </div>
    </section>
  `;
}

function renderScene(issue) {
  return `
    <div class="meeting-scene">
      <div class="character-row">
        ${characters
          .map(
            (character) => `
              <div class="character ${character.id === issue.speakerId ? "active" : ""}">
                <span class="face">${character.face}</span>
                <span>${character.name}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function renderProposal(issue, compact = false) {
  return `
    <article class="proposal ${compact ? "compact" : ""} ${state.isStamped ? "stamped" : ""}">
      <span class="speaker">${issue.speaker}</span>
      <h2>${issue.title}</h2>
      <p>${issue.proposal}</p>
      <div class="ink">${state.lastStamp || "啪"}</div>
    </article>
  `;
}

function renderKpis(size = "") {
  return `
    <div class="kpi-grid ${size}">
      ${Object.entries(kpiMeta)
        .map(([key, meta]) => {
          const value = state.kpis[key];
          const danger = getDangerType(value);
          const watch = state.crisisWatch[key];
          const status = value < targetZone.min ? "low" : value > targetZone.max ? "high" : "safe";
          const dangerClass = danger ? "danger-kpi" : "";
          const watchClass = watch?.status === "warning" ? "warn-kpi" : watch?.status === "crisis" ? "crisis-kpi" : "";
          return `
            <div class="kpi ${status} ${dangerClass} ${watchClass}">
              <div class="kpi-head">
                <span>${meta.icon} ${meta.name}</span>
                <span class="kpi-value">${value}</span>
              </div>
              <div class="kpi-track" aria-label="${meta.name} ${value}, 可复工区 ${targetZone.min} 到 ${targetZone.max}">
                <span class="kpi-needle" style="left: ${value}%"></span>
              </div>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderResult() {
  if (!state.lastResult) {
    return `
      <div class="result-panel">
        <strong>会议秘书待命</strong>
        <span class="result-detail">动作名会骗人，但策略类型会留下痕迹。数值等盖下去再说。</span>
      </div>
    `;
  }
  return `
    <div class="result-panel">
      <strong>${state.lastResult.reaction}</strong>
      <div class="delta-row">
        ${Object.entries(state.lastResult.deltas)
          .map(([key, value]) => {
            const label = kpiMeta[key].name;
            const sign = value > 0 ? "+" : "";
            const kind = value >= 0 ? "plus" : "minus";
            return `<span class="delta ${kind}">${label} ${sign}${value}</span>`;
          })
          .join("")}
        ${state.lastResult.riskTag ? `<span class="delta risk">${state.lastResult.riskTag}</span>` : ""}
        ${state.lastResult.crises.map((item) => `<span class="delta risk">${item.label}</span>`).join("")}
      </div>
    </div>
  `;
}

function renderOptions(issue) {
  return `
    <div class="option-dock">
      ${issue.options
        .map((option) => {
          const meta = strategyMeta[option.strategy];
          return `
            <button class="option-card ${meta.className}" data-action="option" data-option="${option.id}">
              <span class="option-icon">${meta.icon}</span>
              <span class="option-label">${option.label}</span>
              <small>${option.strategyLabel}</small>
            </button>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAgendaStack() {
  return `
    <div class="agenda-stack">
      ${state.activeAgenda
        .map((item, index) => {
          const status = index < state.agendaIndex ? "done" : index === state.agendaIndex ? "current" : "";
          const mark = index < state.agendaIndex ? "已盖" : index === state.agendaIndex ? "当前" : "待议";
          return `<div class="agenda-pill ${status}"><span>${item.title}</span><span>${mark}</span></div>`;
        })
        .join("")}
    </div>
  `;
}

function renderRating() {
  const rating = state.rating || buildRating("临时结算");
  const okr = state.okr;
  const risks = getRoundRiskTags();
  return `
    <section class="rating">
      <div class="rating-card">
        <div class="rating-badge">${rating.badge}</div>
        <p class="micro">复工评级</p>
        <h1 class="rating-title">${rating.title}</h1>
        <p>${rating.copy}</p>
        <div class="report-line">
          <strong>部门 OKR 推进</strong>
          <span>${okr.name} ${okr.roundStart}% -> ${okr.value}%${okr.lastDelta ? `（+${okr.lastDelta}）` : "（+0）"}</span>
        </div>
        <div class="report-line">
          <strong>新增风险标签</strong>
          <span>${risks.length ? summarizeRisks(risks) : "暂无新增风险，审计员不太适应。"}</span>
        </div>
        <div class="report-line">
          <strong>下轮影响预告</strong>
          <span>${state.nextRoundHint}</span>
        </div>
        ${renderKpis()}
      </div>
      <div class="action-grid">
        <button class="primary-action" data-action="next-set">进入下一组</button>
        <button class="secondary-action" data-action="extend">延长 15 秒</button>
        <button class="secondary-action" data-action="report">今日歇业</button>
      </div>
    </section>
  `;
}

function renderReport() {
  const report = state.report || buildReport();
  return `
    <section class="report">
      <div class="report-card">
        <p class="micro">今日肉身财报</p>
        <h1>${report.title}</h1>
        <div class="report-meta">
          <span>OKR ${report.okr}</span>
          <span>${report.meetingSummary}</span>
          <span>${report.rating}</span>
        </div>
        <div class="report-line">
          <strong>风险汇总</strong>
          <span>${report.risks}</span>
        </div>
        <div class="report-line">
          <strong>最大内耗事件</strong>
          <span>${report.event}</span>
        </div>
        <div class="report-line">
          <strong>部门表现</strong>
          <span>${report.department}</span>
        </div>
      </div>
      <button class="primary-action" data-action="restart">再开一轮</button>
    </section>
  `;
}

function renderSwitcher() {
  const label = variants.find(([key]) => key === variant)?.[1] || "";
  return `
    <nav class="switcher" aria-label="prototype variants">
      <button data-action="variant-prev" aria-label="previous variant">‹</button>
      <span class="switcher-label">${variant} · ${label}</span>
      <button data-action="variant-next" aria-label="next variant">›</button>
    </nav>
  `;
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      const action = element.dataset.action;
      if (action === "start") startTraining();
      if (action === "complete-set") setPhase("review");
      if (action === "review") startMeeting(element.dataset.review);
      if (action === "option") useOption(element.dataset.option);
      if (action === "early") finishMeeting("仓促复工");
      if (action === "next-set") nextSet();
      if (action === "extend") extendRest();
      if (action === "report" || action === "shutdown") showReport();
      if (action === "restart") restart();
      if (action === "variant-prev") cycleVariant(-1);
      if (action === "variant-next") cycleVariant(1);
    });
  });
}

function setPhase(phase) {
  state.phase = phase;
  render();
}

function startTraining() {
  stopTimer();
  state.phase = "training";
  state.lastResult = null;
  state.lastStamp = null;
  state.isStamped = false;
  state.isExtension = false;
  render();
}

function startMeeting(review) {
  state.phase = "meeting";
  state.review = review;
  state.timeLeft = 60;
  state.activeAgenda = agenda;
  state.agendaIndex = 0;
  state.lastResult = null;
  state.lastStamp = null;
  state.isStamped = false;
  state.rating = null;
  state.report = null;
  state.isExtension = false;
  state.crisisWatch = resetCrisisWatch();
  state.roundRiskStartIndex = state.riskTags.length;
  state.roundCrisisStartIndex = state.crisisEvents.length;
  state.okr.roundStart = state.okr.value;
  applyReviewEffect(review);
  seedDangerWarnings();
  state.auditFocus = buildAuditFocus();
  startTimer();
  render();
}

function currentIssue() {
  return state.activeAgenda[Math.min(state.agendaIndex, state.activeAgenda.length - 1)];
}

function useOption(optionId) {
  if (state.phase !== "meeting") return;
  window.clearTimeout(stampTimer);

  const issue = currentIssue();
  const option = issue.options.find((item) => item.id === optionId);
  if (!option) return;

  state.strategyCounts[option.strategy] += 1;
  Object.entries(option.deltas).forEach(([key, value]) => {
    state.kpis[key] = clamp(state.kpis[key] + value, 0, 100);
  });

  if (option.riskTag) {
    state.riskTags.push(option.riskTag);
    state.nextRoundHint = option.nextHint || state.nextRoundHint;
  }

  const crises = updateCrisisAfterChoice(issue.title);
  if (crises.length) {
    state.nextRoundHint = buildNextRoundHint(crises[crises.length - 1]);
  }

  const meta = strategyMeta[option.strategy];
  state.lastStamp = meta.icon;
  state.lastResult = {
    issue: issue.title,
    option: option.label,
    stamp: option.strategyLabel,
    strategy: option.strategy,
    reaction: option.reaction,
    deltas: option.deltas,
    riskTag: option.riskTag || "",
    crises,
    snapshot: { ...state.kpis }
  };
  state.history.push(state.lastResult);
  state.isStamped = true;

  feedback();
  render();

  stampTimer = window.setTimeout(() => {
    state.isStamped = false;
    if (state.agendaIndex >= state.activeAgenda.length - 1) {
      finishMeeting("议题处理完毕");
    } else {
      state.agendaIndex += 1;
      render();
    }
  }, 940);
}

function finishMeeting(reason) {
  if (state.phase !== "meeting") return;
  stopTimer();
  window.clearTimeout(stampTimer);
  if (reason === "仓促复工") applyEarlyResumePenalty();
  state.rating = buildRating(reason);
  applyOkrProgress(state.rating);
  if (state.isExtension) {
    state.extensionSegments += 1;
  } else {
    state.completedMeetings += 1;
  }
  state.phase = "rating";
  state.isStamped = false;
  render();
}

function startTimer() {
  stopTimer();
  timer = window.setInterval(() => {
    state.timeLeft = Math.max(0, state.timeLeft - 1);
    if (state.timeLeft === 0) {
      finishMeeting("时间到");
    } else {
      render();
    }
  }, 1000);
}

function stopTimer() {
  if (timer) window.clearInterval(timer);
  timer = null;
}

function nextSet() {
  state.setNumber += 1;
  const cashPenalty = state.rating?.reason === "仓促复工" ? -8 : 0;
  state.kpis.cash = clamp(state.kpis.cash + cashPenalty - 2, 0, 100);
  startTraining();
}

function extendRest() {
  state.phase = "meeting";
  state.isExtension = true;
  state.timeLeft = 15;
  state.activeAgenda = [
    {
      id: "extra-rest",
      speaker: "大脑战略部",
      speakerId: "brain",
      title: "补充汇报",
      proposal: "既然老板延长会议，大脑战略部提交《再躺 15 秒也是生产力》。",
      options: [
        {
          id: "extra-vision",
          label: "定义为恢复型研发投入",
          strategy: "vision",
          strategyLabel: "愿景型",
          reaction: "愿景落章: 泡沫认为自己终于等到了战略窗口。",
          deltas: { cash: 1, morale: 0, growth: 3, bubble: 13 }
        },
        {
          id: "extra-comfort",
          label: "发糖换三口气",
          strategy: "comfort",
          strategyLabel: "安抚型",
          reaction: "安抚落章: 大脑闭嘴嚼糖，腿部偷偷多休了三口气。",
          deltas: { cash: -7, morale: 8, growth: -2, bubble: 2 }
        },
        {
          id: "extra-push",
          label: "改成复工动员会",
          strategy: "push",
          strategyLabel: "推进型",
          reaction: "推进落章: 补充汇报变成复工动员，听起来很贵。",
          deltas: { cash: -6, morale: -4, growth: 11, bubble: 6 }
        },
        {
          id: "extra-deflect",
          label: "记为环境因素",
          strategy: "deflect",
          strategyLabel: "转移型",
          reaction: "转移落章: 延长休息被记为环境因素，泡沫被迫撤回发言。",
          deltas: { cash: 5, morale: -1, growth: -3, bubble: -12 },
          riskTag: "环境因素 +1",
          nextHint: "下轮: 大脑战略部会要求更多恢复解释权。"
        }
      ]
    }
  ];
  state.agendaIndex = 0;
  state.lastResult = null;
  state.lastStamp = null;
  state.isStamped = false;
  state.rating = null;
  state.roundRiskStartIndex = state.riskTags.length;
  state.roundCrisisStartIndex = state.crisisEvents.length;
  state.riskTags.push("延长休息 +1");
  state.okr.roundStart = state.okr.value;
  state.okr.lastDelta = 0;
  state.kpis.bubble = clamp(state.kpis.bubble + 8, 0, 100);
  state.crisisWatch = resetCrisisWatch();
  seedDangerWarnings();
  state.auditFocus = buildAuditFocus();
  state.nextRoundHint = "下轮: 大脑战略部会要求解释为什么 15 秒也能开成会。";
  startTimer();
  render();
}

function showReport() {
  stopTimer();
  state.report = buildReport();
  state.phase = "report";
  render();
}

function restart() {
  stopTimer();
  Object.assign(state, {
    phase: "opening",
    setNumber: 1,
    completedMeetings: 0,
    review: "",
    timeLeft: 60,
    activeAgenda: agenda,
    agendaIndex: 0,
    kpis: { cash: 54, morale: 50, growth: 45, bubble: 47 },
    history: [],
    strategyCounts: { vision: 0, comfort: 0, push: 0, deflect: 0 },
    crisisWatch: resetCrisisWatch(),
    crisisEvents: [],
    riskTags: [],
    roundRiskStartIndex: 0,
    roundCrisisStartIndex: 0,
    extensionSegments: 0,
    auditFocus: "",
    nextRoundHint: "下轮: 腿部事业群会继续讨价还价。",
    okr: { name: "下肢基建稳定交付", initial: 35, value: 35, roundStart: 35, lastDelta: 0 },
    lastResult: null,
    lastStamp: null,
    rating: null,
    report: null,
    isStamped: false,
    isExtension: false
  });
  render();
}

function applyReviewEffect(review) {
  const effects = {
    超额完成: { cash: -3, morale: 6, growth: 11, bubble: 9 },
    正常交付: { cash: 0, morale: 3, growth: 5, bubble: 0 },
    濒临破产: { cash: -9, morale: -5, growth: 7, bubble: -4 },
    疑似注水: { cash: 3, morale: -3, growth: -7, bubble: 8 }
  };
  Object.entries(effects[review] || effects.正常交付).forEach(([key, value]) => {
    state.kpis[key] = clamp(state.kpis[key] + value, 0, 100);
  });
}

function seedDangerWarnings() {
  Object.keys(kpiMeta).forEach((key) => {
    const danger = getDangerType(state.kpis[key]);
    if (danger) state.crisisWatch[key] = { status: "warning", issueIndex: -1, direction: danger };
  });
}

function updateCrisisAfterChoice(issueTitle) {
  const triggered = [];
  Object.entries(kpiMeta).forEach(([key, meta]) => {
    const danger = getDangerType(state.kpis[key]);
    const watch = state.crisisWatch[key];

    if (!danger) {
      state.crisisWatch[key] = null;
      return;
    }

    if (!watch) {
      state.crisisWatch[key] = { status: "warning", issueIndex: state.agendaIndex, direction: danger };
      return;
    }

    if (watch.status === "warning" && state.agendaIndex > watch.issueIndex) {
      const label = danger === "low" ? meta.lowRisk : meta.highRisk;
      const event = {
        kpi: key,
        label,
        issue: issueTitle,
        value: state.kpis[key],
        message: `${meta.name}${danger === "low" ? "跌入" : "冲进"}危险区，审计组开始敲桌。`
      };
      state.crisisEvents.push(event);
      state.riskTags.push(label);
      state.crisisWatch[key] = { status: "crisis", issueIndex: state.agendaIndex, direction: danger };
      triggered.push(event);
    }
  });
  return triggered;
}

function buildAuditFocus() {
  const values = state.kpis;
  const lastRisk = state.riskTags[state.riskTags.length - 1] || "";
  if (lastRisk.includes("现金") || values.cash < targetZone.min) return "救现金流，别让泡沫爆表。";
  if (lastRisk.includes("泡沫") || values.bubble > targetZone.max) return "把泡沫压回现实，士气不能崩。";
  if (values.growth > targetZone.max) return "把增长压回现实，别让心肺财务部报警。";
  if (values.morale < targetZone.min) return "先保士气，别让腿部事业群趴桌。";
  if (getRoundCrisisEvents().length) return "今天不求完美，先别让大脑战略部接管。";
  return "四项都在绿区附近，别把好局开成大会。";
}

function buildRating(reason = "议题处理完毕") {
  const safeCount = Object.values(state.kpis).filter(
    (value) => value >= targetZone.min && value <= targetZone.max
  ).length;
  let level = 0;
  if (safeCount === 4) level = 3;
  else if (safeCount >= 2) level = 2;
  else if (safeCount >= 1) level = 1;

  const crisisCount = getRoundCrisisEvents().length;
  if (crisisCount === 1) level = Math.min(level, 2);
  if (crisisCount === 2) level = Math.min(level, 1);
  if (crisisCount >= 3) level = 0;
  if (reason === "仓促复工") level = Math.min(level, 2);

  const table = [
    {
      badge: "乱",
      title: "会议失控",
      copy: "复工可以继续，但本轮 OKR 基本被审计组按住了。"
    },
    {
      badge: "缓",
      title: "建议缓一缓",
      copy: "指标还能看，风险也是真的。下一组最好别让同一个部门继续失火。"
    },
    {
      badge: "能",
      title: "勉强复工",
      copy: "没人完全满意，但大家都还愿意站起来营业。"
    },
    {
      badge: "准",
      title: "完美复工",
      copy: "四项基本落入可复工区，肉身集团罕见达成共识。"
    }
  ];
  const result = { ...table[level], level, safeCount, crisisCount, reason };
  if (reason === "仓促复工") {
    result.copy = "复工优先通过，但审计目标还没盖完章；这次只能算能营业，不能算漂亮。";
  }
  return result;
}

function applyOkrProgress(rating) {
  if (state.isExtension) {
    state.okr.lastDelta = 0;
    return;
  }

  const base = [0, 6, 15, 25][rating.level];
  const caps = [Infinity, 12, 6, 0];
  const crisisCap = caps[Math.min(rating.crisisCount, 3)];
  const reasonCap = rating.reason === "仓促复工" ? 6 : Infinity;
  const cap = Math.min(crisisCap, reasonCap);
  const delta = Math.max(0, Math.min(base, cap, 100 - state.okr.value));
  state.okr.lastDelta = delta;
  state.okr.value = clamp(state.okr.value + delta, 0, 100);
}

function applyEarlyResumePenalty() {
  state.riskTags.push("仓促复工 +1");
  state.nextRoundHint = "下轮: 心肺财务部将带着未审预算入场。";
}

function buildNextRoundHint(event) {
  if (!event) return state.nextRoundHint;
  if (event.kpi === "cash") return "下轮: 心肺财务部将优先发难。";
  if (event.kpi === "bubble") return "下轮: 大脑战略部会带着泡沫审计报告入场。";
  if (event.kpi === "morale") return "下轮: 腿部事业群可能先趴桌再发言。";
  if (event.kpi === "growth") return "下轮: 增长曲线会要求解释自己为什么抖。";
  return "下轮: 审计组会提前到场。";
}

function buildReport() {
  const hasFullMeeting = state.completedMeetings > 0;
  const rating = state.rating || (hasFullMeeting ? buildRating() : { title: "未开会", level: 0 });
  const topStrategy = Object.entries(state.strategyCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
  const riskText = summarizeRisks(state.riskTags);
  let title = hasFullMeeting ? "勉强复工型腿日" : "业务试探型开张";

  if (!hasFullMeeting) title = "业务试探型开张";
  else if (riskText.includes("泡沫")) title = "泡沫驱动型腿日";
  else if (riskText.includes("现金流") || riskText.includes("预算")) title = "现金流紧张型冲刺";
  else if (riskText.includes("PPT") || riskText.includes("大脑")) title = "大脑接管型休息";
  else if (topStrategy === "vision") title = "画饼续命型复工";
  else if (topStrategy === "push") title = "低质量高意志训练";
  else if (topStrategy === "deflect") title = "历史遗留型经营";
  if (hasFullMeeting && state.okr.value >= 80 && state.crisisEvents.length === 0) title = "罕见共识型经营";
  if (hasFullMeeting && rating.title === "会议失控" && !riskText.includes("现金流")) title = "大脑接管型休息";

  return {
    title,
    okr: `${state.okr.initial}% -> ${state.okr.value}%`,
    meetingSummary: buildMeetingSummary(),
    rating: rating.title,
    risks: riskText || (hasFullMeeting ? "暂无风险标签，审计员今天没找到存在感。" : "暂无风险标签；今天只有开张试探，审计员还没入座。"),
    event: hasFullMeeting ? getBestEvent() : "尚未召开组间小会，财务部只拿到一张开张意向书。",
    department: hasFullMeeting
      ? "腿部事业群完成一轮业务冲刺，并把站起来重新定义为跨部门协作。"
      : "腿部事业群仍在热身，今日经营数据保持空白但诚实。"
  };
}

function getBestEvent() {
  if (!state.history.length) return "大脑战略部试图把休息包装成战略沉淀。";
  const scored = state.history
    .map((item) => {
      const swing = Object.values(item.deltas).reduce((sum, value) => sum + Math.abs(value), 0);
      const crisisBonus = item.crises.length * 18;
      const funnyBonus = item.reaction.includes("PPT") || item.reaction.includes("泡沫") ? 8 : 0;
      return { item, score: swing + crisisBonus + funnyBonus };
    })
    .sort((a, b) => b.score - a.score)[0].item;
  return `${scored.option}处理“${scored.issue}”: ${scored.reaction}`;
}

function summarizeRisks(tags) {
  if (!tags.length) return "";
  const counts = tags.reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(counts)
    .map(([tag, count]) => (count > 1 ? `${tag} x${count}` : tag))
    .join(" / ");
}

function buildMeetingSummary() {
  const base = `${state.completedMeetings} 次小会`;
  if (!state.extensionSegments) return base;
  return `${base} + ${state.extensionSegments} 个追加议题`;
}

function getRoundRiskTags() {
  return state.riskTags.slice(state.roundRiskStartIndex);
}

function getRoundCrisisEvents() {
  return state.crisisEvents.slice(state.roundCrisisStartIndex);
}

function getActiveWarnings() {
  return Object.entries(state.crisisWatch)
    .filter(([, watch]) => watch?.status === "warning")
    .map(([key]) => `预警: ${kpiMeta[key].name}`);
}

function resetCrisisWatch() {
  return { cash: null, morale: null, growth: null, bubble: null };
}

function getDangerType(value) {
  if (value < dangerZone.low) return "low";
  if (value > dangerZone.high) return "high";
  return null;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function feedback() {
  const phone = document.querySelector(".phone");
  phone?.classList.add("stamp-flash");
  window.setTimeout(() => phone?.classList.remove("stamp-flash"), 360);
  if (navigator.vibrate) navigator.vibrate([18, 28, 24]);
  playStampSound();
}

function playStampSound() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.value = 120;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.11);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.12);
  } catch (error) {
    // Audio feedback is best effort in the prototype.
  }
}

function needsShake() {
  return Object.values(state.kpis).some((value) => value < 28 || value > 84);
}
