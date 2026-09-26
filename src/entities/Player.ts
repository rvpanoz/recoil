import Phaser from 'phaser';
import { TUNING } from '../config/tuning';

/** The player: a bouncy ball. Recoil will be its only way to move. */
export class Player {
  readonly gameObject: Phaser.GameObjects.Arc;

  constructor(scene: Phaser.Scene) {
    const { radiusPx, spawnXPx, spawnYPx, color, restitution, friction, frictionAir } = TUNING.player;

    // An Arc stays visible in production, where Matter debug outlines are off.
    this.gameObject = scene.add.circle(spawnXPx, spawnYPx, radiusPx, color);
    scene.matter.add.gameObject(this.gameObject, {
      shape: { type: 'circle', radius: radiusPx },
      restitution,
      friction,
      frictionAir,
    });
  }
}
