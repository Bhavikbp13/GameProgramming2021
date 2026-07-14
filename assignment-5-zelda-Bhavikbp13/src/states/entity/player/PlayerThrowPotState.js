import Animation from "../../../../lib/Animation.js";
import State from "../../../../lib/State.js";
import Player from "../../../entities/Player.js";
import Direction from "../../../enums/Direction.js";
import PlayerStateName from "../../../enums/PlayerStateName.js";
import SoundName from "../../../enums/SoundName.js";
import { sounds, timer } from "../../../globals.js";

export default class PlayerThrowPotState extends State {
	constructor(player) {
		super();

		this.player = player;

		this.animation = {
			[Direction.Up]: new Animation([8, 7, 6,], 0.5, 1),
			[Direction.Down]: new Animation([2, 1, 0], 0.5, 1),
			[Direction.Left]: new Animation([11, 10, 9], 0.5, 1),
			[Direction.Right]: new Animation([5, 4, 3], 0.5, 1),
		};
	}

    enter() {
		//sounds.play(SoundName.Sword);
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.sprites = this.player.liftingPot;
		this.player.currentAnimation = this.animation[this.player.direction];
		//console.log(this.player.currentAnimation);
	}

	exit() {
		this.player.positionOffset = { x: 0, y: 0 };
		this.player.liftHitbox.set(0, 0, 0, 0);
	}

	update() {
		// Idle once one sword swing animation cycle has been played.
		if (this.player.currentAnimation.isDone()) {
			this.player.currentAnimation.refresh();
			this.player.changeState(PlayerStateName.Idle);
		}

		this.player.throwing = true;
		this.throwing();
		
	}

    throwing() {
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