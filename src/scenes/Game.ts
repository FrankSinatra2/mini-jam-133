import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";

export default class Game extends Phaser.Scene {
    private player!: Player;

    constructor() {
        super(SceneKeys.Game);
    }

    create(): void {
        const { width, height } = this.scale;
        this.player = new Player(this, width * 0.5, height * 0.5);

        this.add.existing(this.player);
    }
}