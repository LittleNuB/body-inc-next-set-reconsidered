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
