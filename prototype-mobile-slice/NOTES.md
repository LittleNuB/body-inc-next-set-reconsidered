# Mobile Slice Notes

This is the first real-mobile-game slice for 《下一组再议》 / Body Inc.

It intentionally does not continue the old hackathon variant system. The goal is to test whether a player can understand and enjoy one gym-rest round mainly through visual state, short bubbles, and fast feedback.

Run:

```powershell
node .\output\playwright\static-server.mjs .\prototype-mobile-slice 8770
```

Then open `http://127.0.0.1:8770/index.html`.

Current slice scope:

- Mobile portrait only.
- One training department: 腿部事业群.
- Time choices: 30 / 60 / 90 seconds, with 90 秒恢复会 as the current main test path.
- Pixel office scene occupies the main screen area.
- The round is now framed as “办公室正在出事”, not an agenda list.
- Incidents appear directly in the room: 腿部趴桌, 供氧账本变红, PPT 泡泡, 审计红灯, 刺激仪表, 历史文件.
- Interaction is modal and temporary: tap an incident in the room to open its event sheet, choose a handling method there, then the sheet closes.
- Incidents slowly escalate during the rest timer if ignored; the 90 秒 path now escalates about every 18 seconds, with a short grace window after each handling choice.
- Tool count grows with duration: 2 / 3 / 4 tools.
- Each tool changes both KPI gauges and incident severity, so action feedback can create visible chains.
- The HUD shows action count instead of issue count.
- The HUD now foregrounds three things: action count, next escalation countdown, and the most urgent incident.
- Time-out enters 会议加班 instead of forcing an interrupt.
- 复工结算 produces a report and saves it locally.
- 档案墙 shows a minimal long-term record: culture, reports, rotation, titles, meeting count, operating days, and meeting time.

Validation questions:

- Does “办公室正在出事” make the player read the scene before reading text?
- Are incident cards legible enough on mobile without becoming another list?
- Does a temporary event sheet keep the main office readable while still giving the player real handling choices?
- Does timed incident escalation add urgency without becoming stressful during gym rest?
- Does each tool feel like a funny intervention with tradeoffs?
- Can the player understand KPI danger through the room state and gauges?
- Does 会议加班 feel like a useful rhythm warning instead of a punishment?
- Does the report/archive hint at long-term play without becoming a fitness tracker?

Known simplifications:

- Only 腿部事业群 is implemented.
- Department rotation editing is represented as copy, not an editor yet.
- Company stages are simulated through duration complexity, not persisted stage progression.
- Incident art is CSS pixel placeholder art; it should be replaced with stronger generated/painted assets after the slice validates.
- AI secretary is intentionally absent from this slice.

## 2026-06-03 Rhythm Pass

Goal: make the 腿部事业群 90 秒精品轮 feel more like a small game and less like opening a rules explanation.

Changes:

- Defaulted the slice to 90 秒恢复会.
- Shortened incident sheet copy to title + one concrete event sentence.
- Shortened choice consequence hints to quick labels such as 当前降 / 旁事升 / 留遗留.
- Shortened post-action feedback bubbles to 1-2 lines: what changed and which risk sticker appeared.
- Made action count, escalation countdown, and the current most urgent incident visible in the HUD.
- Slowed 90 秒 escalation to create light pressure without making the player anxious.
- Added a small post-action grace window so the sheet closes back to the office before the next escalation hits.

Current validation focus:

- Can the player understand: tap incident -> choose handling -> sheet closes -> office state changes?
- Does 90 秒 produce at least two meaningful tradeoffs without feeling like a dashboard?
- Does the office scene remain the visual center on 390x844?

## 2026-06-05 Visual Feedback Pass

Goal: make incident handling readable from the office scene before the player reads the feedback bubble.

Changes:

- Added short-lived visual event state for incident cards, separate from incident severity, so feedback can animate without changing layout.
- Incident escalation now gives the changed card a short shake/flash/scale response; urgent escalation uses a stronger but brief red flash.
- Incident reduction now gives the card a small suppressed bounce and green-tinted downgrade.
- Incident resolution now leaves a temporary ghost card with an OK stamp and shrink/fade animation before the card disappears.
- Chain side effects now flash the affected cards too, including new incident cards created by a tool.
- PPT bubble handling gets a pop/stamp effect.
- Audit red light flashes on upgrade and dims on downgrade/resolution.
- Historical file appearance/upgrade shows a small file-stack growth cue.
- Leg slump handling nudges the leg sprite toward a recovered posture.
- Ran a Playwright visual-feedback smoke flow and generated 390x844 screenshots:
  - `output/playwright/mobile-visual-initial-office.png`
  - `output/playwright/mobile-visual-event-sheet.png`
  - `output/playwright/mobile-visual-after-feedback.png`

