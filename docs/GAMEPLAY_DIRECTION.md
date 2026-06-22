# Gameplay Direction: Real Mobile Game

Last updated: 2026-06-02

## 2026-06-22 Architecture Decisions

Two follow-up decisions refine this direction:

- `docs/ADR_PIXI_RENDERING_BOUNDARY.md`: PixiJS is accepted for a technical slice, but only as the in-round office scene renderer. DOM keeps HUD, event sheets, reports, archive, and long text UI. The rules engine remains deterministic.
- `docs/AGENT_DEPARTMENT_MEMORY_MODEL.md`: Department Agents are a long-term companionship and content-variety layer. The game remains a short-time rhythm-control game first. AI can express local facts and memory, but cannot decide rules, KPI deltas, incident severity, ratings, or real training safety.

These documents should be read before starting Pixi, AI, or second-department work.

## Direction Change

The project is no longer optimized for a 24h hackathon demo. The new goal is:

> Make a real mobile-first rest-interval game that fitness users would willingly play between sets.

The core scene is still real gym rest time. A non-training player can enjoy it as a side use case, but the primary design target is a person who just finished a set, is holding a phone one-handed, and wants to control rest time without falling into a short-video hole.

## Product Priority

Priority order:

1. Rest rhythm controller.
2. Light entertainment and relief.
3. Light strategy and body-company companionship.

The game must never force the user to interrupt real training. It can warn, joke, and record consequences, but it must not block returning to exercise or claim to judge real physical safety.

## Product Form

First product form: mobile H5/PWA.

Reasons:

- Low friction: scan/open/play is more important than app-store installation.
- The primary scene is mobile portrait, one-handed, short-session play.
- Native app and mini-program versions can come later after the core loop proves repeatable.

## First Screen

The first screen should show only the essentials:

- Today’s duty department.
- Default rest duration.
- Start button.

A secondary entry opens the Archive Wall. It should not be called "details" or "stats"; it is a game-world space for company history.

## Rest Duration

The user has a default rest duration, with quick switching per round.

Initial duration choices:

- 30 seconds: quick/restless round, low complexity.
- 60 seconds: standard meeting.
- 90 seconds: recovery meeting, more room but more chance for overtime, excuses, PPT, and bubble.

Departments may recommend a duration, but the user keeps control.

When time runs out:

- Do not forcibly end the meeting.
- Switch into "meeting overtime".
- Continue counting overtime visibly.
- Let the user settle and resume training anytime.
- Overtime can create risk, culture, and report flavor.

## Department Rotation

The user can choose a rotation system, wrapped as a "department duty system".

Initial templates:

1. Push / Pull / Legs.
2. Chest / Back / Legs / Shoulders / Arms.
3. Upper / Lower.
4. Full-body cycle.
5. Custom.

The first screen recommends the current duty department without blocking play. Users can temporarily reassign the next duty department or edit the whole rotation.

Rest days are recorded as neutral "group maintenance" and do not advance the department rotation.

The rotation advances only when the user confirms that the current department is off duty. This confirmation appears after the daily report, with a manual correction path in the Archive Wall.

## Departments

First playable training departments:

- Chest Business Division.
- Back Infrastructure Department.
- Leg Business Group.
- Shoulder Image Department.
- Arm Storefront Department.
- Abs Legend Department.

System departments such as Cardio Finance, Brain Strategy, and Audit Group can appear in meetings but do not enter the training rotation.

Departments should differ clearly. Difference priority:

1. Agenda/event pool.
2. Recommended rest duration.
3. Initial KPI state.
4. Risk/crisis flavor.
5. Strategy-effect weighting.

Department traits should be shown through world-language and Archive Wall records, not explicit stat tables.

## Complexity Progression

Complexity grows through company stages. Do not expose a manual "advanced rules" toggle.

Progression exists internally, but should be felt through environment, procedures, and report language rather than visible percentages.

Suggested progression:

1. Startup trial: 1-2 KPIs, 2 strategies.
2. Growth meeting: add a third KPI and new strategy.
3. Scaling company: add fourth KPI, risk tags, and more department interruptions.
4. Audit period: crisis warnings, overtime consequences, stronger records.
5. Public company: report collection, archive wall, culture and department history.

Stage changes appear through:

- Hints in reports.
- Subtle changes next time the user opens the game.
- Occasional abstract transition animation at key nodes.

Avoid explicit "level up" popups.

## Win And Settlement

This is entertainment first, with light victory indicators.

The player should not feel like they "failed a workout". The game should express:

- Whether the round stayed close to rest rhythm.
- Whether key company status gauges reached the workable window.
- What kind of ridiculous company culture this round produced.

Do not use a single total score. Show multiple signals:

- Return-to-work rating.
- On-time/overtime status.
- KPI window status.
- OKR or company progress flavor.
- Risk tags.
- Report title.

## Long-Term Progress

Long-term progress is essential, but it should feel like company history rather than a fitness tracker.

Reward priority:

