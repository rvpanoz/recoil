# CLAUDE.md

Guidance for Claude (and any AI coding agent) working in this repository.

## Project

**Recoil** — a 2D browser physics game where the player can only move by shooting; every shot pushes them the opposite way.
Built with **Phaser 4 + Matter.js + TypeScript + Vite**. First game for the developer: a senior TypeScript engineer
who is new to game development, so explain game-specific concepts briefly when they come up.

- Full plan and phases: `PLAN.md`
- Current status: `PROGRESS.md`

## Session workflow

1. **At the start of a session:** read `PROGRESS.md` to find the current phase and next task.
2. Work on **one task at a time** from the current phase. Don't pull work forward from later phases.
3. **At the end of a session:** update `PROGRESS.md` (tick tasks, add a session log entry, record decisions).
4. If an idea doesn't belong to the current phase, add it to the "Ideas parking lot" in `PROGRESS.md` instead of building it.

## Commands

```bash
npm run dev         # Vite dev server with HMR
npm run build       # Production build to dist/
npm run preview     # Serve the production build
npm run typecheck   # tsc --noEmit
npm run lint        # ESLint
npm run test        # Vitest (unit tests for src/core)
npm run check       # typecheck + lint + test (run before every commit)
```

## Architecture rules

- **`src/core/` is pure TypeScript.** No Phaser imports, no DOM, no globals. All game rules (recoil math, weapon state,
  scoring, unlocks) go here, with unit tests alongside.
- **`src/entities/` and `src/scenes/` stay thin.** Read input → call core → apply the result to Matter bodies and sprites.
- **Data over code.** Weapons live in `src/data/weapons.ts`; levels come from Tiled JSON + `src/data/levels.ts`.
  Adding a weapon or level should not require touching engine code.
- **All tuning constants live in `src/config/tuning.ts`.** Never inline magic numbers for gravity, recoil, speeds, timings.
- **Matter physics only.** Never enable or mix in Arcade physics.
- `HudScene` runs in parallel over `LevelScene`; they communicate through events, not direct references.

## Code conventions

- TypeScript `strict: true`. No `any`; use `unknown` and narrow it.
- Named exports only. One class per file in `entities/` and `scenes/`.
- Angles are **radians** everywhere in code; convert only for display.
- Units: pixels and Matter's default units. Document the unit in the name or comment when not obvious (`recoilImpulse`, `cooldownMs`).
- Prefer small pure functions in `core/` over methods with hidden state.
- Keep the diff focused. Don't reformat or refactor unrelated files.

## Game-dev gotchas (read these)

- **Pointer coordinates:** aim using `pointer.worldX/worldY` (or `pointer.positionToCamera(camera)`), not `pointer.x/y`,
  otherwise aiming breaks once the camera scrolls.
- **Frame-rate independence:** anything time-based in `update(time, delta)` must scale by `delta`. Physics runs on a fixed step.
- **No allocations in hot loops.** Don't create objects, arrays or closures inside `update()` or per-bullet callbacks;
  reuse vectors and pool bullets, shells and particles.
- **Tunnelling:** fast small bodies can pass through thin walls. Clamp player max speed and keep walls thick
  rather than adding hacks.
- **Collision filtering:** use the collision categories defined in one place (player, enemy, projectile, world, sensor).
  Don't add ad-hoc checks on body labels in collision handlers.
- **Scene restarts:** `scene.restart()` must leave no leaked listeners, timers or tweens. Clean up in the scene's
  `shutdown` event.
- **Y axis points down.** Gravity is positive Y. "Up" is negative Y.
- **localStorage can throw** (private mode, blocked storage). Always wrap it in try/catch with a safe default.
- When unsure about a Phaser 4 API, check the official docs/examples rather than Phaser 3 answers; the renderer and
  some APIs (for example FX/masks → Filters) changed in v4.

## Testing

- Unit test everything in `src/core/` with Vitest. Physics and rendering are not unit tested; they are **playtested**.
- For feel changes, say what to try in the browser (for example "fire the shotgun straight down from the floor, you should
  clear the first platform") rather than claiming it feels right.

## Definition of done

A task is done when `npm run check` passes, new core logic has tests, new numbers live in `tuning.ts`,
the change has been played in the browser, and `PROGRESS.md` is updated.

## Don't

- Don't add walking or jumping. Movement comes only from weapons (design pillar #1).
- Don't add dependencies without a clear reason; everything must be open source.
- Don't commit generated files (`dist/`) or large unoptimized assets.
- Don't build features from later phases "while you're in there".
