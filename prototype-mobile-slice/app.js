const app = document.querySelector("#app");
const saveKey = "body-inc-mobile-slice-v2";

const targetZone = { min: 40, max: 68 };
const durationOptions = {
  30: { label: "快速会", actionLimit: 2, kpis: ["cash", "morale"], tools: ["comfort", "push"] },
  60: { label: "标准会", actionLimit: 4, kpis: ["cash", "morale", "growth"], tools: ["comfort", "push", "vision"] },
  90: { label: "恢复会", actionLimit: 5, kpis: ["cash", "morale", "growth", "bubble"], tools: ["comfort", "push", "vision", "deflect"] }
};

const kpiMeta = {
  cash: { name: "供氧周转", short: "供氧", low: "供氧赤字", high: "燃料过热" },
  morale: { name: "动员温度", short: "动员", low: "动员塌方", high: "情绪过热" },
  growth: { name: "刺激强度", short: "刺激", low: "刺激不足", high: "刺激过载" },
  bubble: { name: "泡沫指数", short: "泡沫", low: "叙事真空", high: "泡沫审计" }
};

const toolMeta = {
  comfort: { label: "安抚", icon: "糖", hint: "稳士气", className: "comfort" },
  push: { label: "推进", icon: "令", hint: "拉刺激", className: "push" },
  vision: { label: "愿景", icon: "饼", hint: "抬叙事", className: "vision" },
  deflect: { label: "转移", icon: "档", hint: "降泡沫", className: "deflect" }
};

const toolEffects = {
  comfort: { cash: -8, morale: 14, growth: -2, bubble: -2 },
  push: { cash: -8, morale: -4, growth: 14, bubble: 4 },
  vision: { cash: -2, morale: 4, growth: 8, bubble: 13 },
  deflect: { cash: 6, morale: -4, growth: -4, bubble: -12 }
};

const incidentOrder = ["legs_slumped", "oxygen_red", "ppt_bubble", "audit_lamp", "stim_shake", "file_pile"];
const incidentCatalog = {
  legs_slumped: {
    owner: "腿部事业群",
    title: "腿部趴桌",
    icon: "腿",
    line: "楼梯业务申请破产，腿部暂时趴桌。",
    detail: "它还愿意练，只是不想立刻站起来。",
    risk: "下肢怠工",
    impacts: { comfort: -1, push: -1, vision: 1, deflect: 1 }
  },
  oxygen_red: {
    owner: "心肺财务部",
    title: "供氧账本变红",
    icon: "账",
    line: "供氧账本变红，心肺财务部开始盯人。",
    detail: "预算够复工，但不能乱烧。",
    risk: "供氧透支",
    impacts: { comfort: -1, push: 1, vision: 1, deflect: -1 }
  },
  ppt_bubble: {
    owner: "大脑战略部",
    title: "PPT 泡泡膨胀",
    icon: "饼",
    line: "大脑把“再坐十秒”包装成战略沉淀。",
    detail: "PPT 已经挡住复工门。",
    risk: "战略泡沫",
    impacts: { comfort: 0, push: -1, vision: 1, deflect: -2 }
  },
  audit_lamp: {
    owner: "审计组",
    title: "审计红灯闪烁",
    icon: "灯",
    line: "审计组怀疑大家在重新定义“刚好”。",
    detail: "它不拦复工，只会贴风险。",
    risk: "审计保留意见",
    impacts: { comfort: 0, push: 1, vision: 1, deflect: -1 }
  },
  stim_shake: {
    owner: "刺激仪表",
    title: "刺激仪表抖动",
    icon: "针",
    line: "刺激仪表开始抖，热身和报修很难分。",
    detail: "推进派说这是好事。",
    risk: "刺激过载",
    impacts: { comfort: -1, push: 1, vision: 1, deflect: 0 }
  },
  file_pile: {
    owner: "档案柜",
    title: "历史文件堆高",
    icon: "档",
    line: "档案柜长出新文件，标签写着“以后再说”。",
    detail: "转移会降温，也会留账。",
    risk: "历史遗留",
    impacts: { comfort: -1, push: 1, vision: 1, deflect: 1 }
  }
};

