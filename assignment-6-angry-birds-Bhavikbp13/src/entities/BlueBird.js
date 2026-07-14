import { keys, matter } from "../globals.js";
import BodyType from "../enums/BodyType.js";
import Circle from "./Circle.js";
import { oneInXChance } from "../../lib/RandomNumberHelpers.js";
import GameEntity from "./GameEntity.js";

export default class BlueBird extends Circle {
	static SPRITE_MEASUREMENTS = [{ x: 1, y: 379, width: 32, height: 30 }];
	static RADIUS = 13;

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
		super(x, y, BlueBird.RADIUS, {
			label: BodyType.Bird,
			density: 0.008,
			restitution: 0.8,
			collisionFilter: {
				group: -1,
			},
		});

		this.sprites = GameEntity.generateSprites(BlueBird.SPRITE_MEASUREMENTS);
		this.renderOffset = { x: -19, y: -19 };

		this.isWaiting = true;
		this.isJumping = false;
        this.split = false;
        this.isLaunched = false;
	}

	update(dt) {
		super.update(dt);

		if (this.isWaiting) {
			this.randomlyJump();
		}
        this.checkForSplit();
	}

    checkForSplit(){
        if(keys[' '] && this.split == false){
            console.log("SPLITATTACK");
            if(this.isLaunched){
                this.split = true;
            }
            

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