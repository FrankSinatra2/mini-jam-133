import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";
import TilemapKeys from "../consts/TilemapKeys";
import TextureKeys from "../consts/TextureKeys";
import { LayerManager } from "../game/LayerManager";
import SoundKeys from "../consts/SoundKeys";

export default class WinScreen extends Phaser.Scene {
    private player!: Player;
    // private flag!: Flag;
    private layers: LayerManager[] = [];

    constructor() {
        super(SceneKeys.WinScreen);
    }

    create(): void {
        const winMusic = this.sound.add(SoundKeys.Win, {loop: true});
        winMusic.play();
    }
}