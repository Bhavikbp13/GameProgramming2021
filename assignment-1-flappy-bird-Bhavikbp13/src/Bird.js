import {
	CANVAS_HEIGHT,
	context,
	GRAVITY,
	images
} from "./globals.js";
import Pipe from "./Pipe.js";

export default class Bird {
	/**
	 * The Bird is what we control in the game via clicking or the space bar;
	 * whenever we press either, the bird will flap and go up a little bit,
	 * where it will then be affected by gravity. If the bird hits the ground
	 * or a pipe, the game is over.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} width
	 * @param {Number} height
	 */
	constructor(x, y, width, height) {
		this.width = width;
		this.height = height;

		// Center the bird by subtracting half its width and height from position.
		this.x = x - width / 2;
		this.y = y - height / 2;

		// The Y velocity that will be affected by gravity.
		this.dy = 0;

		// To be used to reset the bird in the reset() function.
		this.startingX = x - width / 2;
		this.startingY = y - height / 2;
	}

	reset() {
		this.x = this.startingX;
		this.y = this.startingY;
		this.dy = 0;
	}

	/**
	 * AABB collision detection that expects a pipe
	 * which will have an X, Y, width, and height values.
	 *
	 * @param {Pipe} pipe
	 * @returns Whether the bird collided with the pipe or not.
	 */
	didCollide(pipe) {
		/**
		 * The 3's are left and top offsets.
		 * The 6's are right and bottom offsets.
		 * Both offsets are used to shrink the bounding box
		 * to give the player a little bit of leeway with the collision.
		 */
		if (this.x + this.width - 6 >= pipe.x
			&& this.x + 3 <= pipe.x + pipe.width
			&& this.y + this.height - 6 >= pipe.y
			&& this.y + 3 <= pipe.y + pipe.height) {
			return true;
		}

		return false;
	}

	didFall() {
		return this.y > CANVAS_HEIGHT;
	}

	flap() {
		// A sudden burst of negative velocity if we hit spacebar.
		this.dy -= 150;
	}

	update(dt) {
		// Apply gravity to velocity.
		this.dy += GRAVITY;

		// Apply current velocity to Y position.
		this.y += this.dy * dt;
	}

	render() {
		context.drawImage(images.bird, this.x, this.y)
	}
}
