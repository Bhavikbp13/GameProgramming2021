import { context, timer } from "../../globals.js";
import { roundedRectangle } from "../../../lib/DrawingHelpers.js";
import Panel from "./Panel.js";

export default class ExperienceBar extends Panel{
    
    constructor(x, y, width, height, pokemon, options = {}) {
		super(x, y, width, height, options);

		this.pokemon = pokemon;
    this.tweening = false;
    this.tweening2 = false;
    this.xpPos = (this.dimensions.x-30)*(Math.floor(this.pokemon.currentExperience - this.pokemon.levelExperience)/(this.pokemon.targetExperience - this.pokemon.levelExperience));
    }

    update(){
      if (this.tweening == false) {
        this.tweening = true;
        let newVal = (this.dimensions.x - 30) * (Math.floor(this.pokemon.currentExperience - this.pokemon.levelExperience) / (this.pokemon.targetExperience - this.pokemon.levelExperience));
        let extra = 0;
        if (newVal > this.pokemon.targetExperience) {
          extra = newVal - this.pokemon.targetExperience;
          newVal = this.pokemon.targetExperience;
  
        }
        timer.tween(this, ['xpPos'], [newVal], 0.2, () => {
  
  
          if (extra != 0) {
            this.tweening2 = true;
            timer.tween(this, ['xpPos'], [extra], 0.2, () => {
  
              this.tweening2 = false;
              this.tweening = false;
  
            });
          }
          if (this.tweening2 != true) {
            this.tweening = false;
          }
  
        });
      }
    }

  render() {
    context.save();
    context.fillStyle = "Blue";
    roundedRectangle(
      context,
      this.position.x + 10,
      this.position.y + this.dimensions.y + 4,
      this.xpPos,
      10,
      Panel.BORDER_WIDTH,
      true,
      false
    );
    context.restore();
  }

}