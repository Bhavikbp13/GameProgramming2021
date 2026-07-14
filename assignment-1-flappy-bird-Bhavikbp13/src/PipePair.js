import Pipe from './Pipe.js';
import { getRandomPositiveNumber } from './utils.js';

export default class PipePair {
	/**
	 * Used to represent a pair of pipes that stick together as they scroll,
	 * providing an opening for the player to jump through in order to score a point.
	 */
	constructor() {
		// Y value is for the upper pipe; gap is a vertical shift of the second lower pipe.
		this.y = getRandomPositiveNumber(25, 175);

		// Size of the gap between pipes.
		this.gapHeight = getRandomPositiveNumber(75, 150);
		//console.log(this.gapHeight);


		// Whether this pipe pair is ready to be removed from the scene.
		this.canRemove = false;

		// Instantiate two pipes that belong to this pair.
		this.pipes = {
			upper: new Pipe(this.y, 'top'),
			lower: new Pipe(this.y + this.gapHeight, 'bottom'),
		};

		// If the bird cleared this pair, set to true;
		this.wasScored = false;
	}

	didScore(bird) {
		if (this.pipes.upper.x + this.pipes.upper.width < bird.x) {
			this.wasScored = true;
			return true;
		}

		return false;
	}

	update(dt) {
		/**
		 * Remove the pipe from the scene if it's beyond the left edge
		 * of the screen, else move it from right to left.
		 */
		if (this.pipes.upper.x < -this.pipes.upper.width) {
			this.canRemove = true;
		}
		else {
			this.pipes.upper.update(dt);
			this.pipes.lower.update(dt);
		}
	}

	render() {
		this.pipes.upper.render();
		this.pipes.lower.render();
	}
}
