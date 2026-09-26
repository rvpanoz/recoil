# Recoil — Progress

Living status document. Update at the end of every work session.
The plan is in [PLAN.md](./PLAN.md); conventions are in [CLAUDE.md](./CLAUDE.md).

---

## Current status

|                   |                                                                                |
| ----------------- | ------------------------------------------------------------------------------ |
| **Current phase** | Phase 1 — Core Feel Prototype ⭐                                               |
| **Next task**     | Player: a circular Matter body with gravity, bounce (restitution) and friction |
| **Live build**    | https://rvpanoz.github.io/recoil/                                              |
| **Last updated**  | 2026-09-26                                                                     |

---

## Phase overview

| Phase | Name                     | Status     | Started    | Finished   |
| ----- | ------------------------ | ---------- | ---------- | ---------- |
| 0     | Project Setup            | ✅ Done    | 2026-09-26 | 2026-09-26 |
| 1     | Core Feel Prototype ⭐   | ⚪ Pending |            |            |
| 2     | Weapons & Ammo           | ⚪ Pending |            |            |
| 3     | Juice & Comedy           | ⚪ Pending |            |            |
| 4     | Hazards, Enemies & Goals | ⚪ Pending |            |            |
| 5     | Levels & Progression     | ⚪ Pending |            |            |
| 6     | Menus, Settings & Polish | ⚪ Pending |            |            |
| 7     | Release                  | ⚪ Pending |            |            |

Legend: ⚪ Pending · 🟡 In progress · ✅ Done · ⛔ Blocked

---

## Current phase checklist — Phase 1

- [ ] Player: a circular Matter body with gravity, bounce (restitution) and friction
- [ ] Aim: the gun sprite rotates toward the mouse pointer (in **world** coordinates, not screen)
- [ ] Fire: left click → apply velocity opposite the aim direction via `core/recoil.ts`
- [ ] Clamp max speed so the player can't break the physics
- [ ] One test arena: floor, walls, ceiling, a few platforms, a goal zone (sensor)
- [ ] Instant restart on `R`
- [ ] Camera follows the player with a little smoothing
- [ ] **Live tuning panel** (lil-gui): gravity, recoil strength, max speed, air drag, restitution
- [ ] Fixed physics timestep so feel doesn't change with frame rate (check the Phaser 4 Matter config docs)
- [ ] Unit tests for `computeRecoil`

**Exit criterion:** you (and one other person) happily fly around the grey arena for 2+ minutes without being asked to.

---

## Tuning values (locked after Phase 1)

Record the values that felt right, so they survive refactors. Source of truth is `src/config/tuning.ts`.

| Constant      | Value | Notes |
| ------------- | ----- | ----- |
| gravity       | —     |       |
| pistol recoil | —     |       |
| max speed     | —     |       |
| air drag      | —     |       |
| restitution   | —     |       |

---

## Decisions log

Record why things were decided, so they're not re-litigated later.

| Date       | Decision                                                                          | Why                                                                                                   |
| ---------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Phaser 4 + Matter.js, TypeScript, Vite                                            | Mature 2D framework with TS types and built-in rigid-body physics needed for impulses and ragdolls    |
| 2026-09-26 | No walking or jumping; weapons are the only movement                              | Core design pillar, the source of the comedy                                                          |
| 2026-09-26 | Game rules in pure `src/core/`, Phaser layer kept thin                            | Testable logic, clean separation                                                                      |
| 2026-09-26 | TypeScript pinned to `~6.0`, not 7.x                                              | typescript-eslint 8.70 supports TS `<6.1`; the Vite template pins 6.0 too. Revisit when it supports 7 |
| 2026-09-26 | Unit tests live next to the code (`src/**/*.test.ts`); no top-level `tests/`      | CLAUDE.md says tests sit alongside core; PLAN.md §3 listed `tests/`, colocating won                   |
| 2026-09-26 | `lint` = ESLint + `prettier --check`                                              | Formatting is enforced by `check` and CI without a separate script                                    |
| 2026-09-26 | ESLint guardrails: no `phaser` imports in `src/core`, no default exports in `src` | Enforces CLAUDE.md architecture rules mechanically instead of by review                               |
| 2026-09-26 | Vite `base` is `/recoil/` for builds only                                         | GitHub Pages serves from `/recoil/`; dev stays at `localhost:5173/`                                   |
| 2026-09-26 | Placeholder shapes are `Rectangle` game objects with Matter bodies                | Visible in production where Matter debug rendering is off                                             |
| 2026-09-26 | Physics debug rendering = `import.meta.env.DEV`                                   | On in `npm run dev`, stripped from production builds                                                  |
| 2026-09-26 | Use Phaser's bundled skills from `node_modules/phaser/skills/`, don't copy them   | Always match the installed Phaser version; no extra files to maintain                                 |
| 2026-09-26 | `chunkSizeWarningLimit` raised to 1600 kB                                         | Phaser alone is ~1.4 MB minified (~360 kB gzip); the default warning is noise                         |

---

## Playtest notes

| Date | Tester | Build/phase | What happened | Action |
| ---- | ------ | ----------- | ------------- | ------ |
|      |        |             |               |        |

---

## Known issues / bugs

- _none yet_

---

## Ideas parking lot

Ideas that don't belong to the current phase. Review at the start of each new phase; most should stay here.

- Weapon roulette mode (random weapon every 10 s)
- Rubber-chicken gun with bouncing projectiles
- Level timer leaderboard (local only)
- Speedrun mode with a global timer across all levels
- Split Phaser into its own vendor chunk so game-code updates don't re-download the engine (Phase 6/7 perf pass)

---

## Session log

Newest first. Keep each entry short: what was done, what's next, anything surprising.

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
