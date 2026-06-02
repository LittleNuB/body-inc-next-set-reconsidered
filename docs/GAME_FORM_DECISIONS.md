# Game Form Decisions

Last updated: 2026-06-02

## Status Note

This document records the older hackathon / roadshow form decisions. It is still useful historical context, especially for KPI naming and complexity progression, but it is no longer the active source of truth.

For current product direction, use `docs/GAMEPLAY_DIRECTION.md`.

Current active prototype: `prototype-mobile-slice`.

Current interaction finding: persistent bottom action panels make the mobile game feel like a dashboard and shrink the office scene. The preferred slice interaction is now:

1. Tap a visible office incident.
2. Open a temporary event sheet with concrete event description.
3. Choose a handling method.
4. Close the sheet and return to the office scene.

## Locked Direction

The game form now splits the experience into two explicit paths:

- **现场体验者默认动线**: 初创期试营业 30 秒.
- **路演展示动线**: 直接进入 60 秒完整小会 / Demo Mode.

The default player path should teach only one rule:

> 肉身集团不是把指标拉满，而是把身体状态调进绿色可复工窗口。太低会垮，太高会失控，中间才适合复工。

## Lifecycle Structure

Use the company lifecycle as progressive disclosure, not as a heavy progression system.

1. **初创期 / 试营业**
   - 30 秒.
   - 2 KPIs: 供氧周转、动员温度.
   - 2 action types: 安抚型、推进型.
   - Purpose: teach that the middle green band is the target.

2. **发展期 / 完整小会**
   - 60 秒.
   - Adds 刺激强度、泡沫指数.
   - Adds 愿景型、转移型.
   - Purpose: show tradeoffs and the body-company premise.

3. **壮大期 / 审计介入**
   - Adds risk tags, crisis warnings, crisis events, OKR progress, and next-round fallout.
   - Purpose: choices stop feeling like random jokes.

4. **上市期 / 肉身财报**
   - Produces the screenshotable result.
   - Purpose: close the loop for voting, sharing, and route comparison.

For the hackathon prototype, implement **初创期** and **完整小会 / 审计 / 财报**. Do not build a long-term lifecycle progression yet.

## KPI Names

Final status-style KPI names:

- **供氧周转**: too low means oxygen/resource shortage; too high means the body is burning resources too aggressively.
- **动员温度**: too low means the department is unwilling to move; too high means emotional overcommitment.
- **刺激强度**: too low means the set was not meaningful; too high means overload pressure.
- **泡沫指数**: too low means no narrative belief; too high means self-deception and excuse inflation.

These names intentionally sound like gauges, pressure, and temperature, so the middle target reads naturally.

## Onsite Player Flow

1. Open the prototype.
2. Default primary action: **试营业 30 秒**.
3. Show only 供氧周转 and 动员温度.
4. Show only two actions per issue.
5. After two issues, show a rating and let the player enter the full meeting or end with a report.

This path should be understandable without explanation.

## Roadshow Flow

The roadshow should not spend time proving the tutorial. It should use the secondary entry:

1. Tap **直接开完整小会**.
2. Point out the green 可复工窗口.
3. Use one 愿景型 choice to push 泡沫指数 upward.
4. Trigger a warning or crisis.
5. Recover or fail softly.
6. Show 复工评级 and 今日肉身财报.
7. Explain that AI later acts as the meeting secretary while rules stay deterministic.