Still needs human playtest confirmation:

- Whether the 500-700ms feedback window is noticeable during real between-set phone handling.
- Whether the urgent escalation flash is strong enough without feeling stressful.
- Whether the PPT pop and history-file chain are legible without reading the speech bubble.
- Whether repeated animations over a full 90 second round feel lively instead of noisy.

## 2026-06-05 Data Structure Pass

Goal: prepare the mobile slice for adding a second department without changing the current 90 second play feel.

Changes:

- Consolidated handling data into `handlingTypes`: id, label, icon, short hint, CSS class, KPI delta, feedback opener, optional risk sticker, and incident aftermath rules.
- Expanded each `incidentCatalog` entry with id, shortTitle, cardTitle, duration-based initial severity, visual cue keys, and resolved flavor.
- Moved KPI-driven incident spawning into `kpiIncidentRules`.
- Kept the visual event queue from the previous pass, but changed special visual effects to read cue keys from incident data instead of hard-coded incident ids.
- Added `resolveHandlingOutcome()` as the single place that applies KPI deltas, incident changes, generated incidents, risk collection, and feedback text.
- Renamed internal `tool` language to `handling` in the active code path and removed unused old summary helpers.

Expansion entry points:

- Add or tune handling methods in `handlingTypes`.
- Add a new incident in `incidentCatalog`, then place its id in `incidentOrder`.
- Give the new incident duration defaults through its `severity` field.
- If the incident should appear from KPI pressure, add a rule to `kpiIncidentRules`.
- If it needs a special animation, add a `visualCue` key and map that key in `visualCueClasses` or `spriteCueClasses`.
- For a second department, keep the same handling/incident structure and add a department-level seed/availability layer instead of changing the state machine first.

Still needs human playtest confirmation:

- Whether the refactor preserved the exact feel of the 90 second loop.
- Whether future department-specific incident pools should override severity only, availability only, or both.

## 2026-06-05 Report Replay Pass

Goal: make 今日肉身财报 read like a game result screen instead of a normal summary.

Changes:

- Rebuilt the report first screen around six scan-first result tiles: 复工评级, 复工节奏, 处理事故, 遗留麻烦, 最大贴纸, and 公司文化.
- Added shorter title generation for game-like round称号 such as 准点盖章型腿日, 红灯闪烁型复工, 档案柜增殖型腿日, and 糖水续命型营业.
- Added 下轮办公室预告 as deterministic flavor based on overtime, unresolved incidents, culture, and the top risk sticker.
- Changed settlement actions to support replay flow directly: 再开一轮, 收好财报, and 去档案墙.
- Enhanced 档案墙 lightly with recent report rows, title collection, current company culture, cumulative operating days, meeting count, and meeting time.
- Kept the archive as local atmosphere/history only; no new departments, AI, real training records, or production long-term system were added.

Validation focus:

- Can a player understand the round outcome from the first report screen without reading long copy?
- Do title, culture, leftover trouble, and next preview create enough one-more-round pressure?
- Does Archive Wall feel like a company-history wall rather than a fitness report?

## 2026-06-05 Result Differentiation Pass

Goal: let the player know why this round was not clean and what could make the next round prettier.

Changes:

- Added settlement metrics for handled incidents, resolved incidents, remaining incident count, remaining severity, max incident severity, KPI ready-window count, early/overtime timing, risk sticker count, and primary failure reason.
- Reworked return-to-work ratings so moderate debt no longer collapses into 审计保留意见:
  - 准点清场
  - 准点带债
  - 加班救场
  - 仓促复工
  - 红灯闪烁
  - 审计保留意见
- Kept 审计保留意见 for truly high-risk/high-leftover rounds only.
- Added one short 本轮做得好 line, one short 本轮遗憾 line, and one 下轮打法 hint to the report.
- Updated title/culture generation so normal on-time, overtime rescue, and random chain rounds produce visibly different reports.
- Preserved the event sheet loop, visual feedback, departments, local-only archive shape, and non-fitness-report boundary.

Validation focus:

- Do three play styles split into different rating/title/culture outcomes?
- Can the player identify the main regret without reading a long explanation?
- Does the next-round hint feel like office-world advice rather than a tutorial or training recommendation?
