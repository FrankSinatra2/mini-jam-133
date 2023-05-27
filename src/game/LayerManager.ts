import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import EventKeys from "../consts/EventKeys";

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


    private moveCmd?: LayerMoveCmd;

    get isMoving(): boolean {
        return !!this.moveCmd;
    };

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
    }

    setHighlight(visible: boolean): void {
        this.highlight.setVisible(visible);
    }

    moveLayer(x: number, y: number): void {
        const offset: [number, number] = [this.gridX - x, this.gridY - y];
        const newX = -offset[0]*20*8;
        const newY = -offset[1]*20*8;

        this.highlight.setPosition(x*20*8, y*20*8);
       // this.layer.setPosition(newX, newY);

        this.moveCmd = {
            lerpValue: 0,
            new: [newX, newY],
            inital: [this.layer.x, this.layer.y]
        };
    }


    update(t: number, dt: number): void {
        this.lerpTo(dt);
    }

    private lerpTo(dt: number): void {
        if (!this.isMoving || !this.moveCmd) {
            return;
        }
        
        const newX = Phaser.Math.Linear(this.moveCmd.inital[0], this.moveCmd.new[0], this.moveCmd.lerpValue);
        const newY = Phaser.Math.Linear(this.moveCmd.inital[1], this.moveCmd.new[1], this.moveCmd.lerpValue);

        this.layer.setPosition(newX, newY);

        this.moveCmd.lerpValue += 0.01 * dt;

        if (1 - this.moveCmd.lerpValue < Phaser.Math.EPSILON) {
            this.layer.setPosition(this.moveCmd.new[0], this.moveCmd.new[1]);
            this.moveCmd = undefined;
        }
    }
}
