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
  },
  floor: {
    heightPx: 64,
    color: 0x4a4f63,
  },
  fallingBox: {
    widthPx: 64,
    heightPx: 64,
    spawnYPx: 120,
    /** Small initial tilt so the box lands on a corner and tumbles. */
    spawnAngleRad: 0.3,
    color: 0xff6b35,
  },
} as const;
