import GameObject from "./GameObject.js";
import Sprite from "../../lib/Sprite.js";
import ImageName from "../enums/ImageName.js";
import { images, sounds, timer } from "../globals.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";
import { getRandomPositiveNumber } from "../../lib/RandomNumberHelpers.js";
import PlayerLiftingPotState from "../states/entity/player/PlayerLiftingPotState.js";
import Tile from "./Tile.js";
import Direction from "../enums/Direction.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";

export default class Pot extends GameObject {
	static WIDTH = 32;
	static HEIGHT = 32;
	

	/**
	 * A toggle that the player can hit to open the dungeon doors.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position, room) {
		super(dimensions, position);

		this.isCollidable = true;
		this.isSolid = true;
        this.lifted = false;
		this.thrown = false;
		this.direction = null;
		this.break = false;
		this.released = false;

		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Pots),
			Pot.WIDTH,
			Pot.HEIGHT
		);
		//this.animation = {[Direction.Up]: new Animation([0,1,2,3], 2, 1)}
		this.currentAnimation = null;
		// this.animation = {
		// 	[Direction.Up]: new Animation([0,1,2,3], 2, 1),
		// 	[Direction.Down]: new Animation([0,1,2,3], 2, 1),
		// 	[Direction.Left]: new Animation([0,1,2,3], 2, 1),
		// 	[Direction.Right]: new Animation([0,1,2,3], 2, 1),
		// };
        
		this.room = room;
		this.hitbox.position.x += Tile.TILE_SIZE*.75;
		this.hitbox.position.y += Tile.TILE_SIZE;
		this.hitbox.dimensions.x -= Tile.TILE_SIZE*1.40;
		this.hitbox.dimensions.y -= Tile.TILE_SIZE;
		this.liftTweenStarted = false;
		this.isCarried = false;
		this.flyingTweenStarted = false;
		this.selfDestruct = false;
		this.shattered = false;
		this.PositionXBefore = null;
		this.PositionYBefore = null;
	}

	update(dt){
		//super.update(dt);
		if(this.currentAnimation != null){
			this.currentAnimation.update(dt);
		}
		if(this.break){
			
			//this.currentFrame = 1;
			if(!this.shattered)
			{
				sounds.play(SoundName.Shatter);
				//console.log("PLAYONCE");
				this.currentAnimation = new Animation([1,2,3], 0.5, 1);
				this.shattered = true;
			}
			
			//this.currentAnimation = new Animation([1,2,3], 0.5, 1);
			// timer.tween(this.position, ['x', 'y'], [this.position.x, this.position.y], 0.5, ()=>{
			// this.sprites = null;
			// this.hitbox.set(0,0,0,0);
			// });
		}
		if(this.isCarried && !this.released){
			//console.log("POT SHOULD NOT TOUCH");
			this.isCollidable = false;
			this.isSolid = false;
		}
		else{
			//console.log("POT SHOULD TOUCH TOUCH");
			this.isCollidable = true;
			this.isSolid = true;
		}
		
		if(this.lifted && !this.liftTweenStarted){
			this.liftTweenStarted = true;
			timer.tween(this.position, ['x', 'y'], [this.room.player.position.x-8, this.room.player.position.y-23], 1.5, ()=>{
				this.hitbox.position.x = this.room.player.position.x+4;
				this.hitbox.position.y = this.room.player.position.y-6;
				//this.player.changeState(PlayerStateName.IdleCarrying);
				//console.log("POT TWEEN");
				this.isCarried = true;
				this.isCollidable = false;
				this.solid = false;
				this.renderPriority = 1
				
			});
			
		}
		
		if(this.released){
			
			if(!this.selfDestruct){
				if(this.PositionXBefore+50 < this.position.x || this.PositionXBefore-50 > this.position.x){
					this.selfDestruct = true;
					this.break = true
				}
				else if(this.PositionYBefore+50 < this.position.y || this.PositionYBefore-50 > this.position.y){
					this.selfDestruct = true;
					this.break = true
				}
				
			}
			
		}
	}
	render() {
		
		if(this.sprites != null){
			if(this.currentAnimation != null){
				this.sprites[this.currentAnimation.getCurrentFrame()].render(Math.floor(this.position.x), Math.floor(this.position.y));
				if(this.currentAnimation.isDone()){
					this.sprites = null;
					this.hitbox.set(0,0,0,0);
					this.currentAnimation = null;
				}
			}
			else{
				super.render();
			}
		}
			
			
        
		
		
	}
	
	onCollision(collider) {
		super.onCollision(collider);

		if (collider instanceof Player) {
			
		}
		//console.log(this);
	}
}