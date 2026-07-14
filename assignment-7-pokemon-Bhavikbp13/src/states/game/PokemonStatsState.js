import PokemonStatsPanel from "../../user-interface/PokemonStatsPanel.js";
import State from "../../../lib/State.js";
import { keys, stateStack } from "../../globals.js";

export default class PokemonStatsState extends State {
	constructor(pokemon) {
		super();

		this.panel = new PokemonStatsPanel(pokemon);
	}

	update(dt) {
		this.panel.update(dt);

		if (keys.Escape) {
			keys.Escape = false;

			stateStack.pop();
		}
	}

	render() {
		this.panel.render();
	}
}
