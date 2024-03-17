import * as Phaser from 'phaser';

import GridScene from './src/scenes/GridScene'


const config = {
  name: 'app',
  type: Phaser.AUTO,
  width: 1800,
  height: 800,
  scene: [GridScene],
};

window.game = new Phaser.Game(config);