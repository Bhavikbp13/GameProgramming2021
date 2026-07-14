import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import { keys } from "../../../globals.js";
import Room from "../../../objects/Room.js";

export default class PlayerWalkingState extends State {
	/**
	 * In this state, the player can move around using the
	 * directional keys. From here, the player can go idle
	 * if no keys are being pressed. The player can also swing
	 * their sword if they press the spacebar.
	 *
	 * @param {Player} player
	 */
	constructor(player) {
		super();

		this.player = player;
		this.animation = {
			[Direction.Up]: new Animation([8, 9, 10, 11], 0.2),
			[Direction.Down]: new Animation([0, 1, 2, 3], 0.2),
			[Direction.Left]: new Animation([12, 13, 14, 15], 0.2),
			[Direction.Right]: new Animation([4, 5, 6, 7], 0.2),
		};
	}

	enter() {
		this.player.sprites = this.player.walkingSprites;
		this.player.currentAnimation = this.animation[this.player.direction];
	}

	update(dt) {
		this.handleMovement(dt);
		this.handleSwordSwing();
		this.checkForPotLift();
	}

	handleMovement(dt) {
		this.player.currentAnimation = this.animation[this.player.direction];

		if (keys.s) {
			this.player.direction = Direction.Down;
			this.player.position.y += this.player.speed * dt;

			if (this.player.position.y + this.player.dimensions.y >= Room.BOTTOM_EDGE) {
				this.player.position.y = Room.BOTTOM_EDGE - this.player.dimensions.y;
			}
		}
		else if (keys.d) {
			this.player.direction = Direction.Right;
			this.player.position.x += this.player.speed * dt;

			if (this.player.position.x + this.player.dimensions.x >= Room.RIGHT_EDGE) {
				this.player.position.x = Room.RIGHT_EDGE - this.player.dimensions.x;
			}
		}
		else if (keys.w) {
			this.player.direction = Direction.Up;
			this.player.position.y -= this.player.speed * dt;

			if (this.player.position.y <= Room.TOP_EDGE - this.player.dimensions.y) {
				this.player.position.y = Room.TOP_EDGE - this.player.dimensions.y;
			}
		}
		else if (keys.a) {
			this.player.direction = Direction.Left;
			this.player.position.x -= this.player.speed * dt;

			if (this.player.position.x <= Room.LEFT_EDGE) {
				this.player.position.x = Room.LEFT_EDGE;
			}
		}
		else {
			this.player.changeState(PlayerStateName.Idle);
		}
	}

	handleSwordSwing() {
		if (keys[' ']) {
			this.player.changeState(PlayerStateName.SwordSwinging);
		}
	}

	checkForPotLift(){
		//console.log(keys);
		if(keys.Enter){
			//console.log("Enter Pressed");
			this.potHitboxCheck();
			
			// if(this.player.liftUp){
			// 	this.player.changeState(PlayerStateName.LiftingPot);
			// }
			
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
