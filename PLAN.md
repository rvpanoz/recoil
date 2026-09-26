# Recoil — Project Plan

> A 2D physics platformer-shooter where **your gun is your only way to move**.
> Every shot throws you backwards. Aim and movement fight each other, and that's the joke.

This file describes **what** we're building and **why**, phase by phase. It changes rarely.
Day-to-day status lives in [PROGRESS.md](./PROGRESS.md). Working conventions live in [CLAUDE.md](./CLAUDE.md).

---

## 1. Vision

### Elevator pitch

A small round character with googly eyes holds a gun far too big for him. He can't walk or jump.
The only way to get anywhere is to shoot in the opposite direction. Shotguns become rocket jumps,
a minigun turns you into a spinning top, and a rocket launcher is basically a catapult.

### Design pillars

Every feature must serve at least one pillar, or it gets cut.

1. **Shooting is movement.** No walking and no jumping, ever. Every mobility option is a weapon.
2. **Failure is funny.** Deaths are ragdolls, restarts are instant, and nothing punishes experimenting.
3. **Short and replayable.** Levels take 15–60 seconds, with a one-key restart and a par shot count for mastery.
4. **Ammo is fuel.** Limited ammo is the core tension: every shot spent moving is a shot you can't spend later.

### Target experience

- A new player understands the mechanic within **5 seconds** without a tutorial text.
- A skilled player finds shortcuts through levels that the designer didn't intend.
- A good death makes the player laugh and immediately press restart.

### Out of scope (v1)

Multiplayer, procedural levels, a story or cutscenes, mobile/touch controls, a level editor for players, monetization.

---

## 2. Tech Stack (all open source)

| Concern         | Choice                                 | License    | Why                                                          |
| --------------- | -------------------------------------- | ---------- | ------------------------------------------------------------ |
| Engine          | **Phaser 4** (4.2.x)                   | MIT        | Mature 2D framework, first-class TS types, bundled Matter.js |
| Physics         | **Matter.js** (via Phaser)             | MIT        | Rigid bodies, impulses, constraints (ragdolls), sensors      |
| Language        | TypeScript (strict)                    | Apache-2.0 | Your home turf                                               |
| Build           | Vite                                   | MIT        | Fast HMR, simple static build                                |
| Tests           | Vitest                                 | MIT        | Unit tests for pure game logic                               |
| Lint/format     | ESLint + Prettier                      | MIT        | Standard                                                     |
| Debug tuning    | lil-gui                                | MIT        | Live sliders for physics constants                           |
| Levels          | **Tiled** map editor                   | GPL (tool) | Exports JSON that Phaser loads directly                      |
| Pixel art       | LibreSprite or Pixelorama              | GPL / MIT  | Free sprite editors                                          |
| Placeholder art | Kenney.nl assets                       | CC0        | No attribution required                                      |
| Sound FX        | jsfxr                                  | Unlicense  | Retro SFX in seconds                                         |
| Music           | BeepBox or LMMS                        | MIT / GPL  | Chiptune loops                                               |
| CI / hosting    | GitHub Actions + GitHub Pages, itch.io | —          | Free static hosting                                          |

**Physics choice:** use **Matter** physics only. Do not mix Arcade and Matter in the same scene.
Recoil needs real impulses, rotation, bouncing and (later) ragdoll joints, and Arcade can't do these.

---

## 3. Architecture Overview

```
src/
  main.ts                 # Phaser game config + scene registration
  config/
    tuning.ts             # ALL gameplay constants (gravity, recoil, max speed…)
  core/                   # Pure TS. No Phaser imports. Unit tested.
    recoil.ts             # computeRecoil(aim, weapon, velocity) → new velocity
    weapons.ts            # weapon state machine: cooldown, ammo, reload
    scoring.ts            # par shots, star rating, best times
  data/
    weapons.ts            # weapon definitions as data (no logic)
    levels.ts             # level manifest (id, file, par, unlock rules)
  entities/               # Phaser-aware wrappers around core logic
    Player.ts
    Projectile.ts
    Enemy.ts
  scenes/
    BootScene.ts          # load assets
    MenuScene.ts
    LevelScene.ts         # gameplay
    HudScene.ts           # runs in parallel over LevelScene
  systems/
    juice.ts              # screen shake, hit-stop, flash, squash/stretch
    audio.ts              # SFX pool, volume, mute
    save.ts               # localStorage persistence (versioned)
  debug/
    tuningPanel.ts        # lil-gui panel, dev builds only
public/
  assets/                 # sprites, audio, Tiled JSON maps
tests/
```

