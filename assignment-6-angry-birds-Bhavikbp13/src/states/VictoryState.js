import State from "../../lib/State.js";
import GameStateName from "../enums/GameStateName.js";
import LevelMaker from "../services/LevelMaker.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	stateMachine
} from "../globals.js";
import Bird from "../entities/Bird.js";
import BlackBird from "../entities/BlackBird.js";

export default class VictoryState extends State {
	/**
	 * Displays a game over screen where the player
	 * can press enter to go back to the title screen.
	 */
	
	constructor() {
		super();
		this.stars = null;
	}

	enter(parameters) {
		this.background = parameters.background;
		this.level = parameters.level;
		this.levelInfo = parameters.levelInfo;
		console.log(this.levelInfo);
		if(this.level == 1 ){
			console.log(this.levelInfo.slingshot.isEmpty());
			console.log(this.levelInfo.slingshot.bird instanceof BlackBird);
			if((this.levelInfo.birdQueue.birds.length >= 1 && this.levelInfo.slingshot.bird instanceof BlackBird) || (this.levelInfo.birdQueue.birds.length ==0 && this.levelInfo.slingshot.bird instanceof Bird && !this.levelInfo.slingshot.wasLaunched)){
				this.stars = 3;
			}
			else if(this.levelInfo.birdQueue.birds.length < 1){
				this.stars = 1;
			}
		}else if(this.level == 2){
			if(this.levelInfo.birdQueue.birds.length >= 2){
				this.stars = 3;
			}else if(this.levelInfo.birdQueue.birds.length == 1){
				this.stars = 2;
			}
			else if(this.levelInfo.birdQueue.birds.length < 1){
				this.stars = 1;
			}
		}
		else if(this.level == 3){
			if(this.levelInfo.birdQueue.birds.length >= 4){
				this.stars = 3;
			}else if(this.levelInfo.birdQueue.birds.length <= 3 && this.levelInfo.birdQueue.birds.length >= 1){
				this.stars = 2;
			}
			if(this.levelInfo.birdQueue.birds.length < 1){
				this.stars = 1;
			}
		}
	}

	update() {
		if (keys.Enter) {
			keys.Enter = false;

			stateMachine.change(GameStateName.Play, {
				background: this.background,
				level: LevelMaker.createLevel(this.level + 1),
			});
		}
	}

	render() {
		this.background.render();

		context.save();
		context.font = '300px AngryBirds';
		context.fillStyle = 'black';
		context.textBaseline = 'middle';
		context.textAlign = 'center';
		context.fillText('Victory!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 170);
		context.fillStyle = 'limegreen';
		context.fillText('Victory!', CANVAS_WIDTH / 2 + 10, CANVAS_HEIGHT / 2 - 160);
		
		let placeholder = new Image();
		placeholder.src = "../../assets/images/star-placeholder.png";
		context.drawImage(placeholder, CANVAS_WIDTH/2 - 250, CANVAS_HEIGHT/2-50);
		
		let star = new Image();
		star.src = "../../assets/images/star.png";
		if(this.stars == 3){
			context.drawImage(star, CANVAS_WIDTH/2 - 230, CANVAS_HEIGHT/2+25);
			context.drawImage(star, CANVAS_WIDTH/2 -40, CANVAS_HEIGHT/2-10);
			context.drawImage(star, CANVAS_WIDTH/2 + 160, CANVAS_HEIGHT/2+25);
		}else if(this.stars == 2){
			context.drawImage(star, CANVAS_WIDTH/2 - 230, CANVAS_HEIGHT/2+25);
			context.drawImage(star, CANVAS_WIDTH/2 + 160, CANVAS_HEIGHT/2+25);
		}
		else if(this.stars == 1){
			
			context.drawImage(star, CANVAS_WIDTH/2 - 230, CANVAS_HEIGHT/2+25);
		}
		context.font = '100px AngryBirds';
		context.fillStyle = 'white';
		context.fillText('Press Enter to Continue', CANVAS_WIDTH / 2, CANVAS_HEIGHT - 80);
		context.restore();
	}
}
