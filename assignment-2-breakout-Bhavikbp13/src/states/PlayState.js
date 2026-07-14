import PowerUp from "../PowerUp.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	context,
	keys,
	sounds,
	stateMachine,
	TILE_SIZE
} from "../globals.js";
import State from "./State.js";
import Ball from "../Ball.js";


/**
 * Represents the state of the game in which we are actively playing;
 * player should control the paddle, with the ball actively bouncing between
 * the bricks, walls, and the paddle. If the ball goes below the paddle, then
 * the player should lose one point of health and be taken either to the Game
 * Over screen if at 0 health or the Serve screen otherwise.
 */
export default class PlayState extends State {
	constructor() {
		super();

		this.baseScore = 10;
	}

	enter(parameters) {
		this.paddle = parameters.paddle;
		this.bricks = parameters.bricks;
		this.health = parameters.health;
		this.score = parameters.score;
		this.ball = parameters.ball;
		this.balls = [];
		this.balls.push(parameters.ball);
		this.userInterface = parameters.userInterface;
		this.level = parameters.level;
		this.powerUp = null;
		this.key = null;
	}

	checkVictory() {
		/**
		 * The every method executes the provided callback function once for
		 * each element present in the array until it finds the one where callback
		 * returns a falsy value. If such an element is found, the every method
		 * immediately returns false. Otherwise, if callback returns a truthy value
		 * for all elements, every returns true.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every
		 */
		return this.bricks.every(brick => !brick.inPlay);
	}

