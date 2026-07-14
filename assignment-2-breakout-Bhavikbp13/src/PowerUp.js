import SpriteManager from "./SpriteManager.js";
import {
	CANVAS_HEIGHT,
	CANVAS_WIDTH,
	sounds,
	TILE_SIZE,
} from "./globals.js";
import { getRandomNegativeNumber, getRandomNumber, getRandomPositiveNumber } from "./utils.js";

export default class PowerUp{
    /**
	 * PowerUp Class to drop a power up out of a random brick.
	 *
	 * @param {Number} x
	 * @param {Number} y
	 * @param {String} type
	 */

    constructor(x,y,type){
        this.x = x;
        this.y = y;
        this.width = TILE_SIZE;
        this.height = TILE_SIZE;
        this.dx = x;
		this.dy = getRandomPositiveNumber(90, 110);
		this.type = type;
        this.sprites = SpriteManager.generatePowerUpSprites();
    }

    update(dt){
        this.y++;
    }

    didFall() {
		return this.y > CANVAS_HEIGHT;
	}

    didCollide(target) {
		/**
		 * First, check to see if the left edge of either is
		 * farther to the right than the right edge of the other.
		 * Then check to see if the bottom edge of either is
		 * higher than the top edge of the other.
		 */
		if (this.x + this.width >= target.x
			&& this.x <= target.x + target.width
			&& this.y + this.height >= target.y
			&& this.y <= target.y + target.height) {
                console.log("powerup hit paddle");
			return true;
		}
        
		// If the above isn't true, they're overlapping.
		return false;
	}

	handlePaddleCollision(paddle) {
		const paddleBallDistance = paddle.x + paddle.width / 2 - this.x;
		const scaleFactor = 8;
		const minimumVelocity = 50;

		// If we hit the paddle on its left side while moving left...
		if (this.x < paddle.x + (paddle.width / 2) && paddle.dx < 0) {
			this.dx = -minimumVelocity + -(scaleFactor * paddleBallDistance);
		}
		//  If we hit the paddle on its right side while moving right...
		else if (this.x > paddle.x + (paddle.width / 2) && paddle.dx > 0) {
			this.dx = minimumVelocity + (scaleFactor * Math.abs(paddleBallDistance));
		}
	}

    render(){
		if(this.type == "multiBall"){
			this.sprites[0].render(this.x,this.y);
		}else if(this.type == "key"){
			this.sprites[1].render(this.x, this.y);
		}
      
		
    }
}