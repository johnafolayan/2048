var width = 800;
var height = 600;

if ("ontouchstart" in document) {
		width = window.innerWidth;
		height = window.innerHeight;
}

var game = new Game(width, height, "screen");

game.start();