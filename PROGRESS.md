# Recoil — Progress

Living status document. Update at the end of every work session.
The plan is in [PLAN.md](./PLAN.md); conventions are in [CLAUDE.md](./CLAUDE.md).

---

## Current status

|                   |                                                                                                         |
| ----------------- | ------------------------------------------------------------------------------------------------------- |
| **Current phase** | Phase 1 — Core Combat Prototype ⭐                                                                      |
| **Next task**     | Player: a circular Matter body with gravity, a little bounce, and friction (awaiting playtest sign-off) |
| **Live build**    | https://rvpanoz.github.io/recoil/                                                                       |
| **Last updated**  | 2026-09-26                                                                                              |

---

## Phase overview

| Phase | Name                          | Status         | Started    | Finished   |
| ----- | ----------------------------- | -------------- | ---------- | ---------- |
| 0     | Project Setup                 | ✅ Done        | 2026-09-26 | 2026-09-26 |
| 1     | Core Combat Prototype ⭐      | 🟡 In progress | 2026-09-26 |            |
| 2     | Weapons                       | ⚪ Pending     |            |            |
| 3     | Juice & Comedy                | ⚪ Pending     |            |            |
| 4     | Enemy Roster & Wave Director  | ⚪ Pending     |            |            |
| 5     | Arenas, Scoring & Progression | ⚪ Pending     |            |            |
| 6     | Menus, Settings & Polish      | ⚪ Pending     |            |            |
| 7     | Release                       | ⚪ Pending     |            |            |

Legend: ⚪ Pending · 🟡 In progress · ✅ Done · ⛔ Blocked

---

## Current phase checklist — Phase 1

**Movement**

- [ ] Player: a circular Matter body with gravity, a little bounce, and friction
- [ ] Aim: the gun rotates toward the mouse pointer (in **world** coordinates, not screen)
- [ ] Fire: left click → spawn a bullet and apply recoil opposite the aim, via `core/recoil.ts`
- [ ] Clamp max speed so the player can't break the physics
- [ ] One weapon to start: the **shotgun** (big recoil, spread), so both jobs are obvious

**Combat**

- [ ] Bullets are physics bodies that damage and **knock back** what they hit
- [ ] One enemy type — **Grunt:** walks toward the player along the ground, contact damage
- [ ] Player health (3 hits) with brief invulnerability after being hit
- [ ] Enemies drop an ammo pickup on death; ammo starts limited
- [ ] Simple spawner: grunts spawn from the arena edges on a timer that speeds up
- [ ] Death → instant restart on `R` or click

**Tools**

- [ ] One grey-box arena: floor, walls, a ceiling, 2–3 floating platforms
- [ ] Camera: fixed on the whole arena (arenas fit on one screen, or follow with smoothing if larger)
- [ ] **Live tuning panel** (lil-gui): gravity, recoil, max speed, bullet knockback, enemy speed, spawn rate, ammo drop amount
- [ ] Fixed physics timestep so feel doesn't change with frame rate (check the Phaser 4 Matter config docs)
- [ ] Unit tests for `computeRecoil`, health/invulnerability, and ammo accounting

**Exit criterion:** you (and one other person) survive as long as you can for 3+ minutes, die laughing,
and immediately restart. Write the final tuning values into `config/tuning.ts`.

---

## Tuning values (locked after Phase 1)

Record the values that felt right, so they survive refactors. Source of truth is `src/config/tuning.ts`.

| Constant                     | Value | Notes |
| ---------------------------- | ----- | ----- |
| gravity                      | —     |       |
| shotgun recoil               | —     |       |
| player max speed             | —     |       |
| bullet knockback             | —     |       |
| grunt speed                  | —     |       |
| spawn interval (start → min) | —     |       |
| ammo per drop                | —     |       |

---

## Decisions log

Record why things were decided, so they're not re-litigated later.

| Date       | Decision                                                                           | Why                                                                                                         |
| ---------- | ---------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Phaser 4 + Matter.js, TypeScript, Vite                                             | Mature 2D framework with TS types and built-in rigid-body physics needed for recoil, knockback and ragdolls |
| 2026-09-26 | No walking, jumping or dodge; weapons are the only movement                        | Core design pillar, the source of the comedy                                                                |
| 2026-09-26 | Game rules in pure `src/core/`, Phaser layer kept thin                             | Testable logic, clean separation                                                                            |
| 2026-09-26 | TypeScript pinned to `~6.0`, not 7.x                                               | typescript-eslint 8.70 supports TS `<6.1`; the Vite template pins 6.0 too. Revisit when it supports 7       |
| 2026-09-26 | Unit tests live next to the code (`src/**/*.test.ts`); no top-level `tests/`       | CLAUDE.md says tests sit alongside core; PLAN.md §3 listed `tests/`, colocating won                         |
| 2026-09-26 | `lint` = ESLint + `prettier --check`                                               | Formatting is enforced by `check` and CI without a separate script                                          |
| 2026-09-26 | ESLint guardrails: no `phaser` imports in `src/core`, no default exports in `src`  | Enforces CLAUDE.md architecture rules mechanically instead of by review                                     |
| 2026-09-26 | Vite `base` is `/recoil/` for builds and `vite preview`                            | GitHub Pages serves from `/recoil/`; dev stays at `localhost:5173/`                                         |
| 2026-09-26 | Placeholder shapes are `Rectangle` game objects with Matter bodies                 | Visible in production where Matter debug rendering is off                                                   |
| 2026-09-26 | Physics debug rendering = `import.meta.env.DEV`                                    | On in `npm run dev`, stripped from production builds                                                        |
| 2026-09-26 | Use Phaser's bundled skills from `node_modules/phaser/skills/`, don't copy them    | Always match the installed Phaser version; no extra files to maintain                                       |
| 2026-09-26 | `chunkSizeWarningLimit` raised to 1600 kB                                          | Phaser alone is ~1.4 MB minified (~360 kB gzip); the default warning is noise                               |
| 2026-09-26 | Pivoted from a physics platformer (goal zones, par shots) to an arena wave shooter | The game must be a shooter first; enemies and combat belong in the core loop from Phase 1                   |
| 2026-09-26 | Side view with gravity, not top-down                                               | Gravity makes running out of ammo mean falling, which drives both tension and comedy                        |
| 2026-09-26 | Enemies drop ammo; pistol has infinite ammo                                        | Kills are fuel, rewarding aggression, while the pistol prevents a full softlock                             |