const state = {
  phase: "home",
  duration: 90,
  timeLeft: 90,
  elapsed: 0,
  actionIndex: 0,
  selectedIncidentId: "legs_slumped",
  modalIncidentId: "",
  nextIncidentAt: 18,
  kpis: initialKpis(90),
  incidents: seedIncidents(90),
  risks: [],
  history: [],
  lastEventTitle: "",
  lastReaction: "",
  stamped: false,
  report: null,
  archive: loadArchive(),
  timer: null
};

render();

function render() {
  app.innerHTML = `<section class="phone"><div class="screen">${renderPhase()}</div></section>`;
  bindActions();
}

function renderPhase() {
  if (state.phase === "home") return renderHome();
  if (state.phase === "game") return renderGame();
  if (state.phase === "report") return renderReport();
  return renderArchive();
}

function renderHome() {
  const archive = state.archive;
  return `
    <section class="hero">
      <div>
        <p class="micro">Body Inc.</p>
        <h1 class="hero-title">下一组<br />再议</h1>
        <p class="hint">手机竖屏体验切片。先让腿部事业群试营业，看看休息时间能不能变成办公室救火。</p>
      </div>

      <div class="home-card">
        <div class="duty-card">
          ${renderSprite("legs")}
          <div>
            <p class="micro">今日值班部门</p>
            <h2 class="dept-title">腿部事业群</h2>
            <p class="hint">建议 ${recommendedDurationText()}，理由是楼梯业务仍在诉讼。</p>
          </div>
        </div>
        <div>
          <p class="micro">本轮休息时间</p>
          <div class="duration-row">
            ${Object.entries(durationOptions)
              .map(([seconds, config]) => {
                const active = Number(seconds) === state.duration ? "active" : "";
                return `<button class="duration-btn ${active}" data-action="duration" data-duration="${seconds}">
                  ${seconds} 秒<span>${config.label}</span>
                </button>`;
              })
              .join("")}
          </div>
        </div>
        <button class="primary" data-action="start">开始 ${state.duration} 秒小会</button>
        <button class="secondary" data-action="archive">档案墙</button>
      </div>

      <div class="topline">
        <span class="small">累计营业 ${archive.operatingDays.length} 日</span>
        <span class="small">小会 ${archive.meetingCount} 次</span>
      </div>
    </section>
  `;
}

function renderGame() {
  const config = durationOptions[state.duration];
  const activeKpis = config.kpis;
  const active = activeIncidents();
  if (!state.stamped) ensureSelectedIncident(active);
  const primaryIncident = active.find((incident) => incident.id === state.selectedIncidentId) || active[0];
  const primaryMeta = primaryIncident ? incidentCatalog[primaryIncident.id] : null;
  const modalIncident = state.modalIncidentId ? getIncident(state.modalIncidentId) : null;
  const canShowModal = modalIncident && modalIncident.severity > 0;
  const overtime = state.timeLeft < 0;
  const canAct = state.actionIndex < config.actionLimit;
  const actionText = `行动 ${state.actionIndex} / ${config.actionLimit}`;
  const pressureLeft = Math.max(0, state.nextIncidentAt - state.elapsed);
  const urgency = primaryIncident && primaryMeta ? `${primaryMeta.title}${"!".repeat(primaryIncident.severity)}` : "暂无事故";
  const pressureText = pressureLeft > 0 ? `${pressureLeft}s 后升级` : "即将升级";
  const speechTitle = state.lastEventTitle || (primaryMeta ? `最急：${primaryMeta.title}` : "办公室暂时安静");
  const speechHint = state.lastReaction || primaryMeta?.line || "点事故牌，选一个处理方式。";

  return `
    <section class="game">
      <div class="hud">
        <div class="hud-title">
          <strong>腿部事业群</strong>
          <div class="hint">${overtime ? "会议加班中" : "90 秒恢复会主测"}</div>
        </div>
        <div class="timer ${overtime ? "overtime" : ""}">${formatTimer(state.timeLeft)}</div>
        <div class="status-pills">
          <span>${actionText}</span>
          <span class="${pressureLeft <= 6 && canAct ? "hot-pill" : ""}">${canAct ? pressureText : "行动用完"}</span>
          <span class="urgent-pill">最急 ${urgency}</span>
        </div>
      </div>

      <div class="scene ${overtime ? "overtime" : ""} ${state.stamped ? "stamped" : ""} ${hasCrisis() ? "crisis" : ""}">
        <div class="wall-title">${overtime ? "会议加班" : "办公室正在出事"}</div>
        <div class="meeting-table"><div class="paper"><div class="stamp-mark">办</div></div></div>
        ${renderSprite("legs", hasActiveIncident("legs_slumped") ? "slumped" : "")}
        ${renderSprite("heart", hasActiveIncident("oxygen_red") ? "red" : "")}
        ${state.duration >= 60 ? renderSprite("brain", hasActiveIncident("ppt_bubble") ? "bubble" : "") : ""}
        ${state.duration >= 90 || hasActiveIncident("audit_lamp") || state.risks.length ? renderSprite("audit", hasActiveIncident("audit_lamp") ? "alarm" : "") : ""}
        ${renderIncidents(canAct && !state.stamped, state.selectedIncidentId)}
        <div class="speech">
          <span class="micro">${state.lastEventTitle ? "处理反馈" : primaryMeta?.owner || "会议秘书"}</span>
          <strong>${speechTitle}</strong>
          <div class="hint">${speechHint}</div>
        </div>
        <div class="device-row">
          ${Object.entries(kpiMeta)
            .map(([key, meta]) => renderDevice(key, meta, activeKpis.includes(key)))
            .join("")}
        </div>
      </div>

      <div class="tool-area">
        <div class="settle-row">
          <button class="primary" data-action="settle">复工结算</button>
          <button class="secondary" data-action="home">先不开了</button>
        </div>
      </div>
      ${canShowModal ? renderIncidentModal(modalIncident, config.tools, !canAct || state.stamped) : ""}
    </section>
  `;
}

