import Phaser from 'phaser';
import { LevelScene } from './LevelScene';

/** Loads assets (none yet) and hands off to the first gameplay scene. */
export class BootScene extends Phaser.Scene {
  static readonly KEY = 'BootScene';

  constructor() {
    super(BootScene.KEY);
  }

  create(): void {
    this.scene.start(LevelScene.KEY);
  }
}
