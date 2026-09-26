# Recoil — Progress

Living status document. Update at the end of every work session.
The plan is in [PLAN.md](./PLAN.md); conventions are in [CLAUDE.md](./CLAUDE.md).

---

## Current status

|                   |                                                |
| ----------------- | ---------------------------------------------- |
| **Current phase** | Phase 0 — Project Setup                        |
| **Next task**     | Scaffold Vite + TypeScript (strict) + Phaser 4 |
| **Live build**    | _not deployed yet_                             |
| **Last updated**  | 2026-09-26                                     |

---

## Phase overview

| Phase | Name                     | Status         | Started | Finished |
| ----- | ------------------------ | -------------- | ------- | -------- |
| 0     | Project Setup            | 🟡 Not started |         |          |
| 1     | Core Feel Prototype ⭐   | ⚪ Pending     |         |          |
| 2     | Weapons & Ammo           | ⚪ Pending     |         |          |
| 3     | Juice & Comedy           | ⚪ Pending     |         |          |
| 4     | Hazards, Enemies & Goals | ⚪ Pending     |         |          |
| 5     | Levels & Progression     | ⚪ Pending     |         |          |
| 6     | Menus, Settings & Polish | ⚪ Pending     |         |          |
| 7     | Release                  | ⚪ Pending     |         |          |

Legend: ⚪ Pending · 🟡 In progress · ✅ Done · ⛔ Blocked

---

## Current phase checklist — Phase 0

- [ ] Scaffold Vite + TypeScript (strict) + Phaser 4
- [ ] Configure Matter physics + debug rendering in dev
- [ ] ESLint + Prettier + Vitest wired into npm scripts (`check` script included)
- [ ] Folder structure + placeholder `BootScene` → `LevelScene`
- [ ] GitHub Actions: lint + typecheck + test + build
- [ ] Auto-deploy `main` to GitHub Pages
- [ ] Optional: review Phaser's AI agent skills

**Exit criterion:** pushing to `main` produces a live URL showing a rectangle falling onto a floor.

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

| Date       | Decision                                               | Why                                                                                                |
| ---------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| 2026-09-26 | Phaser 4 + Matter.js, TypeScript, Vite                 | Mature 2D framework with TS types and built-in rigid-body physics needed for impulses and ragdolls |
| 2026-09-26 | No walking or jumping; weapons are the only movement   | Core design pillar, the source of the comedy                                                       |
| 2026-09-26 | Game rules in pure `src/core/`, Phaser layer kept thin | Testable logic, clean separation                                                                   |

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

---

## Session log

Newest first. Keep each entry short: what was done, what's next, anything surprising.

### 2026-09-26

- Chose Recoil from the game-idea shortlist.
- Wrote PLAN.md, CLAUDE.md and PROGRESS.md.
- **Next:** Phase 0 — scaffold the project.
