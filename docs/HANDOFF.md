# Handoff: 《下一组再议》 / Body Inc.

## Project

This project is for the VibeFriends x 张江AI创新小镇 x Aseed+ 24h Vibe Coding hackathon.

Theme: **Vibe Coding for 1分钟小游戏**.

Current game:

**《下一组再议》 / Body Inc.**  
Subtitle: **下一组前，先开个小会。**

## Read First

1. Main PRD:
   `docs/PRD-next-set-reconsidered.md`

2. Proof-of-fun plan:
   `docs/PROOF_OF_FUN.md`

3. Current prototype notes:
   `prototype-proof-of-fun/NOTES.md`

4. Playable prototype:
   `prototype-proof-of-fun/index.html`

Use the PRD as the product source of truth, but treat the proof-of-fun files and latest review notes below as the current working priority.

## Current Direction

The project is a mobile-first Web PWA for gym rest intervals.

The player is the草台老板 of a body-company. After each real workout set, anthropomorphized body departments hold a short **组间小会**. Departments raise absurd proposals, and the player chooses context-specific actions that map to four stable strategy types:

- **愿景型**: old "画饼"; usually raises growth and bubble.
- **安抚型**: old "发糖"; usually raises morale and spends cash.
- **推进型**: old "打鸡血"; usually pushes growth hard, with resource or morale cost.
- **转移型**: old "甩锅"; no longer one-time, but always has a cost through risks, fallout, or future trouble.

The four moment-to-moment KPIs are:

- 现金流
- 士气
- 增长
- 泡沫

All four KPIs aim for the middle **可复工区**, not max value.

The current prototype has moved beyond static funny text. It now includes:

- contextual choices per agenda item
- visible strategy labels
- round audit focus
- crisis warnings and crisis events
- soft penalties
- one-way department OKR progress
- risk tags
- next-round fallout previews
- rating and肉身财报

## Current Prototype Files

Prototype directory:

`prototype-proof-of-fun`

Main files:

- `prototype-proof-of-fun/index.html`
- `prototype-proof-of-fun/styles.css`
- `prototype-proof-of-fun/app.js`
- `prototype-proof-of-fun/NOTES.md`

Run:

```powershell
start .\prototype-proof-of-fun\index.html
```

Variant URLs:

- `prototype-proof-of-fun/index.html?variant=A`: meeting-table first.
- `prototype-proof-of-fun/index.html?variant=B`: KPI cockpit first.
- `prototype-proof-of-fun/index.html?variant=C`: agenda stack plus report pressure.

Current product/design priority is **Variant B**. A/C only need to remain runnable.

## Most Important Design Concern

Demand, pain point, and scenario are considered valid:

- Gym rest intervals are a real 30-120 second window.
- Users want a distraction but should not be swallowed by short videos/social feeds.
- The body-company meeting metaphor is memorable.

The missing/fragile piece is **game design / toy-core fun**.

The project must avoid becoming:

- a fitness timer with jokes
- a Reigns-like skin
- an interactive段子播放器
- a productivity/company metaphor that feels like more work during rest

The agent's job should be understood as:

> 守住“好玩”这件事: help turn an interesting concept into a playable 60-second mechanism with stakes, regret, feedback, and one-more-round pressure.

## Latest Prototype Review Findings

The latest optimized prototype is directionally better, but has several gameplay/logic issues that should be addressed before more expansion.

### P1: Early Resume Can Farm Rewards

`提前复工` currently calls `finishMeeting("仓促复工")`, but the rating and OKR logic do not penalize that reason. In a safe opening state, the player can skip every agenda item and receive a high rating/OKR progress.

Recommended fix:

- Add a risk tag such as `仓促复工 +1`.
- Cap early-resume rating, e.g. max `勉强复工`.
- Cap OKR progress, e.g. max +6 or +8.
- Add next-round fallout, e.g. `下轮: 心肺财务部将带着未审预算入场。`

### P1: Crisis Count Is Session-Wide, Not Round-Scoped

Rating and OKR use total `state.crisisEvents.length`, so crises from an earlier meeting permanently suppress later meeting results.

Recommended fix:

- Add `roundCrisisStartIndex`, analogous to `roundRiskStartIndex`.
- Rating/OKR should use only crises triggered in the current round.
- 财报 can still summarize all session risks/crises.

### P2: Extend Rest Can Double-Count OKR/Meetings

`延长 15 秒` starts a new meeting segment. When it ends, `finishMeeting` applies OKR progress again and increments meeting count again.

Recommended fix:

- Mark extension rounds with `isExtension`.
- Either do not award full OKR for extension, or award only delta correction.
- Do not increment `completedMeetings` as a full meeting, or label it separately as追加议题.

### P3: Report Shows One Meeting Even With Zero Meetings

The report currently forces `meetings >= 1`. If the user starts training and immediately chooses 今日歇业, the report still claims one meeting.

Recommended fix:

- Show 0 honestly, or use special copy for `业务试探`.

### P3: Test Script Still Says Start With A

Current `prototype-proof-of-fun/NOTES.md` still says testers should open Variant A first, while current design priority is Variant B.

Recommended fix:

- Make B the default test flow.
- Use A/C only as layout comparisons.

## Recommended Next Step

Do not add AI, departments, art, persistence, or production architecture yet.

First fix the prototype logic issues above, then run a small user test on Variant B.

Validation question:

> Does the player now care about KPI movement because it affects OKR progress, risk labels, next-round fallout, and the possibility of almost-but-not-quite perfect复工?

## Suggested Skills

- `diagnose`: if fixing prototype logic bugs or state flow regressions.
- `prototype`: if exploring another throwaway mechanic or UI variant.
- `browser:browser`: to open and interact with the local prototype in Codex's browser.
- `playwright`: for repeatable mobile screenshot/flow checks.
- `imagegen`: later, if generating body-part character assets.
- `to-issues`: only after the proof-of-fun loop is validated.

## Suggested Opening Prompt For A New Codex Chat

```text
请先阅读：
1. docs/PRD-next-set-reconsidered.md
2. docs/PROOF_OF_FUN.md
3. docs/HANDOFF.md
4. prototype-proof-of-fun/NOTES.md

我们正在做 Vibe Coding 24h 黑客松项目《下一组再议》/ Body Inc.。

你的职责不是继续扩世界观，而是守住“好玩”：把当前 proof-of-fun 原型从“好笑的互动段子”继续推向一个 60 秒内有目标、有奖惩、有遗憾、有再来一局压力的小游戏。

当前主攻 Variant B（KPI 指挥台优先）。A/C 只需保持可跑。

请优先处理 docs/HANDOFF.md 里的最新 review findings：
1. 提前复工可以白嫖高评级和 OKR
2. 危机计数是全 session 累计，应该按本轮计算
3. 延长休息会重复发 OKR/会议次数
4. 0 次小会的财报显示不可信
5. NOTES 测试脚本应改为先测 B

修完后请用 node --check 验证 app.js，并用浏览器/Playwright 手动跑通 B 变体一轮，重点观察审计目标、危机提示、危机触发、OKR 推进、风险标签、下轮预告和今日财报是否都符合预期。
```

