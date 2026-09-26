import { describe, expect, it } from 'vitest';
import { TUNING } from '../config/tuning';

// Sample test proving the Vitest setup works. Real core tests arrive with core logic in Phase 1.
describe('tuning sanity', () => {
  it('pulls gravity down the screen (Y axis points down)', () => {
    expect(TUNING.physics.gravityY).toBeGreaterThan(0);
  });

  it('spawns the falling box above the floor', () => {
    const floorTopPx = TUNING.view.heightPx - TUNING.floor.heightPx;
    const boxBottomPx = TUNING.fallingBox.spawnYPx + TUNING.fallingBox.heightPx / 2;
    expect(boxBottomPx).toBeLessThan(floorTopPx);
  });
});