function renderReport() {
  const report = state.report;
  return `
    <section class="report">
      <div class="report-card">
        <p class="micro">今日肉身财报</p>
        <h1>${report.title}</h1>
        <div class="report-meta">
          <span>${report.rating}</span>
          <span>${formatDuration(report.meetingSeconds)}</span>
        </div>
        <div class="report-line">
          <strong>公司文化</strong>
          <span>${report.culture}</span>
        </div>
        <div class="report-line">
          <strong>办公室余震</strong>
          <span>${report.unresolved ? `还有 ${report.unresolved} 级事故没完全摆平。` : "事故牌暂时翻面，大家假装没有看见桌下文件。"}</span>
        </div>
        <div class="report-line">
          <strong>风险贴纸</strong>
          <div class="chip-row">${report.risks.length ? report.risks.map((risk) => `<span class="chip">${risk}</span>`).join("") : '<span class="hint">暂无新增贴纸，审计组今天收工很早。</span>'}</div>
        </div>
        <div class="report-line">
          <strong>最大内耗事件</strong>
          <span>${report.event}</span>
        </div>
        <div class="report-line">
          <strong>下一轮值班</strong>
          <span>背部基建部已把工牌挂在门口。<button class="mini-btn" data-action="archive">调整轮值</button></span>
        </div>
      </div>
      <button class="primary" data-action="home">收好财报</button>
      <button class="secondary" data-action="archive">去档案墙</button>
    </section>
  `;
}

function renderArchive() {
  const archive = state.archive;
  const latest = archive.reports[0];
  return `
    <section class="archive">
      <div class="archive-card">
        <p class="micro">肉身集团</p>
        <h1>档案墙</h1>
        <div class="archive-grid">
          <div class="archive-stat"><span class="micro">公司文化</span><strong>${archive.culture || "试营业中"}</strong></div>
          <div class="archive-stat"><span class="micro">累计小会</span><strong>${archive.meetingCount}</strong></div>
          <div class="archive-stat"><span class="micro">累计营业日</span><strong>${archive.operatingDays.length}</strong></div>
          <div class="archive-stat"><span class="micro">会议总时长</span><strong>${formatDuration(archive.totalMeetingSeconds)}</strong></div>
        </div>
        <div class="report-line">
          <strong>轮值表</strong>
          <span>腿部事业群 -> 背部基建部 -> 胸部事业部。休息日记为集团停机维护，不推进轮值。</span>
        </div>
        <div class="report-line">
          <strong>部门履历</strong>
          <span>腿部事业群：楼梯争议 ${archive.meetingCount} 次，复工口号 ${archive.pushCount} 次。</span>
        </div>
        <div class="report-line">
          <strong>最近财报</strong>
          ${latest ? `<span>${latest.title} · ${latest.date}</span>` : '<div class="empty">暂无财报。先让腿部事业群开一次会。</div>'}
        </div>
        <div class="report-line">
          <strong>称号收藏</strong>
          <div class="chip-row">${archive.titles.length ? archive.titles.map((title) => `<span class="chip">${title}</span>`).join("") : '<span class="hint">还没有称号。财报秘书正在磨章。</span>'}</div>
        </div>
      </div>
      <button class="primary" data-action="home">返回首页</button>
    </section>
  `;
}

