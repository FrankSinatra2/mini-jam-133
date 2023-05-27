/* eslint-disable no-constant-condition */
import { Vector } from 'matter';
import Phaser from 'phaser'

// export default class HelloWorldScene extends Phaser.Scene {
export class TileMap {
	// Attributes
	openTile_: [number, number] = [0, 0]
	// arr = [ [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]];

	tileIsMoveable(x: number, y: number): boolean {

		const isAdjacentOnRow: boolean = (x === this.openTile_[0] + 1 || x === this.openTile_[0] - 1);
		const isAdjacentOnCol: boolean = (y === this.openTile_[1] + 1 || y === this.openTile_[1] - 1);

		// Check if the input is valid
		if (!( (x >= 0) && (x < 4) && (y >= 0) && (y < 4) )) {
			console.log("error: Invalid input.");
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


	// Attempt to replace the current empty tile with the incoming tile
	moveTile(x: number, y: number): void {
		if (x === this.openTile_[0] && y === this.openTile_[1]) {
			console.log("error: Can't move empty tile.");
			return;
		}

		// if tile is moveable
		// tiles are moveable if they are adjacent to the open tile.
		if (this.tileIsMoveable(x, y)) {
			
			// Update openTile_
			this.openTile_ = [x, y];
			console.log("updated openTile_ to: ", this.openTile_);
		} else {
			// print("error. Tile is not adjacent.");
			console.log("error: Tile is not adjacent.");
			return;
		}
	}


	// Get the current open tile.
	getOpenTile(): [number, number] {
		return this.openTile_;
	}


	// constructor() {
	// 	// super('hello-world')
	// }
}
