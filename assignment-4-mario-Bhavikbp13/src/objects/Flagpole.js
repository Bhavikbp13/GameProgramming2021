import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Tile from "./Tile.js";
import ImageName from "../enums/ImageName.js";
import { canvas, images } from "../globals.js";
import GameObject from "./GameObject.js";
import Animation from "../../lib/Animation.js";

export default class Flagpole extends GameObject{
    static WIDTH = Tile.TILE_SIZE;
	static HEIGHT = Tile.TILE_SIZE*3;
	static TOTAL_SPRITES = 1;
    static TOTAL_FLAG_SPRITES = 2;

    /**
	 * A flagpole should pop up once all snails are dead.
	 *
	 * @param {Vector} dimensions
	 * @param {Vector} position
	 */
    constructor(dimensions, position){
        super(dimensions, position);
        this.sprites = Flagpole.generateSprites();
        //this.sprites.add(Flagpole.generateFlagSprites());
        this.isCollidable = true;
        
    }

   
    static generateSprites(){
        const sprites =[];
        sprites.push(new Sprite(
            images.get(ImageName.Flagpole),
            4*Flagpole.WIDTH,
            0,
            Flagpole.WIDTH,
            Flagpole.HEIGHT
        ));
          
        return sprites
    }
    

    onCollision(collider){

        alert("LEVEL UP");
        super.onCollision(collider);
        
       
    }
}