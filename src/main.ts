import Phaser from 'phaser'

import Preloader from './scenes/Preloader'
import Game from './scenes/Game'
import WinScreen from './scenes/WinScreen'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 80*10,
	height: 80*8,
	physics: {
		default: 'arcade',
		arcade: {
<<<<<<< HEAD
			gravity: { y: 1000 },
			debug: true
=======
			gravity: { y: 2000 },
>>>>>>> 2b49dc0 (test momentum)
		},
	},
	scene: [Preloader, Game, WinScreen],
}

export default new Phaser.Game(config);