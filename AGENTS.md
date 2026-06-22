# Agent Operating Guide

This file defines how agents should work on this project.

## Project Source Of Truth

Read these first, in order:

1. `docs/GAMEPLAY_DIRECTION.md`
2. `docs/ADR_PIXI_RENDERING_BOUNDARY.md`
3. `docs/AGENT_DEPARTMENT_MEMORY_MODEL.md`
4. `docs/HANDOFF.md`
5. `prototype-mobile-slice/NOTES.md`
6. `prototype-mobile-slice/app.js`

Historical references:

- `docs/GAME_FORM_DECISIONS.md`
- `docs/PROOF_OF_FUN.md`
- `docs/PRD-next-set-reconsidered.md`
- `prototype-proof-of-fun/NOTES.md`

The current product priority is the mobile slice, not the legacy hackathon variants.

## Product Guardrails

The game is a short-time rhythm-control game first. Gym rest intervals are the first concrete scene. Department Agents are a long-term companionship and content-variety layer, not the primary gameplay.

Keep these priorities:

1. Rest rhythm control.
2. Light entertainment and relief.
3. Light strategy.
4. Department personality and long-term companionship.

Do not turn the project into:

- A generic fitness tracker.
- A chat-first AI product.
- A dashboard with jokes.
- A real training safety advisor.

The game must not give medical, injury, pain, weight, or real exercise technique advice.

## Architecture Guardrails

Rules stay deterministic.

Local rules own:

- KPI deltas.
- Incident severity.
- Incident escalation and resolution.
- Risk stickers.
- Settlement ratings.
- Round timing and overtime.
- Report facts.
- Department memory tags.

AI may express local facts, but must not decide rules.

PixiJS, when introduced, should render the in-round office scene only:

- Office room.
- Characters.
- Incident markers.
- Visual feedback.
- Canvas hit targets.

DOM should keep:

- Home screen.
- HUD shell.
- Incident event sheet.
- Report.
- Archive Wall.
- Settings and local archive controls.

Pixi reads state and forwards clicks. It must not become the source of truth for gameplay.

## Collaboration Model

Use an Owner / Planner / Worker / QA model.

### Owner

The user is the product owner.

Owner decides:

- Product direction.
- Taste and game-feel tradeoffs.
- Large architecture choices.
- Whether human playtest results are acceptable.
- Whether L/XL tasks should start.

### Planner / Integrator

The main agent acts as planner and integrator.

Planner responsibilities:

- Maintain the roadmap and boundaries.
- Write ADRs, RFCs, and task briefs.
- Decide task size.
- Ask for owner approval on L/XL work.
- Delegate bounded work to sub-agents or new threads.
- Review code changes.
- Run validation.
- Integrate results.

The planner should avoid doing large implementation work directly.

### Worker Agents

Worker agents implement bounded tasks.

Worker tasks must include:

- Concrete goal.
- Explicit file ownership.
- Non-goals.
- Validation command.
- Expected final report.

Workers are not alone in the codebase. They must not revert unrelated changes, and they must adapt to concurrent edits.

### QA / Reviewer Agents

QA agents verify behavior and look for regressions. They should not implement fixes unless explicitly assigned.

QA should check:

- Mobile 390x844 flow.
- Interaction clarity.
- Rule consistency.
- Visual regressions.
- Console/runtime errors.
- Whether the feature still supports the product guardrails.

## Task Sizing

Use these categories:

### S: Main Agent Direct

Examples:

- Documentation updates.
- Small config changes.
- Running tests.
- Reading diffs.
- Narrow fixes in one or two files.

Usually no owner approval needed unless product direction changes.

### M: Sub-Agent

Examples:

- Extract one data object.
- Add one Playwright assertion file.
- Refactor one module with clear ownership.
- Review a branch for specific risks.

Approval usually not required, but the planner should announce the delegation.

### L: Owner Approval Required

Examples:

- Merging a large branch.
- Extracting the rules engine.
- Adding Back Infrastructure Department.
- Introducing a new dependency.
- Changing the main user flow.

Requires a task brief before work starts.

### XL: RFC Required

Examples:

- Pixi technical slice.
- Main mobile slice migration to Pixi.
- Agent memory implementation.
- Multi-department architecture.
- PWA/storage architecture.

Requires an RFC, owner approval, and staged implementation.

## Task Brief Template

Use this before M/L/XL implementation:

```md
## Background

## Goal

## Non-Goals

## User-Visible Change

## Files / Ownership

## Acceptance Criteria

## Validation

## Risks

## Rollback Plan

## Task Size

## Delegation Plan
```

## New Thread Policy

Use a new thread for large, self-contained stages with clear stop conditions.

Good new-thread scopes:

- `Rules engine extraction phase 1`
- `Back department content pass`
- `Pixi office scene technical slice`
- `Mobile slice QA pass`

Bad new-thread scopes:

- `Make the game better`
- `Do Pixi`
- `Fix everything`

Each new thread needs:

- Brief.
- Source-of-truth docs.
- File ownership.
- Stop condition.
- Validation command.

## Current Recommended Development Order

1. Review and merge `codex/mobile-result-feedback` if it remains the best DOM baseline.
2. Extract rules/state/data from `prototype-mobile-slice/app.js`.
3. Add Back Infrastructure Department as configuration.
4. Build `prototype-pixi-slice` for the Leg Business Group 90-second office scene only.
5. Compare DOM and Pixi versions.
6. Add AI secretary and memory only after the deterministic department loop is stable.

## Validation Commands

Run:

```powershell
npm run check
```

For the current mobile slice:

```powershell
node .\output\playwright\static-server.mjs .\prototype-mobile-slice 8770
```

Open:

```text
http://127.0.0.1:8770/index.html
```

Core flow to verify:

1. Start 90-second mobile round.
2. Tap an incident marker.
3. Event sheet opens.
4. Choose a handling method.
5. Sheet closes.
6. Incident/KPI/risk feedback is visible.
7. Settle round.
8. Report appears.
9. Archive Wall can be opened.

## Commit And Review Hygiene

- Do not commit secrets or API keys.
- Do not put real training, injury, weight, or pain records into test fixtures.
- Do not overwrite unrelated user changes.
- Keep large refactors separate from gameplay tuning.
- Update docs when architecture or product boundaries change.
- Prefer small commits with a clear product or architecture purpose.

