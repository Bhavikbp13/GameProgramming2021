import Fonts from "../lib/Fonts.js";
import Images from "../lib/Images.js";
import Sounds from "../lib/Sounds.js";
import StateStack from "../lib/StateStack.js";
import Timer from "../lib/Timer.js";
import PokemonFactory from "./services/PokemonFactory.js";

export const canvas = document.querySelector('canvas');
export const context = canvas.getContext('2d');

export const CANVAS_WIDTH = canvas.width;
export const CANVAS_HEIGHT = canvas.height;

export const keys = {};
export const images = new Images(context);
export const fonts = new Fonts();
export const stateStack = new StateStack();
export const timer = new Timer();
export const sounds = new Sounds();

export const pokemonFactory = new PokemonFactory();

export const DEBUG = false;
