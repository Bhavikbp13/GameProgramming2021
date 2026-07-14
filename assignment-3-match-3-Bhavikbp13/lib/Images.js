import Graphic from "./Graphic.js";

export default class Images {
	constructor(context) {
		this.context = context;
		this.images = {};
	}

	load(imageDefinitions) {
		imageDefinitions.forEach((imageDefinition) => {
			this.images[imageDefinition.name] = new Graphic(
				imageDefinition.path,
				imageDefinition.width,
				imageDefinition.height,
			);
		});
	}

	get(name) {
		return this.images[name];
	}

	render(name, x, y) {
		this.get(name).render(this.context, x, y);
	}
}
