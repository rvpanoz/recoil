# Recoil — Project Plan

> A side-view 2D arena shooter where **your gun is your only way to move**.
> Every shot hits the enemy you aimed at **and** throws you the opposite way.
> You can't dodge without shooting, and you can't shoot without moving.

This file describes **what** we're building and **why**, phase by phase. It changes rarely.
Day-to-day status lives in [PROGRESS.md](./PROGRESS.md). Working conventions live in [CLAUDE.md](./CLAUDE.md).

---

## 1. Vision

### Elevator pitch

A small round guy with googly eyes holds a gun far too big for him. He can't walk or jump.
He is dropped into an arena, and waves of ridiculous enemies pour in. Firing the shotgun at the
horde below launches him into the air. Firing the minigun keeps him hovering while he spins
out of control. When he runs out of ammo, he falls.

### Core loop

1. Enemies spawn in waves and come at you from the ground and the air.
2. You shoot them. Every shot kills things **and** moves you.
3. Dead enemies drop ammo. **Ammo is both firepower and mobility.**
4. Stay aggressive to stay airborne. Stop killing and you run dry, fall, and get swarmed.
5. Clear the waves, beat the boss, and unlock the next arena. Chase a high score.

### Design pillars

Every feature must serve at least one pillar, or it gets cut.

1. **Every shot is an attack and a move.** No walking, no jumping, no dodge button. Ever.
2. **Kills are fuel.** Enemies drop the ammo you need to keep moving, which rewards aggression.
3. **Failure is funny.** Ragdoll deaths, enemies flying away comically, instant restart.
4. **Short, replayable runs.** A run lasts 3–8 minutes, with score, combos and a local high-score table.

### Target experience

- A new player understands "shooting moves me" within **5 seconds**, without tutorial text.
- Skilled players aim at enemies _specifically_ to move where they want to go.
- The best moments are accidents: a shotgun blast that clears a crowd and launches you into the spikes.

### Out of scope (v1)

Multiplayer, procedural arenas, story or cutscenes, mobile/touch controls, monetization, a player-facing editor.

---

## 2. Tech Stack (all open source)

| Concern         | Choice                                 | License    | Why                                                             |
| --------------- | -------------------------------------- | ---------- | --------------------------------------------------------------- |
| Engine          | **Phaser 4** (4.2.x)                   | MIT        | Mature 2D framework, first-class TS types, bundled Matter.js    |
| Physics         | **Matter.js** (via Phaser)             | MIT        | Rigid bodies, impulses, knockback, ragdoll constraints, sensors |
| Language        | TypeScript (strict)                    | Apache-2.0 | Your home turf                                                  |
| Build           | Vite                                   | MIT        | Fast HMR, simple static build                                   |
| Tests           | Vitest                                 | MIT        | Unit tests for pure game logic                                  |
| Lint/format     | ESLint + Prettier                      | MIT        | Standard                                                        |
| Debug tuning    | lil-gui                                | MIT        | Live sliders for physics and combat constants                   |
| Arenas          | **Tiled** map editor                   | GPL (tool) | Exports JSON that Phaser loads directly                         |
| Pixel art       | LibreSprite or Pixelorama              | GPL / MIT  | Free sprite editors                                             |
| Placeholder art | Kenney.nl assets                       | CC0        | No attribution required                                         |
| Sound FX        | jsfxr                                  | Unlicense  | Retro SFX in seconds                                            |
| Music           | BeepBox or LMMS                        | MIT / GPL  | Chiptune loops                                                  |
| CI / hosting    | GitHub Actions + GitHub Pages, itch.io | —          | Free static hosting                                             |

**Physics choice:** use **Matter** physics only. Do not mix Arcade and Matter in the same scene.
Recoil, knockback, enemies bouncing off each other and ragdoll deaths all need real rigid-body physics.

---

## 3. Architecture Overview

