import Phaser from "phaser"

export function pickRandom<T>(array: Array<T>): T {
    const index = Phaser.Math.Between(0, array.length-1);
    return array[index];
}