function renderDevice(key, meta, active) {
  const value = state.kpis[key];
  const status = !active ? "hidden" : dangerType(value) ? "danger" : value < targetZone.min || value > targetZone.max ? "warn" : "";
  return `
    <div class="device ${status}">
      <div class="device-name">${meta.short}</div>
      <div class="gauge"><span class="needle" style="left:${value}%"></span></div>
    </div>
  `;
}

function renderIncidentModal(incident, tools, disabled) {
  const meta = incidentCatalog[incident.id];
  return `
    <div class="modal-scrim" data-action="close-modal">
      <section class="incident-modal" role="dialog" aria-modal="true" aria-label="${meta.title}" data-stop-propagation="true">
        <div class="modal-head">
          <span class="micro">${meta.owner}</span>
          <button class="modal-close" data-action="close-modal" aria-label="关闭">×</button>
          <h2><b>${meta.icon}</b>${meta.title}</h2>
          <em>${"!".repeat(incident.severity)}</em>
        </div>
        <p class="modal-line">${meta.line}</p>
        <div class="modal-actions ${tools.length === 3 ? "three" : tools.length === 4 ? "four" : ""}">
          ${tools.map((tool) => renderModalAction(tool, incident.id, disabled)).join("")}
        </div>
      </section>
    </div>
  `;
}

function renderModalAction(tool, targetId, disabled) {
  const meta = toolMeta[tool];
  return `
    <button class="modal-action ${meta.className}" data-action="modal-tool" data-tool="${tool}" ${disabled ? "disabled" : ""}>
      <b>${meta.icon}</b>
      <span>${meta.label}</span>
      <small>${previewImpact(tool, targetId)}</small>
    </button>
  `;
}

function renderIncidents(enabled, selectedId) {
  const active = activeIncidents();
  if (!active.length) {
    return `<div class="incident-marker incident-clear"><b>稳</b><span>窗口已稳</span><em>OK</em></div>`;
  }
  return active
    .map((incident) => {
      const meta = incidentCatalog[incident.id];
      const selected = incident.id === selectedId ? "hot" : "";
      return `
        <button class="incident-marker incident-${incident.id} severity-${incident.severity} ${selected}" data-action="incident" data-incident="${incident.id}" ${enabled ? "" : "disabled"} aria-pressed="${selected ? "true" : "false"}">
          <b>${meta.icon}</b>
          <span>${meta.title}</span>
          <em>${"!".repeat(incident.severity)}</em>
        </button>
      `;
    })
    .join("");
}

function renderSprite(type, extraClass = "") {
  const bodyClass = `pixel-${type === "legs" ? "leg" : type}`;
  return `
    <div class="sprite ${type} ${extraClass}">
      <div class="${bodyClass}">
        <span class="eye left"></span>
        <span class="eye right"></span>
        <span class="mouth"></span>
        <span class="badge"></span>
      </div>
    </div>
  `;
}

function bindActions() {
  document.querySelectorAll("[data-action]").forEach((element) => {
    element.addEventListener("click", () => {
      const action = element.dataset.action;
      if (action === "duration") setDuration(Number(element.dataset.duration));
      if (action === "start") startGame();
      if (action === "incident") handleIncidentTap(element.dataset.incident);
      if (action === "modal-tool") useModalTool(element.dataset.tool);
      if (action === "close-modal") closeModal();
      if (action === "settle") settleRound();
      if (action === "archive") setPhase("archive");
      if (action === "home") setPhase("home");
    });
  });
  document.querySelectorAll("[data-stop-propagation]").forEach((element) => {
    element.addEventListener("click", (event) => event.stopPropagation());
  });
}

function setPhase(phase) {
  stopTimer();
  state.phase = phase;
  render();
}

function setDuration(duration) {
  state.duration = duration;
  render();
}