```
src/
  main.ts                 # Phaser game config + scene registration
  config/
    tuning.ts             # ALL gameplay constants (gravity, recoil, speeds, damage, timings…)
  core/                   # Pure TS. No Phaser imports. Unit tested.
    recoil.ts             # computeRecoil(aim, weapon, velocity) → new velocity
    weapons.ts            # weapon state machine: cooldown, ammo, firing
    health.ts             # damage, invulnerability frames, death
    waves.ts              # wave director: which enemies spawn, when, where
    scoring.ts            # score, combo multiplier, combo timeout
  data/
    weapons.ts            # weapon definitions (data only)
    enemies.ts            # enemy definitions: hp, speed, mass, drops, score
    waves.ts              # wave scripts per arena
    arenas.ts             # arena manifest (id, Tiled file, wave script, unlock rule)
  entities/               # Phaser-aware wrappers around core logic
    Player.ts
    Projectile.ts
    Enemy.ts              # shared enemy behaviour; types configured from data
    Pickup.ts
  scenes/
    BootScene.ts          # load assets
    MenuScene.ts
    ArenaScene.ts         # gameplay
    HudScene.ts           # runs in parallel over ArenaScene
    GameOverScene.ts      # score, high scores, retry
  systems/
    pools.ts              # object pools for bullets, enemies, pickups, particles
    juice.ts              # screen shake, hit-stop, flash, squash/stretch
    audio.ts              # SFX pool, volume, mute
    save.ts               # localStorage persistence (versioned)
  debug/
    tuningPanel.ts        # lil-gui panel, dev builds only
public/
  assets/                 # sprites, audio, Tiled JSON arenas
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
- [ ] Folder structure from §3, with a placeholder `BootScene` → `ArenaScene`
- [ ] GitHub Actions: lint + typecheck + test + build on every push
- [ ] Deploy `main` to GitHub Pages automatically
- [ ] Optional: review the AI agent skills shipped in the Phaser repo for use with Claude Code

**Exit criterion:** pushing to `main` produces a live URL that shows a coloured rectangle falling onto a floor.

---

### Phase 1 — Core Combat Prototype ⭐ _(the most important phase)_

**Goal:** Prove that shooting-as-movement is fun **while fighting**, using only grey boxes.
If this phase isn't fun, nothing later will save it.
**Estimate:** 2 weekends

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

**Learning focus:** game loop, fixed vs variable timestep, impulses, collision events, and why tuning matters more than code.

---

### Phase 2 — Weapons

**Goal:** Each weapon is a different way to fight **and** a different way to move.
**Estimate:** 1–2 weekends

| Weapon          | Damage      | Recoil           | Fire mode    | Movement role                                     | Ammo                    |
| --------------- | ----------- | ---------------- | ------------ | ------------------------------------------------- | ----------------------- |
| Pistol          | Low         | Small            | Semi-auto    | Nudges and corrections; your fallback             | **Infinite**, slow fire |
| Shotgun         | High, close | Huge             | Spread       | The "jump": blast the crowd below to fly up       | Limited                 |
| Minigun         | Low, fast   | Tiny, continuous | Hold to fire | Hover and strafe; spins you if you're careless    | Burns fast              |
| Rocket launcher | Splash      | Massive + blast  | Projectile   | Catapult; the blast pushes you too (rocket jumps) | 1–3                     |

- [ ] Weapon definitions as data in `data/weapons.ts` (damage, recoil, cooldown, spread, knockback, projectile type)
- [ ] Weapon state machine in `core/weapons.ts` (ready → firing → cooldown, ammo, empty)
- [ ] Switch weapons with `1–4` and the mouse wheel
- [ ] The pistol never runs out, so the player is never fully stuck, just weak and slow
- [ ] Weapon pickups dropped by some enemies or from crates
- [ ] Rocket blast: radial impulse and damage to everything nearby, **including the player** (self-damage low but non-zero)
- [ ] Unit tests for weapon state transitions and ammo accounting

**Exit criterion:** each weapon has a situation where it's clearly the best choice, both for killing and for moving.

---

### Phase 3 — Juice & Comedy

**Goal:** Every shot feels punchy and every death is funny. This is where "working" becomes "hilarious".
**Estimate:** 1 weekend

- [ ] Screen shake scaled by weapon recoil and explosion size
- [ ] Hit-stop (freeze ~40–80 ms) on big hits, kills and multi-kills
- [ ] Muzzle flash, shell casings (physics bodies that bounce around), smoke, impact particles
- [ ] Enemies flash white when hit and fly away exaggeratedly when killed
- [ ] Squash & stretch on the player when firing and landing
- [ ] Googly eyes that lag behind the player's motion (a simple spring)
- [ ] Player death = ragdoll: swap the player for a jointed Matter ragdoll with an absurd launch
- [ ] Funny enemy death sounds and multi-kill callouts ("DOUBLE!", "TRIPLE!", "WHOOPS" for self-kills)
- [ ] SFX for every action via jsfxr, with slight random pitch variation
- [ ] One looping combat music track
- [ ] A single "juice intensity" setting (so it can be toned down for comfort)

**Exit criterion:** a playtester laughs at least once in the first two minutes. Record a 10-second GIF worth sharing.

**Learning focus:** watch _"Juice it or lose it"_ (Jonasson & Purho) and _"The Art of Screenshake"_ (Jan Willem Nijman) before starting.

---

### Phase 4 — Enemy Roster & Wave Director

**Goal:** Enemies that force the player to move in different ways, arriving in designed waves.
**Estimate:** 2 weekends

| Enemy                | Behaviour                                             | Forces the player to…                                 |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------- |
| **Grunt**            | Walks toward you on the ground                        | Stay airborne                                         |
| **Pigeon**           | Flies in erratic swoops                               | Aim upward, which pushes you **down** into the grunts |
| **Chonk**            | Slow, tanky, barely knocked back                      | Commit ammo or avoid it                               |
| **Kaboom**           | Runs at you and explodes, launching everything nearby | Kill it at range, or ride the blast                   |
| **Sniper**           | Stays at range and fires slow bullets that push you   | Dodge by shooting                                     |
| **Boss** (per arena) | A big set-piece enemy with phases                     | Use everything learned                                |

- [ ] Enemy definitions as data in `data/enemies.ts` (hp, speed, mass, behaviour, drops, score value)
- [ ] Simple behaviours as small state machines (patrol → chase → attack), not a general AI framework
- [ ] Wave director in `core/waves.ts`: scripted waves from `data/waves.ts`, spawn points, spawn telegraphs
- [ ] Short breather between waves, with a "WAVE 3" banner
- [ ] Enemies and projectiles pooled; target 60 fps with 40+ enemies on screen
- [ ] Collision categories/filters defined in one place (player, enemy, player bullet, enemy bullet, world, pickup, sensor)
- [ ] Unit tests for the wave director (spawn order, wave completion, timings)

**Exit criterion:** one arena runs 10 designed waves and a boss, and each enemy type changes how you move.

---

### Phase 5 — Arenas, Scoring & Progression

**Goal:** A complete arcade game with a reason to replay.
**Estimate:** 2 weekends

- [ ] Tiled workflow: tile layers for terrain, object layers for spawn points, hazards and pickup spots
- [ ] Loader that builds the arena from Tiled data (no hardcoded positions)
- [ ] 3–4 arenas, each with a gimmick:
  - **Backyard:** plain ground, teaches the basics
  - **Rooftops:** gaps you can fall through, so running out of ammo is deadly
  - **Kitchen:** a hot-plate floor, you must stay airborne
  - **Trampoline factory:** bounce pads everywhere, chaos
- [ ] Score: points per kill × combo multiplier; the combo decays if you stop killing
- [ ] Style bonuses: multi-kills, mid-air kills, kills with your own rocket blast
- [ ] Beat an arena's boss to unlock the next arena
- [ ] Local high-score table per arena, saved to `localStorage` (versioned schema, safe fallback)
- [ ] Game-over screen: score, waves reached, best combo, retry
- [ ] Unit tests for scoring, combo decay and unlock rules

**Exit criterion:** a new player plays at least three runs in a row without being asked to.

---

### Phase 6 — Menus, Settings & Polish

**Goal:** It feels like a finished game, not a prototype.
**Estimate:** 1–2 weekends

- [ ] Title screen, arena select, pause menu, credits (list every open-source asset and tool)
- [ ] Settings: master/SFX/music volume, juice intensity, screen shake on/off
- [ ] Optional gamepad support (right stick aims, trigger fires)
- [ ] Replace placeholder art with a consistent style (pixel art or clean vector shapes)
- [ ] Scene transitions and a loading bar
- [ ] Performance pass: a stable 60 fps on a mid-range laptop during the busiest wave
- [ ] Browser checks: Chrome, Firefox, Safari

**Exit criterion:** three people outside the project play a full run without asking you a question.

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
| `R`                   | Restart run instantly               |
| `Esc`                 | Pause                               |
| `` ` `` (dev builds)  | Toggle tuning panel + physics debug |

---

## 6. Risks & Mitigations

| Risk                                                    | Mitigation                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Aiming and moving together feels frustrating, not funny | Phase 1 is a hard gate: tune recoil, gravity and enemy speed with live sliders until it's fun |
| The player gets stuck with no ammo                      | The pistol has infinite ammo; generous drops early, scarcer later                             |
| Too many physics bodies tank performance                | Pool everything; bullets are small sensors where possible; cap enemies per wave               |
| Physics instability (tunnelling, jitter)                | Fixed timestep, clamp max speed, thick walls, avoid tiny very fast bodies                     |
| Scope creep (it's a first game)                         | Pillars in §1 decide every feature; new ideas go to the "Ideas parking lot" in PROGRESS.md    |
| Art takes forever                                       | Kenney CC0 placeholders until Phase 6; it must be fun in grey boxes first                     |

---

## 7. Definition of Done (every task)

- Typecheck, lint and tests pass
- Logic added to `core/` has unit tests
- New tuning numbers live in `config/tuning.ts`, not inline
- It has been **played**, not just compiled
- PROGRESS.md is updated
