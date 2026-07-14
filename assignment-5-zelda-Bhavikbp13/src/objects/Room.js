import { getRandomPositiveInteger, pickRandomElement } from "../../lib/RandomNumberHelpers.js";
import Sprite from "../../lib/Sprite.js";
import Vector from "../../lib/Vector.js";
import Enemy from "../entities/enemies/Enemy.js";
import EnemyFactory from "../entities/enemies/EnemyFactory.js";
import Player from "../entities/Player.js";
import Direction from "../enums/Direction.js";
import EnemyType from "../enums/EnemyType.js";
import ImageName from "../enums/ImageName.js";
import PlayerStateName from "../enums/PlayerStateName.js";
import { CANVAS_HEIGHT, CANVAS_WIDTH, images, timer } from "../globals.js";
import Doorway from "./Doorway.js";
import HeartDrop from "./HeartDrop.js";
import Pot from "./Pot.js";
import Switch from "./Switch.js";
import Tile from "./Tile.js";

export default class Room {
	static WIDTH = CANVAS_WIDTH / Tile.TILE_SIZE - 2;
	static HEIGHT = Math.floor(CANVAS_HEIGHT / Tile.TILE_SIZE) - 2;
	static RENDER_OFFSET_X = (CANVAS_WIDTH - (Room.WIDTH * Tile.TILE_SIZE)) / 2;
	static RENDER_OFFSET_Y = (CANVAS_HEIGHT - (Room.HEIGHT * Tile.TILE_SIZE)) / 2;

	static TOP_EDGE = Room.RENDER_OFFSET_Y + Tile.TILE_SIZE;
	static BOTTOM_EDGE = CANVAS_HEIGHT - Room.RENDER_OFFSET_Y - Tile.TILE_SIZE;
	static LEFT_EDGE = Room.RENDER_OFFSET_X + Tile.TILE_SIZE;
	static RIGHT_EDGE = CANVAS_WIDTH - Tile.TILE_SIZE * 2;
	static CENTER_X = Math.floor(Room.LEFT_EDGE + ((Room.RIGHT_EDGE - Room.LEFT_EDGE) / 2));
	static CENTER_Y = Math.floor(Room.TOP_EDGE + ((Room.BOTTOM_EDGE - Room.TOP_EDGE) / 2));

	static TILE_TOP_LEFT_CORNER = 3;
	static TILE_TOP_RIGHT_CORNER = 4;
	static TILE_BOTTOM_LEFT_CORNER = 22;
	static TILE_BOTTOM_RIGHT_CORNER = 23;
	static TILE_EMPTY = 18;
	static TILE_TOP_WALLS = [57, 58, 59];
	static TILE_BOTTOM_WALLS = [78, 79, 80];
	static TILE_LEFT_WALLS = [76, 95, 114];
	static TILE_RIGHT_WALLS = [77, 96, 115];
	static TILE_FLOORS = [
		6, 7, 8, 9, 10, 11, 12,
		25, 26, 27, 28, 29, 30, 31,
		44, 45, 46, 47, 48, 49, 50,
		63, 64, 65, 66, 67, 68, 69,
		87, 88, 106, 107,
	];

