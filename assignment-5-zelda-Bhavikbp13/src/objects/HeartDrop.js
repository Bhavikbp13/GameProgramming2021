import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import Tile from "./Tile.js";

export default class HeartDrop extends GameObject {
	static HEARTWIDTH = Tile.TILE_SIZE;
	static HEARTHEIGHT = Tile.TILE_SIZE;
	

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, room) {
		super(dimensions, position);
        this.room = room;
		//this.isCollidable = true;
        this.isConsumable = true;
		this.isSolid = false;
        this.currentFrame = 4;
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Hearts),
			HeartDrop.HEARTWIDTH,
			HeartDrop.HEARTHEIGHT
		);
	}
    onConsume(consumer){
        
        if (consumer instanceof Player) {
			super.onConsume(consumer);
			//console.log("Heart Consumed");
			consumer.receiveHealth(2);
            this.sprites = null;
            
		}
    }

	render(offset = { x: 0, y: 0 }) {
		// const x = this.position.x + offset.x;
		// const y = this.position.y + offset.y;


		let scale = { x: 0.75, y: 0.75 }
		if(this.sprites != null)
        {
            this.sprites[this.currentFrame].render(this.position.x, this.position.y, scale);
        }
		//this.sprites[this.currentFrame].render(Math.floor(x), Math.floor(y), {x:0.75, y: 0.75});

		// if (DEBUG) {
		// 	this.hitbox.render(context);
		// }
	}
	// onCollision(collider) {
	// 	super.onCollision(collider);

	// 	if (collider instanceof Player) {
	// 		collider.receiveHealth(2);
    //         this.sprites = null;
            
	// 	}
	// }

    // render(){
    //     if(this.sprites != null)
    //     {
    //         this.sprites[this.currentFrame].render(this.position.x, this.position.y);
    //     }
        
    // }

}