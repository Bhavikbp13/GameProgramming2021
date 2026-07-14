import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";

export default class PlayerIdleCarryingState extends State {
	/**
	 * In this state, the player is stationary unless
	 * a directional key or the spacebar is pressed.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([8], 1),
			[Direction.Down]: new Animation([0], 1),
			[Direction.Left]: new Animation([12], 1),
			[Direction.Right]: new Animation([4], 1),
		};
		
	}

	enter() {
		this.player.sprites = this.player.carryingPot;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update() {
		this.checkForMovement();
		this.checkForPotThrow();
	}

	checkForMovement() {
		if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.changeState(PlayerStateName.WalkingCarrying);
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.changeState(PlayerStateName.WalkingCarrying);
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.changeState(PlayerStateName.WalkingCarrying);
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.changeState(PlayerStateName.WalkingCarrying);
		}
	}


	checkForPotThrow(){
		//console.log(keys);
		if(keys.Enter){
			//console.log("Enter Pressed");
			this.player.changeState(PlayerStateName.ThrowingPot);
			//this.potHitboxCheck();
		}
	}

	
	potHitboxCheck() {
		let hitboxX, hitboxY, hitboxWidth, hitboxHeight;
		//console.log(this.player);
		// The magic numbers here are to adjust the hitbox offsets to make it line up with the sword animation.
		if (this.player.direction === Direction.Left) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x;
			hitboxX = this.player.position.x - hitboxWidth;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Right) {
			hitboxWidth = this.player.dimensions.x / 2;
			hitboxHeight = this.player.dimensions.x;
			hitboxX = this.player.position.x + this.player.dimensions.x;
			hitboxY = this.player.position.y + this.player.dimensions.y / 2;
		}
		else if (this.player.direction === Direction.Up) {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x;
			hitboxY = this.player.position.y;
		}
		else {
			hitboxWidth = this.player.dimensions.x;
			hitboxHeight = this.player.dimensions.x / 2;
			hitboxX = this.player.position.x;
			hitboxY = this.player.position.y + this.player.dimensions.y + 4;
		}

		this.player.liftHitbox.set(hitboxX, hitboxY, hitboxWidth, hitboxHeight);
		
	}
}