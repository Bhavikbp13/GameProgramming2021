/**
 * Flappy-Bird-10
 * "The Audio Update"
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * A mobile game by Dong Nguyen that went viral in 2013, utilizing a very simple
 * but effective gameplay mechanic of avoiding pipes indefinitely by just tapping
 * the screen, making the player's bird avatar flap its wings and move upwards slightly.
 * A variant of popular games like "Helicopter Game" that floated around the internet
 * for years prior. Illustrates some of the most basic procedural generation of game
 * levels possible as by having pipes stick out of the ground by varying amounts, acting
 * as an infinitely generated obstacle course for the player.
 */

import Game from "./src/Game.js";
import { canvas } from "./src/globals.js";

const game = new Game();

game.start();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