function startGame() {
  stopTimer();
  state.phase = "game";
  state.timeLeft = state.duration;
  state.elapsed = 0;
  state.actionIndex = 0;
  state.nextIncidentAt = nextEscalationInterval();
  state.kpis = initialKpis(state.duration);
  state.incidents = seedIncidents(state.duration);
  state.selectedIncidentId = pickUrgentIncidentId();
  state.modalIncidentId = "";
  state.risks = [];
  state.history = [];
  state.lastEventTitle = "";
  state.lastReaction = "";
  state.stamped = false;
  state.report = null;
  startTimer();
  render();
}

function startTimer() {
  state.timer = window.setInterval(() => {
    state.timeLeft -= 1;
    state.elapsed += 1;
    if (!state.stamped && state.elapsed >= state.nextIncidentAt) {
      escalatePressure();
      state.nextIncidentAt += nextEscalationInterval();
    }
    render();
  }, 1000);
}

function stopTimer() {
  if (state.timer) window.clearInterval(state.timer);
  state.timer = null;
}

function handleIncidentTap(incidentId) {
  const config = durationOptions[state.duration];
  const target = getIncident(incidentId);
  if (!target || target.severity <= 0 || state.stamped) return;
  if (state.actionIndex >= config.actionLimit) return;
  state.selectedIncidentId = incidentId;
  state.modalIncidentId = incidentId;
  state.lastEventTitle = "";
  state.lastReaction = "";
  render();
}

function closeModal() {
  state.modalIncidentId = "";
  render();
}

function useModalTool(tool) {
  const incidentId = state.modalIncidentId;
  if (!incidentId) return;
  state.modalIncidentId = "";
  useTool(tool, incidentId);
}

function useTool(tool, incidentId) {
  const config = durationOptions[state.duration];
  if (state.stamped) return;
  if (state.actionIndex >= config.actionLimit) return;
  if (!config.tools.includes(tool)) return;
  const target = getIncident(incidentId);
  if (!target || target.severity <= 0) return;

  const deltas = toolEffects[tool];
  Object.entries(deltas).forEach(([key, delta]) => {
    state.kpis[key] = clamp(state.kpis[key] + delta, 0, 100);
  });

  const changes = applyToolToIncidents(tool, incidentId);
  changes.push(...generateIncidentsFromKpis(tool));
  const newRisks = collectRisks(tool);
  state.risks.push(...newRisks);

  state.lastEventTitle = buildToolTitle(tool, incidentId);
  state.lastReaction = buildReaction(tool, incidentId, changes, newRisks);
  state.history.push({
    action: state.actionIndex + 1,
    tool,
    target: incidentId,
    eventTitle: state.lastEventTitle,
    reaction: state.lastReaction,
    risks: newRisks,
    incidents: activeIncidents().map((incident) => `${incidentCatalog[incident.id].title}${incident.severity}`)
  });

  state.stamped = true;
  state.nextIncidentAt = Math.max(state.nextIncidentAt, state.elapsed + Math.ceil(nextEscalationInterval() * 0.55));
  window.setTimeout(() => {
    state.stamped = false;
    state.actionIndex += 1;
    state.selectedIncidentId = pickUrgentIncidentId();
    state.modalIncidentId = "";
    if (state.phase === "game") render();
  }, 1050);
  render();
}

function settleRound() {
  stopTimer();
  const config = durationOptions[state.duration];
  const active = config.kpis;
  const overtime = Math.max(0, -state.timeLeft);
  const safeCount = active.filter((key) => inTarget(state.kpis[key])).length;
  const unresolved = activeIncidents().reduce((sum, incident) => sum + incident.severity, 0);
  const strongRisks = new Set(state.risks).size;
  const meetingSeconds = state.elapsed;

  let rating = "带事故复工";
  if (state.actionIndex === 0) rating = "未经会议复工";
  else if (unresolved === 0 && overtime === 0 && safeCount === active.length) rating = "准点复工";
  else if (overtime > 0 && safeCount >= Math.ceil(active.length / 2)) rating = "会议加班";
  else if (unresolved <= 3 && safeCount >= Math.ceil(active.length / 2)) rating = "勉强营业";
  if (unresolved >= 6 || strongRisks >= 3) rating = "审计保留意见";

  const culture = buildCulture(overtime, unresolved);
  const title = buildTitle(rating, culture);
  const event = buildEvent();
  const report = {
    date: todayKey(),
    title,
    rating,
    culture,
    duration: state.duration,
    overtime,
    meetingSeconds,
    risks: [...new Set(state.risks)],
    unresolved,
    event
  };

  state.report = report;
  saveReport(report);
  state.phase = "report";
  render();
}

