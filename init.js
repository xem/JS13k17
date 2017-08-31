// GLOBALS
// =======

var 

// Debug
//=======

// Log
log = s => {
  console.log(s);
}, 

// Rotate camera
rot = 0,
move_scene = () => {
  scene.style.transform = "translateX(-"+(snakex[head]*sidesize)+"vh)translateY(-"+(snakey[head]*sidesize)+"vh)translateZ(40vh)rotateX(40deg)rotateZ(" + rot + "rad)";
},

// Meta
//=======

L = localStorage,
P = "lossst_",
easteregg = 0,
son = +L[P + "son"] || 0,

// Snake
//=======

// cubes side size in vh (default: 6, but in the editor it can be resized)
sidesize = 7,

// Number of moves recorded
head = 0,

// snakex/y/z contains the current X, Y, Z coordinates of the head (and all its previous positions)
// One value is pushed every time the snake moves
// Ex: head_X = snakex[head]; tail_X = snakex[xhead - snakelength]
snakex = [],
snakey = [],
snakez = [],

// Z-axis rotation of each cube in radians
snakeangle = [],

// Snake length in cubes (default: 5)
// Synchronized with localStorage
snakelength = L[P + "snakelength"] = +L[P + "snakelength"] || 5,

// Game
//=======

// Are we in the editor
iseditor = 0,

// Playing (0: editor / 1: in-game)
playing = 1,

// Playing a puzzle
puzzling = 0,

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace
u = r = d = l = s = c = B = 0,

// Keyboard lock
lock = 0,

// Emoji
trees = [],
apples = [],

// doors
doors = [],

// Cubes
cubes = [],

// Hints
hints = [],

// Puzzles
puzzles = [],
currentpuzzle = null,
cellprefix = 'e',
dg = [],
dw = [],
hasground = 0,
haswall = 0,
haswrap = 0,
issolved = 0,
leftoffset = 0,
topoffset = 0,
size = 0,
totalsolved = +L[P + "totalsolved"] || 0,
exithead = 0,

// Stuck
stuck = 0,

// Page
pagename = "",

// Page size
w = h = 0,

// Game
//=======

