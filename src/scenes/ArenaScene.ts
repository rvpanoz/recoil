import Phaser from 'phaser';
import { TUNING } from '../config/tuning';
import { Player } from '../entities/Player';

/** Gameplay scene. Phase 1 prototype: a static floor and the player ball. */
export class ArenaScene extends Phaser.Scene {
  static readonly KEY = 'ArenaScene';

  constructor() {
    super(ArenaScene.KEY);
  }

  create(): void {
    const { view, floor } = TUNING;

    // Rectangle shapes are visible without debug rendering; Matter bodies are attached to them.
    const floorRect = this.add.rectangle(
      view.widthPx / 2,
      view.heightPx - floor.heightPx / 2,
      view.widthPx,
      floor.heightPx,
      floor.color,
    );
    this.matter.add.gameObject(floorRect, { isStatic: true });

    new Player(this);
  }
}
