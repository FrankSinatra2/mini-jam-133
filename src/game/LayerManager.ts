import Phaser from "phaser";
import TextureKeys from "../consts/TextureKeys";
import EventKeys from "../consts/EventKeys";


export class LayerManager extends Phaser.GameObjects.Container {
    private layer!: Phaser.Tilemaps.TilemapLayer;
    private highlight!: Phaser.GameObjects.Image;

    readonly id: number;
    readonly gridX: number;
    readonly gridY: number;

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
        const offset = [this.gridX - x, this.gridY - y];
        const newX = -offset[0]*20*8;
        const newY = -offset[1]*20*8;

       
        console.log(this.layer);
        console.log(this.layer.x, this.layer.y);
        this.layer.setPosition(newX, newY);
        // this.layer.setDepth(90);
        // this.layer.setPosition= x;
        // this.layer.y = y;

        //this.setPosition(newX, newY);
        this.highlight.setPosition(x*20*8, y*20*8);
    }


}
