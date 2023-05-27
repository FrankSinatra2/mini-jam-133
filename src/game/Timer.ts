import Phaser from "phaser";

export default class Timer extends Phaser.GameObjects.Container {
    
    private timerLabel!: Phaser.GameObjects.Text;

    startTime = new Date().getTime();


    get time(): string {

        let elapsed = (new Date().getTime() - this.startTime) / 1000;
        let minute: string|number = Math.floor(elapsed / 60);
        let second: string|number = Math.floor(elapsed % 60);
        if (minute < 10){
            minute = '0' + minute;
        }
        if (second < 10){
            second = '0' + second;
        }
        return minute + ':' + second
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
    
        
        this.timerLabel = scene.add.text(x, y, `Time: ${this.time}`);
    }

    update(...args: any[]): void {
            
        this.time;
        this,this.timerLabel.text = `Time: ${this.time}`;
    }

    reset(): void {}
}