	/**
	 * Represents one individual section of the dungeon complete
	 * with its own set of enemies and a switch that can open the doors.
	 *
	 * @param {Player} player
	 */
	constructor(player, isShifting = false) {
		this.player = player;
		this.dimensions = new Vector(Room.WIDTH, Room.HEIGHT);
		this.sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Tiles),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);
		this.tiles = this.generateWallsAndFloors();
		this.entities = this.generateEntities();
		this.doorways = this.generateDoorways();
		this.objects = this.generateObjects();
		this.renderQueue = this.buildRenderQueue();

		// Used for drawing when this room is the next room, adjacent to the active.
		this.adjacentOffset = new Vector();

		this.isShifting = isShifting;
		this.player.changeState(PlayerStateName.Idle);
		this.player.throwing = false;
	}

	update(dt) {
		this.renderQueue = this.buildRenderQueue();
		this.cleanUpEntities();
		this.cleanUpObjects();
		this.updateEntities(dt);
		this.updateObjects(dt);

	}

	render() {
		this.renderTiles();

		this.renderQueue.forEach((elementToRender) => {
			elementToRender.render(this.adjacentOffset);
		});
	}

	/**
	 * Order the entities by their renderPriority fields. If the renderPriority
	 * is the same, then sort the entities by their bottom positions. This will
	 * put them in an order such that entities higher on the screen will appear
	 * behind entities that are lower down.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
	 *
	 * The spread operator (...) returns all the elements of an array separately
	 * so that you can pass them into functions or create new arrays. What we're
	 * doing below is combining both the entities and objects arrays into one.
	 *
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
	 */
	buildRenderQueue() {
		return [...this.entities, ...this.objects].sort((a, b) => {
			let order = 0;
			const bottomA = a.hitbox.position.y + a.hitbox.dimensions.y;
			const bottomB = b.hitbox.position.y + b.hitbox.dimensions.y;

			if (a.renderPriority < b.renderPriority) {
				order = -1;
			}
			else if (a.renderPriority > b.renderPriority) {
				order = 1;
			}
			else if (bottomA < bottomB) {
				order = -1;
			}
			else {
				order = 1;
			}

			return order;
		});
	}

	cleanUpEntities() {
		this.entities = this.entities.filter((entity) => !entity.isDead);
	}
	cleanUpObjects(){
		this.objects = this.objects.filter((object) => !object.wasConsumed)
	}

	updateEntities(dt) {
		this.entities.forEach((entity) => {
			if (entity.health <= 0) {
				entity.isDead = true;
			}

			// Disallow the player to control the character while shifting.
			if ((!this.isShifting) || (this.isShifting && entity !== this.player)) {
				entity.update(dt);
			}

			this.objects.forEach((object) => {
				
				if(object instanceof Pot && object.lifted && this.player.throwing && entity instanceof Player && object.didCollideWithEntity(entity.hitbox)){
					//console.log("PLAYER ATTACKED BY POT");
					object.isSolid = false;
					object.isCollidable = false;
					
				}
				else{
					object.isSolid = true;
					object.isCollidable = true;
				}
				if(object instanceof HeartDrop && entity instanceof Enemy && object.didCollideWithEntity(entity.hitbox)){
					//console.log("ENEMY WALK THROUGH HEART");
					object.isSolid = false;
					object.isCollidable = false;
					
				}
				else{
					object.isSolid = true;
					object.isCollidable = true;
				}
				if(object instanceof Pot && object.isCarried && entity instanceof Enemy){
					//console.log("POT DOESNT TOUCH ENEMY");
					object.isSolid = false;
					object.isCollidable = false;
				}else{
					object.isSolid = true;
					object.isCollidable = true;
				}

				if (object.didCollideWithEntity(entity.hitbox)) {
					if (object.isCollidable) {
						if(object instanceof Pot && object.released && entity instanceof Player){
							//Released doesnt exist on non Pots so I have to make a blank if
						}else{
							object.onCollision(entity)
						}
					}
					if(object.isConsumable){
						object.onConsume(entity);
					}
				}
				
				
				if(object instanceof Pot && object.lifted && this.player.throwing && entity instanceof Enemy && object.didCollideWithEntity(entity.hitbox)){
					//console.log("ENEMY HIT WITH POT");
					entity.receiveDamage(entity.health);
					if (entity instanceof Enemy) {
						if (entity.dropHeart == 1) {
							//console.log("DROPHEART");
							
	
							this.objects.push(new HeartDrop(
								new Vector(
									HeartDrop.HEARTWIDTH,
									HeartDrop.HEARTHEIGHT
								),
								new Vector(
									entity.position.x,
									entity.position.y,
								),
								this
							));
						}
					}
					object.break = true;
				}
				
				
				
			});

			// Since the player is technically always colliding with itself, skip it.
			if (entity === this.player) {
				return;
			}

			if (entity.didCollideWithEntity(this.player.swordHitbox)) {
				entity.receiveDamage(this.player.damage);
				if (entity instanceof Enemy) {
					if (entity.dropHeart == 1) {
						//console.log("DROPHEART");


						this.objects.push(new HeartDrop(
							new Vector(
								HeartDrop.HEARTWIDTH,
								HeartDrop.HEARTHEIGHT
							),
							new Vector(
								entity.position.x,
								entity.position.y,
							),
							this
						));
					}
				}
			}

			if (!entity.isDead && this.player.didCollideWithEntity(entity.hitbox) && !this.player.isInvulnerable) {
				this.player.receiveDamage(entity.damage);
				this.player.becomeInvulnerable();
			}
		});
	}

	updateObjects(dt) {
		this.objects.forEach((object) => {
			object.update(dt);
			if (object instanceof Pot && object.lifted && this.player.throwing && object.released && object.break) {
				
			}
			else if (object instanceof Pot && object.didCollideWithEntity(this.player.liftHitbox) && !object.lifted) {

				//console.log("LIFTPOT");
				

				object.lifted = true;
				//object.isCarried = true;
				this.player.changeState(PlayerStateName.LiftingPot);
				//object.isCollidable = false;
			}
			else if (object instanceof Pot && object.lifted && this.player.throwing && object.released && !object.break) {
				//console.log("POT FLYING");
				if (object.direction === Direction.Left) {
					object.direction = Direction.Left;
					object.position.x -= 1;
					object.hitbox.position.x = object.position.x+(object.dimensions.x/2)-4;

					if (object.position.x <= Room.LEFT_EDGE) {
						object.position.x = Room.LEFT_EDGE;
						object.break = true;
					}

					if (!object.flyingTweenStarted) {
						object.flyingTweenStarted = true;
						timer.tween(object.position, ['x', 'y'], [object.position.x -= 1, object.position.y], 0.01, () => {
							//this.player.changeState(PlayerStateName.IdleCarrying);
							//object.hitbox.position.x -=1;
							//object.hitbox.position.y -=1;
							//object.break = true;

						});
					}

					//object.direction = Direction.Left;
				}
				else if (object.direction === Direction.Right) {
					object.direction = Direction.Right;
					object.position.x += 1;
					object.hitbox.position.x = object.position.x+(object.dimensions.x/2)-4;

					if (object.position.x + object.dimensions.x >= Room.RIGHT_EDGE) {
						object.position.x = Room.RIGHT_EDGE - object.dimensions.x;
						object.break = true;
					}

					if (!object.flyingTweenStarted) {
						object.flyingTweenStarted = true;
						timer.tween(object.position, ['x', 'y'], [object.position.x += 1, object.position.y], 0.01, () => {
							//this.player.changeState(PlayerStateName.IdleCarrying);
							//object.hitbox.position.x +=1;
							//object.hitbox.position.y -=1;
							//object.break = true;

						});
					}
					//object.direction = Direction.Right;
				}
				else if (object.direction === Direction.Up) {
					object.direction = Direction.Up;
					object.position.y -= 1;
					object.hitbox.position.y = object.position.y+(object.dimensions.y/2)-2;

					if (object.position.y <= Room.TOP_EDGE - object.dimensions.y) {
						object.position.y = Room.TOP_EDGE - object.dimensions.y;
						object.break = true;
					}

					if (!object.flyingTweenStarted) {
						object.flyingTweenStarted = true;
						timer.tween(object.position, ['x', 'y'], [object.position.x, object.position.y -= 1], 0.01, () => {
							//this.player.changeState(PlayerStateName.IdleCarrying);
							//object.hitbox.position.x -=1;
							//object.hitbox.position.y -=1;
							//object.break = true;

						});
					}
					//object.direction = Direction.Up;
				}
				else {
					object.direction = Direction.Down;
					object.position.y += 1;
					object.hitbox.position.y = object.position.y+(object.dimensions.y/2)-2;

					if (object.position.y + object.dimensions.y >= Room.BOTTOM_EDGE) {
						object.position.y = Room.BOTTOM_EDGE - object.dimensions.y;
						object.break = true;
					}

					if (!object.flyingTweenStarted) {
						object.flyingTweenStarted = true;
						timer.tween(object.position, ['x', 'y'], [object.position.x, object.position.y += 1], 0.01, () => {
							//this.player.changeState(PlayerStateName.IdleCarrying);
							//object.hitbox.position.x -=1;
							//object.hitbox.position.y +=1;
							//object.break = true;

						});
					}
					//object.direction = Direction.Down;
				}

				//object.isCollidable = true;
			}
			else if (object instanceof Pot && object.lifted && this.player.throwing && !object.break) {
				//console.log("POT THROWN");

				if (this.player.direction === Direction.Left) {
					timer.tween(object.position, ['x', 'y'], [object.position.x -= 1, object.position.y], 0.01, () => {
						//this.player.changeState(PlayerStateName.IdleCarrying);
						//object.hitbox.position.x -=1;
						//object.hitbox.position.y -=1;

					});
					object.direction = Direction.Left;
				}
				else if (this.player.direction === Direction.Right) {
					timer.tween(object.position, ['x', 'y'], [object.position.x += 1, object.position.y], 0.01, () => {
						//this.player.changeState(PlayerStateName.IdleCarrying);
						//object.hitbox.position.x +=1;
						//object.hitbox.position.y -=1;

					});
					object.direction = Direction.Right;
				}
				else if (this.player.direction === Direction.Up) {
					timer.tween(object.position, ['x', 'y'], [object.position.x, object.position.y -= 1], 0.01, () => {
						//this.player.changeState(PlayerStateName.IdleCarrying);
						//object.hitbox.position.x -=1;
						//object.hitbox.position.y -=1;

					});
					object.direction = Direction.Up;
				}
				else {
					timer.tween(object.position, ['x', 'y'], [object.position.x, object.position.y += 1], 0.01, () => {
						//this.player.changeState(PlayerStateName.IdleCarrying);
						//object.hitbox.position.x -=1;
						//object.hitbox.position.y +=1;

					});
					object.direction = Direction.Down;
				}

				object.released = true;
				object.isCollidable = true;
				object.PositionXBefore = object.position.x;
				object.PositionYBefore = object.position.y;
				//object.isSolid = true;
				//object.lifted = false;
			}
			else if (object instanceof Pot && object.lifted && object.isCarried) {
				timer.tween(object.position, ['x', 'y'], [this.player.position.x - 8, this.player.position.y - 23], 0.01, () => {
					//this.player.changeState(PlayerStateName.IdleCarrying);
					object.hitbox.position.x = this.player.position.x + 4;
					object.hitbox.position.y = this.player.position.y - 6;

				});
				//object.isCollidable = false;
			}


		});
		this.player.liftHitbox.set(0, 0, 0, 0);
	}

	renderTiles() {
		this.tiles.forEach((tileRow) => {
			tileRow.forEach((tile) => {
				tile.render(this.adjacentOffset);
			});
		});
	}

	/**
	 * Uses the constants defined at the top of the class and determines which
	 * sprites to use for the walls and floor. Since there are several potential
	 * tiles to use for a piece of wall or floor, we can have a slightly different
	 * look each time we create a new room.
	 *
	 * @returns An array containing the walls and floors of the room, randomizing the tiles for visual variety.
	 */
	generateWallsAndFloors() {
		const tiles = [];

		for (let y = 0; y < this.dimensions.y; y++) {
			tiles.push([]);

			for (let x = 0; x < this.dimensions.x; x++) {
				let tileId = Room.TILE_EMPTY;

				if (x === 0 && y === 0) {
					tileId = Room.TILE_TOP_LEFT_CORNER;
				}
				else if (x === 0 && y === this.dimensions.y - 1) {
					tileId = Room.TILE_BOTTOM_LEFT_CORNER;
				}
				else if (x === this.dimensions.x - 1 && y === 0) {
					tileId = Room.TILE_TOP_RIGHT_CORNER;
				}
				else if (x === this.dimensions.x - 1 && y === this.dimensions.y - 1) {
					tileId = Room.TILE_BOTTOM_RIGHT_CORNER;
				}
				// Random left-hand walls, right walls, top, bottom, and floors.
				else if (x === 0) {
					if (y === Math.floor(this.dimensions.y / 2) || y === Math.floor(this.dimensions.y / 2) + 1) {
						tileId = Room.TILE_EMPTY;
					}
					else {
						tileId = Room.TILE_LEFT_WALLS[Math.floor(Math.random() * Room.TILE_LEFT_WALLS.length)];
					}
				}
				else if (x === this.dimensions.x - 1) {
					if (y === Math.floor(this.dimensions.y / 2) || y === Math.floor(this.dimensions.y / 2) + 1) {
						tileId = Room.TILE_EMPTY;
					}
					else {
						tileId = Room.TILE_RIGHT_WALLS[Math.floor(Math.random() * Room.TILE_RIGHT_WALLS.length)];
					}
				}
				else if (y === 0) {
					if (x === this.dimensions.x / 2 || x === this.dimensions.x / 2 - 1) {
						tileId = Room.TILE_EMPTY;
					}
					else {
						tileId = Room.TILE_TOP_WALLS[Math.floor(Math.random() * Room.TILE_TOP_WALLS.length)];
					}
				}
				else if (y === this.dimensions.y - 1) {
					if (x === this.dimensions.x / 2 || x === this.dimensions.x / 2 - 1) {
						tileId = Room.TILE_EMPTY;
					}
					else {
						tileId = Room.TILE_BOTTOM_WALLS[Math.floor(Math.random() * Room.TILE_BOTTOM_WALLS.length)];
					}
				}
				else {
					tileId = Room.TILE_FLOORS[Math.floor(Math.random() * Room.TILE_FLOORS.length)];
				}

				tiles[y].push(new Tile(x, y, Room.RENDER_OFFSET_X, Room.RENDER_OFFSET_Y, this.sprites[tileId]));
			}
		}

		return tiles;
	}

	/**
	 * @returns An array of enemies for the player to fight.
	 */
	generateEntities() {
		const entities = [];
		const sprites = Sprite.generateSpritesFromSpriteSheet(
			images.get(ImageName.Enemies),
			Tile.TILE_SIZE,
			Tile.TILE_SIZE
		);

		/**
		 * Choose a random enemy type and fill the room with only that type.
		 * This is more to make each room feel like a different room.
		 */
		const enemyType = EnemyType[pickRandomElement(Object.keys(EnemyType))];

		for (let i = 0; i < 10; i++) {
			entities.push(EnemyFactory.createInstance(enemyType, sprites));
		}

		entities.push(this.player);

		return entities;
	}

	/**
	 * @returns An array of objects for the player to interact with.
	 */
	generateObjects() {
		const objects = [];

		objects.push(new Switch(
			new Vector(
				Switch.WIDTH,
				Switch.HEIGHT
			),
			new Vector(
				getRandomPositiveInteger(Room.LEFT_EDGE + Switch.WIDTH, Room.RIGHT_EDGE - Switch.WIDTH * 2),
				getRandomPositiveInteger(Room.TOP_EDGE + Switch.HEIGHT, Room.BOTTOM_EDGE - Switch.HEIGHT * 2),
			),
			this
		));
		objects.push(...this.doorways);
		objects.push(new Pot(
			new Vector(
				Pot.WIDTH,
				Pot.HEIGHT
			),
			new Vector(
				getRandomPositiveInteger(Room.LEFT_EDGE + Switch.WIDTH, Room.RIGHT_EDGE - Switch.WIDTH * 2),
				getRandomPositiveInteger(Room.TOP_EDGE + Switch.HEIGHT, Room.BOTTOM_EDGE - Switch.HEIGHT * 2),
			),
			this
		));	
		
		return objects;
	}

	/**
	 * @returns An array of the four directional doors.
	 */
	generateDoorways() {
		const doorways = [];

		doorways.push(new Doorway(
			Doorway.getDimensionsFromDirection(Direction.Up),
			Doorway.getPositionFromDirection(Direction.Up),
			Direction.Up,
			this
		));
		doorways.push(new Doorway(
			Doorway.getDimensionsFromDirection(Direction.Down),
			Doorway.getPositionFromDirection(Direction.Down),
			Direction.Down,
			this
		));
		doorways.push(new Doorway(
			Doorway.getDimensionsFromDirection(Direction.Left),
			Doorway.getPositionFromDirection(Direction.Left),
			Direction.Left,
			this
		));
		doorways.push(new Doorway(
			Doorway.getDimensionsFromDirection(Direction.Right),
			Doorway.getPositionFromDirection(Direction.Right),
			Direction.Right,
			this
		));

		return doorways;
	}

	openDoors() {
		this.doorways.forEach((doorway) => {
			doorway.open();
		});
	}

	closeDoors() {
		this.doorways.forEach((doorway) => {
			doorway.close();
		});
	}
}
