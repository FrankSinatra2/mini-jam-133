import Phaser from 'phaser'

import HelloWorldScene from './HelloWorldScene'
import { TileMap } from './tiles';

// const config: Phaser.Types.Core.GameConfig = {
// 	type: Phaser.AUTO,
// 	parent: 'app',
// 	width: 800,
// 	height: 600,
// 	physics: {
// 		default: 'arcade',
// 		arcade: {
// 			gravity: { y: 200 },
// 		},
// 	},
// 	scene: [HelloWorldScene],
// }

// export default new Phaser.Game(config)


const test = new TileMap;

console.log(test.getOpenTile());


test.moveTile(1, 0);


test.moveTile(1, 1);

// test.moveTile(2, 0);