1. Departments gain personality and recognizable habits.
2. Collectible reports and titles.
3. Content unlocks and event variety.
4. Light numerical growth.

Long-term negative outcomes should become company culture branches, not punishment.

Culture-axis priority:

1. Rhythm culture: on-time, overtime, rushed return.
2. Strategy habit: vision, comfort, push, deflect.
3. Department influence.
4. KPI bias.

MVP scope for long-term systems:

- Company culture label.
- Recent report records.
- Department rotation history.
- Department dossiers.
- Title collection.
- Meeting count.
- Current and best continuous operating days.
- Cumulative operating days.
- Meeting duration, named as meeting time rather than training time.

Current local save is acceptable for first version. Show "local archive" only in Archive Wall/settings. Later, add export/import before cloud sync.

## Archive Wall

The Archive Wall is the main long-term entry. It combines:

- A visual meeting-room/company wall.
- Company culture labels.
- Report wall.
- Rotation table.
- Title collection.
- Department dossiers.
- Meeting count.
- Cumulative operating days and continuous operating days.
- Meeting duration.

It should feel like a game-world room, not a statistics dashboard.

## Department Milestones

Department milestones return as long-term "big cakes".

Rules:

- A milestone is bound to a training department.
- Each department has one active main milestone.
- Completed or archived milestones move into department history.
- The system recommends templates, and the user can edit them.
- The game cannot verify real completion. The user manually announces fulfillment.
- The system only creates atmosphere: stage labels, meeting mentions, and department attitude.
- Milestones can lightly affect agenda pools and report titles, but not real-safety logic or KPI penalties.

Milestone atmosphere examples:

- Already pitched.
- In trial operation.
- Budget dispute.
- Written into report.
- Waiting for boss declaration.

Prompt timing:

- First ask after the user confirms a department is off duty for the first time.
- Permanent management lives in the department dossier inside Archive Wall.

## AI Role

AI can support long-term variety, but only as an expression layer.

AI may:

- Rewrite agenda copy.
- Rewrite report events.
- Refer to deterministic local history.
- Vary department tone.

AI must not:

- Decide rules.
- Decide KPI changes.
- Decide risk/crisis triggers.
- Decide safety.
- Store or infer real medical/training facts.

Generation timing priority:

1. Background pre-generation.
2. Use prepared material at round start.
3. Patch report text after local report is already visible.

Avoid per-agenda real-time generation.

AI memory can include game facts, strategy habits, department history, report titles, and meeting time. It should not record real weights, injuries, pain, or physical safety judgments.

## Visual Direction

Visual direction:

- Pixel business-sim feel.
- Grassroots office comedy.
- Cute body-part employees, not childish.
- Reference energy: readable management-game clarity plus lively pixel-game animation.

Use pixel characters and pixel meeting-room scenes, but keep UI text clear on mobile.

Main round composition:

- Mobile portrait.
- Central office/meeting-room scene occupies about 50% of the screen.
- KPIs are in-scene devices plus small readable HUD support.
- Bottom area keeps only round-level controls such as return-to-work settlement.
- Moment-to-moment handling choices should appear only as temporary event sheets after the player taps a room incident.
- Avoid persistent bottom command panels; they make the prototype feel like a dashboard and shrink the office scene.

Visual growth order:

1. Department characters become more recognizable.
2. Meeting room becomes more formal while keeping grassroots humor.
3. Instruments/audit systems become richer.
4. More content appears, but visual chaos decreases.

## Mobile Slice Goal

Next prototype directory:

`prototype-mobile-slice`

Goal: test one playable mobile slice before expanding.

Must include:

- Mobile portrait H5.
- One department: Leg Business Group.
- 30/60/90 second duration choice.
- Office scene centered as the main game view.
- KPI devices embedded in the room plus small HUD readouts.
- Room incidents as the primary interaction targets.
- Temporary incident event sheet: tap an incident, read concrete event detail, choose a handling method, then return to the room.
- Short speech bubbles instead of long proposal text.
- Countdown, overtime, and return-to-work settlement.
- Report with meeting time, risk tags, and one company-culture hint.
- Local save of one report record.
- Archive Wall entry as a simple playable stub.

Can be simplified:

- AI can be absent in the slice.
- Only one department needs full treatment.
- Long-term systems can save and display minimal data.
- Art can be temporary, but it must be visual enough to test whether the game reads without long text.

## Current Interaction Finding

The latest mobile slice rejected two intermediate interaction models:

1. Persistent bottom strategy buttons.
2. Persistent bottom contextual handling panel.

Both made the game feel like a control dashboard and consumed too much mobile screen space.

The current preferred interaction model is:

1. The office scene stays dominant.
2. Incident cards are visible in the room.
3. Tapping an incident opens a temporary event sheet with concrete description and handling choices.
4. Choosing a handling method closes the sheet and returns attention to the room.
5. Incident severity, KPI devices, risk tags, and report text carry the consequence.

This keeps the player focused on "what is happening in the office" while preserving meaningful choice.
