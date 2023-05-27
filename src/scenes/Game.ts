import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";
import TilemapKeys from "../consts/TilemapKeys";
import TextureKeys from "../consts/TextureKeys";
import { PuzzleState } from "../util/PuzzleState";

export default class Game extends Phaser.Scene {
    private player!: Player;

    private puzzleState = new PuzzleState();

    constructor() {
        super(SceneKeys.Game);
    }


    update(time: number, delta: number): void {
        this.player.update(time, delta);
    }


    create(): void {
        const { width, height } = this.scale;

        const bgm = this.sound.add("kysNOW", {loop: true});
        bgm.play();

        const debugMap = this.add.tilemap(TilemapKeys.DebugMap);
        const debugTileset = debugMap.addTilesetImage(TextureKeys.DebugTileset);

        // const map = this.add.tilemap(TilemapKeys.TestMap);
        const map = this.add.tilemap(TilemapKeys.TestCollisionMap);
        const incaFrontTileset = map.addTilesetImage(TextureKeys.IncaTilesetFront);
        const incaBackTileset = map.addTilesetImage(TextureKeys.IncaTilesetBack);
        const testCollisionTileset = map.addTilesetImage(TextureKeys.TestCollision);
        
        const fmtLayer = 'Tile Layer {}';
        const layers: Phaser.Tilemaps.TilemapLayer[] = [];
        
        //! @todo Uncomment this
        // this.puzzleState.scramble(50);

        let i = -1;
        for (let gridY = 0; gridY < 4; gridY++) {
            for (let gridX = 0; gridX < 4; gridX++) {
                
                i++;
                
                if (i === 15) {
                    break;
                }

                const [x, y] = this.puzzleState.getIndexOfId(i+1);

                const offset = [gridX - x, gridY - y];
                
                const layer = map.createLayer(fmtLayer.replace('{}', `${i+2}`), [incaFrontTileset, incaBackTileset, testCollisionTileset], -offset[0]*20*8, -offset[1]*20*8);
                
                console.log(i+1, x, y, gridX, gridY, layer.x, layer.y)
                layers.push(layer);
            }
        }
        
        this.player = new Player(this, width * 0.5, height * 0.5);

        this.add.existing(this.player);
    }
}