---

## Playtest notes

| Date | Tester | Build/phase | What happened | Action |
| ---- | ------ | ----------- | ------------- | ------ |
|      |        |             |               |        |

---

## Known issues / bugs

- Motion looks stuttery in playtest. Likely cause: Matter steps at a fixed 60 Hz with no render interpolation, so on a
  120 Hz display the player moves only every other frame (display rate not yet confirmed). Fix belongs to the Phase 1
  "Fixed physics timestep" task.

---

## Ideas parking lot

Ideas that don't belong to the current phase. Review at the start of each new phase; most should stay here.

- Between-wave perk choice (pick 1 of 3: bigger magazine, bouncy bullets, lighter body…)
- Weapon roulette mode: weapon swaps randomly every 10 s
- Rubber-chicken gun with bouncing, squawking projectiles
- Endless mode with a global leaderboard
- Local co-op: two players whose recoil can knock each other around
- Split Phaser into its own vendor chunk so game-code updates don't re-download the engine (Phase 6/7 perf pass)

---

## Session log

Newest first. Keep each entry short: what was done, what's next, anything surprising.

### 2026-09-26 — Pivot to arena shooter; Phase 1 started

- The developer reworked PLAN.md from a physics platformer (goal zones, par shots) into a side-view arena wave
  shooter. PROGRESS.md rebuilt on the new phases; Phase 0 stays done, since its work is unchanged by the pivot.
- Renamed `LevelScene` → `ArenaScene` to match the new Phase 0 checklist.
- CLAUDE.md: levels → arenas (`data/arenas.ts`), `LevelScene` → `ArenaScene`, collision categories match Phase 4.
- Player task (branch `phase-1/player-body`, not committed yet): the falling box is replaced by `entities/Player.ts`,
  a circle `Arc` with a circular Matter body (restitution 0.4, friction 0.05, frictionAir 0.01). `npm run check` passes.
- Playtest: the ball falls, bounces and settles, but motion isn't smooth (see Known issues).
- Surprise: Phaser 4 bundles Matter 0.20, whose runner already steps physics at a fixed 60 Hz and scales gravity,
  velocity and air drag by step length. What's missing for smooth motion is render interpolation, not a fixed step.
- **Next:** choose the smoothness fix (120 Hz physics step vs render interpolation), then sign off the player task.

### 2026-09-26 — Phase 0 setup

- Scaffolded Vite 8 vanilla-ts + Phaser 4.2.1, strict TS 6.0, ESLint 10 flat config, Prettier, Vitest 5. Node 24 LTS.
- `BootScene` → `LevelScene`: a tilted orange box falls onto a static floor. Matter only; debug outlines in dev.
- CI workflow: `check` + `build` on every push/PR; deploy `dist/` to Pages on push to `main`.
- Pushed `main` to `rvpanoz/recoil`. First CI run: `build` job (check + build) passed; `deploy` failed with 404 because
  Pages isn't enabled, and enabling it failed (HTTP 422) because the repo is private (free plan needs a public repo).
  Made the repo public, enabled Pages (`build_type=workflow`) and re-ran the failed deploy job.
- Playtested dev (`npm run dev`) and production preview (`npm run preview`): the box falls and
  settles flat on the floor; no debug outlines in production. (Chrome freezes the game when its window is fully hidden.)
- Bug found and fixed (branch `phase-0/progress-update`): `npm run preview` served the build from `/` while
  `index.html` pointed at `/recoil/`, so the page stayed blank. `vite preview` runs as `command === 'serve'`; the
  base now also checks `isPreview`. Production builds were never affected.
- CLAUDE.md: added a pointer to Phaser's bundled agent skills; the developer added Git workflow, agent guardrail and
  clean-code sections and removed lines copied from another project. Tidied: merge gate is `npm run check`, Commands
  block lists `lint` (ESLint + Prettier) and `format`, duplicate "What not to do" section removed.
- Surprise: TS 7 is out but typescript-eslint doesn't support it yet, so TS is pinned to 6.0.
- Surprise: Phaser ships 28 AI agent skills in its npm package (`node_modules/phaser/skills/`).
- Re-run deploy succeeded. **Phase 0 exit criterion met:** https://rvpanoz.github.io/recoil/ shows the box falling
  onto the floor (confirmed by the developer). All Phase 0 tasks done, including auto-deploy of `main`.
- **Next:** Phase 1 — player as a circular Matter body.

### 2026-09-26

- Chose Recoil from the game-idea shortlist.
- Wrote PLAN.md, CLAUDE.md and PROGRESS.md.
- **Next:** Phase 0 — scaffold the project.
