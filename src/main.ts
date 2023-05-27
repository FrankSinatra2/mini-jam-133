import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import WinScreen from './scenes/WinScreen'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 80*8,
	height: 80*8,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 1000 },
			debug: true
		},
	},
	scene: [Preloader, Game, WinScreen],
}

export default new Phaser.Game(config);