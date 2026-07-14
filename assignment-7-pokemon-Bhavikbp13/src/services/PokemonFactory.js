import Pokemon from "../entities/Pokemon.js";

export default class PokemonFactory {
	constructor(context) {
		this.context = context;
		this.names = [];
		this.pokemon = {};
	}

	load(pokemonDefinitions) {
		this.names = pokemonDefinitions.names;
		this.pokemon = pokemonDefinitions.definitions;
	}

	get(name) {
		return this.pokemon[name];
	}

	createInstance(name, level = 1) {
		return new Pokemon(this.pokemon[name], level);
	}
}
