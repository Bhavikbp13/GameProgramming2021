import { context, images, TILE_SIZE } from "../globals.js";
import { ImageName, TileColour, TilePattern } from "../enums.js";
import Sprite from "../../lib/Sprite.js";

export default class Tile {
	/**
	 * The individual tiles that make up our game board. Each Tile can have a
	 * color and a pattern, with the patterns adding extra points to the matches.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} colour
	 * @param {Number} pattern
	 * @param {Array} sprites
	 */
	constructor(x, y, colour = TileColour.Beige, pattern = TilePattern.Flat, sprites = []) {
		// Board position.
		this.boardX = x;
		this.boardY = y;

		// Canvas position.
		this.x = this.boardX * TILE_SIZE;
		this.y = this.boardY * TILE_SIZE;

		// Tile appearance.
		this.colour = colour;
		this.pattern = pattern;
		this.sprites = sprites;
	}

	/**
	 * Retrieves all tile sprites from the sprite sheet.
	 *
	 * @returns An array of tile sprites.
	 */
	static generateSprites() {
		const ROWS = 9;
		const COLUMNS = 6;
		const SPLIT_POINT = 2;
		const sprites = [];
		let x = 0;
		let y = 0;
		let counter = 0;

		for (let row = 0; row < ROWS; row++) {
			// The "split point" exists because one row in the sprite sheet contains 2 colours.
			for (let i = 0; i < SPLIT_POINT; i++) {
				sprites[counter] = [];

				for (let column = 0; column < COLUMNS; column++) {
					const sprite = new Sprite(images.get(ImageName.SpriteSheet), x, y, TILE_SIZE, TILE_SIZE);

					sprites[counter].push(sprite);
					x += TILE_SIZE;
				}

				counter++;
			}

			y += TILE_SIZE;
			x = 0;
		}

		return sprites;
	}

	render(x, y) {
		this.sprites[this.colour][this.pattern].render(context, this.x + x, this.y + y);
	}
}
