import { describe, expect, it } from 'vitest';
import { TUNING } from '../config/tuning';

// Sample test proving the Vitest setup works. Real core tests arrive with core logic in Phase 1.
describe('tuning sanity', () => {
  it('pulls gravity down the screen (Y axis points down)', () => {
    expect(TUNING.physics.gravityY).toBeGreaterThan(0);
  });

  it('spawns the player above the floor', () => {
    const floorTopPx = TUNING.view.heightPx - TUNING.floor.heightPx;
    const playerBottomPx = TUNING.player.spawnYPx + TUNING.player.radiusPx;
    expect(playerBottomPx).toBeLessThan(floorTopPx);
  });
});
