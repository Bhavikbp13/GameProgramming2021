import { SoundName, StateName } from "../enums.js";
import {
	BOARD_SIZE,
	context,
	keys,
	sounds,
	stateMachine,
	TILE_SIZE,
	timer,
} from "../globals.js";
import { roundedRectangle } from "../../lib/DrawingHelpers.js";
import State from "../../lib/State.js";
import Tile from "../objects/Tile.js";

export default class PlayState extends State {
	constructor() {
		super();

		// Position in the grid which we're currently highlighting.
		this.cursor = { boardX: 0, boardY: 0 };

		// Tile we're currently highlighting (preparing to swap).
		this.selectedTile = null;

		this.level = 1;

		// Increases as the player makes matches.
		this.score = 0;

		// Score we have to reach to get to the next level.
		this.scoreGoal = 250;

		// How much score will be incremented by per match tile.
		this.baseScore = 5;

		// How much scoreGoal will be scaled by per level.
		this.scoreGoalScale = 1.25;

		/**
		 * The timer will countdown and the player must try and
		 * reach the scoreGoal before time runs out. The timer
		 * is reset when entering a new level.
		 */
		this.maxTimer = 60;
		this.timer = this.maxTimer;
		this.hints = 3;
		this.hintTile1 = null;
		this.hintTile2 = null;
		this.hintType = null;
	}

	enter(parameters) {
		this.board = parameters.board;
		this.score = parameters.score;
		this.level = parameters.level;
		this.scene = parameters.scene;
		this.timer = this.maxTimer;
		this.scoreGoal *= Math.floor(this.level * this.scoreGoalScale);

		this.startTimer();
	}

	exit() {
		timer.clear();
		sounds.pause(SoundName.Music3);
	}

	update(dt) {
		this.scene.update(dt);
		this.checkGameOver();
		this.checkVictory();
		this.updateCursor();

		// If we've pressed enter, select or deselect the currently highlighted tile.
		if (keys.Enter) {
			keys.Enter = false;

			this.selectTile();
		}
		if(keys.h){
			keys.h = false;
			
			if(this.hints>0){
				this.findMatch();
				this.hints--;
			}
			
		}

		timer.update(dt);
	}

	async findMatch(){
		
		for (var y = 0; y < BOARD_SIZE; y++) {
			for (var x = 0; x < BOARD_SIZE-1; x++) {
				
				await this.board.swapTiles(this.board.tiles[y][x], this.board.tiles[y][x+1], false)
				this.board.calculateMatches();
				
				if(this.board.matches.length>0){
					await this.board.swapTiles(this.board.tiles[y][x+1], this.board.tiles[y][x], false);
					console.log("MATCH FOUND")
					console.log(this.board.matches)
					this.hintTile1 = this.board.tiles[y][x];
					this.hintTile2 = this.board.tiles[y][x+1];
					this.hintType = 'Horizontal';
					
					return;
				}
				if(this.board.matches.length == 0){
					await this.board.swapTiles(this.board.tiles[y][x+1], this.board.tiles[y][x], false);
					
				}
				
			}
		}
		
		if(this.hintType == null){
			for (var x = 0; x < BOARD_SIZE; x++) {
				for (var y = 0; y < BOARD_SIZE - 1; y++) {
					
					await this.board.swapTiles(this.board.tiles[y][x], this.board.tiles[y + 1][x], false)
					this.board.calculateMatches();
					if (this.board.matches.length > 0) {
						await this.board.swapTiles(this.board.tiles[y + 1][x], this.board.tiles[y][x], false);
						console.log("MATCH FOUND")
						console.log(this.board.matches)
						this.hintTile1 = this.board.tiles[y][x];
						this.hintTile2 = this.board.tiles[y + 1][x];
						this.hintType = 'Vertical';
						return;
					}
					if (this.board.matches.length == 0) {
						await this.board.swapTiles(this.board.tiles[y + 1][x], this.board.tiles[y][x], false);

					}
				}
			}
		}

		
	}
	hintRender(){
		console.log("HINTHIGHLIGHT");
		console.log(this.hintTile1);
		context.save();
		context.strokeStyle = 'red'
		context.lineWidth = 5;
	
		let width = TILE_SIZE;
		let height = TILE_SIZE;
		if(this.hintType == "Vertical"){
			height *=2
		} else if(this.hintType == "Horizontal"){
			width *=2
		}
		roundedRectangle(
			context,
			this.hintTile1.boardX*TILE_SIZE+ this.board.x,
			this.hintTile1.boardY*TILE_SIZE+ this.board.y,
			width,
			height,
			
		);
		//context.restore();
	}

