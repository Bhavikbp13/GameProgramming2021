import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	stateMachine
} from "../globals.js";
import State from "./State.js";

export default class CountdownState extends State {
	/**
	 * This state gives the player a small window to get ready
	 * before the onslaught of pipes.
	 */
	constructor() {
		super();
		this.countdownTime = 0.75;
	}

	enter(parameters) {
		this.scene = parameters.scene;
		this.count = 3;
		this.timer = 0;
	}

	update(dt) {
		this.timer = this.timer + dt;

		if (this.timer > this.countdownTime) {
			this.timer = this.timer % this.countdownTime;
			this.count = this.count - 1;

			if (this.count == 0) {
				stateMachine.change('play', { scene: this.scene });
			}
		}

		this.scene.update(dt);
	}

	render() {
		this.scene.render();

		context.save();
		context.fillStyle = "white";
		context.font = "150px Joystix";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`${this.count}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.restore();
	}
}
