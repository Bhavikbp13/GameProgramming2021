import GameObject from "./GameObject.js";
import Tile from "./Tile.js";
import { images, sounds } from "../globals.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import Animation from "../../lib/Animation.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Player from "../entities/Player.js";

export default class Mushroom extends GameObject {
	static WIDTH = Tile.TILE_SIZE;
	static HEIGHT = Tile.TILE_SIZE;
	static TOTAL_SPRITES = 1;
	

	/**
	 * A collectible item that the player can consume to gain points.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
	constructor(dimensions, position) {
		super(dimensions, position);

		this.isConsumable = true;

		this.sprites = Mushroom.generateSprites();
		
	}

	update(dt) {
		
	}

	onConsume(player) {
		if (this.wasConsumed) {
			return;
		}

		super.onConsume();
		sounds.play(SoundName.PickUp);
		//console.log(player);
        
		player.sprites = Player.generateBiggerSprites();
		player.bigger = true;
		console.log(player);
		this.cleanUp = true;
	}

	static generateSprites() {
		const sprites = [];

		
			sprites.push(new Sprite(
				images.get(ImageName.Mushroom),
				0,
				0,
				Mushroom.WIDTH,
				Mushroom.HEIGHT
			));
		

		return sprites;
	}
}