**Key principle:** game rules live in `core/` as pure functions and plain objects, so they can be tested
without a browser. Phaser code in `entities/` and `scenes/` stays thin: read input, call core, apply the results to physics bodies.

---

## 4. Phases

Each phase ends with a **playable build** and an **exit criterion**. Don't start the next phase until the current one is met.
Time estimates assume part-time evenings and weekends.

---

### Phase 0 — Project Setup

**Goal:** An empty but production-grade project that builds, lints, tests and deploys.
**Estimate:** 1 evening

- [ ] Scaffold Vite + TypeScript (strict) + Phaser 4
- [ ] Configure Matter physics in the game config and turn on its debug rendering in dev
- [ ] ESLint + Prettier + Vitest wired into `npm` scripts
- [ ] Folder structure from §3, with a placeholder `BootScene` → `LevelScene`
- [ ] GitHub Actions: lint + typecheck + test + build on every push
- [ ] Deploy `main` to GitHub Pages automatically
- [ ] Optional: review the AI agent skills shipped in the Phaser repo for use with Claude Code

**Exit criterion:** pushing to `main` produces a live URL that shows a coloured rectangle falling onto a floor.

---

### Phase 1 — Core Feel Prototype ⭐ _(the most important phase)_

**Goal:** Prove the mechanic is fun using only grey boxes. If this phase isn't fun, nothing later will save it.
**Estimate:** 1–2 weekends

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
Write the final tuning values into `config/tuning.ts`.

**Learning focus:** game loop, fixed vs variable timestep, impulses, and why tuning matters more than code.

---

### Phase 2 — Weapons & Ammo

**Goal:** Make the weapons different ways to move, not just different ways to shoot.
**Estimate:** 1–2 weekends

| Weapon          | Recoil                  | Fire mode             | Movement role                       | Ammo       |
| --------------- | ----------------------- | --------------------- | ----------------------------------- | ---------- |
| Pistol          | Small                   | Semi-auto             | Precise nudges, mid-air corrections | Many       |
| Shotgun         | Huge                    | Semi-auto, spread     | The "jump" button                   | Few        |
| Minigun         | Tiny, continuous        | Hold to fire          | Hover / sustained flight, spins you | Burns fast |
| Rocket launcher | Massive + delayed blast | Semi-auto, projectile | Catapult; blast also pushes you     | 1–2        |

- [ ] Weapon definitions as data in `data/weapons.ts` (recoil, cooldown, ammo, spread, projectile type)
- [ ] Weapon state machine in `core/weapons.ts` (ready → firing → cooldown, ammo, empty)
- [ ] Switch weapons with `1–4` and the mouse wheel
- [ ] Per-level weapon loadout and ammo (defined by the level, not the player)
- [ ] Ammo pickups placed in levels
- [ ] Projectiles as real physics bodies (they can push crates and knock enemies)
- [ ] Rocket blast: radial impulse to everything nearby, **including the player** (rocket jumping)
- [ ] Unit tests for weapon state transitions and ammo accounting

**Exit criterion:** each weapon has at least one situation where it's clearly the best choice for moving.

---

### Phase 3 — Juice & Comedy

**Goal:** Make every action feel punchy and every death funny. This is where "working" becomes "hilarious".
**Estimate:** 1 weekend

- [ ] Screen shake scaled by weapon recoil
- [ ] Hit-stop (freeze ~40–80 ms) on big shots and kills
- [ ] Muzzle flash, shell casings (physics bodies that bounce around), smoke particles
- [ ] Squash & stretch on the player when landing and firing
- [ ] Googly eyes that lag behind the player's motion (a simple spring)
- [ ] Death = ragdoll: swap the player for a jointed Matter ragdoll with an exaggerated launch
- [ ] SFX for every action via jsfxr, with slight random pitch variation to avoid repetition
- [ ] One looping music track
- [ ] A single "juice intensity" setting (so it can be toned down for comfort)

**Exit criterion:** a playtester laughs at least once in the first two minutes. Record a 10-second GIF worth sharing.

**Learning focus:** watch _"Juice it or lose it"_ (Jonasson & Purho) and _"The Art of Screenshake"_ (Jan Willem Nijman) before starting.

---

### Phase 4 — Hazards, Enemies & Goals

**Goal:** Give the player things to avoid and reasons to aim at something other than the floor.
**Estimate:** 1–2 weekends

