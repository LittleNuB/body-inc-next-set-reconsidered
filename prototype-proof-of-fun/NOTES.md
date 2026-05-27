# Proof-of-Fun Prototype Notes

This is a throwaway prototype for 《下一组再议》 / Body Inc.

Question: can one 60-second rest meeting feel fun enough to beat a generic小游戏 plus timer?

Run:

```powershell
start .\prototype-proof-of-fun\index.html
```

Direct open now defaults to Variant B. To force the main proof-of-fun path, open `index.html?variant=B`.

Prototype shape:

- `?variant=A`: meeting-table first. Tests whether the body-company scene carries the premise in one glance.
- `?variant=B`: KPI cockpit first. Tests whether the可复工区 becomes instantly legible.
- `?variant=C`: agenda stack plus report pressure. Tests whether the session feels like it is building toward a screenshotable结算.

What is intentionally included:

- One training department: 腿部事业群.
- One 60-second meeting.
- Five hand-written agenda items.
- Four contextual choices per agenda item, each mapped to a stable strategy type: 愿景型 / 安抚型 / 推进型 / 转移型.
- Hidden numerical effects before stamping, explicit consequences after stamping.
- Four KPI instruments where the middle band is the target.
- Crisis warnings, soft crisis penalties, and one-way OKR progress.
- Rating and肉身财报 that use local rules, not AI.

What is intentionally excluded:

- Full department selection.
- Long-term milestones.
- Real persistence.
- AI calls.
- Production routing, tests, and error handling.

Current B-variant focus:

- Show the round audit focus before choices.
- Show crisis warnings when a KPI enters danger.
- Trigger a crisis if the KPI remains dangerous after the next agenda item.
- End each round with rating, OKR progress, risk tags, and next-round fallout.
- Cap 仓促复工 so it creates risk, cannot farm 完美复工, and cannot receive full OKR.
- Keep crisis penalties round-scoped for rating/OKR while the final report still summarizes the whole session.
- Treat 延长休息 as追加议题: it can add risk and change the final readout, but does not award another full meeting or OKR payout.
- Keep bad outcomes soft: less OKR progress, more risk labels, funnier reports, never a Game Over.

User-test script:

1. Ask the tester to open Variant B first and play without explanation.
2. Observe whether they notice the round audit focus and green middle KPI band before the second stamp.
3. Watch whether a crisis warning changes their next choice, and whether a crisis event feels like a fair consequence.
4. After the rating, check whether OKR progress, risk tags, and next-round fallout are noticed.
5. After the report, ask: "Which line would you screenshot?"
6. Use Variant A or C only as layout comparisons after the B run.

Pass signals:

- Laugh or visible smile in the first 30 seconds.
- They press stamps quickly without reading instructions.
- They notice a KPI entering/leaving the可复工区.
- They describe one stamp consequence as "that makes sense" or "that is funny".
- The report produces at least one line they would share.

Fail signals:

- They treat it as reading random jokes.
- They max out KPI bars because the middle target is unclear.
- They wait for the timer instead of wanting to stamp.
- The report feels like a generic summary instead of a punchline.

Agent verification:

- Run `node --check app.js` after prototype logic edits.
- The Playwright check used for the B flow lives at `output/playwright/verify-body-inc-b.js`.
- It covers 0-meeting report, 仓促复工 cap/risk/OKR, 延长休息 as追加议题, crisis warning/trigger, rating OKR/risk/next-round preview, and final report risk summary.
