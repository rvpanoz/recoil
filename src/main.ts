import Phaser from 'phaser';
import { TUNING } from './config/tuning';
import { BootScene } from './scenes/BootScene';
import { LevelScene } from './scenes/LevelScene';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: TUNING.view.widthPx,
  height: TUNING.view.heightPx,
  backgroundColor: TUNING.view.backgroundColor,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: TUNING.physics.gravityY },
      // Draws body outlines; stripped from production builds.
      debug: import.meta.env.DEV,
    },
  },
  scene: [BootScene, LevelScene],
});
