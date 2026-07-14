import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	images,
} from "./globals.js";

export default class Scene {
	constructor() {
		// Background image position and speed.
		this.backgroundScroll = 0;
		this.backgroundScrollSpeed = 25;

		// Ground image position and speed.
		this.groundScroll = 0;
		this.groundScrollSpeed = 75;

		// Point at which we should loop our background back to X = 0;
		this.backgroundLoopingPoint = 413;
	}

	update(dt) {
		// Scroll background by preset speed * dt, looping back to 0 after the looping point.
		this.backgroundScroll = (this.backgroundScroll + this.backgroundScrollSpeed * dt) % this.backgroundLoopingPoint;

		// Scroll ground by preset speed * dt, looping back to 0 after the screen width passes.
		this.groundScroll = (this.groundScroll + this.groundScrollSpeed * dt) % CANVAS_WIDTH;
	}

	render(pipes = []) {
		/**
		 * Here, we draw our images shifted to the left by their looping point; eventually,
		 * they will revert back to 0 once a certain distance has elapsed, which will make it
		 * seem as if they are infinitely scrolling. Choosing a looping point that is seamless
		 * is key, so as to provide the illusion of infinitely scrolling.
		 */
		context.drawImage(images.background, -this.backgroundScroll, 0);
		pipes.forEach(pipe => pipe.render());
		context.drawImage(images.ground, -this.groundScroll, CANVAS_HEIGHT - images.ground.height);
	}
}
