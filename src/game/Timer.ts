import Phaser from "phaser";

export default class Timer extends Phaser.GameObjects.Container {
    
    private timerLabel!: Phaser.GameObjects.Text;
    private timer = 0;
    

    get time(): string {
        const seconds = this.timer % 60;
        const minutes = this.timer / 60;

        return `${minutes}:${seconds}`;
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
    
        
        this.timerLabel = scene.add.text(x, y, `Time: ${this.time}`);
    }


    update(t: number, dt: number): void {
        // dt is given in ms
        this.timer += dt * 1000;

        this.timerLabel.text = `Time: ${this.time}`;
    }

    reset(): void {}
}

