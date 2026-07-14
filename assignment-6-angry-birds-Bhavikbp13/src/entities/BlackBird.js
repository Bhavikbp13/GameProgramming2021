import { keys, matter } from "../globals.js";
import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";
import GameEntity from "./GameEntity.js";
import Animation from "../../lib/Animation.js";

export default class BlackBird extends Circle {
	static SPRITE_MEASUREMENTS = [
        { x: 410, y: 725, width: 62, height: 82 },
        { x: 778, y: 446, width: 62, height: 82 },
        { x: 715, y: 446, width: 62, height: 82 },
        { x: 588, y: 446, width: 62, height: 82 },
        { x: 651, y: 446, width: 62, height: 82 },
        { x: 673, y: 353, width: 90, height: 90 },
    ];
	static RADIUS = 30;

	/**
	 * A bird that will be launched at the pig fortress. The bird is a
	 * dynamic (i.e. non-static) Matter body meaning it is affected by
	 * the world's physics. We've given the bird a high restitution value
	 * so that it is bouncy. The label will help us manage this body later.
	 * The collision filter ensures that birds cannot collide with eachother.
	 * We've set the density to a value higher than the block's default density
	 * of 0.001 so that the bird can actually knock blocks over.
	 *
	 * https://brm.io/matter-js/docs/classes/Body.html#property_restitution
	 * https://brm.io/matter-js/docs/classes/Body.html#property_label
	 * https://brm.io/matter-js/docs/classes/Body.html#property_collisionFilter
	 * https://brm.io/matter-js/docs/classes/Body.html#property_density
	 *
	 * @param {number} x
	 * @param {number} y
	 */
	constructor(x, y) {
		super(x, y, BlackBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(BlackBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -30, y: -50 };

		this.isWaiting = true;
		this.isJumping = false;
		this.explode = false;
		this.timerStart = false;
		this.exploded=false;
		this.isLaunched = false;
		this.currentAnimation = null;
	}

	update(dt) {
		super.update(dt);

		//console.log(dt);
		if(this.currentAnimation != null){
			this.currentAnimation.update(dt);
		}
		if (this.isWaiting) {
			this.randomlyJump();
		}
		//console.log(this.explode)
		if(this.explode && this.exploded == false){
			
			//console.log(this.sprites);
			if(!this.timerStart){
				console.log("BOOM");
				console.log(BlackBird.SPRITE_MEASUREMENTS);
				this.currentAnimation = new Animation([1,0,3,4], 0.5, 1);
				console.log(this.currentAnimation);
				
				
				this.timerStart = true;
			}
			
			
		}
		
	}

	render() {
		
			if(this.currentAnimation != null){
				//console.log(this.body);
				this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.body.position.x-30), Math.floor(this.body.position.y-50));
				if(this.currentAnimation.isDone()){
					console.log("EXPLODED");
					console.log("ANIMATE DONE");
					this.exploded = true;
					this.currentAnimation = null;
				}
			}
			else{
				super.render();
			}
			
		
	}
    
	randomlyJump() {
		if (!this.isJumping && oneInXChance(1000)) {
			this.jump();
		}

		if (this.isOnGround()) {
			this.isJumping = false;
		}
	}

	jump() {
		this.isJumping = true;

		// https://brm.io/matter-js/docs/classes/Body.html#method_applyForce
		matter.Body.applyForce(this.body, this.body.position, { x: 0.0, y: -0.2 });
	}
}