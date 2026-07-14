import Graphic from "./Graphic.js";
import SoundPool from "./SoundPool.js";
import StateMachine from "./StateMachine.js";
import EnterHighScoreState from "./states/EnterHighScoreState.js";
import GameOverState from "./states/GameOverState.js";
import HighScoreState from "./states/HighScoreState.js";
import PaddleSelectState from "./states/PaddleSelectState.js";
import PlayState from "./states/PlayState.js";
import ServeState from "./states/ServeState.js";
import TitleScreenState from "./states/TitleScreenState.js";
import VictoryState from "./states/VictoryState.js";

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const TILE_SIZE = 16;
export const MAX_HIGH_SCORES = 10;

export const keys = {};

canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

const fonts = [
	new FontFace('Joystix', 'url(./fonts/Joystix.ttf)'),
];

fonts.forEach((font) => {
	font.load().then(font => {
		document.fonts.add(font);
	});
})

export const images = {
	arrows: new Graphic('./images/arrows.png', 48, 24),
	background: new Graphic('./images/background.png', CANVAS_WIDTH, CANVAS_HEIGHT),
	hearts: new Graphic('./images/hearts.png', 20, 9),
	spriteSheet: new Graphic('./images/sprite_sheet.png', 1152, 1536),
};

export const sounds = {
	brickHit: new SoundPool('./sounds/brick_hit.wav', 10, 0.1),
	confirm: new SoundPool('./sounds/confirm.wav', 5, 0.1),
	highScore: new SoundPool('./sounds/high_score.wav', 5, 0.1),
	hurt: new SoundPool('./sounds/hurt.wav', 5, 0.1),
	music: new SoundPool('./sounds/music.wav', 1, 0.1, true),
	noSelect: new SoundPool('./sounds/no-select.wav', 5, 0.1),
	paddleHit: new SoundPool('./sounds/paddle_hit.wav', 5, 0.1),
	pause: new SoundPool('./sounds/pause.wav', 5, 0.1),
	select: new SoundPool('./sounds/select.wav', 5, 0.1),
	victory: new SoundPool('./sounds/victory.wav', 5, 0.1),
	wallHit: new SoundPool('./sounds/wall_hit.wav', 5, 0.1),
};

/**
 * The state machine we'll be using to transition between various states
 * in our game instead of clumping them together in our update and draw methods.
 *
 * Current game state can be any of the following:
 *   1. 'title-screen' (the beginning of the game, where we're told to press Enter)
 *   2. 'play' (the ball is in play, bouncing between paddles)
 *   3. 'serve' (waiting on a key press to serve the ball)
 *   4. 'game-over' (the player has lost; display score and allow restart)
 *   5. 'victory' (the current level is over, with a victory jingle)
 *   6. 'high-score' (displays all the high scores)
 *   7. 'enter-high-score' (player got a high score and can enter their name)
 *   8. 'paddle-select' (the player can select a skin for their paddle before playing)
 */
export const stateMachine = new StateMachine();

stateMachine.add('game-over', new GameOverState());
stateMachine.add('serve', new ServeState());
stateMachine.add('play', new PlayState());
stateMachine.add('victory', new VictoryState());
stateMachine.add('high-score', new HighScoreState());
stateMachine.add('enter-high-score', new EnterHighScoreState());
stateMachine.add('paddle-select', new PaddleSelectState());
stateMachine.add('title-screen', new TitleScreenState());