function seedIncidents(duration) {
  const incidents = [
    { id: "legs_slumped", severity: 2 },
    { id: "oxygen_red", severity: duration === 30 ? 1 : 2 }
  ];
  if (duration >= 60) incidents.push({ id: "ppt_bubble", severity: 1 });
  if (duration >= 90) incidents.push({ id: "audit_lamp", severity: 1 });
  return incidents;
}

function activeIncidents() {
  return state.incidents
    .filter((incident) => incident.severity > 0)
    .sort((a, b) => b.severity - a.severity || incidentOrder.indexOf(a.id) - incidentOrder.indexOf(b.id));
}

function ensureSelectedIncident(active = activeIncidents()) {
  if (active.some((incident) => incident.id === state.selectedIncidentId)) return;
  state.selectedIncidentId = active[0]?.id || "";
}

function pickUrgentIncidentId() {
  return activeIncidents()[0]?.id || "";
}

function nextEscalationInterval() {
  if (state.duration === 30) return 10;
  if (state.duration === 60) return 14;
  return 18;
}

function escalatePressure() {
  const active = activeIncidents();
  const target = active.find((incident) => incident.severity < 3) || active[0];
  const change = target ? growIncident(target.id, 1) : growIncident("legs_slumped", 1);
  if (!change) return;

  const meta = incidentCatalog[change.id];
  state.selectedIncidentId = change.id;
  if (state.modalIncidentId && !hasActiveIncident(state.modalIncidentId)) state.modalIncidentId = "";
  state.lastEventTitle = `事故升级：${meta.title}`;
  state.lastReaction = change.next >= 3 ? `升到 ${change.next} 级，贴纸：${meta.risk} +1。` : `升到 ${change.next} 级，先处理它。`;
  if (change.next >= 3) state.risks.push(`${meta.risk} +1`);
}

function getIncident(id) {
  return state.incidents.find((incident) => incident.id === id);
}

function hasActiveIncident(id) {
  return Boolean(getIncident(id)?.severity);
}

function hasCrisis() {
  return activeIncidents().some((incident) => incident.severity >= 3) || state.risks.length >= 3;
}

function applyToolToIncidents(tool, targetId) {
  const changes = [];
  const target = getIncident(targetId);
  if (!target || target.severity <= 0) return changes;

  const targetDelta = incidentCatalog[target.id].impacts[tool] || 0;
  const targetPrev = target.severity;
  target.severity = clamp(target.severity + targetDelta, 0, 3);
  if (target.severity !== targetPrev) changes.push({ id: target.id, prev: targetPrev, next: target.severity, target: true });

  activeIncidents().forEach((incident) => {
    if (incident.id === targetId) return;
    const delta = incidentCatalog[incident.id].impacts[tool] || 0;
    if (delta <= 0) return;
    const prev = incident.severity;
    incident.severity = clamp(incident.severity + 1, 0, 3);
    if (incident.severity !== prev) changes.push({ id: incident.id, prev, next: incident.severity, target: false });
  });

  if (tool === "deflect" && !hasActiveIncident("file_pile")) {
    changes.push(growIncident("file_pile", 1));
  }

  return changes.filter(Boolean);
}

function generateIncidentsFromKpis(tool) {
  const changes = [];
  if (state.kpis.morale < 34) changes.push(growIncident("legs_slumped", 1));
  if (state.kpis.cash < 34) changes.push(growIncident("oxygen_red", 1));
  if (state.kpis.growth > 76) changes.push(growIncident("stim_shake", 1));
  if (state.kpis.bubble > 72) changes.push(growIncident("ppt_bubble", 1));
  if (durationOptions[state.duration].kpis.some((key) => dangerType(state.kpis[key]))) {
    changes.push(growIncident("audit_lamp", 1));
  }
  if (tool === "deflect" && activeIncidents().filter((incident) => incident.id !== "file_pile").length <= 1) {
    changes.push(growIncident("file_pile", 1));
  }
  return changes.filter(Boolean);
}

function growIncident(id, amount) {
  let incident = getIncident(id);
  if (!incident) {
    incident = { id, severity: 0 };
    state.incidents.push(incident);
  }
  const prev = incident.severity;
  incident.severity = clamp(incident.severity + amount, 0, 3);
  if (incident.severity === prev) return null;
  return { id, prev, next: incident.severity };
}