	render() {
		this.scene.render();
		this.board.render();

		if (this.selectedTile) {
			this.renderSelectedTile();
		}

		this.renderCursor();
		this.renderUserInterface();
		if(this.hintTile1 != null && this.hintTile2 != null){
			this.hintRender();
		}
		
	}

	updateCursor() {
		let x = this.cursor.boardX;
		let y = this.cursor.boardY;

		if (keys.w) {
			keys.w = false;
			y = Math.max(0, y - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.s) {
			keys.s = false;
			y = Math.min(BOARD_SIZE - 1, y + 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.a) {
			keys.a = false;
			x = Math.max(0, x - 1);
			sounds.play(SoundName.Select);
		}
		else if (keys.d) {
			keys.d = false;
			x = Math.min(BOARD_SIZE - 1, x + 1);
			sounds.play(SoundName.Select);
		}

		this.cursor.boardX = x;
		this.cursor.boardY = y;
	}

	selectTile() {
		const highlightedTile = this.board.tiles[this.cursor.boardY][this.cursor.boardX];

		/**
		 * The `?.` syntax is called "optional chaining" which allows you to check
		 * a property on an object even if that object is `null` at the time.
		 *
		 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
		 */
		const tileDistance = Math.abs(this.selectedTile?.boardX - highlightedTile.boardX) + Math.abs(this.selectedTile?.boardY - highlightedTile.boardY);

		// If nothing is selected, select current tile.
		if (!this.selectedTile) {
			this.selectedTile = highlightedTile;
		}
		// Remove highlight if already selected.
		else if (this.selectedTile === highlightedTile) {
			this.selectedTile = null;
		}
		/**
		 * If the difference between X and Y combined of this selected
		 * tile vs the previous is not equal to 1, also remove highlight.
		 */
		else if (tileDistance > 1) {
			sounds.play(SoundName.Error);
			this.selectedTile = null;
		}
		// Otherwise, do the swap, and check for matches.
		else {
			this.swapTiles(highlightedTile);
		}
	}

	async swapTiles(highlightedTile) {
		if(highlightedTile == this.hintTile1 || highlightedTile == this.hintTile2){
			this.hintTile1 = null;
			this.hintTile2 = null;
			this.hintType = null;
		}
		await this.board.swapTiles(this.selectedTile, highlightedTile, true);
		this.board.calculateMatches();
		if(this.board.matches.length == 0 && highlightedTile != null){
			sounds.play(SoundName.Error);
			await this.board.swapTiles(highlightedTile, this.selectedTile, true);
			
		}
		this.selectedTile = null;
		await this.calculateMatches();
	}

	renderSelectedTile() {
		context.save();
		context.fillStyle = 'rgb(255, 255, 255, 0.5)';
		roundedRectangle(
			context,
			this.selectedTile.x + this.board.x,
			this.selectedTile.y + this.board.y,
			TILE_SIZE,
			TILE_SIZE,
			5,
			true,
			false,
		);
		context.restore();
	}

	renderCursor() {
		context.save();
		context.strokeStyle = 'white';
		context.lineWidth = 4;

		// Use board position * TILE_SIZE so that the cursor doesn't get tweened during a swap.
		roundedRectangle(
			context,
			this.cursor.boardX * TILE_SIZE + this.board.x,
			this.cursor.boardY * TILE_SIZE + this.board.y,
			TILE_SIZE,
			TILE_SIZE,
		);
		context.restore();
	}

	renderUserInterface() {
		context.fillStyle = 'rgb(56, 56, 56, 0.9)';
		roundedRectangle(
			context,
			50,
			this.board.y,
			225,
			BOARD_SIZE * TILE_SIZE,
			5,
			true,
			false,
		);

		context.fillStyle = 'white';
		context.font = '25px Joystix';
		context.textAlign = 'left';
		context.fillText(`Level:`, 60, this.board.y + 30);
		context.fillText(`Score:`, 60, this.board.y + 85);
		context.fillText(`Goal:`, 60, this.board.y + 140);
		context.fillText(`Timer:`, 60, this.board.y + 195);
		context.fillText(`Hint:`, 60, this.board.y + 240);
		context.textAlign = 'right';
		context.fillText(`${this.level}`, 250, this.board.y + 30);
		context.fillText(`${this.score}`, 250, this.board.y + 85);
		context.fillText(`${this.scoreGoal}`, 250, this.board.y + 140);
		context.fillText(`${this.timer}`, 250, this.board.y + 195);
		context.fillText(`${this.hints}`, 250, this.board.y + 240);
	}

	/**
	 * Calculates whether any matches were found on the board and tweens the needed
	 * tiles to their new destinations if so. Also removes tiles from the board that
	 * have matched and replaces them with new randomized tiles, deferring most of this
	 * to the Board class.
	 */
	async calculateMatches() {
		// Get all matches for the current board.
		this.board.calculateMatches();

		// If no matches, then no need to proceed with the function.
		if (this.board.matches.length === 0) {
			return;
		}

		this.calculateScore();

		// Remove any matches from the board to create empty spaces.
		this.board.removeMatches();

		await this.placeNewTiles();

		/**s
		 * Recursively call function in case new matches have been created
		 * as a result of falling blocks once new blocks have finished falling.
		 */
		await this.calculateMatches();
	}

	calculateScore() {
		this.board.matches.forEach((match) => {
			
			match.forEach((tileThis) =>{
				
				if(tileThis.pattern == 5){
					this.score += (tileThis.pattern)*2
				}else{
					this.score += (tileThis.pattern+1)*2
				}
				
			})
			this.score += match.length * this.baseScore;
			this.timer +=5;
			this.maxTimer = this.timer;
			timer.clear();
			this.startTimer();
		});
	}

	async placeNewTiles() {
		// Get an array with tween values for tiles that should now fall as a result of the removal.
		const tilesToFall = this.board.getFallingTiles();

		// Tween all the falling blocks simultaneously.
		await Promise.all(tilesToFall.map((tile) => {
			timer.tween(tile.tile, tile.parameters, tile.endValues, 0.25);
		}));

		// Get an array with tween values for tiles that should replace the removed tiles.
		const newTiles = this.board.getNewTiles();

		// Tween the new tiles falling one by one for a more interesting animation.
		for (const tile of newTiles) {
			await timer.tweenAsync(tile.tile, tile.parameters, tile.endValues, 0.05);
		}
	}

	startTimer() {
		// Decrement the timer every second.
		timer.addTask(() => {
			this.timer--;

			if (this.timer <= 5) {
				sounds.play(SoundName.Clock);
			}
		}, 1, this.maxTimer);
	}

	checkVictory() {
		if (this.score < this.scoreGoal) {
			return;
		}

		sounds.play(SoundName.NextLevel);

		stateMachine.change(StateName.LevelTransition, {
			level: this.level + 1,
			score: this.score,
			scene: this.scene,
			hints: this.hints = 3,
		});
	}

	checkGameOver() {
		if (this.timer > 0) {
			return;
		}

		sounds.play(SoundName.GameOver);

		stateMachine.change(StateName.GameOver, {
			score: this.score,
			scene: this.scene,
		});
	}
}
