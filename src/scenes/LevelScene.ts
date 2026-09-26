import Phaser from 'phaser';
import { TUNING } from '../config/tuning';

/** Gameplay scene. Phase 0 placeholder: a static floor and a box that falls onto it. */
export class LevelScene extends Phaser.Scene {
  static readonly KEY = 'LevelScene';

  constructor() {
    super(LevelScene.KEY);
  }

  create(): void {
    const { view, floor, fallingBox } = TUNING;

    // Rectangle shapes are visible without debug rendering; Matter bodies are attached to them.
    const floorRect = this.add.rectangle(
      view.widthPx / 2,
      view.heightPx - floor.heightPx / 2,
      view.widthPx,
      floor.heightPx,
      floor.color,
    );
    this.matter.add.gameObject(floorRect, { isStatic: true });

    const box = this.add.rectangle(
      view.widthPx / 2,
      fallingBox.spawnYPx,
      fallingBox.widthPx,
      fallingBox.heightPx,
      fallingBox.color,
    );
    this.matter.add.gameObject(box, { angle: fallingBox.spawnAngleRad });
  }
}
