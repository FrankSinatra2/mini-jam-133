import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';

export default class Flag extends Phaser.GameObjects.Container {   
    private flag!: Phaser.GameObjects.Image;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.flag = scene.add.sprite(0, 0, TextureKeys.Flag)
            .setScale(0.1, 0.1)
            .setOrigin(0.5, 1);
            
        this.add(this.flag);
        scene.physics.add.existing(this, true);

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.setSize(this.flag.width * 0.07, this.flag.height * 0.07);
        body.setOffset(15, -7)
    }
}