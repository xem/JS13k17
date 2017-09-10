// GLOBALS
// =======

var 

// Debug
//=======

// Rotate camera
move_scene = (rot) => {
  s.style.transform = "translateX(-"+(snakex[head]*sidesize)+"vh)translateY(-"+(snakey[head]*sidesize)+"vh)translateZ(15vh)rotateX(40deg)rotateZ(" + rot + "rad)";
},

// Meta
//=======

L = localStorage,
P = "lossst_",
easteregg = 0,
son = +L[P+"s"] || 0,
mobile = +L[P+"m"] || 0,
ocd_time = +L[P+"t"] || 0,
ocd_moves = +L[P+"M"] || 0,
int_time = 0,
touchintervals = [],

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
snakelength = L[P+"S"] = +L[P+"S"] || 5,

// Game
//=======

// Are we in the editor
iseditor = 0,

// Playing (0: editor / 1: in-game)
playing = 1,

// Playing a puzzle
puzzling = 0,

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace/alt
u = r = d = l = n = c = B = 0,

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

// Emoji
emoji = [],

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
totalsolved = +L[P+"T"] || 0,
exithead = 0,
inbounds = 0,

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
  
  // Macintosh hack
  if(navigator.userAgent.indexOf("Maci") > -1){
    V.className = "M";
  }
  
  // Fx hack
  if(navigator.userAgent.indexOf("Firefox") > -1){
    V.className = "f";
  }
  
  // Mobile hacks
  if(mobile){
    V.className = "M";
  }
  
  // Set room name to the body
  b.className = pagename;
  
  
  // Empty father container if son returns to hub
  if(son && !iseditor){
    S.innerHTML = "";
  }
  
  if(pagename == "_l"){
    w = 20;
    h = 20;
    trees = [];
    apples = [];
    doors = [];
    cubes = [];
    puzzles = [eval("["+(location.hash.slice(1).replace(/[01]{2,}/g,'"$&"'))+"]")];
    snakelength = puzzles[0][1];
    puzzles[0][5] = puzzles[0][6] = 8; 
    son = !!puzzles[0][3];
    hints = [
      ["Move: arrow keys<br>"+(son?"Up/Down: Shift/Ctrl<br>":"")+"backtrack: Alt<br>Reset: R", 1, 5, 1, 0, son, 0],
    ];
    if(L[P+"pl0"]) delete L[P+"pl0"];
    L[P+"dl0"] = 1;
  }
  
  // Hub (start, tuto, access to 2D, wrap and 3D puzzles)
  // ----
  else if(pagename == "_h"){
  
    w = 40;
    h = 20;
    
    // Trees (x, y, z)
    trees = [
      [13,9,0],
      [7,13,0],
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
    // 10: color (0: orange / 1: black)
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "A", 1, 0, 10, 0, 0],
      [20, -2, 0, 14, 0, "D", 1, 10, 19, 0, 0],
      [-2, 11, -Math.PI / 2, 6, 0, "J", 1, 14, 5, 1, 1],
      [28, 21, Math.PI, 14, 0, "C", 1, 22, 1, 0, 0],
      [5, 21, Math.PI, 5, 0, "I", 1, 36, 1, 0, 1],
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
    // 5: son?
    // 6: z
    hints = [
      ["Move with<br>arrow keys" + (mobile ? "" : " or WASD/ZQSD"), 19, 5, 0, 13, 0],
      ["Use the " + (mobile ? "↩" : "Alt") + " key to backtrack", 1, 9, 0, 13, 0, 1],
      ["Doors indicate the snake size required to open them", 35, 14, 0, 13, 0],
      ["2D puzzle editor<br>↓", 18, 8, 14, 0, 0],
      ["↑<br>New puzzles!", 22, 3, 14, 0, 0],
      ["New ! Puzzle editor with wraps<br>↓", 19, 8, 6, 7, 1],
      ["←<br>New puzzles!", 1, 9, 6, 7, 1, 1],
      ["Full puzzle editor (2D, 3D & wraps!)<br>↓", 19, 8, 7, 0, 1],
    ];
    
    emoji = [
      ["🐿️", 37, 7],
    ];
    
  }
  
  // A = 1-1 (puzzles 2D length 8)
  // Puzzles solved before: 0
  // Puzzles solved after: 6
  // ----
  
  else if(pagename == "_A"){
      
    w = 40;
    h = 20;
    
    // Trees
    trees = [
      [35,15,0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [33,16,0,0,6],
      [34,17,0,0,6],
      [37,15,0,0,6],
    ];
    
    cubes = [
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
      [-2, 10, -Math.PI / 2, 8, 0, "_h", 0, 39, 11, 0, 0],
      [35, 21, Math.PI, 11, 0, "_B", 1, 35, 1, 0, 0]
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
      ["Cover the black shapes to solve puzzles", 9, 9, 1, 0],
      ["Solve all the puzzles in the room to get new apples and open a new door", 21, 9, 1, 0],
      ["Your progress is saved automatically", 34, 9, 1, 0],
    ];
    
    emoji = [
      ["🐌", 11, 10],
    ]
    
  }
  
  // B = 1-3 (puzzles 2D length 11)
  // Puzzles solved before: 6
  // Puzzles solved after: 12
  // ----
  
  else if(pagename == "_B"){
    
    // Show mobile button Reset
    if(mobile){
      q.className = "";
      L[P+"r"] = 1;
    }
    
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
      [35, -2, 0, 8, 0, "_A", 0, 35, 19, 0, 0],
      [-2, 10, -Math.PI / 2, 13, 0, "_C", 1, 39, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,11,0,,"000000011110011010011110000000000000",8,2],
      [7,11,0,,"0000000001110000111000001100000110000010000000000",18,2],
      [6,11,0,,"000000011000011110001010001110000000",28,2],
      [6,11,0,,"000000011100001110001110001100000000",8,12],
      [6,11,0,,"000000001110001110001110001010000000",18,12],
      [6,11,0,,"000000011110011110001100001000000000",28,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["If you get stuck, " + (mobile ? "click ×" : "press R") + " to exit a puzzle", 35, 11, 1, 0],
      ["If a puzzle looks impossible, try another entry!", 14, 10, 1, 0],
    ];
    
    cubes = [
      [11,4],
      [21,16],
    ];
    
    emoji = [
      ["🐈", 4, 14],
    ]
  }
  
  // C = 1-4 (2D puzzles length 13)
  // Puzzles solved before: 12
  // Puzzles solved after: 18
  else if(pagename == "_C"){
    
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
      [41, 10, Math.PI / 2, 8, 0, "B", 0, 1, 10, 0, 0],
      [22, -2, 0, 14, 0, "_h", 1, 28, 19, 0, 0]
    ];
    
    // Puzzles
    puzzles = [
      [7,13,0,,"0000000000000001111000111100001111000100000000000",2,3],
      [7,13,0,,"0000000001110000101000011100001110000110000000000",14,3],
      [6,13,0,,"000000001110011110011010001110000000",26,4],
      [7,13,0,,"0000000001100000111000011100001110000110000000000",2,12],
      [7,13,0,,"0000000000000001111100101010011111000000000000000",14,12],
      [6,13,0,,"000000011000011100011110011110000000",26,12],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["↑<br>After this room, go north to test a puzzle editor and a new kind of puzzles!", 22, 11, 13, 0, 0],
    ];
    
    cubes = [
      [17,5],
      [18,8],
      [29,7],
      [27,5],
      [27,8],
      [29,13],
      [30,13],
      [30,14],
      [18,15],
      [16,15],
      [6,13],
      [6,17],
      [7,8],
      [6,8],
      [5,8],
      [3,7],
      [3,8],
      [7,6],
      [7,5],
    ];
    
    emoji = [
      ["🦋<br><br>", 29, 13],
    ]
  }
  
  // D = 2-1 (2D puzzle with wrap, length 14)
  // Puzzles solved before: 18
  // Puzzles solved after: 19
  else if(pagename == "_D"){
    
    w = 20;
    h = 20;
    
    // Trees
    trees = [
      [10, 2, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
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
      [10, 21, Math.PI, 14, 0, "_h", 0, 20, 0, 0, 0],
      [-2, 5, -Math.PI / 2, 14, 0, "E", 0, 24, 12, 0, 0],
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
    
    emoji = [
      ["🐐", 12, 2],
    ]
  }
  
  // E: 2-15 (2D, wrap, length 14)
  // Puzzles solved before: 19
  // Puzzles solved after: 23
  else if(pagename == "_E"){
    
    w = 25;
    h = 25;
    
    // Trees
    trees = [
      [5, 12, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 14, 0, 0, 23],
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
      [26, 12, Math.PI / 2, 14, 0, "D", 0, 0, 5, 0, 0],
      [-2, 12, -Math.PI / 2, 15, 0, "F", 1, 79, 5, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [7,14,1,,"1000001000000000000000010100011011011000111000001", 15, 3],
      [6,14,1,,"110011100001000000100001100001110011", 15, 17],
      [5,14,1,,"1100111001100011001110011", 3, 3],
      [6,14,1,,"000011000011110001110001000011000011", 3, 17],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["Reminder:<br>use " + (mobile ? "↩" : "Alt") + " to backtrack,<br>" + (mobile ? "×" : "R") + " to exit a puzzle.", 11, 12, 1, 0, 0], 
    ];
    
    cubes = [
    ];
    
    emoji = [
      ["🐒", 12, 20],
    ]
    
  }
  
  // F = 2-2 (2D puzzle with wrap, length 15, easter egg)
  // Puzzles solved before: 23
  // Puzzles solved after: 35
  else if(pagename == "_F"){
    
    w = 80;
    h = 20;
    
    // Trees
    trees = [
      [35, 10, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [38, 11, 0, 0, 35],
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
      [81, 5, Math.PI / 2, 15, 0, "E", 0, 0, 12, 0, 0],
      [-2, 15, -Math.PI / 2, 16, 0, "G", 1, 19, 5, 0, 0],
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
      ["This room hides a surprise!", 72, 2, 0, 15, 0],
    ];
    
    cubes = [];
    
    emoji = [];
    
  }
  
  // G = 2-3 (2D puzzle with wrap, length 16)
  // Puzzles solved before: 35
  // Puzzles solved after: 37
  else if(pagename == "_G"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [5, 25, 0],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [4, 24, 0, 0, 37],
      [7, 25, 0, 0, 37],
      [2, 26, 0, 0, 37],
      [3, 28, 0, 0, 37],
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
      [10, 31, Math.PI, 16, 0, "H", 1, 10, 1, 0, 0],
      [21, 5, Math.PI/2, 16, 0, "F", 0, 1, 15, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011000011100111111001110001000", 7, 6],
      [6,16,1,,"110001100001000111000111100001110001", 7, 18],
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
    
    emoji = [
      ["🐁", 9, 14],
    ];
  }
  
  // H = 2-4 (2D puzzle with wrap, length 20)
  // Puzzles solved before: 37
  // Puzzles solved after: 39
  else if(pagename == "_H"){
    
    w = 20;
    h = 30;
    
    // Trees
    trees = [
      [16, 22],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [18, 22, 0, 0, 39],
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
      [10, -2, 0, 20, 0, "G", 0, 10, 29, 0, 0],
      [21, 25, Math.PI/2, 21, 0, "I", 1, 1, 10, 0, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,16,1,,"001000011110111111011110011110001000", 7, 6],
      [6,16,1,,"110001100001000011000111001111111111", 7, 18],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [];
    
    emoji = [
      ["🦆", 9, 14],
    ];
  }
  
  // I = 2-5 (change snake)
  // Puzzles solved before: 39
  // Puzzles solved after: 39
  else if(pagename == "_I"){
    
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
      [-2, 10, -Math.PI/2, 1, 0, "H", 0, 19, 25, 0, 0],
      [36, -2, 0, 6, 0, "_h", 1, 5, 19, 0, 1],
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
      ["Guess what, you finished the first half of the game!", 5, 9, 1, 0],
      ["Little snake can move up and down with " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl keys") + ", and open black doors", 30, 9, 1, 0],
    ];
    
    cubes = [];
    
    for(i=0;i<7;i++) cubes.push([31, i]);
    for(i=31;i<40;i++) cubes.push([i, 6]);
    
    emoji = [
      ["🐢", 13, 14],
    ]
  }
  
  // J = 3-1 (3D puzzles, length 6, wall and wall+gtound)
  // Puzzles solved before: 39
  // Puzzles solved after: 47
  else if(pagename == "_J"){
    
    w = 15;
    h = 70;
    
    // Trees
    trees = [
      [2, 62],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [2, 65, 0, 0, 47],
      [1, 66, 0, 0, 47],
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
      [16, 5, Math.PI / 2, 6, 0, "_h", 0, 1, 11, 0, 1],
      [-2, 65, -Math.PI / 2, 8, 0, "K", 1, 19, 65, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      // Wall
      [5,5,0,"0000000000000000000001110",, 2, 2],
      [4,5,0,"0000000001000110",, 4, 11],
      [5,5,0,"0000000000000000101001110",, 6, 20],
      [5,5,0,"0000000000000000111000100",, 8, 29],
      
      // Wall + ground
      [4,5,0,"0000000001100110","0000011001100000", 2, 38],
      [4,5,0,"0000010001100100","0000011001100000", 4, 47],
      [4,5,0,"0000011001000100","0000010001100000", 6, 56],
      [4,5,0,"0000000001100110","0100011000100000", 8, 65],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [
      ["You now have to match the patterns on the walls...", 10, 2, 1, 0, 1],
      ["... and on the floor too!", 10, 40, 1, 0, 1],
    ];
    
    cubes = [ ];
    
    emoji = [
      ["🦉", 10, 14],
    ]
  }
  
  // K = 3-3 (3D puzzles, length 8, wall and full and wrap)
  // Puzzles solved before: 47
  // Puzzles solved after: 59
  else if(pagename == "_K"){
    
    // Show mobile button Reset
    if(mobile){
      m.className = Q.className = "";
      L[P+"c"] = 1;
    }

    w = 20;
    h = 75;
    
    // Trees
    trees = [
      [2, 2],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 4, 0, 0, 59],
      [2, 5, 0, 0, 59],
      [3, 6, 0, 0, 59],
      [4, 2, 0, 0, 59],
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
      [21, 65, Math.PI / 2, 7, 0, "J", 0, 1, 65, 0, 1],
      [-2, 5, -Math.PI / 2, 12, 0, "L", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
    
      // Wall
      [5,5,0,"0000000000010000110001110",, 8, 69],
      [6,5,0,"000000000000000000000100001110011000",, 12, 58],
      [5,5,0,"0000000000010000111001000",, 2, 58],
      
      // Wall + ground
      [4,5,0,"0000001001100110","0000001001100000", 2, 45],
      [5,5,0,"0000000000000000010001110","0000000100001100110000000", 12, 45],
      [5,5,0,"0000000000000000101001110","0000001110010100000000000", 2, 34],
      [5,5,0,"0000000000000000011001100","0000001110011000010000000", 12, 34],
      
      // Wrap      
      [4,5,1,"0000011001100110","0110000000000110", 2, 22],
      [4,5,1,"1001000000001001","1001000000001001", 12, 22],
      [4,5,1,"0000010011110010","0000111101100000", 2, 12],
      [4,5,1,"0110010000000011","0000011100110000", 12, 12],
      [4,5,1,"1101000000000001","1101000000010001", 12, 2],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    // 5: son
    hints = [
      ["You can rotate the camera with " + (mobile ? "<br>↻ and ↺" : "the keys 1, 2 and 3"), 15, 68, 1, 0, 1],
      ["Can you imagine what's coming next?", 7, 54, 1, 0, 1],
      ["Yep... 3D puzzles with wrap! Use " + (mobile ? "⬆︎ and ⬇︎" : "Shift and Ctrl") + " to wrap between top and bottom", 7, 24, 1, 0, 1],
    ];
    
    cubes = [ ];
    
    emoji = [
      ["🐞", 3, 70],
    ]
  }


  // L = 3-6 (3D puzzles, length 12, all kinds)
  // Puzzles solved before: 59
  // Puzzles solved after: 68
  else if(pagename == "_L"){
    
    w = 15;
    h = 80;
    
    // Trees
    trees = [
      [2, 70]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [1, 73, 0, 0, 68],
      [3, 75, 0, 0, 68],
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
      [16, 5, Math.PI / 2, 12, 0, "K", 0, 1, 5, 0, 1],
      [-2, 75, -Math.PI / 2, 14, 0, "M", 1, 14, 25, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      
      // Wall
      [5,5,0,"0000000000001001111100100",, 2, 2],
      [4,5,0,"0000010001100000",, 5, 11],
      [5,5,0,"0000000110000110111000010",, 8, 20],
      
      // Wall + ground
      [5,5,0,"0000000000001000111011111","0000000000111001111100000", 2, 29],
      [4,5,0,"1000110011101111","0000001111110000", 5, 38],
      [4,5,0,"0000100011001110","1110110010000000", 8, 45],
      
      // Wrap
      [4,5,1,"1000100110010001","0000100110010000", 2, 54],
      [4,12,1,"0000001011110100","0000110011110011", 5, 63],
      [5,12,1,"0100011000010000111001000","0000001110110000100000000", 8, 72],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [
      [6, 12],
    ];
    
    emoji = [
      ["🐝", 3, 20],
    ];
  }
  
  // M = 3-7 (3D puzzles, length 14, all kinds)
  // Puzzles solved before: 68
  // Puzzles solved after: 71
  else if(pagename == "_M"){
    
    w = 15;
    h = 30;
    
    // Trees
    trees = [
      [10,12]
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [8, 11, 0, 0, 71],
      [9, 10, 0, 0, 71],
      [10, 9, 0, 0, 71],
      [11, 10, 0, 0, 71],
      [12, 11, 0, 0, 71],
      [13, 12, 0, 0, 71],
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
      [16, 25, Math.PI / 2, 14, 0, "L", 0, 1, 75, 0, 1],
      [-2, 5, -Math.PI / 2, 20, 0, "N", 1, 14, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [5,14,1,"0001100110011001100010000","0001100110011001100010000", 2, 24],
      [5,5,1,"1100010001000011000111000","0000011000110010000000000", 4, 13],
      [5,5,1,"1101110001000001000011000","1100010000000001000111011", 6, 2],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [ ];
    
    emoji = [
      ["🐓", 1, 14],
    ];
  }
  
  // N = 3-8 (3D puzzles, length 20, wrap)
  // Puzzles solved before: 71
  // Puzzles solved after: 75
  else if(pagename == "_N"){
    
    w = 15;
    h = 48;
    
    // Trees
    trees = [
      [10, 44],
    ];
    
    // Apples (x, y, z, length, puzzles solved) 
    apples = [
      [7, 45, 0, 0, 75],
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
      [16, 5, Math.PI / 2, 20, 0, "M", 0, 1, 5, 0, 1],
    ];
    
    // Puzzles
    puzzles = [
      [4,20,1,"0000111101101111","1000111111111000", 5, 38],
      [4,20,1,"1111001001001111","1111101010101111", 5, 28],
      [4,20,1,"1111010101011101","0001101101101111", 5, 18],
      [4,20,1,"1111000100011110","1111110110011111", 5, 8],
    ];
    
    // Hints
    // 0: Message
    // 1: x
    // 2: y
    // 3: min snake length
    // 4: max snake length
    hints = [ ];
    
    cubes = [ ];
    
    emoji = [
      ["🐉", 13, 46],
    ];
  }
  
  s.style.width = w * sidesize + "vh";
  s.style.height = h * sidesize + "vh";
  
  // Draw objects: doors, trees, apples, puzzles, cubes...
  //=====================
  
  o.innerHTML = "";
  pp.innerHTML = "";
  
  // Trees
  for(var i in trees){
    o.innerHTML += 
    `<div id=t${i} class="e u" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-9vh)translateY(${trees[i][1]*sidesize+4}vh)rotateX(-75deg)">🌳</div><div id=u${i} class="q x" style="left:${trees[i][0]*sidesize}vh;transform:translateX(-9vh)translateY(${trees[i][1]*sidesize+4}vh)rotateZ(144deg)scaleY(1.5)">🌳`;
  }
  
  // Apples
  for(i in apples){

    // Remove apples already eaten
    if(L[P+"a" + pagename + i]){      
      delete apples[i];
    }
   
    // Draw apples to eat
    else {
      o.innerHTML += 
      `<div id=a${i} class="e a ${L[P+"A"+pagename+i]?"":"d"}" style="left:${apples[i][0]*sidesize}vh;transform:translateY(${apples[i][1]*sidesize+4}vh) rotateX(-65deg)">${pagename=="N"?"<div>⚽</div>":"<div class=E>🍎</div>"}</div><div id=A${i} class="q A ${L[P+"A"+pagename+i]?"":"d"}" style="left:${apples[i][0]*sidesize}vh;transform:scaleX(-1)translateY(${apples[i][1]*sidesize+3}vh)rotateZ(212deg)">${pagename=="N"?"⚽":"🍎"}`;
    }
  }
  
  // Emoji
  for(i in emoji){
   
    // Draw apples to eat
    o.innerHTML += 
    `<div class="e n" style="left:${emoji[i][1]*sidesize}vh;transform:translateY(${emoji[i][2]*sidesize+4}vh) rotateX(-65deg)"><div class=E>${emoji[i][0]}</div></div><div class="q N" style="left:${emoji[i][1]*sidesize}vh;transform:scaleX(-1)translateY(${emoji[i][2]*sidesize+3}vh)rotateZ(212deg)">${emoji[i][0]}`;
  }
  
  // Doors
  for (i in doors){
  o.innerHTML+=`<div id=d${""+pagename+i} class="d ${L[P+"d"+pagename+i]?"o":""}" style="left:${(doors[i][0]+.5)*sidesize}vh;top:${(doors[i][1]+.5)*sidesize}vh;transform:rotateZ(${doors[i][2]}rad)translateZ(${doors[i][9]*sidesize}vh)"><div class="r d${doors[i][10]}">${doors[i][3]}</div><div class=p>`;
  }
  
  // Cubes

  for(var p in puzzles){
    for(var j in cubes){
      if(
        L[P+"p" + pagename + p]
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
    o.innerHTML+=`<div id=cube${i} class="c k" style="left:${cubes[i][0]*sidesize}vh;top:${cubes[i][1]*sidesize}vh;width:7.2vh;height:7.2vh"><div class=F></div><div class=U style="background-position:${-300-cubes[i][0]*sidesize}vh ${-140-cubes[i][1]*sidesize}vh"></div><div class=R></div><div class=left>`;
  }
  
  // Hints
  for (i in hints){
    
    if(!(son ^ hints[i][5])){
    // => if((son && hints[i][5]) || (!son && !hints[i][5])){
      
      if(
        // Min size
        (hints[i][3] && hints[i][3] <= snakelength)
        ||
        // Max size
        (hints[i][4] && hints[i][4] >= snakelength)
      ){
        //hints[i][4] = 1;
        o.innerHTML+=`<div id=h${""+pagename+i} class=h style="left:${hints[i][1]*sidesize+1}vh;transform:translateY(${hints[i][2]*sidesize+4}vh)translateZ(${(hints[i][6]*sidesize||0)}vh)rotateX(-70deg)translateY(-4vh)">${hints[i][0]}</div>`;
      }
    }
  }
  
  // puzzles
  for(var p in puzzles){
    
    size = puzzles[p][0];
    
    var whtml = '';
    var ghtml = '';
    var html =
    `<div id=p${p} class="c w v ${(puzzles[p][2]&&!L[P+"p"+pagename+p])?"W":""}" style="left:${puzzles[p][5]*sidesize}vh;top:${puzzles[p][6]*sidesize}vh;width:${puzzles[p][0]*sidesize}vh;height:${size*sidesize}vh">${puzzles[p][2]?"<div class=L></div><div class=R></div>":""}<div id=D${p} class=D></div><div id=B${p} class=B></div>${puzzles[p][2]?"<div class=F>":""}`;
    p.innerHTML += html;

    // Not solved (black/white)
    // Solved (blue/gold)
    var color1 = "000", color2 = "fff";
    if(L[P+"p" + pagename + p]){
      color1 = "44c";
      color2 = "fd0";
    }
      
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(puzzles[p][3]){
          whtml += `<div class=C id=w${p}${i}${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][3][i*size+j]=="1")?color1:color2}'></div>`;
        }
        if(puzzles[p][4]){
          ghtml += `<div class=C id=g${p}${i}${j} style='width:${sidesize}vh;height:${sidesize}vh;background:#${(puzzles[p][4][i*size+j]=="1")?color1:color2}'></div>`;
        }
      }
    }
    
    if(self["D" + p]){
      self["D" + p].innerHTML += ghtml;
    }
    if(self["B" + p]){
      self["B" + p].innerHTML += whtml;
    }
  }
  
  // The end
  if(pagename == "_N"){
    o.innerHTML += "<div style='position:fixed;transform:rotateZ(-90deg)translateX(-113vh)translateY(22vh)translateZ(317vh);font:30vh/30vh a'>THE<br><br>END";
  }
  
  // Init snake
  
  // Hub's opening cinematic
  if(pagename == "_h" && !L[P+"x"]){
      
    // Lock controls
    lock = 1;

    // Resize and place snake at the right place, slow it down
    setTimeout('resetsnake();movesnake();M0.style.transition="transform .5s"',2000);
    
    // Head goes out of the ground
    setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()",4500);
    
    // Shake head and shadow
    setTimeout("M0.style.transition='';S0.style.transition=R0.style.transition='transform .2s';S0.style.transform=R0.style.transform='rotateZ("+-Math.PI/4+"rad)'",5000);
    setTimeout("S0.style.transform=R0.style.transform='rotateZ("+Math.PI/4+"rad)'",5500);
    setTimeout("S0.style.transform=R0.style.transform=''",6000);
    
    // Reset custom transitions, unlock keyboard, show mobile controls
    setTimeout(`b.innerHTML+="<div style='position:fixed;font:8vh a;top:3vh;right:3vh' onclick=location=location>×";s.style.transition='transform 1s,transform-origin 1s';S0.style.transition=R0.style.transition='';lock=0;L[P+"x"]=20;L[P+"y"]=10;if(mobile){U.className=D.className=F.className=R.className='';L[P+"w"]=1}`,9000);
  }
  
  // Return to hub, or enter other rooms
  else{
    s.style.transition = 'transform 1s,transform-origin 1s';
    resetsnake();
  }
 
  // Move snake at the right place
  movesnake();
  
},

// Reset the snake's positions and angles and draw it
// if son == 1, draw the son.
resetsnake = noresethistory => {
  
  // Choose container
  var container = (son && !iseditor) ? N : S;
  
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
    
    // Load
    if(pagename == "_l"){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = 1 - i;
        snakey[head-i] = 10;
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      }
    }
    
    // Editor
    else if(iseditor){
      for(i = 0; i < snakelength; i++){
        snakex[head-i] = -i - 1;
        snakey[head-i] = ~~(size/2);
        snakez[head-i] = 0;
        snakeangle[head-i] = -Math.PI/2;
      } 
    }
    
    // Game
    else if(L[P+"x"]){
      var x = +L[P+"x"];
      var y = +L[P+"y"];
      var z = +L[P+"z"];
      
      // Return to hub from J = 3-1: z = 1
      if(pagename == "_h" && snakex < 2){
        z = L[P+"z"] = 1;
      }
      
      // Son start
      if(pagename == "_I" && easteregg && son == 1){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
        
      // Arrive from left
      else if(x < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x - i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = -Math.PI / 2;
        }
      }
      
      // Arrive from right
      else if(x > w - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x + i;
          snakey[head-i] = y;
          snakez[head-i] = z;
          snakeangle[head-i] = Math.PI / 2;
        }
      }
      
      // Arrive from top
      else if(y < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y - i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Arrive from bottom
      else if(y > h - 2){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = x;
          snakey[head-i] = y + i;
          snakez[head-i] = z;
          snakeangle[head-i] = 0;
        }
      }
      
      // Other
      else {
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i;
          snakeangle[head-i] = 0;
        }
      }
    }
      
    // Game start
    else {
      if(b.className == "_h"){
        for(i = 0; i < snakelength; i++){
          snakex[head-i] = 20;
          snakey[head-i] = 10;
          snakez[head-i] = -i - 1;
          snakeangle[head-i] = 0;
        }
      }
    }   
  }
  
  // Draw 16 snake cubes (or more if snalelength is > 16) and hide them below the ground
  // The first one (the head) has a tongue (Y), mouth (‿) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 5 * div (the bottom div is useless)
  for(i = 0; i < Math.max(snakelength + 4, 16); i++){
    container.innerHTML += `<div id=M${i} class=_X style="transform:translateX(50vh)translateY(50vh)translateZ(-30vh);width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=S id=S${i}></div><div id=R${i} class=_Y><div class="c s" id=T${i}>${i<1?"<div class=t>Y</div>":""}<div class=F>${i<1?"‿":""}</div><div class=U style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=R></div><div class=L></div><div class=B>`;
  }
},


// Onload
index = (n, cross) => {
  
  // Go to the last saved room (or hub by default)
  pagename = "_" + (n || L[P+"p"] || "h");
  
  // Draw html structure
  document.body.outerHTML =
`<body id=b class=${pagename}>
<div id=V>
<div id=s style="transform:translateX(-140vh)translateY(-72vh)rotateZ(90deg)translateZ(119vh);transform-origin:142vh 72vh">
<div id=o></div>
<div id=pp></div>
<div id=S></div>
<div id=N></div>
</div>
</div>
<center id=e style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>
<button id=U class=d ontouchstart="touchstart(38)" ontouchend="touchend(38)">↑</button>
<button id=D class=d ontouchstart="touchstart(40)" ontouchend="touchend(40)">↓</button>
<button id=F class=d ontouchstart="touchstart(37)" ontouchend="touchend(37)">←</button>
<button id=R class=d ontouchstart="touchstart(39)" ontouchend="touchend(39)">→</button>
<button id=T class=d ontouchstart="touchstart(16)" ontouchend="touchend(16)">⬆︎</button>
<button id=C class=d ontouchstart="touchstart(17)" ontouchend="touchend(17)">⬇︎</button>
<button id=b class=d ontouchstart="touchstart(18)" ontouchend="touchend(18)">↩</button>
<button id=q class=d ontouchstart="touchstart(82)" ontouchend="touchend(82)">×</button>
<button id=m class=d ontouchstart="touchstart(49)" ontouchend="touchend(49)">↻</button>
<button id=Q class=d ontouchstart="touchstart(51)" ontouchend="touchend(51)">↺</button>
</center>
<center id=t style='font:5vh arial,sans-serif;color:#fff;position:fixed;bottom:9vh;left:0;width:100vw'>`;
  
  // Make the first apple appear (when the game starts only)
  L[P+"Ah0"] = 1;
  
  // Enter room
  enterroom();
  
  // Show buttons that already appeared before
  if(L[P+"w"]){
    U.className = D.className = F.className = R.className = '';
  }
  if(L[P+"b"]){
    b.className = "";
  }
  if(L[P+"r"]){
    q.className = "";
  }
  if(L[P+"B"]){
    T.className = "";
    C.className = "";
  }
  if(L[P+"c"]){
    m.className = "";
    Q.className = "";
  }

  int_time = setInterval(`L[P+"t"]=++ocd_time;document.title='LOSSST: '+ocd_moves+'m, '+ocd_time+'s'`,1000);
  
    
  if(cross){
    b.innerHTML+=`<div style='position:fixed;font:8vh a;top:3vh;right:3vh'onclick=location=location>×`;
  }
},

touchstart = (n) => {
  self.onkeydown({which:"+n+"});
  touchintervals[n] = setInterval("self.onkeydown({which:"+n+"})",150);
},

touchend = (n) => {
  clearInterval(touchintervals[n]);
  self.onkeyup();
}


// Editor
// All the editor features
editor = () => {

  son = 0;
  issolved = 0;
  Y.disabled = 1;
  
  // Hide ground checkbox & label if they're alone
  if(!L[P+"e"] && !((L[P+"s"] && L[P+"S"] > 6))){
    G.style.opacity = g.style.opacity = 0;
    G.style.position = g.style.position = "fixed";
    G.style.top = g.style.top = "-9vh";
  }
  
  // Startup
  currentpuzzle = 0;
  iseditor = 1;
  puzzles = [[5,5,0,0,0,0,0]];
  
  // Set default values to the form
  z.value = Z.value = snakelength = 5;
  G.checked = true;
  hasground = 1;
  if(self.x)x.checked = false;
  if(self.W)W.checked = false;

  // Ground/wall checkboxes
  // (can't be both disabled)
  G.onclick = e => {
    if(G.checked){
      hasground = 1;
    }
    else if(self.x){
      hasground = 0;
      haswall = 1;
      x.checked = true;
    }
  }
 
	if(self.x){
    x.onclick = e => {
      if(self.x && x.checked){
        haswall = 1;
        puzzles[0][3] = 1;
        son = 1;
      }
      else {
        son = 0;
        haswall = 0;
        hasground = 1;
        G.checked = true;
        puzzles[0][3] = 0;
      }
    }
  }
  
  // Wrap checkbox
  if(self.W){
    W.onclick = e => {
      haswrap = puzzles[0][2] = W.checked || 0;
    }
  }

  // Data arrays for wall and ground puzzle
  dw = [];
  dg = [];
    
  // Reset and resize the snake (when the snake size range changes)
  Z.onchange =
  Z.oninput = e => {
    
    // Update range indicator
    v.innerHTML = snakelength = +Z.value;
    resetsnake();
    movesnake();
    
    issolved = 0;
    Y.disabled = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        self[`ge${i}${j}`].style.background = dg[i][j] ? "#000" : "#fff";
        self[`we${i}${j}`].style.background = dw[i][j] ? "#000" : "#fff";
      }
    }
  }
  
  // Editor
  
  // Grids size (in numbers of cells squared)
  size = 5;
  
  // Resize the grid
  // Called on load, on reset and when the grid size input is changed
  // This also resizes the snake (so it can fit in the cells)
  (A.onclick =
  z.onchange =
  z.oninput =
  resizegrid = e => {

    issolved = 0;
    Y.disabled = 1;
    
    // Update range indicator (z = value)
    gridval.innerHTML = size = +z.value;
    puzzles[0][0] = size;
 
    // Compute cells size (in %)
    var cellsize = 100 / size;
    
    // Reset grids (html and data)
    H.innerHTML = '';
    E.innerHTML = '';
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
        whtml += `<div class=C id=w${cellprefix}${i}${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,0)' onmousemove='paint(${i},${j},this,0,1)'></div>`;
        ghtml += `<div class=C id=g${cellprefix}${i}${j} style='width:${cellsize}%;padding-top:${cellsize}%' onmousedown='paint(${i},${j},this,1)' onmousemove='paint(${i},${j},this,1,1)'></div>`;
      }
    }
    H.innerHTML += ghtml;
    E.innerHTML += whtml;
    
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

    if(mousedown){
      issolved = 0;
      Y.disabled = 1;
    }
    
    // Choose ground or wall
    var d = g ? dg : dw;
    
    // Force
    if(f && mousedown){
      d[i][j] = 1;
    }
    
    // Toggle
    else if(!f){
      d[i][j] ^= 1;
    }
    
    // Update CSS
    if(!f || mousedown){
    // => if((f && mousedown) || !f){
      for(i = 0; i < size; i++){
        for(j = 0; j < size; j++){
          self[`ge${i}${j}`].style.background = dg[i][j] ? "#000" : "#fff";
          self[`we${i}${j}`].style.background = dw[i][j] ? "#000" : "#fff";
        }
      }
    }
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

  Y.onclick = () => {
    var r = [];
    r.push(size)
    r.push(Z.value);
    r.push(self.W && W.checked ? 1 : 0);
    r.push(self.x && x.checked ? print(dw) : '')
    r.push(ground.checked ? print(dg) : '')
    window.open("//twitter.com/intent/tweet?text=I%20made%20a%20level%20for%20LOSSST,%20a%20%23js13k%20game%20by%20by%20@MaximeEuziere!%0Ahttp%3A%2F%2Fjs13kgames.com%2Fentries%2Flossst/index.html%23"+r)
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
    b.className = "l P";
    issolved = 0;
    Y.disabled = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        self[`ge${i}${j}`].style.background = dg[i][j] ? "#000" : "#fff";
        self[`we${i}${j}`].style.background = dw[i][j] ? "#000" : "#fff";
      }
    }
  }
  
  // Quit
  O.onclick = () => {
    
    // Quit playing
    if(playing){
      playing = puzzling = 0;
      b.className = "l";
      resetsnake();
      movesnake();
      checkgrid();
    }
    
    // Quit editor
    else {
      location = "index.html";
    }
  }
  
  s.style.transform = "rotateX(38deg)translateX(-18vh)";
}

mainmenu = () => {
  
  if(location.hash.length > 1){
    index("l");
    return;
  }
  
  
  // Menu 1
  b.innerHTML = `<center id=e>👀</center>
<center id=X></center>
<div id=V style=perspective:30vh>
<center id=menu>
<h1>LOSSST</h1><span onclick=a()>New game</span><br>`+(L[P+"start"]?(L[P+"ended"]?'':'<span onclick=index(0,1)>Continue</span><br>')+`<span onclick=location='e.htm'>Puzzle editor</span><br>`:"")+`<span onclick="location='//twitter.com/search?q=%23LOSSSTjs13k'">Twitter levels</span><br><span onclick=location='//xem.github.io/articles#js13k17'>Making of</span><br><span onclick=location='//maximeeuziere.itch.io'>Other games`;

  // New game
  a = () => {
    for(i in localStorage){
      if(i.indexOf("lossst") == 0 && i.indexOf("e") == -1){
        delete localStorage[i];
      }
    }
    L[P+"start"] = 1;
    menu.innerHTML = '<br><br><span onclick=intro(0)>Desssktop</span><br><br><span onclick=intro(1)>Mobile';
  }

  // Intro
  intro = function(m) {
    L[P+"m"] = mobile = m;
    L[P+"S"] = snakelength = 5;
    ocd_time = L[P+"t"] = 0,
    ocd_moves = L[P+"M"] = 0,
    
    L[P+"M"] = 0;
    L[P+"t"] = 0;
    menu.innerHTML = "";
    
    // Eyes
    setTimeout("e.style.margin=0", 500);
    dir = 1;
    inter = setInterval("e.style.opacity=0;setTimeout('e.style.opacity=1;dir=-dir;e.style.transform=`scaleX(`+dir+`)`',150)", 3000);
    
    // text
    setTimeout("X.innerHTML=`I lossst my kid!`", 2000);
    setTimeout("X.innerHTML=``", 5000);
    setTimeout("clearInterval(inter);e.style.margin='-80vh 0 0'", 7000);
    setTimeout(index, 7500);
  }
  
  // Music by Anders Kaare
  // http://veralin.dk/2k.html
  /*Music = () => {

    MM=new (function(){
      if (!window.AudioContext) return;

      var M=this;

      var ctx=new AudioContext;
      var node=ctx.createScriptProcessor(4096,0,1);

      // "constants"
      var RATE=ctx.sampleRate/48e3;
      var POW=Math.pow;
      var SIN=Math.sin;
      var RND=Math.random;
      var NSIN=function(x){return SIN(x)+RND()*0.6};
      var P2=Math.PI*2;
      //var PRB=function(x){return RND()<x;};
      var OSC=function(fn){
        var x=0;
        return function(note) {
          x+=POW(2,note/12)*RATE;
          if(x>P2)x-=P2;
          return fn(x);
        };
      };

      // oscillators
      var snare=OSC(NSIN);
      var pling=OSC(function(x) {
        return (x/P2-0.5);
      });
      var pling2=OSC(function(x) {
        return (x/P2-0.5);
      });
      var bass=OSC(function (x) {
        return (x/P2-0.5)+POW(SIN(x),5)*3;
      });

      var pos=1;
      var step=-1;
      var vibrato=0;

      node.onaudioprocess = function(e) {
        var data = e.outputBuffer.getChannelData(0);
        for (var i=0;i<data.length;i++) {
          pos+=M.t/RATE;
          vibrato+=0.001/RATE;
          if(pos>=1){
            pos-=1;
            step++;
          }
          var decay=1-pos;

          var o=0;

          var X=null;
          var bt=0;

          var lseq,lseq2;
          if ((step%128)<64) {
            lseq = [3,4,4,4,3,4,0,-3,0,X,X,0,X,X,0,X,3,4,4,4,3,4,0,-3,0,12,X,12,12,X,X,X];
            lseq2 = [X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,X,-1,0,0,0,-1,0,-5,-8,-5,X,X,-5,X,X,-5,X,X];
          } else {
            lseq = [6,7,7,7,6,5,4,2,-5,X,X,7,X,X,X];
            lseq2 = [X,X,X,X,-10,-5,X,X,X,-10];
            bt = -5;
          }

          var L=lseq.length;
          var ln = lseq[step%L];
          if (ln!=X) o+=pling(-81+ln+24)*decay*M.p;

          L=lseq2.length;
          var ln = lseq2[step%L];
          if (ln!=X) o+=pling2(-81+ln+24+SIN(vibrato)*0.05)*decay*M.p;

          var bseq=[0,X,X,0,7,9,X,7];
          L=bseq.length;
          var bseq2=[X,12,X,12,12,X,12,X];
          var bn = (((step/L)&3)<3?bseq:bseq2)[step%L];
          if (bn!=X) o+=bass(-81+bn+bt-SIN(vibrato)*0.05)*M.b*decay;

          var drumx=((1-pos)+(step&1))/2;
          if ((step&2)==2) o += snare(-70+POW(drumx,15)*60)*M.s*decay*RND();


          data[i]=o;
        }
      };
      node.connect(ctx.destination);

      // hi xem, this is the interface:
      M.stop = function() { node.disconnect(); } // XXX you can remove this to conserve space

      M.s = 0.1; // snare volume
      M.p = 0.2; // pling volume
      M.b = 0.2; // bass volume
      M.t=1.1e-4; // tempo
    })

  }*/

  //Music();

}