// Enter a room
enterroom = () => {
  
  // Set room name to the body
  b.className = pagename;
  
  // Empty father container if son returns to hub
  if(son && !iseditor){
    snake.innerHTML = "";
  }
  
  // Hub (start, tuto, access to 2D, wrap and 3D puzzles)
  // ----
  if(pagename == "hub"){
  
    w = 40;
    h = 20;
    
    // Trees (x, y, z)
    trees = [
      [13,9,0],
      [6,13,0],
      [35,8,0],
    ];

    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [11,11,0,0,0],
      [2,12,0,6,0],
      [38,10,0,7,0],
    ];
    
    // Doors
    // 0: x (path center)
    // 1: y (path center)
    // 2: angle
    // 3: min snake length
    // 4: min solved puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z (path center)
    // 10: color (0: orange / 1: red)
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "1-1", 1, 0, 10, 0, 0],
      [20, -2, 0, 14, 0, "2-1", 1, 10, 19, 0, 0],
      [-2, 11, -Math.PI / 2, 6, 0, "3-1", 1, 20, 20, 1, 1],
      [28, 21, Math.PI, 14, 0, "1-4", 1, 22, 1, 0, 0],
      [5, 21, Math.PI, 5, 0, "2-5", 1, 36, 1, 0, 1],
    ];
    
    puzzles = [];
    
    cubes = [];
    for(i = 9; i < 15; i++){
      for(j = 0; j < 5; j++){
        if((j == 2 && i == 14) || (j == 2 && i == 13) || (j == 3 && i == 13) || (j == 3 && i == 12) || (j == 2 && i == 12)){
        }
        else {
          cubes.push([j,i]);          
        }
      }
    }
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length (if any)
    // 4: max snake length (if any)
    hints = [
      ["Move with arrow keys or WASD/ZQSD", 19, 5, 0, 13],
      ["Backtrack with Alt or ⟵", 2, 5, 0, 13],
      ["You can open red doors when you reach the length written on them", 30, 5, 0, 13],
      ["2D puzzle editor<br>↓", 19, 9, 14, 0],
      ["↑<br>More puzzles", 22, 2, 14, 0],
    ];
    
  }
  
  // 1-1 (puzzles 2D length 8)
  // ----
  
  else if(pagename == "1-1"){
      
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,13,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [33,14,0,0,6],
      [34,15,0,0,6],
      [37,13,0,0,6],
    ];
    
    cubes = [
      //[16,6],
      //[29,6],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI / 2, 8, 0, "hub", 0, 39, 11, 0, 0],
      [35, 21, Math.PI, 11, 0, "1-3", 1, 35, 1, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [6,8,0,,"000000001000001110001110001000000000",2,3],
      [6,8,0,,"000000011000011100010000011000000000",14,3],
      [6,8,0,,"000000000100001100011000011100000000",26,3],
      [5,8,0,,"0000001110011100110000000",2,13],
      [6,8,0,,"000000011000011000001100001100000000",14,13],
      [6,8,0,,"000000000100001100001110001100000000",26,13],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["You get new apples when all the puzzles in the room are solved", 9, 9, 1, 0],
    ];
    
  }
  
  // 1-3 (puzzles 2D length 11)
  // ----
  
  else if(pagename == "1-3"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [4,7,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [2,8,0,0,12],
      [3,9,0,0,12],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [35, -2, 0, 8, 0, "1-1", 0, 35, 19, 0, 0],
      [-2, 10, -Math.PI / 2, 13, 0, "1-4", 1, 39, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,11,0,,"000000011110011010011110000000000000",8,2],
      [7,11,0,,"0000000001110000111000001100000110000010000000000",18,2],
      [6,11,0,,"000000011000011110001010001110000000",28,2],
      [6,11,0,,"000000011100001110001110001100000000",8,11],
      [6,11,0,,"000000001110001110001110001010000000",18,11],
      [6,11,0,,"000000011110011110001100001000000000",28,11],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Your progress is saved automatically", 35, 9, 1, 0],
    ];
    
    cubes = [
      [11,4],
      [21,15],
    ];
  }
  
  // 1-4 (2D puzzles length 13)
  else if(pagename == "1-4"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [34,11,0,0,18],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "1-3", 0, 1, 10, 0, 0],
      [22, -2, 0, 14, 0, "hub", 1, 28, 19, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [7,13,0,,"0000000000000001111000111100001111000100000000000",2,2],
      [7,13,0,,"0000000001110000101000011100001110000110000000000",14,2],
      [6,13,0,,"000000001110011110011010001110000000",26,2],
      [7,13,0,,"0000000001100000111000011100001110000110000000000",2,11],
      [7,13,0,,"0000000000000001111100101010011111000000000000000",14,11],
      [6,13,0,,"000000011000011100011110011110000000",26,11],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["This is just a training. Head to the north to try a new kind of puzzles!", 34, 3, 13, 1, 0],
    ];
    
    cubes = [
      [17,4],
      [18,7],
      [29,5],
      [27,3],
      [27,6],
      [29,12],
      [30,12],
      [30,13],
      [18,14],
      [16,14],
      [6,12],
      [6,16],
      [7,7],
      [6,7],
      [5,7],
      [3,6],
      [3,7],
      [7,5],
      [7,4],
    ];
  }
  
  // 2-1 (2D puzzle with wrap, length 14)
  else if(pagename == "2-1"){
    
    w = 20;
    h = 20;
    
    // Trees
    trees = [
      [10, 2, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [8, 2, 0, 0, 19],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, 21, Math.PI, 14, 0, "hub", 0, 20, 0, 0, 0],
      [-2, 5, -Math.PI / 2, 15, 0, "2-2", 1, 79, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,14,1,,"0100010011111000000000000000000000001111100100010",7,7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Now you're thinking with wraps!", 2, 2, 0, 14, 0], 
    ];
    
    cubes = [];
    
    for(i = 0; i < 20; i++){
      cubes.push([i, 10]);
    }
  }
  
  // 2-2 (2D puzzle with wrap, length 15, easter egg)
  else if(pagename == "2-2"){
    
    w = 80;
    h = 20;
    
    // Trees
    trees = [
      [35, 10, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 11, 0, 0, 31],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [81, 5, Math.PI / 2, 15, 0, "2-1", 0, 0, 5, 0, 0],
      [-2, 15, -Math.PI / 2, 16, 0, "2-3", 1, 19, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [5,5,1,,"0111101001010110100011111", 59, 13], // J
      [5,5,1,,"1111011000111100001011110", 48, 13],
      [5,5,1,,"1111101000011110111001100", 37, 13],
      [5,5,1,,"1111110000111001000011111", 26, 13],
      [5,5,1,,"1100101101001110011101101", 15, 13],

      [5,5,1,,"1111100001110010000111111", 59, 2], // G
      [5,5,1,,"1000110111100011000111111", 48, 2],
      [5,5,1,,"1000110101101011111110001", 37, 2],
      [5,5,1,,"1111110001000110000111111", 26, 2],
      [5,5,1,,"0111101100011100011011110", 15, 2],

      [5,5,1,,"1111101111001110001100001", 4, 8], // Triangle
      [5,5,1,,"1010100101111010000111111", 71, 8], // Zigouigoui
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["To exit a wrap puzzle, you can either solve it, backtrack, or press R.", 72, 2, 0, 15, 0], 
    ];
    
    cubes = [
      /*[65,15],
      [14,3],
      [41,3],*/
    ];
    
    // TODO: translateX(-16vh) translateY(-202vh) translateZ(-400vh) rotateX(0deg) rotateZ(180deg) + transform-origin
  }
  
  // 2-3 (2D puzzle with wrap, length 16)
  else if(pagename == "2-3"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [5, 25, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 24, 0, 0, 33],
      [7, 25, 0, 0, 33],
      [2, 26, 0, 0, 33],
      [3, 28, 0, 0, 33],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, 31, Math.PI, 20, 0, "2-4", 1, 10, 1, 0, 0],
      [21, 5, Math.PI/2, 20, 0, "2-2", 0, 1, 15, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011000011100111111001110001000", 7, 7],
      [6,16,1,,"110001100001000111000111100001110001", 7, 17],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      
    ];
    
    cubes = [];
  }
  
  // 2-4 (2D puzzle with wrap, length 20)
  else if(pagename == "2-4"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [16, 22],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [18, 22, 0, 0, 35],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [10, -2, 0, 20, 0, "2-3", 0, 10, 29, 0, 0],
      [21, 25, Math.PI/2, 21, 0, "2-5", 1, 1, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011110111111011110011110001000", 7, 7],
      [6,16,1,,"110001100001000011000111001111111111", 7, 17],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      
    ];
    
    cubes = [];
  }
  
  // 2-5 (change snake)
  else if(pagename == "2-5"){
    
    w = 40;
    h = 20;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 2, 0, 5, 0],
    ];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
      [-2, 10, -Math.PI/2, 1, 0, "2-4", 0, 19, 25, 0, 0],
      [36, -2, 0, 6, 0, "hub", 1, 5, 19, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Lil'snake can move up and down with Shift and Ctrl keys, and open black doors", 30, 9, 1, 0],
    ];
    
    cubes = [
      [33, 0],
      [33, 1],
      [33, 2],
      [33, 3],
      [33, 4],
      [34, 4],
      [35, 4],
      [36, 4],
      [37, 4],
      [38, 4],
      [39, 4],
    ];
  }
  
  // 3-1 (3D puzzles, length 6, wall)
  else if(pagename == "3-1"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
    ];
    
    // Puzzles
    puzzles = [
      [5,5,0,"0000000000000000000001110",, 12, 2],
      [4,5,0,"0000000001000110",, 12, 12],
      [5,5,0,"0000000000000000101001110",, 12, 22],
      [5,5,0,"0000000000000000111001000",, 2, 2],
      [4,5,0,"0000001001100100",, 2, 12],
      [5,5,0,"0000000000000000111000100",, 2, 22],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
    ];
    
    cubes = [
    ];
  }
  
  // 3-2 (3D puzzles, length 6, wall + ground)
  else if(pagename == "3-2"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
    ];
    
    // Puzzles
    puzzles = [
      [4,5,0,"0000000001100110","0000011001100000", 7, 7],
      [5,5,0,"0000000100001000010001100","0000000000011000100000000", 7, 7],
      [4,5,0,"0000011001000100","0000010001100000", 7, 7],
      [5,5,0,"0000000000000000111001010","0000000000011000011000000", 7, 7],
      [4,5,0,"0000000001100110","0100011000100000", 7, 7],
      [5,5,0,"0000000000000000010001110","0000000000001100110000000", 7, 7],
      [4,5,0,"0000010001100100","0000011001100000", 7, 7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
    ];
    
    cubes = [
    ];
  }
  
  // 3-3 (3D puzzles, length 8, wall)
  else if(pagename == "3-3"){
    
    w = 30;
    h = 30;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
    ];
    
    // Puzzles
    puzzles = [
      [6,5,0,"000000000000000000000000011110010010",, 7, 7],
      [5,5,0,"0000000000010000110001110",, 7, 7],
      [6,5,0,"000000000000000000000100001110011000",, 7, 7],
      [5,5,0,"0000000000011000111000100",, 7, 7],
      [5,5,0,"0000000000010000111001000",, 7, 7],
      [5,5,0,"0000000000001000111001010",, 7, 7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
    ];
    
    cubes = [
    ];
  }
  
  // 3-4 (3D puzzles, length 8, wall + ground)
  else if(pagename == "3-4"){
    
    w = 30;
    h = 30;
    
    // Trees
    trees = [];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [];
    
    // Doors
    // 0: x,
    // 1: y
    // 2: angle
    // 3: min length
    // 4: min puzzles
    // 5: page to load
    // 6: show door
    // 7: x in new page
    // 8: y in new page
    // 9: z
    // 10: color
    doors = [
    ];
    
    // Puzzles
    puzzles = [
      [4,5,0,"0000000001100110","0000011001100000", 7, 7],
      [4,5,0,"0000001001100110","0000001001100000", 7, 7],
      [5,5,0,"0000000000000000010001110","0000000100001100110000000", 7, 7],
      [4,5,0,"0000011001000100","0000011001100000", 7, 7],
      [5,5,0,"0000000000000000101001110","0000001110010100000000000", 7, 7],
      [5,5,0,"0000000000000000011001100","0000001110011000010000000", 7, 7],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
    ];
    
    cubes = [
    ];
  }
  
  scene.style.width = w * sidesize + "vh";
  scene.style.height = h * sidesize + "vh";
  
  // Draw objects: doors, trees, apples, puzzles, cubes...
  //=====================
  
  objects.innerHTML = "";
  puzzle.innerHTML = "";
  
  // Trees
  for(var i in trees){
    objects.innerHTML += 
    `<div id=tree${i} class="emoji tree" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-8vh)translateY(${trees[i][1]*sidesize+4}vh)rotateX(-75deg)">🌳</div><div id=treeshadow${i} class="emojishadow treeshadow" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-8vh)translateY(${trees[i][1]*sidesize+4}vh)rotateZ(144deg)scaleY(1.5)">🌳`;
  }
  
  // Apples
  for(i in apples){

    // Remove apples already eaten
    if(L[P + "appleeaten" + pagename + i]){      
      delete apples[i];
    }
   
    // Draw apples to eat
    else {
      objects.innerHTML += 
      `<div id=apple${i} class="emoji apple ${L[P + "appleappeared"+pagename+i]?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;transform:translateY(${apples[i][1]*sidesize+4}vh) rotateX(-65deg)">🍎</div><div id=appleshadow${i} class="emojishadow appleshadow ${L[P+"appleappeared"+pagename+i]?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;transform:translateY(${apples[i][1]*sidesize+3}vh)rotateZ(144deg)">🍎`;
    }
  }
  
  // Doors
  for (i in doors){
  objects.innerHTML+=`<div id=door${""+pagename+i} class="door${L[P+"door"+pagename+i]?" open":""}" style="left:${(doors[i][0]+.5)*sidesize}vh;top:${(doors[i][1]+.5)*sidesize}vh;transform:rotateZ(${doors[i][2]}rad)translateZ(${doors[i][9]*sidesize}vh)"><div class="realdoor door${doors[i][10]}" ${doors[i][6]?"":"hidden"}>${doors[i][3]}</div><div class=path>`;
  }
  
  // Cubes

  for(var p in puzzles){
    for(var j in cubes){
      if(
        L[P + "puzzle" + pagename + p]
        && cubes[j][0] >= puzzles[p][5]
        && cubes[j][0] < puzzles[p][5] + puzzles[p][0]
        && cubes[j][1] >= puzzles[p][6]
        && cubes[j][1] < puzzles[p][6] + puzzles[p][0]
      ){
        delete cubes[j];
      }
    }
  }
  for (i in cubes){
    objects.innerHTML+=`<div id=cube${i} class="cube rock" style="left:${cubes[i][0]*sidesize}vh;top:${cubes[i][1]*sidesize}vh;width:7.2vh;height:7.2vh"><div class=front></div><div class=up style="background-position:${-300-cubes[i][0]*sidesize}vh ${-140-cubes[i][1]*sidesize}vh"></div><div class=right></div><div class=left>`;
  }
  
  // Hints
  for (i in hints){
    if(
      // Min size
      (hints[i][3] && hints[i][3] <= snakelength)
      ||
      // Max size
      (hints[i][4] && hints[i][4] >= snakelength)
    ){
      hints[i][4] = 1;
      objects.innerHTML+=`<div id=hint${""+pagename+i} class="hint" style="left:${hints[i][1]*sidesize}vh;transform:translateY(${hints[i][2]*sidesize + 4}vh)rotateX(-70deg)translateY(-4vh)">${hints[i][0]}`;
    }
    else {
      hints[i][4] = 0;
    }
  }
  
  // puzzles
  for(var p in puzzles){
    
    size = puzzles[p][0];
    
    var whtml = '';
    var ghtml = '';
    var html =
    `<div id=puzzle${p} class="cube wrap visible ${(puzzles[p][2]&&!L[P+'puzzle'+pagename+p])?"wrapvisible":""}" style="left:${puzzles[p][5]*sidesize}vh;top:${puzzles[p][6]*sidesize}vh;width:${puzzles[p][0]*sidesize}vh;height:${size*sidesize}vh">${puzzles[p][2]?"<div class=left></div><div class=right></div>":""}<div id=down${p} class=down></div><div id=back${p} class=back></div>${puzzles[p][2]?"<div class=front>":""}`;
    puzzle.innerHTML += html;

    // Not solved (black/white)
    // Solved (blue/gold)
    var color1 = "000", color2 = "fff";
    if(L[P + "puzzle" + pagename + p]){
      color1 = "44c";
      color2 = "fd0";
    }
      
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(puzzles[p][3]){
          whtml += `<div class=cell id=w${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][3][i*size+j]=="1")?color1:color2}'></div>`;
        }
        if(puzzles[p][4]){
          ghtml += `<div class=cell id=g${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][4][i*size+j]=="1")?color1:color2}'></div>`;
        }
      }
    }
    
    if(self["down" + p]){
      self["down" + p].innerHTML += ghtml;
    }
    if(self["back" + p]){
      self["back" + p].innerHTML += whtml;
    }
  }
  
  // Init snake
  
  // Hub's opening cinematic
  if(pagename == "hub" && !L[P + "snakex"]){
    
    if(debug){
      scene.style.transition='transform .8s linear, transform-origin .8s linear';resetsnake();movesnake();snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake();
    }
    
    else{
      
      // Lock controls
      lock = 1;

      // Resize and place snake at the right place, slow it down
      setTimeout('resetsnake();movesnake();snakecubemove0.style.transition="transform .5s"',2000);
      
      // Head goes out of the ground
      setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()",4500);
      
      // Shake head and shadow
      setTimeout("snakecubemove0.style.transition='';snakeshadow0.style.transition=snakecuberotate0.style.transition='transform .2s';snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+-Math.PI/4+"rad)'",5000);
      setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+Math.PI/4+"rad)'",5500);
      setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='';",6000);
      
      // Reset custom transitions and unlock keyboard
      setTimeout("scene.style.transition='transform .8s, transform-origin .8s linear';snakeshadow0.style.transition=snakecuberotate0.style.transition='';lock=0",9000);
    }
  }
  
  // Return to hub, or enter other rooms
  else{
    scene.style.transition = 'transform .8s, transform-origin .8s linear';
    resetsnake();
  }
 
  // Move snake at the right place
  movesnake();
  
},

