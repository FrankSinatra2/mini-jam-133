import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";
import TilemapKeys from "../consts/TilemapKeys";
import TextureKeys from "../consts/TextureKeys";

export default class Game extends Phaser.Scene {
    private player!: Player;

    constructor() {
        super(SceneKeys.Game);
    }

    create(): void {
        const { width, height } = this.scale;
        this.player = new Player(this, width * 0.5, height * 0.5);

        this.add.existing(this.player);

        const map = this.add.tilemap(TilemapKeys.TestMap);
        const tileset = map.addTilesetImage(TextureKeys.IncaTilesetFront);
        
        const fmtLayer = 'Tile Layer {}';
        const layers: Phaser.Tilemaps.TilemapLayer[] = [];

        for (let i = 0; i < 15; i++) {
            const layer = map.createLayer(fmtLayer.replace('{}', `${i + 1}`), tileset);
            layers.push(layer);
        }

    }
}