function collectRisks(tool) {
  const config = durationOptions[state.duration];
  const risks = new Set();
  config.kpis.forEach((key) => {
    const danger = dangerType(state.kpis[key]);
    if (!danger) return;
    const meta = kpiMeta[key];
    risks.add(`${danger === "low" ? meta.low : meta.high} +1`);
  });
  activeIncidents()
    .filter((incident) => incident.severity >= 3)
    .forEach((incident) => risks.add(`${incidentCatalog[incident.id].risk} +1`));
  if (tool === "deflect") risks.add("历史遗留 +1");
  if (state.timeLeft < 0) risks.add("会议加班 +1");
  return [...risks];
}

function previewImpact(tool, targetId) {
  const targetDelta = incidentCatalog[targetId]?.impacts[tool] || 0;
  const targetText = targetDelta < 0 ? "当前降" : targetDelta > 0 ? "当前升" : "当前稳";
  const sideCount = activeIncidents().filter((incident) => incident.id !== targetId && (incidentCatalog[incident.id].impacts[tool] || 0) > 0).length;
  const parts = [targetText];
  if (sideCount) parts.push("旁事升");
  if (tool === "deflect") parts.push("留遗留");
  return parts.join(" · ");
}

function buildToolTitle(tool, targetId) {
  const targetName = incidentCatalog[targetId]?.title || "现场事故";
  const titles = {
    comfort: `已安抚：${targetName}`,
    push: `已推进：${targetName}`,
    vision: `已包装：${targetName}`,
    deflect: `已转移：${targetName}`
  };
  return titles[tool] || "临时处理了一下现场。";
}

function buildReaction(tool, targetId, changes, risks) {
  const changeText = formatTargetChanges(changes, targetId);
  const riskText = risks.length ? `贴纸：${risks.slice(0, 2).join("、")}。` : "暂无新贴纸。";
  return `${changeText || "现场稳住。"} ${riskText}`;
}

function formatTargetChanges(changes, targetId) {
  const merged = mergeChanges(changes).filter((change) => change.prev !== change.next);
  const target = merged.find((change) => change.id === targetId);
  const sideEffects = merged.filter((change) => change.id !== targetId && change.next > change.prev).slice(0, 2);
  const parts = [];

  if (target) {
    const name = incidentCatalog[target.id].title;
    if (target.next < target.prev) parts.push(`${name}${target.next === 0 ? "清掉" : `降到 ${target.next}`}。`);
    else parts.push(`${name}升到 ${target.next}。`);
  } else {
    parts.push(`${incidentCatalog[targetId].title}暂稳。`);
  }

  if (sideEffects.length) {
    parts.push(
      `旁边：${sideEffects
        .map((change) => `${incidentCatalog[change.id].title}+${change.next - change.prev}`)
        .join("、")}。`
    );
  }

  return parts.join(" ");
}

function formatChanges(changes) {
  const usefulChanges = mergeChanges(changes).filter((change) => change.prev !== change.next);
  if (!usefulChanges.length) return "";
  const better = usefulChanges
    .filter((change) => change.next < change.prev)
    .slice(0, 2)
    .map((change) => `${incidentCatalog[change.id].title}${change.next === 0 ? "被按回可控区" : `降到 ${change.next} 级`}`);
  const worse = usefulChanges
    .filter((change) => change.next > change.prev)
    .slice(0, 2)
    .map((change) => `${incidentCatalog[change.id].title}升到 ${change.next} 级`);
  return [...better, ...worse].join("，") + "。";
}

function mergeChanges(changes) {
  const map = new Map();
  changes.forEach((change) => {
    if (!change) return;
    const saved = map.get(change.id);
    if (!saved) {
      map.set(change.id, { ...change });
      return;
    }
    saved.next = change.next;
  });
  return [...map.values()];
}

function buildOfficeSummary() {
  const active = activeIncidents();
  if (!active.length) return "事故牌暂时翻面，办公室像刚被老板路过。";
  const names = active.slice(0, 3).map((incident) => `${incidentCatalog[incident.id].title}${incident.severity}`);
  const suffix = active.length > 3 ? `等 ${active.length} 件` : "";
  return `现场剩余：${names.join(" / ")}${suffix}。`;
}

