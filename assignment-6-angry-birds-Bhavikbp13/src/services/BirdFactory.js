import Bird from "../entities/Bird.js";
import BlackBird from "../entities/BlackBird.js";
import BlueBird from "../entities/BlueBird.js";
import BirdType from "../enums/BirdType.js";

export default class BirdFactory {
	/**
	 * Encapsulates the instantiation logic for creating birds.
	 * This method should be extended when adding new birds.
	 *
	 * @param {object} type Uses the BirdType enum.
	 * @returns An instance of a Bird.
	 */
	 static createInstance(type, x, y) {
		switch (type) {
			case BirdType.Red:
				return new Bird(x, y);

			case BirdType.Blue:
				return new BlueBird(x,y);

			case BirdType.Black:
				return new BlackBird(x,y);
		}
	}
}