// Reset the snake's positions and angles and draw it
// if son == 1, draw the son.
resetsnake = noresethistory => {
  
  // Choose container
  var container = snake;
  if(son && !iseditor) container = snake2;
  
  // Delete the snake
  container.innerHTML = "";
      
  if(!noresethistory){
    
    // Reset positions & angles
    snakex = [];
    snakey = [];
    snakez = [];
    snakeangle = [];
  }
  
  // Compute cubes sizes in vh (editor only)
  if(iseditor){
    sidesize = 32 / size;
  }
  
  head = snakelength - 1;
  
  if(!noresethistory){
    
    // Editor
    if(iseditor){
      for(i = 0; i < snakelength; i++){
        snakex[head - i] = -i - 1;
        snakey[head - i] = ~~(size/2);
        snakez[head - i] = 0;
        snakeangle[head - i] = -Math.PI/2;
      } 
    }
    
    // Game
    else if(L[P + "snakex"]){
      var x = +L[P + "snakex"];
      var y = +L[P + "snakey"];
      var z = +L[P + "snakez"];
      
      // Son start
      if(pagename == "2-5" && easteregg && son == 1){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = 20;
          snakey[head - i] = 10;
          snakez[head - i] = -i - 1;
          snakeangle[head - i] = 0;
        }
      }
        
      // Arrive from left
      else if(x < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x - i;
          snakey[head - i] = y;
          snakez[head - i] = z;
          snakeangle[head - i] = -Math.PI / 2;
        }
      }
      
      // Arrive from right
      else if(x > w - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x + i;
          snakey[head - i] = y;
          snakez[head - i] = z;
          snakeangle[head - i] = Math.PI / 2;
        }
      }
      
      // Arrive from top
      else if(y < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x;
          snakey[head - i] = y - i;
          snakez[head - i] = z;
          snakeangle[head - i] = 0;
        }
      }
      
      // Arrive from bottom
      else if(y > h - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x;
          snakey[head - i] = y + i;
          snakez[head - i] = z;
          snakeangle[head - i] = 0;
        }
      }
      
      // Other
      else {
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = 20;
          snakey[head - i] = 10;
          snakez[head - i] = -i;
          snakeangle[head - i] = 0;
        }
      }
    }
      
    // Game start
    else {
      if(b.className == "hub"){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = 20;
          snakey[head - i] = 10;
          snakez[head - i] = -i - 1;
          snakeangle[head - i] = 0;
        }
      }
    }   
  }
  
  // Draw 16 snake cubes (or more if snalelength is > 16) and hide them below the ground
  // The first one (the head) has a tongue (Y), mouth (‿) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 5 * div (the bottom div is useless)
  for(i = 0; i < Math.max(snakelength + 4, 16); i++){
    container.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style="transform:translateX(50vh)translateY(50vh)translateZ(-30vh);width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake" id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=front>${i<1?"‿":""}</div><div class=up style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=right></div><div class=left></div><div class=back>`;
  }
},


// Onload
index = () => {
  
  // Go to the last saved room (or hub by default)
  pagename = L[P + "page"] || "hub";
  
  // Draw html structure
  document.body.outerHTML =
`<body id=b class="${pagename}"><div id=perspective><div id=scene style="transform:translateX(-140vh)translateY(-72vh)rotateZ(90deg)translateZ(119vh);transform-origin:142vh 72vh"><div id=objects></div><div id=puzzle></div><div id=snake></div><div id=snake2></div>

</div></div>
<center id=text style=font:5vh'arial';color:#fff;position:fixed;bottom:9vh;left:0;width:100vw></center>
<div style="position:fixed;bottom:5px;left:5px;width:700px">
<button style="width:30px";float:none onclick="rot+=Math.PI/4;move_scene()">↻</button>
<button style="width:30px;float:none" onclick="rot-=Math.PI/4;move_scene()">↺</button>
<button style="width:30px;float:none" onclick="L.clear()">clear</button>


Room
<button style="width:30px;float:none" onclick="L[P+'snakelength']=8;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='hub';location=location">hub</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=8;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='1-1';location=location">1-1</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=11;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='1-3';location=location">1-3</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=13;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='1-4';location=location">1-4</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=14;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='2-1';location=location">2-1</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=15;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='2-2';location=location">2-2</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=16;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='2-3';location=location">2-3</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=20;L[P+'snakex']=L[P+'snakey']=19;L[P+'snakez']=0;L[P+'page']='2-4';location=location">2-4</button>
<button style="width:30px;float:none" onclick="L[P+'snakelength']=21;L[P+'snakex']=L[P+'snakey']=1;L[P+'snakez']=0;L[P+'page']='2-5';location=location">2-5</button>
<button style="width:30px;float:none" onclick="L[P+'son']=1;L[P+'snakelength']=6;L[P+'snakex']=L[P+'snakey']=16;L[P+'snakez']=0;L[P+'page']='hub';location=location">hub2</button>
`;
  
  // Disable cinematics (debug only)
  debug = 1;
  
  // Make the first apple appear (when the game starts only)
  L[P + "appleappearedhub0"] = 1;
  
  // Enter room
  enterroom();
},

// Editor
// All the editor features
editor = () => {
  
  // Startup
  currentpuzzle = 0;
  iseditor = 1;
  puzzles = [[5,5,0,0,0,0,0]];
  
  // Set default values to the form
  gridsize.value = snakesize.value = snakelength = 5;
  ground.checked = true;
  hasground = 1;
  if(self.wall)wall.checked = false;
  if(self.wrap)wrap.checked = false;

  // Puzzle (ground/wall) checkboxes can't be both disabled
  onclick = e => {
    if(ground.checked){
      hasground = 1;
    }
    else if(self.wall){
      hasground = 0;
      haswall = 1;
      wall.checked = true;
    }
    
    if(self.wall && wall.checked){
      haswall = 1;
    }
    else {
      haswall = 0;
      hasground = 1;
      ground.checked = true;
    }

    haswrap = puzzles[3] = self.wrap && wrap.checked;
  }

  // Data arrays for wall and ground puzzle
  dw = [];
  dg = [];
    
  // Reset and resize the snake (when the snake size range changes)
  snakesize.onchange =
  snakesize.oninput = e => {
    
    // Update range indicator
    snakeval.innerHTML = snakelength = +snakesize.value;
    resetsnake();
    movesnake();
  }
  
  // Editor
  
  // Grids size (in numbers of cells squared)
  size = 5;
  
  // Resize the grid
  // Called on load, on reset and when the grid size input is changed
  // This also resizes the snake (so it can fit in the cells)
  (reset.onclick =
  gridsize.onchange =
  gridsize.oninput =
  resizegrid = e => {
    
    // Update range indicator (z = value)
    gridval.innerHTML = size = +gridsize.value;
    puzzles[0][1] = size;
 
    // Compute cells size (in %)
    var cellsize = 100 / size;
    
    // Reset grids (html and data)
    down.innerHTML = '';
    back.innerHTML = '';
    whtml = '';
    ghtml = '';
    dw = [];
    dg = [];
    for(i = 0; i < size; i++){
      dw[i] = [];
      dg[i] = [];
      for(j = 0; j < size; j++){
        dw[i][j] = 0;
        dg[i][j] = 0;
      }
    }
    
    // Fill grids HTML
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        whtml += `<div class=cell id=w${cellprefix}-${i}-${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,0)' onmousemove='paint(${i},${j},this,0,1)'></div>`;
        ghtml += `<div class=cell id=g${cellprefix}-${i}-${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,1)' onmousemove='paint(${i},${j},this,1,1)'></div>`;
      }
    }
    down.innerHTML += ghtml;
    back.innerHTML += whtml;
    
    // Resize and place snake at the right place
    resetsnake();
    movesnake();
  })()
  
  // Initialize the grid (with size 5)
  
  // On click on a call, toggle its color
  // On mousedown + mousemove, paint it in black
  // Params: i, j (coords), this (current cell), ground (1 = ground, 0 = wall), force (1 = mousemove, 0 = click)
  paint = (i,j,t,g,f) => {
    
    // Do nothing in playing mode 
    if(playing) return;
    
    // Choose ground or wall
    var d = g ? dg : dw;
    
    // Force
    if(f && mousedown) d[i][j] = 1;
    
    // Toggle
    if(!f) d[i][j] ^= 1;
    
    // Update CSS
    t.style.background = d[i][j] ? "#000" : "#fff";
  };

  
  // Share a puzzle
  // Generates an url with the hash "#gridsize,snakesize,wrap,wall,ground".
  print = a => {
    var r = "";
    for(i in a){
      for(j in a[i]){
        r += a[i][j];
      }
    }
    return r;
  }

  share.onclick = () => {
    var r = [];
    r.push(size)
    r.push(snakesize.value);
    r.push(self.wrap && wrap.checked ? 1 : 0);
    r.push(self.wall && wall.checked ? print(dw) : '')
    r.push(ground.checked ? print(dg) : '')
    prompt("URL:", location + "#" + r);
  }
  
  // Mouse inputs
  // update mousedown flag
  mousedown = 0;
  onmousedown = e => {
    mousedown = 1;
  }
  
  onmouseup = e => {
    mousedown = 0;
  }
  
  // Ignore all drag events
  ondragstart = e => {
    e.preventDefault();
  }

  // playing
  playing = puzzling = 0;
  test.onclick = e => {
    playing = puzzling = 1;
    b.className = "editor playing";
  }
  
  // Quit
  quit.onclick = () => {
    
    // Quit playing
    if(playing){
      playing = puzzling = 0;
      b.className = "editor";
      resetsnake();
      movesnake();
      checkgrid();
    }
    
    // Quit editor
    else {
      location = "index.html"
    }
  }
  
  // DEBUG
  
  // Camera rotation
  (move_scene = () => {
    scene.style.transform = "rotateX(38deg)translateX(-18vh)rotateZ(" + rot + "rad)";
  })();
}