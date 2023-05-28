import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import EventKeys from "../consts/EventKeys";
import SoundKeys from "../consts/SoundKeys";
import { pickRandom } from "../util/pick-random";

type LayerMoveCmd = {
    inital: [number, number];
    new: [number, number];
    lerpValue: number;
}

export class LayerManager extends Phaser.GameObjects.Container {
    public layer!: Phaser.Tilemaps.TilemapLayer;
    private highlight!: Phaser.GameObjects.Image;

    readonly id: number;
    readonly gridX: number;
    readonly gridY: number;

    private tileMoveSounds: Phaser.Sound.BaseSound[] = [];
    private tileClickSounds: Phaser.Sound.BaseSound[] = [];

    private moveCmd?: LayerMoveCmd;

    get isMoving(): boolean {
        return !!this.moveCmd;
    }

    get isMoveable(): boolean {
        return this.highlight.visible;
    }

    constructor(scene: Phaser.Scene, x: number, y: number, layer: Phaser.Tilemaps.TilemapLayer, id: number, gridX: number, gridY: number) {
        super(scene, x, y);
        this.layer = layer;

        this.highlight = scene.add.image(x, y, TextureKeys.LayerHighlight)
            .setVisible(false)
            .setDepth(100)
            .setOrigin(0, 0)
            .setName('tile-highlight')
            .setInteractive()
            .on(EventKeys.HighlightClick, () => {
                this.emit(EventKeys.MoveTile, this.id);
            });

        this.id = id;
        this.gridX = gridX;
        this.gridY = gridY;

        this.tileMoveSounds.push(scene.sound.add(SoundKeys.TileMoveLower, { loop: false, volume: 0.1 }));
        this.tileMoveSounds.push(scene.sound.add(SoundKeys.TileMoveStandard, { loop: false, volume: 0.1 }));
        this.tileMoveSounds.push(scene.sound.add(SoundKeys.TileMoveHigher, { loop: false, volume: 0.1 }));

        //this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick1, { loop: false, volume: 0.3 }));
        this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick2, { loop: false, volume: 0.2 }));
        // start sooner?
        // this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick3, { loop: false, volume: 0.3 }));
        // start sooner?
        // this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick4, { loop: false, volume: 0.3 }));
        this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick5, { loop: false, volume: 0.8 }));
        this.tileClickSounds.push(scene.sound.add(SoundKeys.TileClick6, { loop: false, volume: 0.3 }));
    }

    setHighlight(visible: boolean): void {
        this.highlight.setVisible(visible);
    }

    moveLayer(x: number, y: number): void {
        const offset: [number, number] = [this.gridX - x, this.gridY - y];
        const newX = -offset[0]*20*8;
        const newY = -offset[1]*20*8;

        this.highlight.setPosition(x*20*8, y*20*8);

        pickRandom(this.tileMoveSounds).play();
        this.moveCmd = {
            lerpValue: 0,
            new: [newX, newY],
            inital: [this.layer.x, this.layer.y]
        };
    }


    update(_t: number, dt: number): void {
        this.lerpTo(dt);
    }

    private lerpTo(dt: number): void {
        if (!this.isMoving || !this.moveCmd) {
            return;
        }
        
        const newX = Phaser.Math.Linear(this.moveCmd.inital[0], this.moveCmd.new[0], this.moveCmd.lerpValue);
        const newY = Phaser.Math.Linear(this.moveCmd.inital[1], this.moveCmd.new[1], this.moveCmd.lerpValue);

        this.layer.setPosition(newX, newY);

        this.moveCmd.lerpValue += 0.007 * dt;

        if (1 - this.moveCmd.lerpValue < Phaser.Math.EPSILON) {
            // this.stopSounds();
            pickRandom(this.tileClickSounds).play();
            this.layer.setPosition(this.moveCmd.new[0], this.moveCmd.new[1]);
            this.moveCmd = undefined;
        }
    }

    private stopSounds(): void {
        this.tileClickSounds.forEach(x => x.stop());
        this.tileMoveSounds.forEach(x => x.stop());
    }
}
