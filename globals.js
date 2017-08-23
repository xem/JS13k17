// GLOBALS

// Snake

// cubes side size in vh (default: 6, but in the editor it can be resized)
sidesize = 7;

// oldsnakex/y/z contains the previous X, Y, Z coordinates of each cube (values are multiples of sidesize)
// snakex/y/z contains the current coordinates of each cube
oldsnakex = [];
oldsnakey = [];
oldsnakez = [];
snakex = [];
snakey = [];
snakez = [];

// Z rotation of each cube in radians
snakeangle = [];

// Length in cubes (default: 5)
snakelength = 5;

// Game

// Playing (0: editor / 1: in-game)
playing = 1;

// Playing a puzzle
puzzling = 0;

// Keyboard input (control snake's cubes): up right down left shift ctrl 
u = r = d = l = s = c = 0;

// Keyboard lock
lock = 0;

// Wrap enabled 
wrapenabled = 0;

// Emoji
emoji=[];

// Debug

// Log
var log = function(s){
  console.log(s);
}