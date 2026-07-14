import { CANVAS_WIDTH, context, images } from './globals.js';

export default class Pipe {
	/**
	 * The Pipe class represents the pipes that randomly spawn in our game,
	 * which act as our primary obstacles. The pipes can stick out a random
	 * distance from the top or bottom of the screen. When the player collides
	 * with one of them, it's game over. Rather than our bird actually moving
	 * through the screen horizontally, the pipes themselves scroll through
	 * the game to give the illusion of player movement.
	 *
	 * @param {Number} y
	 * @param {String} orientation Dictates the direction the pipe will be drawn.
	 */
	constructor(y, orientation) {
		this.width = images.pipe.width;
		this.height = images.pipe.height;
		this.x = CANVAS_WIDTH; // Initialize pipes past the end of the screen.
		this.y = orientation === 'top' ? y - this.height : y;
		this.scrollSpeed = -75; // How fast the pipes move across the screen.
		this.orientation = orientation;
	}

	update(dt) {
		this.x += this.scrollSpeed * dt;
	}

	render() {
		/**
		 * If we have to draw the top pipe, translate and rotate the canvas
		 * appropriately before drawing. After drawing, restore the canvas
		 * state back to what it was before we translated and rotated.
		 */
		if (this.orientation === 'top') {
			context.save();
			context.translate(this.x + this.width, this.y + this.height);
			context.rotate(Math.PI);
			context.drawImage(images.pipe, 0, 0);
			context.restore();
		}
		else {
			context.drawImage(images.pipe, this.x, this.y);
		}
	}
}
