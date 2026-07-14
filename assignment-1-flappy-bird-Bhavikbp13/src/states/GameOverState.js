import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine,
	images
} from "../globals.js";
import State from "./State.js";

export default class GameOverState extends State {
	/**
	 * This state is shown when the player either hit a pipe
	 * or fell off the bottom of the screen.
	 */
	constructor() {
		super();
	}

	enter(parameters) {
		this.score = parameters.score;
		this.scene = parameters.scene;
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

		if(this.score >= 3)
		{
			//console.log("1st");
			context.drawImage(images.gold, (CANVAS_WIDTH/2)-30,10, 60, 100);
		}else if(this.score == 2){
			//console.log("2nd");
			context.drawImage(images.silver, (CANVAS_WIDTH/2)-30,10, 60, 100);
		}else if(this.score == 1){
			//console.log("3rd");
			context.drawImage(images.bronze, (CANVAS_WIDTH/2)-30,10, 60, 100);
		}else{
			
		}
		context.fillStyle = "white";
		context.font = "40px Flappy";
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText(`game over`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
		context.font = "20px Joystix";
		context.fillText(`Score: ${this.score}`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 40);
		context.fillText(`Press Enter to Play Again!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5 + 70);
		context.restore();
	}
}
