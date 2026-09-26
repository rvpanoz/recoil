import Phaser from 'phaser';
import { ArenaScene } from './ArenaScene';

/** Loads assets (none yet) and hands off to the first gameplay scene. */
export class BootScene extends Phaser.Scene {
  static readonly KEY = 'BootScene';

  constructor() {
    super(BootScene.KEY);
  }

  create(): void {
    this.scene.start(ArenaScene.KEY);
  }
}
