import Phaser from 'phaser';
import { TUNING } from './config/tuning';
import { BootScene } from './scenes/BootScene';
import { ArenaScene } from './scenes/ArenaScene';

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
      runner: { fps: TUNING.physics.stepHz },
      // Draws body outlines; stripped from production builds.
      debug: import.meta.env.DEV,
    },
  },
  scene: [BootScene, ArenaScene],
});
