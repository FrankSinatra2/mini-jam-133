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
    longJump = 0;
    jumpLock = false;
    cyote = 0;
    
    readonly GROUND_FRICTION = 0.96;

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
        this.arcadeBody.setSize(this.character.width, this.character.height);
        this.arcadeBody.setOffset(-this.character.width * 0.5, -this.character.height);
        this.arcadeBody.setCollideWorldBounds(true);

        this.walkSound = scene.sound.add(SoundKeys.Walking, {loop: true}) as Phaser.Sound.HTML5AudioSound;
        this.jumpSound = scene.sound.add(SoundKeys.Jump, {loop: false}) as Phaser.Sound.HTML5AudioSound;

        this.cursors = scene.input!.keyboard!.createCursorKeys();
    }

    update(t: number, dt: number): void {
        if (this.cursors.up.isUp) this.jumpLock = false;

        if (this.arcadeBody.onFloor()) {
            this.cyote = 0;
            this.longJump = 0;
        }
        else {
            this.cyote++;
            if (this.cyote > 60) this.cyote = 60;
        }

        let xa:number = 0;

        // On ground
        if (this.cyote < 6) {
            if (this.cursors.up.isDown && this.longJump === 0 && !this.jumpLock) {
                this.jumpLock = true;
                this.arcadeBody.velocity.y = - 400;
                this.cyote = 60;
                this.longJump = 1;
            }
            if (this.cursors.left.isDown && this.cursors.right.isUp) {
                if (this.arcadeBody.velocity.x > 0) this.arcadeBody.velocity.x *= this.GROUND_FRICTION;
                xa -= 7
            }
            else if (this.cursors.right.isDown && this.cursors.left.isUp) {
                if (this.arcadeBody.velocity.x < 0) this.arcadeBody.velocity.x *= this.GROUND_FRICTION;
                xa += 7;
            } 
            else {
                this.arcadeBody.velocity.x *= this.GROUND_FRICTION
            }
        }
        // in air
        else {
            if (this.cursors.up.isDown && this.longJump < 45) this.arcadeBody.velocity.y -= 10;
            if (this.cursors.left.isDown) {
                xa -= 5
            }
            if (this.cursors.right.isDown) {
                xa += 5;
            } 
            this.longJump++;
        }

        this.arcadeBody.velocity.x += xa;
        if (Math.abs(this.arcadeBody.velocity.x) < 0.5) this.arcadeBody.velocity.x = 0;
        if ( this.arcadeBody.velocity.x === 0 && this.arcadeBody.velocity.y === 0) this.playerState = PlayerState.Idle;
        else if( this.arcadeBody.velocity.x < 0 ) this.playerState = PlayerState.MovingLeft 
        else this.playerState = PlayerState.MovingRight 

        this.setAnimationByState();
    }

    
    private setAnimationByState(): void {
        if (this.playerState !== PlayerState.Idle) {
            this.character.flipX = this.playerState === PlayerState.MovingRight;
        }
        
        if (this.longJump === 1) {
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
        if (this.cyote < 6 && (this.playerState === PlayerState.MovingRight || this.playerState === PlayerState.MovingLeft)) {
            if (!this.walkSound.isPlaying) {
                this.walkSound.play();
            }
        }
    }
}