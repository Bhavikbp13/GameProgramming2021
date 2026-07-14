import Colour from "../../enums/Colour.js";
import { context, stateStack, timer } from "../../globals.js";
import Pokemon from "../../entities/Pokemon.js";
import UserInterfaceElement from "../UserInterfaceElement.js";
import Panel from "../elements/Panel.js";
import ProgressBar from "../elements/ProgressBar.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import ExperienceBar from "../elements/ExperienceBar.js";
import DialogueState from "../../states/game/DialogueState.js";
import BattleState from "../../states/game/BattleState.js";

export default class BattlePlayerPanel extends Panel {
	/**
	 * The Panel displayed beside the Player's Pokemon
	 * during battle that displays their name, health,
	 * level and experience.
	 *
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} height
	 * @param {Pokemon} pokemon
	 * @param {object} options Options for the super Panel.
	 */
	constructor(x, y, width, height, pokemon, options = {}) {
		super(x, y, width, height, options);

		this.pokemon = pokemon;
		this.oldHealth = this.pokemon.health;
		this.oldAttack = this.pokemon.attack;
		this.oldDefense = this.pokemon.defense;
		this.oldSpeed = this.pokemon.speed;

		this.progressbar = new ProgressBar(x, y, width, height, pokemon, options, this);
		this.experienceBar = new ExperienceBar(x, y, width, height, pokemon, options);
		this.battleState = null;
		this.oldExperience = this.pokemon.currentExperience;
		this.oldTarget = this.pokemon.targetExperience;
		this.tweening = false;
		this.tweening2 = false;
		this.xpPos = (this.dimensions.x-30)*(Math.floor(this.pokemon.currentExperience - this.pokemon.levelExperience)/(this.pokemon.targetExperience - this.pokemon.levelExperience));
	}

	update(){
		
		if(this.pokemon.levelChange){
			if(this.tweening == false){
				this.tweening = true;
				this.pokemon.tweenXP1 = true

				let newVal = (this.dimensions.x-30)*(Math.floor(this.pokemon.currentExperience - this.pokemon.levelExperience)/(this.pokemon.targetExperience - this.pokemon.levelExperience));
				let extra = this.pokemon.currentExperience - this.oldTarget;
				
				
				if(extra > 0){
					extra = newVal - this.pokemon.targetExperience;
					newVal = this.dimensions.x-30;
					
				}
				//newVal = this.dimensions.x-30;
				timer.tween(this, ['xpPos'], [newVal], 1, () => {
					
					
					// if(extra != 0){
					// 	this.tweening2 = true;
					// 	this.pokemon.tweenXP2 = true;
					// 	timer.tween(this, ['xpPos'], [extra], 0.2, () => {
					
					// 		this.tweening2 = false;
					// 		this.tweening = false;
					// 		this.pokemon.tweenXP2 = false;
					// 		this.pokemon.tweenXP1 = false;
							
					// 	});
					// }
					
						this.tweening = false;
						this.pokemon.tweenXP1 = false;
						this.pokemon.levelChange = false;
						
						stateStack.push(new DialogueState(`Health: ${this.oldHealth} > ${this.pokemon.health} \n
			                                   Attack: ${this.oldAttack} > ${this.pokemon.attack} \n
											   Defense: ${this.oldDefense} > ${this.pokemon.defense} \n
											   Speed: ${this.oldSpeed} > ${this.pokemon.speed}`, Panel.POKEMON_STATS, () => this.battleState.exitBattle()));
						
						console.log("TWEEN STPPOED");
					
					
				});
			}
		}
		
	}
	render() {
		super.render();

		this.renderStatistics();
		if(this.pokemon.battleEnd){
			console.log("BATTLE END");
			if(this.tweening == false){
				this.tweening = true;
				this.pokemon.tweenXP1 = true

				let newVal = (this.dimensions.x-30)*(Math.floor(this.pokemon.currentExperience - this.pokemon.levelExperience)/(this.pokemon.targetExperience - this.pokemon.levelExperience));
				let extra = this.pokemon.currentExperience - this.oldTarget;
				
				if(extra > 0){
					extra = newVal - this.pokemon.targetExperience;
					newVal = this.dimensions.x-30;
					
				}
				
				timer.tween(this, ['xpPos'], [newVal], 1, () => {
					
						this.tweening = false;
						this.pokemon.tweenXP1 = false;
						this.pokemon.battleEnd = false;
						
						console.log("TWEEN STPPOED");

				});
			}
		}
	}

	/**
	 * All the magic number offsets here are to
	 * arrange all the pieces nicely in the space.
	 */
	renderStatistics() {
		context.save();
		context.textBaseline = 'top';
		context.fillStyle = Colour.Black;
		context.font = `${UserInterfaceElement.FONT_SIZE}px ${UserInterfaceElement.FONT_FAMILY}`;
		context.fillText(
			this.pokemon.name.toUpperCase(),
			this.position.x + 15,
			this.position.y + 12
		);
		context.textAlign = 'right';
		context.fillText(
			`Lv${this.pokemon.level}`,
			this.position.x + this.dimensions.x - 10,
			this.position.y + 12
		);
		this.progressbar.update();
		context.fillStyle = "black";
		roundedRectangle(
			context,
			this.position.x + 10,
                this.position.y + 38,
                this.progressbar.DimensionX,
                14,
			Panel.BORDER_WIDTH,
			true,
			false
		);
		this.progressbar.render()
		if(this.progressbar.green){
            context.fillStyle = "Green";
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y + 40,
                this.progressbar.positionX,
                10,
                Panel.BORDER_WIDTH,
                true,
                false
            );
        } else if (this.progressbar.yellow) {
            context.fillStyle = "Yellow";
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y + 40,
                this.progressbar.positionX,
                10,
                Panel.BORDER_WIDTH,
                true,
                false
            );
        } else if (this.progressbar.red) {
            context.fillStyle = "Red";
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y + 40,
                this.progressbar.positionX,
                10,
                Panel.BORDER_WIDTH,
                true,
                false
            );
        }
		context.fillStyle = "Black";
		context.fillText(
			`${this.pokemon.getHealthMeter()}`,//HP
			this.position.x + this.dimensions.x - 30,
			this.position.y + this.dimensions.y - 25
		);
		// context.fillText(
		// 	`EXP: ${this.pokemon.getExperienceMeter()}`,
		// 	this.position.x  - 30,
		// 	this.position.y + this.dimensions.y - 25
		// );
		context.fillStyle = "black";
		roundedRectangle(
			context,
			this.position.x + 10,
            this.position.y + this.dimensions.y+2,
            this.progressbar.DimensionX,
            14,
			Panel.BORDER_WIDTH,
			true,
			false
		);

		
		
		context.fillStyle = "Blue";
            roundedRectangle(
                context,
                this.position.x + 10,
                this.position.y + this.dimensions.y+4,
                this.xpPos,
                10,
                Panel.BORDER_WIDTH,
                true,
                false
            );
		//this.experienceBar.render();
		 context.restore();
		
	}
}
