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
            }
            return;
        }

        if ([PlayerState.MovingLeft, PlayerState.MovingRight].includes(this.playerState)) {
            this.character.play({ key: AnimationKeys.CharacterWalk, repeat: -1 }, true);
        }

        if (this.playerState === PlayerState.Idle) {
            this.character.play({ key: AnimationKeys.CharacterIdle, repeat: -1 }, true);
        }
    }
}