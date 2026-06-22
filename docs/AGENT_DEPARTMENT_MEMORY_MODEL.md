# Agent Department Memory Model

Date: 2026-06-22  
Status: Accepted as product/architecture direction

## Product Position

The project is a short-time rhythm-control game first. The first concrete scene is gym rest intervals, but the long-term product idea can extend to other short windows that need lightweight time control.

Department Agents are not the core gameplay by themselves. They are a companionship, expression, content-variety, and replay layer on top of the rhythm-control game.

The player should open the game to manage a short interval. The player should return because the departments feel increasingly recognizable, biased, and alive.

## Version Roadmap

### v0.2: Configured Departments

Departments are deterministic configuration, not true agents.

Each playable department should define:

- Department identity and tone.
- Incident pool.
- Recommended duration.
- Initial KPI state.
- Preferred handling style.
- Punished handling style.
- Incident tempo.
- Risk flavor.
- Report/archive flavor.

### v0.3: AI Department Secretary

AI may rewrite expression from deterministic local facts:

- Incident text.
- Handling feedback.
- Report events.
- Department attitude.
- Short memory-aware flavor lines.

AI must use prepared material or background generation. It must not block a live tap.

### v0.4: Department Memory Tags

Departments gain memory through local deterministic tags:

- Frequently used handling style.
- Recent incidents.
- Report titles.
- Risk stickers.
- Meeting count.
- Department culture labels.
- Recent grudges or habits.

AI can read these tags to write more personal lines, but rules remain deterministic.

### v0.5: Agent-Like Candidate Generation

AI may propose new incident candidates, but only through a local schema and template mapping. It still cannot invent live rules.

Example:

```text
AI candidate: Back Infrastructure complains that the load-bearing KPI was moved to another department.
Local mapping: historical-debt template or infrastructure-pressure template.
Rules: still from the local template.
```

## Deterministic Rule Boundary

These must always be decided locally:

- KPI deltas.
- Incident severity changes.
- Incident escalation and resolution.
- Risk stickers.
- Settlement rating.
- Round timing and overtime.
- Report facts.
- Whether a candidate maps to an approved rule template.

AI must not:

- Directly change KPI values.
- Directly decide whether an incident is solved or escalated.
- Decide the rating.
- Decide real training safety.
- Give real training, medical, pain, injury, weight, or technique advice.
- Turn free-form player input into live rule judgment in the short term.

AI may:

- Rewrite copy.
- Vary department tone.
- Refer to local game history.
- Generate candidate incident flavor.
- Produce memory-aware report text.
- Suggest world-language explanations for deterministic results.

## Memory Scope

Both company-level and department-level memory are allowed, but department-level memory comes first.

Department-level memory:

- Recent 5-10 rounds involving that department.
- Handling style counts.
- Incident counts.
- Risk sticker counts.
- Report titles.
- Department culture labels.
- Current bias/habit label.

Company-level memory:

- Overall rhythm culture.
- Total meeting count.
- Operating days.
- Cross-department strategy habits.
- Archive Wall title collection.

Old detailed events should move into the Archive Wall. They should not all be fed back into AI prompts.

## Memory Effects

v0.3:

- Memory affects department speech only.
- Example: a department comments that the player always uses deflect.

v0.4:

- Memory may lightly affect incident appearance probability.
- Example: a department with long-running historical debt is more likely to surface file-related incidents.

Permanent boundary:

- Memory must not directly change KPI deltas.
- Memory must not make the game give real training advice.
- Game clarity beats Agent personality when they conflict.

## Back Infrastructure Department v0.2

The second department should be the Back Infrastructure Department.

First-version identity:

- Slow-heating, heavy-backlog, easy to blame.

Core incidents:

- Workstation/frame collapse.
- File blame/history debt.

Encouraged handling:

- Comfort. It stabilizes infrastructure and reduces backlog pressure.

Punished handling:

- Deflect. It may reduce the visible current problem, but creates historical debt or makes old files return later.

Tempo:

- Slower incident escalation than Leg Business Group.
- Harder-to-clear leftover trouble.

KPI model:

- Reuse the existing four KPIs.
- Do not add a new KPI for the second department.

Implementation rule:

- Add Back Infrastructure as department configuration.
- Do not copy the Leg Business DOM logic and fork it by hand.

## Reset And Control

The player should be able to reset local company/Agent memory from the Archive Wall or settings.

Do not place reset controls in the main round flow.

Use world-language such as "restart company archive" rather than raw data-management language when possible.

## Current Development Order

1. Review and merge `codex/mobile-result-feedback`.
2. Extract rules engine and department configuration.
3. Add Back Infrastructure Department v0.2.
4. Build the Pixi technical slice for the Leg Business Group 90-second scene.
5. Compare DOM and Pixi versions.
6. Add AI secretary/memory only after the deterministic department loop is stable.