- [ ] Hazards: spikes (instant death), bouncy pads, moving platforms, breakable crates
- [ ] Targets: balloons or bullseyes that must be popped to open the exit
- [ ] Enemy 1 — **Walker:** patrols a platform, dies to any hit, flies away comically
- [ ] Enemy 2 — **Turret:** shoots at the player; its bullets push you (so it can help or hurt)
- [ ] Enemy 3 — **Magnet guy:** pulls the player toward him (tests recoil control)
- [ ] Level win/lose states and a results screen (time, shots used, deaths)
- [ ] Collision categories/filters set up cleanly (player, enemy, projectile, world, sensor)

**Exit criterion:** one level uses every hazard and enemy type and feels fair.

---

### Phase 5 — Levels & Progression

**Goal:** A complete, short campaign.
**Estimate:** 2–3 weekends

- [ ] Tiled workflow: tile layers for terrain, object layers for spawns, pickups, hazards and the exit
- [ ] Loader that turns Tiled object layers into entities (data-driven, no hardcoded positions)
- [ ] 10–12 levels in a difficulty curve:
  - 1–3: pistol only, teach aiming as movement
  - 4–6: shotgun introduced, big gaps, ammo scarcity
  - 7–9: minigun and rocket, enemies, combinations
  - 10–12: mastery levels with multiple routes
- [ ] Par shot count per level + 1–3 star rating
- [ ] Level select screen with unlocks
- [ ] Save progress to `localStorage` (versioned schema, safe fallback if storage is blocked)
- [ ] Unit tests for scoring and unlock rules

**Exit criterion:** a new player can finish the campaign in ~20–30 minutes, and at least one level has an unintended shortcut you decide to keep.

**Level design rule:** introduce a mechanic safely, then test it, then twist it, then combine it with something already learned.

---

### Phase 6 — Menus, Settings & Polish

**Goal:** It feels like a finished game, not a prototype.
**Estimate:** 1–2 weekends

- [ ] Title screen, pause menu, level results, credits (list every open-source asset and tool)
- [ ] Settings: master/SFX/music volume, juice intensity, screen shake on/off
- [ ] Keyboard-only aiming fallback (accessibility), optional gamepad support
- [ ] Replace placeholder art with a consistent style (pixel art or clean vector shapes)
- [ ] Scene transitions and a loading bar
- [ ] Performance pass: object pooling for bullets and particles, a stable 60 fps on a mid-range laptop
- [ ] Browser checks: Chrome, Firefox, Safari

**Exit criterion:** three people outside the project play it end to end without asking you a question.

---

### Phase 7 — Release

**Goal:** Ship it publicly.
**Estimate:** 1 weekend

- [ ] Production build size check (target < 10 MB total)
- [ ] Publish on **itch.io** (HTML5 embed) and keep GitHub Pages as a mirror
- [ ] itch.io page: GIFs, a short description, controls, credits
- [ ] Open-source the repo with a README and LICENSE
- [ ] Collect feedback and log it in PROGRESS.md for a v1.1

**Exit criterion:** the game is live, and strangers have played it.

---

## 5. Controls (v1)

| Input                 | Action                              |
| --------------------- | ----------------------------------- |
| Mouse                 | Aim                                 |
| Left click / hold     | Fire (hold for automatic weapons)   |
| `1`–`4` / mouse wheel | Switch weapon                       |
| `R`                   | Restart level instantly             |
| `Esc`                 | Pause                               |
| `` ` `` (dev builds)  | Toggle tuning panel + physics debug |

---

## 6. Risks & Mitigations

| Risk                                     | Mitigation                                                                                 |
| ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| The core mechanic isn't fun              | Phase 1 is a hard gate: tune with live sliders until it is, or pivot early                 |
| Physics instability (tunnelling, jitter) | Fixed timestep, clamp max speed, thicker walls, avoid tiny fast bodies                     |
| Scope creep (it's a first game)          | Pillars in §1 decide every feature; new ideas go to the "Ideas parking lot" in PROGRESS.md |
| Art takes forever                        | Kenney CC0 placeholders until Phase 6; the gameplay must be fun in grey boxes first        |
| Levels feel samey                        | Every level must introduce, twist or combine something (§ Phase 5 rule)                    |

---

## 7. Definition of Done (every task)

- Typecheck, lint and tests pass
- Logic added to `core/` has unit tests
- New tuning numbers live in `config/tuning.ts`, not inline
- It has been **played**, not just compiled
- PROGRESS.md is updated
