import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine
} from "../globals.js";
import Scene from "../Scene.js";
import State from "./State.js";

export default class TitleScreenState extends State {
	/**
	 * The TitleScreenState is the starting screen of the game, shown on startup.
	 */
	constructor() {
		super();

		this.scene = new Scene();
	}

	update(dt) {
		if (keys.Enter) {
			stateMachine.change('countdown', { scene: this.scene });
		}

		this.scene.update(dt);
	}

	render() {
		this.scene.render();

		context.save();
		context.fillStyle = "white";
		context.font = "40px Flappy";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`🐤 flappy bird 🐤`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.font = "20px Flappy";
		context.fillText(`press enter`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 50);
		context.restore();
	}
}
