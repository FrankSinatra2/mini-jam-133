import Phaser from "phaser";
import SceneKeys from "../consts/SceneKeys";
import Player from "../game/Player";
import Flag from "../game/Flag";
import TilemapKeys from "../consts/TilemapKeys";
import TextureKeys from "../consts/TextureKeys";
import { PuzzleState } from "../util/PuzzleState";
import Timer from "../game/Timer";
import { LayerManager } from "../game/LayerManager";
import EventKeys from "../consts/EventKeys";
import SoundKeys from "../consts/SoundKeys";

export default class Game extends Phaser.Scene {
    private player!: Player;
    private flag!: Flag;
    private timer!: Timer;
    private layers: LayerManager[] = [];
    private puzzleState = new PuzzleState();

    constructor() {
        super(SceneKeys.Game);
    }

    update(time: number, delta: number): void {
        this.player.update(time, delta);
        this.timer.update(time, delta);
        this.layers.forEach(x => x.update(time, delta));
    }


    create(): void {
        const { width, height } = this.scale;

        const backgroundMusic = this.sound.add(SoundKeys.Bgm, {loop: true});
        // backgroundMusic.play();

        const debugMap = this.add.tilemap(TilemapKeys.DebugMap);
        const debugTileset = debugMap.addTilesetImage(TextureKeys.DebugTileset);

        const map = this.add.tilemap(TilemapKeys.Map1);
        const incaFrontTileset = map.addTilesetImage(TextureKeys.IncaTilesetFront);
        const incaBackTileset = map.addTilesetImage(TextureKeys.IncaTilesetBack);
        const testCollisionTileset = map.addTilesetImage(TextureKeys.TestCollision);
        
        const fmtLayer = 'Tile Layer {}';
        
        this.puzzleState.on('active-ids', (activeIds: number[]) => {
            for (const layerManager of this.layers) {
                if (activeIds.some(x => x === layerManager.id)) {
                    layerManager.setHighlight(true);
                } else {
                    layerManager.setHighlight(false);
                }
            }
        });
        
        //! @todo Uncomment this
        this.puzzleState.scramble(50);

        let i = -1;
        for (let gridY = 0; gridY < 4; gridY++) {
            for (let gridX = 0; gridX < 4; gridX++) {
                
                i++;
                
                if (i === 15) {
                    break;
                }

                const [x, y] = this.puzzleState.getIndexOfId(i+1);

                const offset = [gridX - x, gridY - y];
                
                const layer = map.createLayer(fmtLayer.replace('{}', `${i+2}`), [debugTileset, incaFrontTileset, incaBackTileset, testCollisionTileset], -offset[0]*20*8, -offset[1]*20*8);
                
                // Collision addition
                layer?.setCollisionByProperty({collidable: true});
                
                const manager = new LayerManager(this, x * 20 * 8, y * 20 * 8, layer, i+1, gridX, gridY);
                manager.on(EventKeys.MoveTile, (id: number) => {
                    this.moveLayer(id);
                });
                this.layers.push(manager);
            }
        }

        this.timer = new Timer(this, width * 0.85 , height * 0.05);
        this.add.existing(this.timer);
        
        this.player = new Player(this, width * 0.1, height * 0.1);
        this.flag = new Flag(this, width * 0.78, height * 0.79);
        
        this.add.existing(this.player);
        this.add.existing(this.flag);

        // Loop through all layers and make them collidable with the player
        for (const layerManager of this.layers) {
            this.physics.add.collider(layerManager.layer, this.player);
        }

        // Make the player collidable with the flag
        this.physics.add.overlap(this.player, this.flag, ()=>{
            this.scene.start(SceneKeys.WinScreen);
        });

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