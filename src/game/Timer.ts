import Phaser from "phaser";

export default class Timer extends Phaser.GameObjects.Container {
    static readonly TIME_HISTORY_KEY = 'mj133-time-history';
    
    private timerLabel!: Phaser.GameObjects.Text;

    startTime = new Date().getTime();
    currentTime = -1;

    timeHistory: number[] = [];

    get time(): string {
        return this.toDurationString((this.currentTime - this.startTime) / 1000);
    }

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y);
    
        
        this.timerLabel = scene.add.text(x, y, `Time: ${this.time}`);

        const history = localStorage.getItem(Timer.TIME_HISTORY_KEY);
        history?.split(',').forEach(time => {
            this.timeHistory.push(parseFloat(time));
        });
        this.timeHistory.sort((a, b) => a - b);

        scene.add.text(x - 8, y + 25, `Previous Best:`);
        for (const [index, value] of this.timeHistory.entries()) {
            // console.log(index, value);
            scene.add.text(x + 15, y + 25 + 15 + index*15, `${index+1}. ${this.toDurationString(value)}`);
        }
    }

    update(): void {
        this.currentTime = new Date().getTime();
        this.timerLabel.text = `Time: ${this.time}`;
    }

    toDurationString(elapsed: number): string {
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

    stop(): void {
        const elapsed = (this.currentTime - this.startTime)/1000;
        this.timeHistory.push(elapsed);

        const result = this.timeHistory.join(',');

        localStorage.setItem(Timer.TIME_HISTORY_KEY, result);
    }
}



