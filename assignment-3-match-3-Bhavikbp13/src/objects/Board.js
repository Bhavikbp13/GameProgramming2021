import {
	BOARD_SIZE,
	sounds,
	TILE_SIZE,
	timer
} from '../globals.js';
import Tile from './Tile.js';
import { SoundName, TileColour } from '../enums.js';
import { getRandomPositiveInteger, pickRandomElement } from '../../lib/RandomNumberHelpers.js';

export default class Board {
	/**
	 * The Board is our arrangement of Tiles with which we must try
	 * to find matching sets of three horizontally or vertically.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 */
	constructor(x, y, level, width = BOARD_SIZE, height = BOARD_SIZE) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.matches = [];
		this.tiles = [];
		this.minMatchLength = 3;
		this.level = level;
		this.tileSprites = Tile.generateSprites();
	}

	render() {
		this.renderBoard();
	}

	// Loops through the tiles and renders them at their location.
	renderBoard() {
		for (let row = 0; row < this.height; row++) {
			for (let column = 0; column < this.width; column++) {
				this.tiles[row][column].render(this.x, this.y);
			}
		}
	}

	initializePlayBoard() {
		// Recursively initialize if matches exist so we always start with a matchless board.
		do {
			this.initializeBoard();
			this.calculateMatches();
		}
		while (this.matches.length > 0);
	}

	initializeTitleScreenBoard() {
		this.initializeBoard();
	}

	initializeBoard() {
		this.tiles = [];

		// For each row in the board...
		for (let row = 0; row < this.height; row++) {
			// Insert a new array to represent the row.
			this.tiles.push([]);

			// For each column in the row...
			for (let column = 0; column < this.width; column++) {
				this.tiles[row].push(this.generateTile(column, row));
			}
		}
	}

	generateTile(x, y) {
		const colourList = [
			TileColour.Beige,
			TileColour.Pink,
			TileColour.Purple,
			TileColour.LightGreen,
			TileColour.Blue,
			TileColour.Orange,
		];
		let patternRange;
		let colour;
		let pattern;
			
		if(this.level == 1){
			patternRange = [0, 0];
			colour = pickRandomElement(colourList);
			pattern = getRandomPositiveInteger(patternRange[0], patternRange[1]);
		}else if(this.level<=5){
			
			patternRange = [0, this.level-1];
			colour = pickRandomElement(colourList);
		 	pattern = getRandomPositiveInteger(patternRange[0], patternRange[1]);
		}
		else{
			patternRange = [0, 5];
			colour = pickRandomElement(colourList);
		 	pattern = getRandomPositiveInteger(patternRange[0], patternRange[1]);
		}
		

		return new Tile(x, y, colour, pattern, this.tileSprites);
	}

	async swapTiles(selectedTile, highlightedTile, show) {
		const temporaryTile = new Tile(selectedTile.boardX, selectedTile.boardY);

		if(show == true){
			// Swap canvas positions by tweening so the swap is animated.
			timer.tweenAsync(highlightedTile, ['x', 'y'], [temporaryTile.x, temporaryTile.y], 0.2);
			await timer.tweenAsync(selectedTile, ['x', 'y'], [highlightedTile.x, highlightedTile.y], 0.2);
		}

		// Swap board positions.
		selectedTile.boardX = highlightedTile.boardX;
		selectedTile.boardY = highlightedTile.boardY;
		highlightedTile.boardX = temporaryTile.boardX;
		highlightedTile.boardY = temporaryTile.boardY;

		// Swap tiles in the tiles array.
		this.tiles[selectedTile.boardY][selectedTile.boardX] = selectedTile;
		this.tiles[highlightedTile.boardY][highlightedTile.boardX] = highlightedTile;
		
		// this.calculateMatches();
		// if(this.matches.length >0 ){
		// 	// Swap canvas positions by tweening so the swap is animated.
		// 	timer.tweenAsync(highlightedTile, ['x', 'y'], [temporaryTile.x, temporaryTile.y], 0.2);
		// 	await timer.tweenAsync(selectedTile, ['x', 'y'], [highlightedTile.x, highlightedTile.y], 0.2);
		// }
	}

	/**
	 * Goes left to right, top to bottom in the board, calculating matches by
	 * counting consecutive tiles of the same color. Doesn't need to check the
	 * last tile in every row or column if the last two haven't been a match.
	 */
	calculateMatches() {
		this.matches = [];
		this.resolveHorizontalMatches();
		this.resolveVerticalMatches();
	}

	resolveHorizontalMatches() {
		for (let y = 0; y < BOARD_SIZE; y++) {
			let matchCounter = 1;
			let colourToMatch = this.tiles[y][0].colour;
			let rowMatches = [];

			// For every horizontal tile...
			for (let x = 1; x < BOARD_SIZE; x++) {
				
				// If this is the same colour as the one we're trying to match...
				if (this.tiles[y][x].colour === colourToMatch) {
					matchCounter++;
				}
				else {
					// Set this as the new colour we want to watch for.
					colourToMatch = this.tiles[y][x].colour;

					// If we have a match of 3 or more up until now, add it to our matches array.
					if (matchCounter >= this.minMatchLength) {
						const match = [];

						// Go backwards from here by matchCounter.
						for (let x2 = x - 1; x2 >= x - matchCounter; x2--) {
							if(this.tiles[y][x2].pattern == 5){
								var counter = 0;
								do {
									match.push(this.tiles[y][counter]);
									counter++
								} while (counter < BOARD_SIZE);
								
							}
							
							// Add each tile to the match that's in that match.
							match.push(this.tiles[y][x2]);
						}

						// Add this match to our total matches array.
						rowMatches.push(match);
					}

					matchCounter = 1;

					// We don't need to check last two if they won't be in a match.
					if (x >= BOARD_SIZE - 2) {
						break;
					}
				}
			}

			// Account for matches at the end of a row.
			if (matchCounter >= this.minMatchLength) {
				let match = [];

				// Go backwards from here by matchCounter.
				for (let x = BOARD_SIZE - 1; x >= BOARD_SIZE - matchCounter; x--) {
					
					match.push(this.tiles[y][x]);
				}

				// Add this match to our total matches array.
				rowMatches.push(match);
			}

			// Insert matches into the board matches array.
			rowMatches.forEach(match => this.matches.push(match));
		}
	}

	resolveVerticalMatches() {
		for (let x = 0; x < BOARD_SIZE; x++) {
			let matchCounter = 1;
			let colourToMatch = this.tiles[0][x].colour;
			let columnMatches = [];

			// For every vertical tile...
			for (let y = 1; y < BOARD_SIZE; y++) {
				// If this is the same colour as the one we're trying to match...
				if (this.tiles[y][x].colour === colourToMatch) {
					matchCounter++;
				}
				else {
					// Set this as the new colour we want to watch for.
					colourToMatch = this.tiles[y][x].colour;

					// If we have a match of 3 or more up until now, add it to our matches array.
					if (matchCounter >= this.minMatchLength) {
						const match = [];

						// Go backwards from here by matchCounter.
						for (let y2 = y - 1; y2 >= y - matchCounter; y2--) {
							if(this.tiles[y2][x].pattern == 5){
								var counter = 0;
								do {
									match.push(this.tiles[counter][x]);
									counter++
								} while (counter < BOARD_SIZE);
							}
							// Add each tile to the match that's in that match.
							match.push(this.tiles[y2][x]);
						}

						// Add this match to our total matches array.
						columnMatches.push(match);
					}

					matchCounter = 1;

					// We don't need to check last two if they won't be in a match.
					if (y >= BOARD_SIZE - 2) {
						break;
					}
				}
			}

			// Account for matches at the end of a column.
			if (matchCounter >= this.minMatchLength) {
				let match = [];

				// Go backwards from here by matchCounter.
				for (let y = BOARD_SIZE - 1; y >= BOARD_SIZE - matchCounter; y--) {
					var counter = 0;
					do {
						match.push(this.tiles[counter][x]);
						counter++
					} while (counter < BOARD_SIZE);
					match.push(this.tiles[y][x]);
				}

				// Add this match to our total matches array.
				columnMatches.push(match);
			}

			// Insert matches into the board matches array.
			columnMatches.forEach(match => this.matches.push(match));
		}
	}

	/**
	 * Remove the matches from the Board by setting the Tile slots
	 * within them to null, then setting this.matches to empty.
	 */
	removeMatches() {
		if (this.matches.length === 0) {
			return;
		}
			this.matches.forEach((match) => {
				match.forEach((tile) => {
					
					this.tiles[tile.boardY][tile.boardX] = null;
				});
	
				sounds.play(SoundName.Match);
			});

		this.matches = [];
	}

	/**
	 * Shifts down all of the tiles that now have spaces below them, then returns
	 * an array that contains tweening information for these new tiles.
	 *
	 * @returns An array containing all the tween definitions for the falling tiles.
	 */
	getFallingTiles() {
		// An array to hold the tween definitions.
		const tweens = [];

		// For each column, go up tile by tile till we hit a space.
		for (let column = 0; column < BOARD_SIZE; column++) {
			let space = false;
			let spaceRow = 0;
			let row = BOARD_SIZE - 1;

			while (row >= 0) {
				// If our last tile was a space...
				const tile = this.tiles[row][column];

				// If the current tile is *not* a space, bring this down to the lowest space.
				if (space && tile) {
					// Put the tile in the correct spot in the board and fix its grid position.
					this.tiles[spaceRow][column] = tile;
					tile.boardY = spaceRow;

					// Set its prior position to null.
					this.tiles[row][column] = null;

					// Add a tween definition to be processed later.
					tweens.push({
						tile,
						parameters: ['y'],
						endValues: [tile.boardY * TILE_SIZE],
					});

					// Reset parameters so we start back from here in the next iteration.
					space = false;
					row = spaceRow;
					spaceRow = 0;
				}
				// If the current tile is a space, mark it as such.
				else if (tile === null) {
					space = true;

					if (spaceRow === 0) {
						spaceRow = row;
					}
				}

				row--;
			}
		}

		return tweens;
	}

	/**
	 * Scans the board for empty spaces and generates new tiles for each space.
	 *
	 * @returns An array containing all the tween definitions for the new tiles.
	 */
	getNewTiles() {
		const tweens = [];

		// Create replacement tiles at the top of the screen.
		for (let x = 0; x < BOARD_SIZE; x++) {
			for (let y = BOARD_SIZE - 1; y >= 0; y--) {
				// If the tile is exists, move on to the next one.
				if (this.tiles[y][x]) {
					continue;
				}

				// If the tile doesn't exist, that means it's a space that needs a new tile.
				const tile = this.generateTile(x, y);

				tile.y = -TILE_SIZE;
				this.tiles[y][x] = tile;

				// Add a tween definition to be processed later.
				tweens.push({
					tile,
					parameters: ['y'],
					endValues: [tile.boardY * TILE_SIZE],
				});
			}
		}

		return tweens;
	}

	/**
	 * Automatically swap tiles for the title screen animation.
	 */
	autoSwap() {
		timer.addTask(async () => {
			// Pick initial positions that won't become out of bounds when swapping.
			const tile1Position = {
				x: getRandomPositiveInteger(1, this.height - 2),
				y: getRandomPositiveInteger(1, this.width - 2),
			};
			const tile2Position = {
				x: tile1Position.x,
				y: tile1Position.y,
			};

			// Randomly choose the second tile to be up/down/left/right of tile1.
			switch (getRandomPositiveInteger(0, 4)) {
				case 0:
					tile2Position.x++;
					break;
				case 1:
					tile2Position.x--;
					break;
				case 2:
					tile2Position.y++;
					break;
				default:
					tile2Position.y--;
					break;
			}

			const tile1 = this.tiles[tile1Position.x][tile1Position.y];
			const tile2 = this.tiles[tile2Position.x][tile2Position.y];

			await this.swapTiles(tile1, tile2);
		}, 0.3)
	}
}
