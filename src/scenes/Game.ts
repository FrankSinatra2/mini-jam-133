import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";
import TilemapKeys from "../consts/TilemapKeys";
import TextureKeys from "../consts/TextureKeys";
import { PuzzleState } from "../util/PuzzleState";
import { LayerManager } from "../game/LayerManager";
import EventKeys from "../consts/EventKeys";

export default class Game extends Phaser.Scene {
    private player!: Player;
    private layers: LayerManager[] = [];

    private puzzleState = new PuzzleState();

    constructor() {
        super(SceneKeys.Game);
    }


    update(time: number, delta: number): void {
        this.player.update(time, delta);
        this.layers.forEach(x => x.update(time, delta));
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
        
        this.puzzleState.on('active-ids', (activeIds: number[]) => {
            console.log(activeIds);
            for (const layerManager of this.layers) {
                if (activeIds.some(x => x === layerManager.id)) {
                    layerManager.setHighlight(true);
                } else {
                    layerManager.setHighlight(false);
                }
            }
        });
        
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
                
                const layer = debugMap.createLayer(fmtLayer.replace('{}', `${i+2}`), [debugTileset, incaFrontTileset, incaBackTileset, testCollisionTileset], -offset[0]*20*8, -offset[1]*20*8);
                const manager = new LayerManager(this, x * 20 * 8, y * 20 * 8, layer, i+1, gridX, gridY);
                manager.on(EventKeys.MoveTile, (id: number) => {
                    this.moveLayer(id);
                });
                this.layers.push(manager);
            }
        }
        
        this.player = new Player(this, width * 0.5, height * 0.5);
        this.add.existing(this.player);

        this.puzzleState.emit('active-ids', this.puzzleState.getActiveIds());
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer, objs: Phaser.GameObjects.GameObject[]) => {
            objs.filter(x => x.name === 'tile-highlight').forEach(x => x.emit(EventKeys.HighlightClick));
        });
    }

    moveLayer(id: number): void {
        const [x, y] = this.puzzleState.getIndexOfId(id);
        const layer = this.layers.find(x => x.id === id);
        
        if (!layer || x === -1 || y === -1) {
            console.log(`Unknown id: ${id}`);
            return;
        }

        const [newX, newY] = this.puzzleState.openTile;
        this.puzzleState.move(x, y);
        layer.moveLayer(newX, newY);
    }
}