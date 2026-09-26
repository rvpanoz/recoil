import Phaser from 'phaser';
import { TUNING } from '../config/tuning';

/** The player: a bouncy ball holding a gun. Recoil will be its only way to move. */
export class Player {
  readonly gameObject: Phaser.GameObjects.Arc;
  private readonly gun: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    this.gameObject = createBall(scene);
    this.gun = createGun(scene);
  }

  /** Points the gun from the ball's centre toward a position in world coordinates. */
  aimAt(worldX: number, worldY: number): void {
    const { x, y } = this.gameObject;
    this.gun.setPosition(x, y);
    this.gun.setRotation(Phaser.Math.Angle.Between(x, y, worldX, worldY));
  }
}

function createBall(scene: Phaser.Scene): Phaser.GameObjects.Arc {
  const { radiusPx, spawnXPx, spawnYPx, color, restitution, friction, frictionAir } = TUNING.player;

  // An Arc stays visible in production, where Matter debug outlines are off.
  const ball = scene.add.circle(spawnXPx, spawnYPx, radiusPx, color);
  scene.matter.add.gameObject(ball, {
    shape: { type: 'circle', radius: radiusPx },
    restitution,
    friction,
    frictionAir,
  });
  return ball;
}

function createGun(scene: Phaser.Scene): Phaser.GameObjects.Rectangle {
  const { spawnXPx, spawnYPx } = TUNING.player;
  const { lengthPx, thicknessPx, color } = TUNING.gun;

  // A separate visual with no physics body, so it keeps its aim while the ball rolls.
  // Origin at the left end makes the barrel pivot around the ball's centre.
  return scene.add.rectangle(spawnXPx, spawnYPx, lengthPx, thicknessPx, color).setOrigin(0, 0.5);
}
