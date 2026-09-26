/**
 * All gameplay tuning constants live here. Never inline these numbers elsewhere.
 *
 * Units: pixels for sizes and positions, radians for angles, Matter units for physics.
 */
export const TUNING = {
  view: {
    widthPx: 1280,
    heightPx: 720,
    backgroundColor: 0x1b1d26,
  },
  physics: {
    /**
     * Matter gravity along Y (positive = down). Matter multiplies this by its gravity scale (0.001),
     * so 1 ≈ 0.001 px/ms², roughly 1000 px/s² at 60 fps.
     */
    gravityY: 1,
    /**
     * Physics steps per second, fixed so the feel is identical on every machine. 120 divides evenly into 60 Hz and
     * 120 Hz displays (2 or 1 steps per frame); Matter's default 60 makes 120 Hz displays stutter.
     */
    stepHz: 120,
  },
  floor: {
    heightPx: 64,
    color: 0x4a4f63,
  },
  player: {
    radiusPx: 24,
    /** Horizontal centre of the 1280 px view. */
    spawnXPx: 640,
    spawnYPx: 120,
    color: 0x9ab8d6,
    /** Bounciness, 0 (dead stop) to 1 (no energy lost). Matter uses the higher of the two touching bodies. */
    restitution: 0.6,
    /** Grip against surfaces while sliding, 0 to 1. Low so the ball rolls and skids after landing. */
    friction: 0.05,
    /** Air drag, 0 to 1: share of velocity lost per 16.7 ms (Matter scales it to the step length). Matter's default. */
    frictionAir: 0.01,
  },
} as const;
