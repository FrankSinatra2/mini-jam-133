




export class PuzzleState {
    board: number[][] = [];

    openTile: [number, number] = [3, 2];

    constructor() {
        this.reset();
    }

    isMoveable(x: number, y: number): boolean {

        const isAdjacentOnRow: boolean = (x === this.openTile[0] + 1 || x === this.openTile[0] - 1);
        const isAdjacentOnCol: boolean = (y === this.openTile[1] + 1 || y === this.openTile[1] - 1);
        // Check if the input is valid
        if (!( (x >= 0) && (x < 4) && (y >= 0) && (y < 4) )) {
            console.log("error: Invalid input.", x, y);
            return false;
        }

        // If the input tile is not adjacent on both columns and rows
        if ( !(isAdjacentOnCol && isAdjacentOnRow) ) {
            if (isAdjacentOnRow || isAdjacentOnCol) {
                return true;
            }
        }

        return false;
    }
    
    // return false if tile was not moved
    move(x: number, y: number): boolean {
        if (x === this.openTile[0] && y === this.openTile[1]) {
            console.log("error: Can't move empty tile.");
            return false;
        }
        
        if (!this.isMoveable(x, y)) {
            return false;
        }

        const previous = this.board[this.openTile[0]][this.openTile[1]];
        this.board[this.openTile[0]][this.openTile[1]] = this.board[x][y];
        this.board[x][y] = previous;

        this.openTile = [x, y];

        return true;
    }

    getActiveIds(): number[] {
        const [x, y] = this.openTile;
        const result = [
            this.board[x-1] ? this.board[x-1][y] : undefined,
            this.board[x+1] ? this.board[x+1][y] : undefined,
            this.board[x][y -1],
            this.board[x][y + 1]
        ].filter(x => x !== undefined) as number[];
        return result;
    }


    getIndexOfId(id: number): [number, number] {
        let indexX = -1;
        let indexY = -1;
        for (const x of this.board) {
            indexX++;
            for (const y of x) {
                indexY++;
                if (y === id) {
                    return [indexX, indexY]
                }
            }
            indexY = -1;
        }

        return [-1, -1];
    }

    scramble(iterations=1): void {
        for (let i = 0; i < iterations; i++) {
            const activeTiles = this.getActiveIds();
            const choiceId = activeTiles[Phaser.Math.Between(0, activeTiles.length-1)];
            const choiceIndex = this.getIndexOfId(choiceId);
            this.move(choiceIndex[0], choiceIndex[1]);
        }
    }

    reset(): void {
        this.board = [
            [1, 5, 9, 13],
            [2, 6, 10, 14],
            [3, 7, 11, 15],
            [4, 8, 12, 16]
        ]
    }

    toString(): string {
        return this.board.reduce((acc, x) => {
            acc += x.join(' ') + '\n';
            return acc;
        }, '');
    }
}


