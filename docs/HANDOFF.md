# Handoff: 《下一组再议》 / Body Inc.

## Project

This project started as a VibeFriends x 张江AI创新小镇 x Aseed+ 24h Vibe Coding hackathon entry, but the current goal is no longer hackathon delivery.

Current goal:

> Make a real mobile-first rest-interval game that fitness users would willingly play between sets.

Current game:

**《下一组再议》 / Body Inc.**  
Subtitle: **下一组前，先开个小会。**

## Read First

1. Current gameplay direction: `docs/GAMEPLAY_DIRECTION.md`
2. This handoff: `docs/HANDOFF.md`
3. Current mobile slice notes: `prototype-mobile-slice/NOTES.md`
4. Current mobile slice code: `prototype-mobile-slice/app.js`
5. Historical game form decisions: `docs/GAME_FORM_DECISIONS.md`
6. Historical proof-of-fun plan: `docs/PROOF_OF_FUN.md`
7. Legacy proof-of-fun notes: `prototype-proof-of-fun/NOTES.md`

Use `docs/GAMEPLAY_DIRECTION.md` as the current product/design source of truth. The older PRD and proof-of-fun files are useful history, but the latest working priority is the mobile slice.

## Current Direction

The project is a mobile-first Web PWA for gym rest intervals.

The player is the 草台老板 of a body-company. After each real workout set, anthropomorphized body departments hold a short **组间小会**. In the current mobile slice, visible office incidents are the main interaction targets. Tapping an incident opens a temporary event sheet with concrete description and handling choices that map to four stable strategy types:

- **愿景型**: old "画饼"; usually raises growth and bubble.
- **安抚型**: old "发糖"; usually raises morale and spends cash.
- **推进型**: old "打鸡血"; usually pushes growth hard, with resource or morale cost.
- **转移型**: old "甩锅"; no longer one-time, but always has a cost through risks, fallout, or future trouble.

The four moment-to-moment KPIs are status-style gauges:

- 供氧周转
- 动员温度
- 刺激强度
- 泡沫指数

All four KPIs aim for the middle **可复工区**, not max value.

AI boundary:

- AI may support expression variety later.
- AI must not control strategy, KPI deltas, incident rules, ratings, risks, or flow.
- The current mobile slice intentionally omits AI. It is testing the toy-core loop first.

## Current Mobile Slice

Directory:

`prototype-mobile-slice`

Main files:

- `prototype-mobile-slice/index.html`
- `prototype-mobile-slice/styles.css`
- `prototype-mobile-slice/app.js`
- `prototype-mobile-slice/NOTES.md`

Run with the local static server:

```powershell
node .\output\playwright\static-server.mjs .\prototype-mobile-slice 8770
```

Then open:

`http://127.0.0.1:8770/index.html`

Current state:

- Mobile portrait H5/PWA direction.
- One department: 腿部事业群.
- 30 / 60 / 90 second round choices.
- Main scene: pixel office with visible incidents.
- The round is framed as **办公室正在出事**, not an agenda list.
- Incidents appear as room cards: 腿部趴桌, 供氧账本变红, PPT 泡泡, 审计红灯, 刺激仪表, 历史文件.
- Tapping an incident opens a temporary event sheet with description and handling choices.
- Handling choices close after use and no longer occupy the bottom of the screen permanently.
- Incidents escalate during the rest timer if ignored.
- KPI devices remain in-scene.
- Settlement produces 今日肉身财报 and local Archive Wall records.

## Legacy Proof Of Fun

Legacy directory:

`prototype-proof-of-fun`

Main files:

- `prototype-proof-of-fun/index.html`
- `prototype-proof-of-fun/styles.css`
- `prototype-proof-of-fun/app.js`
- `prototype-proof-of-fun/NOTES.md`

Variant URLs:

- `prototype-proof-of-fun/index.html?variant=A`: meeting-table first.
- `prototype-proof-of-fun/index.html?variant=B`: KPI cockpit first.
- `prototype-proof-of-fun/index.html?variant=C`: agenda stack plus report pressure.

Legacy Variant B remains useful as historical proof-of-fun evidence, but the current product/design priority is `prototype-mobile-slice`.

## Most Important Design Concern

Demand, pain point, and scenario are considered valid:

- Gym rest intervals are a real 30-120 second window.
- Users want a distraction but should not be swallowed by short videos/social feeds.
- The body-company meeting metaphor is memorable.

The missing/fragile piece is **game design / toy-core fun**.

The project must avoid becoming:

- a fitness timer with jokes
- a Reigns-like skin
- an interactive 段子播放器
- a productivity/company metaphor that feels like more work during rest

The agent's job should be understood as:

> 守住“好玩”这件事: help turn an interesting concept into a playable short-session mechanism with stakes, regret, feedback, and one-more-round pressure.

## Recommended Next Step

Do not add AI, more departments, production persistence, or production architecture yet.

Next, test whether the incident event sheet loop is actually fun on mobile before expanding content.

Validation question:

> Does tapping visible office incidents, reading a short concrete event, and choosing a temporary handling method feel like a game rather than a dashboard?

Secondary checks:

- Does the office scene remain readable on mobile?
- Does the temporary event sheet avoid persistent screen occupation?
- Are consequences legible through incident severity, KPI devices, risk tags, and report text?
- Does overtime feel like rhythm pressure rather than punishment?

## Suggested Skills

- `diagnose`: if fixing prototype logic bugs or state flow regressions.
- `prototype`: if exploring another throwaway mechanic or UI variant.
- `browser:browser`: to open and interact with the local prototype in Codex's browser.
- `playwright`: for repeatable mobile screenshot/flow checks.
- `imagegen`: later, if generating body-part character assets.
- `to-issues`: only after the mobile toy-core loop is validated.

## Suggested Opening Prompt For A New Codex Chat

```text
请先阅读：
1. docs/GAMEPLAY_DIRECTION.md
2. docs/HANDOFF.md
3. prototype-mobile-slice/NOTES.md
4. prototype-mobile-slice/app.js

我们正在做《下一组再议》/ Body Inc.，现在目标是移动端真实可玩游戏，不再以黑客松展示为导向。

你的职责不是继续扩世界观，而是守住“好玩”：把当前移动端切片从“有趣概念”继续推向一个适合健身组间休息的小游戏。

当前主攻 prototype-mobile-slice，不要继续扩旧 Variant。

请优先守住 docs/GAMEPLAY_DIRECTION.md 里的当前定稿：
1. 真实健身组间休息是主场景
2. 办公室事故是主要交互对象
3. 点击事故牌后弹出临时事件处理 sheet
4. 处理后回到主画面，不让底部处理面板长期占屏
5. 不急着加 AI、部门、资产或生产化架构

改动后请用 node --check 验证 app.js，并用浏览器/Playwright 跑通：
1. 90 秒移动端切片
2. 点击事故牌打开事件 sheet
3. 选择处理方式后 sheet 关闭
4. 行动计数、事故变化、KPI、风险、财报和档案墙
```
