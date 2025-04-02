import * as Phaser from 'phaser';

import GridScene from './src/scenes/GridScene';
import LevelSelectScene from './src/scenes/LevelSelectScene';
import CreatorScene from './src/scenes/CreatorScene';


const config = {
  name: 'app',
  type: Phaser.AUTO,
  width: 1800,
  height: 800,
  scene: [LevelSelectScene, GridScene, CreatorScene],
};

window.game = new Phaser.Game(config);