	update(dt) {
		if(this.powerUp!= null && this.powerUp.didCollide(this.paddle)&& this.powerUp.type != null){ 
			//this.powerUp = null;
			console.log("SPAWN MORE BALLS NOW");
			if(this.powerUp.type == "key"){
				this.key = true;
			}
			if(this.powerUp.type == "multiBall"){
				this.balls.push(new Ball());
				this.balls.push(new Ball());
			}
			this.powerUp = null;
		}
		if(this.powerUp != null && this.powerUp.didFall())
		{
			this.powerUp = null;
		}
		 
		if (this.paused) {
			if (keys.p) {
				keys.p = false;
				this.paused = false;
				sounds.pause.play();
			}
			else {
				return;
			}
		}
		else if (keys.p) {
			keys.p = false;
			this.paused = true;
			sounds.pause.play();
			return;
		}
		console.log(this.balls);
		if(this.balls.length == 1)
		{
			if (this.balls[0].didCollide(this.paddle)) {
			// Flip y velocity and reset position to on top of the paddle.
			this.balls[0].dy *= -1;
			this.balls[0].y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;

			// Vary the angle of the ball depending on where it hit the paddle.
			this.balls[0].handlePaddleCollision(this.paddle);

			sounds.paddleHit.play();
		}
		}else{
			this.balls.forEach((ball) => {
				if(ball.didCollide(this.paddle)){
					// Flip y velocity and reset position to on top of the paddle.
				ball.dy *= -1;
				ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;
	
				// Vary the angle of the ball depending on where it hit the paddle.
				ball.handlePaddleCollision(this.paddle);
	
				sounds.paddleHit.play();
				}
			});
		}
		
		// if (this.ball.didCollide(this.paddle)) {
		// 	// Flip y velocity and reset position to on top of the paddle.
		// 	this.ball.dy *= -1;
		// 	this.ball.y = CANVAS_HEIGHT - TILE_SIZE * 2 - TILE_SIZE / 2;

		// 	// Vary the angle of the ball depending on where it hit the paddle.
		// 	this.ball.handlePaddleCollision(this.paddle);

		// 	sounds.paddleHit.play();
		// }

		this.bricks.forEach((brick) => {
			if(this.key != null){
				brick.locked = false;
			}
			this.balls.forEach((ball) => {
				if (brick.inPlay && ball.didCollide(brick)) {
					if(this.powerUp == null){
						if(this.key == null){
							this.powerUp = new PowerUp(brick.x, brick.y, "key");
							this.powerUp.update(dt);
						}
						else if(this.balls.length == 1)
						{
							this.powerUp = new PowerUp(brick.x, brick.y, "multiBall");
							this.powerUp.update(dt);
						}
						
						
						//POWERUP
						//this.powerUp.update(dt);
					}
					
					this.score += this.baseScore * (brick.tier + 1);
					this.userInterface.update(this.health, this.score);
					console.log(this.score);
					console.log(this.baseScore);
					//console.log(this.score - this.baseScore);
					
					if(this.score%30 == 0){
						console.log("200points");
						if(this.paddle.size == 3){
	
						}else{
							this.paddle.size ++;
							if(this.paddle.size == 0)
							{
								this.paddle.width = TILE_SIZE*2;
							}
							else if(this.paddle.size == 1)
							{
								this.paddle.width = TILE_SIZE*4;
							}
							else if(this.paddle.size == 2)
							{
								this.paddle.width = TILE_SIZE*6;
							}
							else if(this.paddle.size == 3)
							{
								this.paddle.width = TILE_SIZE*8;
							}
							
						}
						
					} 
					
					// Call the brick's hit function, which removes it from play.
					brick.hit();
	
					if (this.checkVictory()) {
						sounds.victory.play();
						stateMachine.change('victory', {
							level: this.level,
							paddle: this.paddle,
							health: this.health,
							score: this.score,
							ball: ball,
							userInterface: this.userInterface,
						});
						
					}
	
					ball.handleBrickCollision(brick);
				}
			});
			// if (brick.inPlay && this.ball.didCollide(brick)) {
			// 	if(this.powerUp == null && this.balls.length > 1){
			// 		this.powerUp = new PowerUp(brick.x, brick.y);
			// 	    //POWERUP
			// 		this.powerUp.update(dt);
			// 	}
				
			// 	this.score += this.baseScore * (brick.tier + 1);
			// 	this.userInterface.update(this.health, this.score);
			// 	console.log(this.score);
			// 	console.log(this.baseScore);
			// 	//console.log(this.score - this.baseScore);
				
			// 	if(this.score%30 == 0){
			// 		console.log("200points");
			// 		if(this.paddle.size == 3){

			// 		}else{
			// 			this.paddle.size ++;
			// 			if(this.paddle.size == 0)
			// 			{
			// 				this.paddle.width = TILE_SIZE*2;
			// 			}
			// 			else if(this.paddle.size == 1)
			// 			{
			// 				this.paddle.width = TILE_SIZE*4;
			// 			}
			// 			else if(this.paddle.size == 2)
			// 			{
			// 				this.paddle.width = TILE_SIZE*6;
			// 			}
			// 			else if(this.paddle.size == 3)
			// 			{
			// 				this.paddle.width = TILE_SIZE*8;
			// 			}
						
			// 		}
					
			// 	} 
				
			// 	// Call the brick's hit function, which removes it from play.
			// 	brick.hit();

			// 	if (this.checkVictory()) {
			// 		sounds.victory.play();
			// 		stateMachine.change('victory', {
			// 			level: this.level,
			// 			paddle: this.paddle,
			// 			health: this.health,
			// 			score: this.score,
			// 			ball: this.ball,
			// 			userInterface: this.userInterface,
			// 		});
					
			// 	}

			// 	this.ball.handleBrickCollision(brick);
			// }
		});
		var counter = 0;
		this.balls.forEach((ball) => {
			
			if(ball.didFall()){
				this.balls.splice(counter, 1)
			}
			counter++;
		});
		if(this.balls.length == 0){
			
				
					this.health--;
					this.userInterface.update(this.health, this.score);
					sounds.hurt.play();
		
					if(this.health === 2){
						console.log("fam2");
						console.log(this.paddle.size);
						if(this.paddle.size === 0){
		
						}else{
							this.paddle.size--;
							console.log(this.paddle.size);
							if(this.paddle.size == 0)
								{
									this.paddle.width = TILE_SIZE*2;
								}
								else if(this.paddle.size == 1)
								{
									this.paddle.width = TILE_SIZE*4;
								}
								else if(this.paddle.size == 2)
								{
									this.paddle.width = TILE_SIZE*6;
								}
								else if(this.paddle.size == 3)
								{
									this.paddle.width = TILE_SIZE*8;
								}
						}
						
					}
					else if(this.health === 1){
						console.log("fam1");
						console.log(this.paddle.size);
						if(this.paddle.size === 0){
		
						}else{
							this.paddle.size--;
							console.log(this.paddle.size);
							if(this.paddle.size == 0)
							{
								this.paddle.width = TILE_SIZE*2;
							}
							else if(this.paddle.size == 1)
							{
								this.paddle.width = TILE_SIZE*4;
							}
							else if(this.paddle.size == 2)
							{
								this.paddle.width = TILE_SIZE*6;
							}
							else if(this.paddle.size == 3)
							{	
								this.paddle.width = TILE_SIZE*8;
							}
						}
					}
		
					if (this.health === 0) {
						stateMachine.change('game-over', {
							score: this.score,
						});
					}
					else {
						stateMachine.change('serve', {
							paddle: this.paddle,
							ball: this.ball,
							bricks: this.bricks,
							health: this.health,
							score: this.score,
							userInterface: this.userInterface,
							level: this.level,
						});
					}
				
			
		}
		// if (this.ball.didFall()) {
		// 	this.health--;
		// 	this.userInterface.update(this.health, this.score);
		// 	sounds.hurt.play();

		// 	if(this.health === 2){
		// 		console.log("fam2");
		// 		console.log(this.paddle.size);
		// 		if(this.paddle.size === 0){

		// 		}else{
		// 			this.paddle.size--;
		// 			console.log(this.paddle.size);
		// 			if(this.paddle.size == 0)
		// 				{
		// 					this.paddle.width = TILE_SIZE*2;
		// 				}
		// 				else if(this.paddle.size == 1)
		// 				{
		// 					this.paddle.width = TILE_SIZE*4;
		// 				}
		// 				else if(this.paddle.size == 2)
		// 				{
		// 					this.paddle.width = TILE_SIZE*6;
		// 				}
		// 				else if(this.paddle.size == 3)
		// 				{
		// 					this.paddle.width = TILE_SIZE*8;
		// 				}
		// 		}
				
		// 	}
		// 	else if(this.health === 1){
		// 		console.log("fam1");
		// 		console.log(this.paddle.size);
		// 		if(this.paddle.size === 0){

		// 		}else{
		// 			this.paddle.size--;
		// 			console.log(this.paddle.size);
		// 			if(this.paddle.size == 0)
		// 			{
		// 				this.paddle.width = TILE_SIZE*2;
		// 			}
		// 			else if(this.paddle.size == 1)
		// 			{
		// 				this.paddle.width = TILE_SIZE*4;
		// 			}
		// 			else if(this.paddle.size == 2)
		// 			{
		// 				this.paddle.width = TILE_SIZE*6;
		// 			}
		// 			else if(this.paddle.size == 3)
		// 			{	
		// 				this.paddle.width = TILE_SIZE*8;
		// 			}
		// 		}
		// 	}

		// 	if (this.health === 0) {
		// 		stateMachine.change('game-over', {
		// 			score: this.score,
		// 		});
		// 	}
		// 	else {
		// 		stateMachine.change('serve', {
		// 			paddle: this.paddle,
		// 			ball: this.ball,
		// 			bricks: this.bricks,
		// 			health: this.health,
		// 			score: this.score,
		// 			userInterface: this.userInterface,
		// 			level: this.level,
		// 		});
		// 	}
		// }

		this.paddle.update(dt);
		this.balls.forEach((ball)=> {
			ball.update(dt);
		})
		//this.ball.update(dt);
		if(this.powerUp != null){
			this.powerUp.update(dt);
			console.log("power update");
		}
		
		this.bricks.forEach((brick) => {
			brick.update(dt);
		});
		
	}

	render() {
		this.userInterface.render();
		this.paddle.render();
		this.balls.forEach((ball)=> {
			ball.render();
		})
		//this.ball.render();
		
		this.bricks.forEach((brick) => {
			brick.render();
			if(this.powerUp != null){
				//POWERUP
				this.powerUp.render();
			}
			
		});
		

		if (this.paused) {
			context.save();
			context.font = "50px Joystix";
			context.fillStyle = "white";
			context.textBaseline = 'middle';
			context.textAlign = 'center';
			context.fillText(`⏸`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);
			context.restore();
		}
	}
}
