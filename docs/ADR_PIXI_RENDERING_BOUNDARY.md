# ADR: Pixi Rendering Boundary

Date: 2026-06-22  
Status: Accepted for the next technical slice

## Context

The project has moved from a hackathon proof-of-fun prototype toward a mobile-first rest-interval game. The current playable direction is a 90-second office incident loop: the player watches a body-company office, taps visible incidents, chooses a temporary handling method, then returns to the room and eventually settles the round.

The current DOM/CSS prototype is sufficient for rule validation, but the intended game feel needs clearer visual causality, livelier body-part characters, and stronger incident feedback. PixiJS is preferred over Three.js for this direction because the game is a 2D mobile office scene, not a 3D scene.

## Decision

Use PixiJS as a rendering layer for the in-round office scene only.

Pixi owns:

- Office room rendering.
- Department characters and body-part sprites.
- Incident cards/markers inside the room.
- Visual feedback for incident escalation, downgrade, resolution, and chain side effects.
- Canvas hit targets for office incidents.

DOM owns:

- Home screen.
- HUD and timer shell.
- Temporary incident event sheet.
- Buttons and long Chinese copy.
- Settlement/report screens.
- Archive Wall.
- Settings, local archive controls, and future PWA/system UI.

The rules engine owns:

- KPI values and deltas.
- Incident severity.
- Risk stickers.
- Round timing/overtime state.
- Settlement rating.
- Report facts.
- Department memory tags.

Pixi must not decide rules. It reads the current state, plays animation, and forwards player clicks to the rules layer.

## Why This Boundary

This keeps Pixi focused on the part where it creates the most value: making the office feel like a game scene. Long text, event sheets, reports, and archive UI remain easier and more reliable in DOM.

The goal is not to rewrite the whole project. The goal is to prove whether a Pixi office scene makes the 90-second loop more readable, more lively, and more replayable than the DOM scene.

## First Pixi Slice

Create a separate technical slice before replacing the current mobile slice:

`prototype-pixi-slice`

The first Pixi slice should reproduce only:

- Mobile portrait, 390x844 reference viewport.
- Leg Business Group 90-second recovery meeting.
- Office scene with the existing main incidents.
- Clickable room incidents.
- Visual states for escalation, downgrade, resolution, and chain side effects.
- The existing DOM event sheet and settlement flow, or a minimal equivalent shell.

It should not include:

- Full report redesign.
- Archive Wall rewrite.
- Multi-department support.
- AI secretary.
- Production asset pipeline.
- New gameplay rules.

## Failure Criteria

The Pixi route should be considered unsuccessful for now if any of these are true:

- Animation improvement is not obvious compared with the DOM version.
- Players still cannot understand what changed without reading the feedback bubble.
- Click accuracy or one-handed mobile interaction gets worse.
- The 90-second loop has serious frame drops on target mobile hardware.
- Development complexity rises without a clear game-feel gain.

## Success Criteria

The Pixi slice is worth continuing if:

- Incident upgrades and resolutions are legible from the office scene.
- Chain side effects are visible enough that players can tell something else changed.
- The room feels more alive without becoming visually noisy.
- The same rules produce the same KPI/risk/report facts as the DOM version.
- A human tester says the Pixi version is more tempting to replay than the DOM version.

## Sequencing

1. Review and merge `codex/mobile-result-feedback` if it still represents the best DOM baseline.
2. Extract rules/state/data from `prototype-mobile-slice/app.js` so DOM and Pixi can share the same logic.
3. Add the Back Infrastructure Department as configuration, not copied DOM logic.
4. Build `prototype-pixi-slice` for the Leg Business Group 90-second office scene.
5. Compare DOM and Pixi versions before deciding whether to migrate the main mobile slice.

## Consequences

Positive:

- Better visual feedback without rewriting the entire app.
- Lower risk than a full engine migration.
- Rules stay testable and deterministic.
- DOM remains available for complex Chinese UI and local archive screens.

Costs:

- There will be a hybrid DOM + Pixi architecture.
- The rules layer must be separated before serious Pixi work.
- Visual tests must include canvas rendering checks, not just DOM text checks.

