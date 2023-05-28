import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import SoundKeys from "../consts/SoundKeys";

export default class WinScreen extends Phaser.Scene {

    constructor() {
        super(SceneKeys.WinScreen);
    }

    create(): void {
        const winMusic = this.sound.add(SoundKeys.Win, {loop: true, volume: .05});
        winMusic.play();

        const {width, height} = this.scale;

        this.add.text(width * 0.5, height * 0.5, 'You Win! Press SPACE to Play Again', {
            fontSize: '32px',
            color: '#fff',
            backgroundColor: '#000',
            shadow: {
                fill: true,
                blur: 0,
                offsetY: 0
            },
            padding: {
                left: 15,
                right: 15,
                top: 10,
                bottom: 10
            }
        }).setOrigin(0.5);

        this.input.keyboard.once('keydown-SPACE', () => {
            winMusic.stop();
            this.scene.stop(SceneKeys.WinScreen);
            this.scene.stop(SceneKeys.Game);
            this.scene.start(SceneKeys.Game);
        });
    }
}