function buildAuditLine() {
  const bad = Object.entries(kpiMeta)
    .filter(([key]) => durationOptions[state.duration].kpis.includes(key))
    .find(([key]) => !inTarget(state.kpis[key]));
  if (!bad) return "审计组暂时找不到存在感，只好检查纸杯有没有编号。";
  const [, meta] = bad;
  return `${meta.name}还没进可复工窗口，办公室仍在冒小烟。`;
}

function buildCulture(overtime, unresolved) {
  const counts = state.history.reduce((acc, item) => {
    acc[item.tool] = (acc[item.tool] || 0) + 1;
    return acc;
  }, {});
  const topTool = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (unresolved >= 6) return "事故连锁型";
  if (overtime > 0) return "会议加班型";
  if (topTool === "comfort") return "福利安抚型";
  if (topTool === "push") return "强行动员型";
  if (topTool === "vision") return "泡沫叙事型";
  if (topTool === "deflect") return "历史遗留型";
  return "试营业观察型";
}

function buildTitle(rating, culture) {
  if (rating === "未经会议复工") return "裸奔复工型腿日";
  if (rating === "准点复工") return "罕见准点型腿日";
  if (rating === "审计保留意见") return "红灯闪烁型复工";
  if (culture === "事故连锁型") return "办公室抢救型休息";
  if (culture === "会议加班型") return "会议加班型休息";
  if (culture === "福利安抚型") return "糖水续命型营业";
  if (culture === "强行动员型") return "低质量高意志冲刺";
  if (culture === "泡沫叙事型") return "画饼续命型复工";
  if (culture === "历史遗留型") return "档案柜增殖型复工";
  return "带事故复工型腿日";
}

function buildEvent() {
  const last = state.history[state.history.length - 1];
  if (!last) return "腿部事业群尚未正式发难，会议室已经开始热身。";
  const firstLine = last.reaction.split("。").filter(Boolean)[0] || "现场暂时稳住";
  return `${last.eventTitle}: ${firstLine}。`;
}

function saveReport(report) {
  const archive = loadArchive();
  const day = todayKey();
  if (!archive.operatingDays.includes(day)) archive.operatingDays.push(day);
  archive.meetingCount += 1;
  archive.totalMeetingSeconds += report.meetingSeconds;
  archive.culture = report.culture;
  archive.pushCount += state.history.filter((item) => item.tool === "push").length;
  archive.reports.unshift(report);
  archive.reports = archive.reports.slice(0, 12);
  if (!archive.titles.includes(report.title)) archive.titles.unshift(report.title);
  archive.titles = archive.titles.slice(0, 16);
  state.archive = archive;
  window.localStorage.setItem(saveKey, JSON.stringify(archive));
}

function loadArchive() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(saveKey) || "{}");
    return {
      operatingDays: Array.isArray(saved.operatingDays) ? saved.operatingDays : [],
      meetingCount: Number(saved.meetingCount || 0),
      totalMeetingSeconds: Number(saved.totalMeetingSeconds || 0),
      culture: saved.culture || "",
      reports: Array.isArray(saved.reports) ? saved.reports : [],
      titles: Array.isArray(saved.titles) ? saved.titles : [],
      pushCount: Number(saved.pushCount || 0)
    };
  } catch {
    return { operatingDays: [], meetingCount: 0, totalMeetingSeconds: 0, culture: "", reports: [], titles: [], pushCount: 0 };
  }
}

function initialKpis(duration) {
  if (duration === 30) return { cash: 34, morale: 36, growth: 45, bubble: 47 };
  if (duration === 60) return { cash: 46, morale: 42, growth: 38, bubble: 50 };
  return { cash: 52, morale: 46, growth: 44, bubble: 62 };
}

function recommendedDurationText() {
  if (state.duration === 90) return "90 秒恢复预算";
  if (state.duration === 60) return "60 秒标准预算";
  return "30 秒秒杀预算";
}

function formatTimer(seconds) {
  if (seconds < 0) return `加班 +${formatDuration(Math.abs(seconds))}`;
  return formatDuration(seconds);
}

function formatDuration(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function todayKey() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function inTarget(value) {
  return value >= targetZone.min && value <= targetZone.max;
}

function dangerType(value) {
  if (value < 25) return "low";
  if (value > 80) return "high";
  return "";
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, Math.round(value)));
}
