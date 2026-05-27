# Proof-of-Fun Plan

## Current Bet

Do not expand lore yet. Validate the smallest native loop:

> A real rest timer becomes a ridiculous body-company meeting, and each choice visibly pushes the body toward or away from a just-good-enough复工 state.

The current question is no longer "is the concept clever?" It is:

> Does Variant B make players care about KPI movement because it changes OKR progress, risk labels, crisis fallout, and next-round pressure?

## Prototype

Playable throwaway prototype:

```powershell
start .\prototype-proof-of-fun\index.html
```

Variant URLs:

- `prototype-proof-of-fun/index.html?variant=A`: meeting-table first.
- `prototype-proof-of-fun/index.html?variant=B`: KPI cockpit first.
- `prototype-proof-of-fun/index.html?variant=C`: agenda stack plus report pressure.

## Current Status

The prototype has already been optimized once. Variant B is now the main proof-of-fun path and includes:

- contextual actions per agenda item, mapped to stable strategy types
- round audit focus
- crisis warnings and crisis events
- risk tags and next-round fallout
- one-way department OKR progress
- single-round rating and 今日肉身财报

Current priority is not adding content. First fix the latest review issues captured in `docs/HANDOFF.md`, especially:

- early resume can currently farm rewards
- crisis penalties are session-wide instead of round-scoped
- extended rest can double-count OKR/meeting progress
- reports can claim one meeting even when none happened
- the test protocol should now start with Variant B, not A

## Validation Questions

1. Does a 60-second 组间小会 produce urgency and爽感?
2. Does choosing a contextual action feel like making a decision rather than pressing a menu button?
3. Is the KPI 可复工区 understood as "middle is good" in one glance?
4. Do crisis warnings make players change behavior?
5. Do OKR progress and risk labels make the result feel consequential?
6. Does the result/report contain a line worth screenshotting?
7. Does the timer-meeting-report loop feel more native than adding a timer beside another小游戏?

## Test Protocol

Use 3 to 5 testers. Give only this prompt:

> 刚练完一组腿，休息一分钟。你是肉身集团老板，把小会开到能复工。

Start with **Variant B**.

Watch silently for the first run.

Record:

- Time to first choice.
- Whether they mention the green KPI band.
- Whether they notice the round audit focus.
- Which strategy type they choose twice or more.
- First line they laugh at.
- Whether crisis warning changes their next choice.
- Whether they notice OKR progress or risk labels.
- Whether they want "再来一组".
- Which report line they would screenshot.

Use Variant A or C only for layout comparison after the B run.

## Pass Signals

- They make the first choice within 10 seconds of entering the meeting.
- They understand the middle KPI target by the second issue.
- They react to a crisis warning or crisis event.
- They understand that OKR progress and risk labels are consequences.
- They describe one consequence as "that makes sense" or "that is funny".
- They laugh or quote one line.
- The report produces at least one line they would share.
- They want to try a different route.

## Fail Signals

- They treat it as reading random jokes.
- They max out KPI bars because the middle target is unclear.
- They ignore crisis warnings because the penalty is unclear.
- They do not notice OKR progress or risk labels.
- They wait for the timer instead of wanting to choose.
- The report feels like a generic summary instead of a punchline.

## Decision Rule

Proceed toward MVP only if at least 3 of 5 testers:

- choose within 10 seconds of entering the meeting,
- understand the middle KPI target by the second issue,
- react to crisis/OKR/risk consequences,
- laugh or quote one line,
- and want to try a different route.

If not, adjust the core interaction before adding AI, more departments, or more content.

