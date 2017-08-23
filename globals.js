// GLOBALS

// Snake

// cubes side size in vh (default: 6, but in the editor it can be resized)
sidesize = 7;

// snakex/y/z contains the current X, Y, Z coordinates of each cube (and all their previous positions)
// One value is pushed every time the snake moves
// For example: head_X = snakex[x.length - 1]; tail_X = snakex[x.length - 1 - snakelength]
snakex = [];
snakey = [];
snakez = [];

// Z rotation of each cube in radians
snakeangle = [];

// Number of move records = head index on the arrays above
head = 0;

// Length in cubes (default: 5)
snakelength = 5;

// Game

// Playing (0: editor / 1: in-game)
playing = 1;

// Playing a puzzle
puzzling = 0;

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace
u = r = d = l = s = c = B = 0;

// Keyboard lock
lock = 0;

// Wrap enabled 
wrapenabled = 0;

// Emoji
emoji=[];

// Stuck
stuck = 0;

// Debug

// Log
var log = function(s){
  console.log(s);
}

// Rotate camera
rot = 0;
b_rl.onclick = function(){rot -= Math.PI/4; move_scene()};
b_rr.onclick = function(){rot += Math.PI/4; move_scene()};
  