/**
 * Angry-Birds-7
 * The "Polish" Update
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * Released by Rovio in 2009, Angry Birds took the mobile gaming scene by storm back
 * when it was still arguably in its infancy. Using the simple gameplay mechanic of
 * slingshotting birds into fortresses of various materials housing targeted pigs,
 * Angry Birds succeeded with its optimized formula for on-the-go gameplay. It's an
 * excellent showcase of the ubiquitous Box2D physics library, the most widely used
 * physics library of its kind, which is also open source. This "clone" of Angry Birds
 * doesn't contain nearly the plethora of features as the original series of games
 * it's based on but does use Matter.js to showcase the fundamental setup of what the
 * game looks like and how to use a subset of the physics library's features.
 *
 * Art
 * https://www.spriters-resource.com/mobile/angrybirds/
 *
 * Music
 * https://freesound.org/people/tyops/sounds/348166/
 *
 * Font
 * https://www.dafont.com/angrybirds.font
 */

import GameStateName from "./enums/GameStateName.js";
import Game from "../lib/Game.js";
import {
	canvas,
	context,
	fonts,
	images,
	keys,
	sounds,
	stateMachine,
} from "./globals.js";
import PlayState from "./states/PlayState.js";
import GameOverState from "./states/GameOverState.js";
import VictoryState from "./states/VictoryState.js";

// Fetch the asset definitions from config.json.
fetch('./src/config.json').then((response) => response.json())
.then((response) => {
	const {
		images: imageDefinitions,
		fonts: fontDefinitions,
		sounds: soundDefinitions,
		// @ts-ignore
	} = response;
	
	// Load all the assets from their definitions.
	images.load(imageDefinitions);
	fonts.load(fontDefinitions);
	sounds.load(soundDefinitions);
	
	// Add all the states to the state machine.
	stateMachine.add(GameStateName.GameOver, new GameOverState());
	stateMachine.add(GameStateName.Victory, new VictoryState());
	stateMachine.add(GameStateName.Play, new PlayState());
	
	stateMachine.change(GameStateName.Play);
	
	// Add event listeners for player input.
	canvas.addEventListener('keydown', event => {
		keys[event.key] = true;
	});
	
	canvas.addEventListener('keyup', event => {
		keys[event.key] = false;
	});
	
	const game = new Game(stateMachine, context, canvas.width, canvas.height);
	
	game.start();
	
	// Focus the canvas so that the player doesn't have to click on it.
	canvas.focus();
});

