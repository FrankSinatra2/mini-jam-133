import Phaser from 'phaser';
import TextureKeys from '../consts/TextureKeys';
import AnimationKeys from '../consts/AnimationKeys';
import SoundKeys from '../consts/SoundKeys';

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

    walkSound: Phaser.Sound.HTML5AudioSound;
    jumpSound: Phaser.Sound.HTML5AudioSound;

    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private character!: Phaser.GameObjects.Sprite;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);

        this.character = scene.add.sprite(0, 0, TextureKeys.Character)
            .setOrigin(0.5, 1)
            .play({ key: AnimationKeys.CharacterIdle, repeat: -1 });
       
        this.add(this.character);

        scene.physics.add.existing(this);
        this.arcadeBody = this.body as Phaser.Physics.Arcade.Body;
        this.arcadeBody.setSize(this.character.width * 0.8, this.character.height);
        this.arcadeBody.setOffset(-this.character.width * 0.5, -this.character.height);
        this.arcadeBody.setCollideWorldBounds(true);

        this.walkSound = scene.sound.add(SoundKeys.Walking, {loop: true}) as Phaser.Sound.HTML5AudioSound;
        this.jumpSound = scene.sound.add(SoundKeys.Jump, {loop: false}) as Phaser.Sound.HTML5AudioSound;

        this.cursors = scene.input!.keyboard!.createCursorKeys();
    }

    update(t: number, dt: number): void {
        if (this.arcadeBody.onFloor()) {
            this.isJumping = false;
        }
       //add onWall() ??
        if (!this.cursors.left.isDown && !this.cursors.right.isDown) {
            this.playerState = PlayerState.Idle;
            this.arcadeBody.velocity.x = 0;
        }

        if (this.cursors.left.isDown) {
            this.playerState = PlayerState.MovingLeft;
            this.arcadeBody.velocity.x = -300;
        }

        if (this.cursors.right.isDown) {
            this.playerState = PlayerState.MovingRight;
            this.arcadeBody.velocity.x = 300;
        } 
        if (this.isJumping === false && this.cursors.up.isDown) {
            this.isJumping = true;
            this.arcadeBody.velocity.y = -500;
        }

        this.setAnimationByState();
    }

    
    private setAnimationByState(): void {
        if (this.playerState !== PlayerState.Idle) {
            this.character.flipX = this.playerState === PlayerState.MovingRight;
        }
        
        if (this.isJumping) {
            if (this.character.anims.currentAnim.key !== AnimationKeys.CharacterJump) {
                this.character.play({ key: AnimationKeys.CharacterJump, repeat: 0 }, true);
                this.jumpSound.play();
                this.walkSound.stop();
            }
            return;
        }

        if ([PlayerState.MovingLeft, PlayerState.MovingRight].includes(this.playerState)) {
            this.character.play({ key: AnimationKeys.CharacterWalk, repeat: -1 }, true);
        }

        if (this.playerState === PlayerState.Idle) {
            this.character.play({ key: AnimationKeys.CharacterIdle, repeat: -1 }, true);
            this.walkSound.stop();
        }

        // If walking on ground
        if (this.isJumping === false && (this.playerState === PlayerState.MovingRight || this.playerState === PlayerState.MovingLeft)) {
            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        }
    }
}