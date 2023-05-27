import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';


export default class Player extends Phaser.GameObjects.Container {
    private character!: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.character = scene.add.sprite(0, 0, TextureKeys.Character)
            .setOrigin(0.5, 1)
            .play({ key: AnimationKeys.CharacterIdle, repeat: -1})
       
        this.add(this.character);
    }
}


