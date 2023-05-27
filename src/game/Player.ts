import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';

enum PlayerState {
    Idle,
    MovingLeft,
    MovingRight,
}

export default class Player extends Phaser.GameObjects.Container {
    arcadeBody!: Phaser.Physics.Arcade.Body;

    playerState = PlayerState.Idle;
    isOnGround = false;
    isJumping = false;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private character!: Phaser.GameObjects.Sprite;


    // get feet(): number {
    //     // const body = this.body as Phaser.Physics.Arcade.Body;
    //     return this.arcadeBody.bottom;
    // }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.character = scene.add.sprite(0, 0, TextureKeys.Character)
            .setOrigin(0.5, 1)
            .play({ key: AnimationKeys.CharacterIdle, repeat: -1 });
       
        this.add(this.character);

        scene.physics.add.existing(this);
        this.arcadeBody = this.body as Phaser.Physics.Arcade.Body;
        this.arcadeBody.setSize(this.character.width, this.character.height);
        this.arcadeBody.setOffset(-this.character.width * 0.5, -this.character.height);
        this.arcadeBody.setCollideWorldBounds(true);

        this.cursors = scene.input!.keyboard!.createCursorKeys();
    }

    update(t: number, dt: number): void {
        if (this.arcadeBody.onFloor()) {
            this.isJumping = false;
        }
       
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.playerState = PlayerState.Idle;
            this.arcadeBody.velocity.x = 0;
        }

        if (this.cursors.left.isDown) {
            this.playerState = PlayerState.MovingLeft
            this.arcadeBody.velocity.x = -50;
        }

        if (this.cursors.right.isDown) {
            this.playerState = PlayerState.MovingLeft
            this.arcadeBody.velocity.x = 50;
        } 
    }

    
    // private setAnimationByState(): void {

    //     const current = this.character.anims.currentAnim.key;
    // }
}