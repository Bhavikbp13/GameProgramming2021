import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import Pokemon from "../../entities/Pokemon.js";
import { context, timer } from "../../globals.js";
import Panel from "./Panel.js";

export default class ProgressBar extends Panel{

    constructor(x, y, width, height, pokemon, options = {}, panel) {
		super(x, y, width, height, options);

        this.panel = panel;
		this.pokemon = pokemon;

        this.green = true;
        this.yellow = false;
        this.red = false;
        
        this.previousCurrent = null;
        this.positionX = this.dimensions.x-30;
        this.DimensionX = this.dimensions.x-30;
        this.newDimensionX = this.dimensions.x-30;
        this.difference = (this.DimensionX/this.pokemon.health);
        this.tweening = false;
	}

    update(){
        // console.log(this.DimensionX);
        // console.log(this.previousCurrent);
        // console.log(this.pokemon.currentHealth);
        if(this.previousCurrent != null){
            // if(this.pokemon.currentHealth == 0){
            //     this.newDimensionX = 0;
            // }else{
                this.newDimensionX = this.DimensionX-(this.difference*(this.pokemon.health-this.pokemon.currentHealth));
                
            //}
            
        }else{
            this.previousCurrent = this.pokemon.currentHealth;
        }
        

        if(this.pokemon.currentHealth <= Math.floor(this.pokemon.health/4)){
            this.green = false;
            this.yellow = false;
            this.red = true;
        }
        else if(this.pokemon.currentHealth <= Math.floor(this.pokemon.health/2)){
            this.green = false;
            this.yellow = true;
            this.red = false;
        }
        else{
            this.green = true;
            this.yellow = false;
            this.red = false;
        }
    }

    render(){
        context.save();
        if(this.tweening == false){
            this.tweening = true;
            timer.tween(this, ['positionX'], [this.newDimensionX], 0.40, () => {
                
                this.tweening = false;
                console.log("FALSEIFIED");
            });
        }
        context.restore();
        
    }
}