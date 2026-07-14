/**
 * Breakout-8
 * "The Paddle Select Update"
 *
 * Originally developed by Atari in 1976. An effective evolution of
 * Pong, Breakout ditched the two-player mechanic in favor of a single-
 * player game where the player, still controlling a paddle, was tasked
 * with eliminating a screen full of differently placed bricks of varying
 * values by deflecting a ball back at them.
 *
 * This version is built to more closely resemble the NES than
 * the original Pong machines or the Atari 2600 in terms of
 * resolution, though in widescreen (16:9) so it looks nicer on
 * modern systems.
 *
 * Credit for graphics:
 * https://opengameart.org/users/buch
 *
 * Credit for music:
 * http://freesound.org/people/joshuaempyre/sounds/251461/
 * http://www.soundcloud.com/empyreanma
 */

import Game from "./src/Game.js";
import { canvas } from "./src/globals.js";

const game = new Game();

game.start();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
