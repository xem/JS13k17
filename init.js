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
// Synchronize it in localStorage
snakelength = +localStorage["snakelength"] || 5;
localStorage["snakelength"] = snakelength;

// Game

// Playing (0: editor / 1: in-game)
playing = 1;

// Playing a puzzle
puzzling = 0;

// Keyboard input (control snake's cubes): up, right, down, left, shift, ctrl, backspace
u = r = d = l = s = c = B = 0;

// Keyboard lock
lock = 0;

// Emoji
trees = [];
apples = [];

// doors
doors = [];

// Cubes
cubes = [];

// Puzzles
puzzles = [];

currentpuzzle = null;

cellprefix = 'e';

dg = [];

hasground = 0;

haswall = 0;

issolved = 0;

wrapenabled = 0;

leftoffset = 0;

topoffset = 0;

totalsolved = +localStorage["totalsolved"] || 0;

// Stuck
stuck = 0;

// Page
pagename = "";


// Debug

// Log
var log = function(s){
  console.log(s);
}

// Rotate camera
rot = 0;

// Camera rotation
move_scene = function(){
  scene.style.transform = "translateX(-"+(snakex[head]*sidesize)+"vh)translateY(-"+(snakey[head]*sidesize)+"vh)translateZ(40vh)rotateX(40deg)rotateZ(" + rot + "rad)";
}

// Game

// HTML
inithtml = function(c){
  document.body.outerHTML =

`<title>SNAKE</title>
<body id=b class="${pagename}">
<div id=perspective>
  <div id=scene style="transform:translateX(-142vh)translateY(-72vh)rotateZ(90deg)translateZ(79vh);transform-origin:142vh 72vh">
    <div id=objects></div>
    <div id=puzzle></div>
    <div id=snake></div>
  </div>
</div>
<div style="position:fixed;bottom:5px;left:5px;width:200px">
  <button onclick="rot+=Math.PI/4;move_scene()">↻</button>
  <button onclick="rot-=Math.PI/4;move_scene()">↺</button>
  <button onclick="localStorage.clear()">clear</button>`;
}

drawobjects = function(){
  
  objects.innerHTML = "";
  puzzle.innerHTML = "";
  
  // Trees
  for(var i in trees){
    objects.innerHTML += 
    `<div id=tree${i} class="emoji tree" style="left:${trees[i][0]*sidesize}vh;top:${trees[i][1]*sidesize}vh;transform:translateZ(${trees[i][2]*sidesize+2}vh)translateX(-8vh)translateY(-15vh)rotateX(-75deg)">🌳</div><div id=treeshadow${i} class="emojishadow treeshadow" style="left:${trees[i][0]*sidesize}vh;top:${trees[i][1]*sidesize}vh;transform:translateZ(${trees[i][2]*sidesize}vh)translateX(-7vh)translateY(-14vh)rotateZ(144deg)scaleY(1.5)">🌳`;
    
  }
  
  // Apples
  for(i in apples){
    emoji = "";
    
    // Apple already eaten
    if(localStorage["appleeaten"+pagename+i]){      
      delete apples[i];
    }
   
    // Apples to eat
    else {
      objects.innerHTML += 
      `<div id=apple${i} class="emoji apple ${((pagename=="hub"&&i==0)||localStorage["appleappeared"+pagename+i])?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;top:${apples[i][1]*sidesize}vh">🍎</div><div id=appleshadow${i} class="emojishadow appleshadow ${((pagename=="hub"&&i==0)||localStorage["appleappeared"+pagename+i])?"":"hidden"}" style="left:${apples[i][0]*sidesize}vh;top:${apples[i][1]*sidesize}vh">🍎`;
    }
  }
  
  // Doors
  for (i in doors){
    objects.innerHTML+=`<div id=door${i} class="door${localStorage['door'+pagename+i]?" open":""}" style="left:${(doors[i][0]+.5)*sidesize}vh;top:${(doors[i][1]+.5)*sidesize}vh;transform:rotateZ(${doors[i][2]}rad)translateZ(${doors[i][9]*sidesize}vh)"><div class=realdoor ${doors[i][6]?"":"hidden"}>`+(doors[i][3] || "")+`</div><div class=path>`;
  }
  
  // Cubes
  for (i in cubes){
    objects.innerHTML+=`<div id=cube${i} class="cube rock" style="left:${cubes[i][0]*sidesize}vh;top:${cubes[i][1]*sidesize}vh;width:7vh;height:7vh">
      <div class=front></div>
      <div class=up style="background-position:${-300-cubes[i][0]*sidesize}vh ${-140-cubes[i][1]*sidesize}vh"></div>
      <div class=right></div>
      <div class=left></div>
      <div class=back></div>
      <div class=down>`;
  }
  
  // puzzles
  for(var p in puzzles){
    
    var whtml = '';
    var ghtml = '';
    var html =
    `<div class="cube wrap visible" style="left:${puzzles[p][5]*sidesize}vh;top:${puzzles[p][6]*sidesize}vh;width:${puzzles[p][0]*sidesize}vh;height:${puzzles[p][0]*sidesize}vh">
      <!--div class=left></div>
      <div class=right></div-->
      <div id=down${p} class=down></div>
      <!--div id=back${p} class=back></div-->
      <!--div class=up></div>
      <div class=front-->`;
    puzzle.innerHTML += html;

    // Solved
    if(localStorage["puzzle"+pagename+p]){
      for(i = 0; i < puzzles[p][0]; i++){
        for(j = 0; j < puzzles[p][0]; j++){
          //whtml += `<div class=cell id=w${i}${j} style='width:${sidesize}vh;height:${sidesize}vh;'></div>`;
        ghtml += `<div class=cell id=g${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:${(puzzles[p][4][i*puzzles[p][0]+j]=="1")?"green":"gold"}'></div>`;
        }
      }
    }
    
    // Not solved
    else {
      for(i = 0; i < puzzles[p][0]; i++){
        for(j = 0; j < puzzles[p][0]; j++){
          //whtml += `<div class=cell id=w${i}${j} style='width:${sidesize}vh;height:${sidesize}vh;'></div>`;
        ghtml += `<div class=cell id=g${p}-${i}-${j} style='width:${sidesize}vh;height:${sidesize}vh;background:${(puzzles[p][4][i*puzzles[p][0]+j]=="1")?"#000":"#fff"}'></div>`;
        }
      }
    }
    
    
    top["down"+p].innerHTML += ghtml;
    //if(top["back"+p]) top["back"+p].innerHTML += whtml;
    
  }
}

// Enter a room
enterroom = function(){
  
  b.className = pagename;
  
  // Hub (start, tuto, access to 2D, wrap and 3D puzzles)
  if(pagename == "hub"){
  
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
    // 9: z
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "hub2", 1, 0, 10, 0],
      [20, -2, 0, 15, 0, "hub16", 1, 0, 0, 0],
      [-2, 11, -Math.PI / 2, 6, 0, "hub16", 1, 0, 0, 1],
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
    
    drawobjects();
    
    // Opening cinematic
    if(!localStorage["snakex"]){
    
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
    
    // Return to hub from another room
    else {
      scene.style.transition = 'transform .8s, transform-origin .8s linear';
      resetsnake();
      movesnake();
    }
  }
  
  // Hub2 (puzzles 2D length 8)
  else if(pagename == "hub2"){
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples
    apples = [
      [33,9,0,0,6],
    ];
    
    cubes = [];
    
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
    doors = [
      [-2, 10, -Math.PI / 2, 8, 0, "hub", 0, 39, 11, 0],
      [41, 10, Math.PI / 2, 9, 0, "hub3", 1, 1, 9, 0],
      [22, 21, Math.PI, 14, 0, "hub5",0, 22, 1, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,8,0,,"000000001000001110001110001000000000",2,3],
      [6,8,0,,"000000011000011000001100001100000000",14,3],
      [6,8,0,,"000000000100001100011000011100000000",26,3],
      [5,8,0,,"0000001110011100110000000",2,13],
      [6,8,0,,"000000011000011100010000011000000000",14,13],
      [6,8,0,,"000000000100001100001110001100000000",26,13],
    ];
    
    drawobjects();
    
    scene.style.transition = 'transform .8s, transform-origin .8s linear';
    resetsnake();
    movesnake();
  }

  // Hub3 (puzzles 2D length 9)
  else if(pagename == "hub3"){
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples
    apples = [
      [33,9,0,0,12],
      [34,10,0,0,12],
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
    doors = [
      [-2, 9, -Math.PI / 2, 8, 0, "hub2", 0, 39, 10, 0],
      [22, 21, Math.PI, 11, 0, "hub4", 1, 22, 1, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,9,0,,"000000000000001100001110011110000000",2,2],
      [7,9,0,,"0000000001100000110000010000001100000110000000000",14,2],
      [6,9,0,,"000000000000011000001110011110000000",26,2],
      [6,9,0,,"000000001110001110000110000010000000",2,11],
      [7,9,0,,"0000000000100000011000011100001100000010000000000",14,11],
      [6,9,0,,"000000011000011000001110000110000000",26,11],
    ];
    
    cubes = [];
    
    drawobjects();
    
    scene.style.transition = 'transform .8s, transform-origin .8s linear';
    resetsnake();
    movesnake();
  }
  
  // Hub4 (puzzles 2D length 11)
  else if(pagename == "hub4"){
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples
    apples = [
      [33,9,0,0,18],
      [34,10,0,0,18],
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
    doors = [
      [22, -2, 0, 8, 0, "hub3", 0, 22, 19, 0],
      [-2, 10, -Math.PI / 2, 13, 0, "hub5", 1, 39, 10, 0],
    ];
    
    // Puzzles
    puzzles = [
      [6,11,0,,"000000011110011010011110000000000000",2,2],
      [7,11,0,,"0000000001110000111000001100000110000010000000000",14,2],
      [6,11,0,,"000000011000011110001010001110000000",26,2],
      [6,11,0,,"000000011100001110001110001100000000",2,11],
      [6,11,0,,"000000001110001110001110001010000000",14,11],
      [6,11,0,,"000000011110011110001100001000000000",26,11],
    ];
    
    cubes = [];
    
    drawobjects();
    
    scene.style.transition = 'transform .8s, transform-origin .8s linear';
    resetsnake();
    movesnake();
  }
  
  // Hub5
  else if(pagename == "hub5"){
    
    // Trees
    trees = [
      [35,8,0],
    ];
    
    // Apples
    apples = [
      [34,11,0,0,24],
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
    doors = [
      [41, 10, Math.PI / 2, 8, 0, "hub4", 0, 1, 10, 0],
      [22, -2, 0, 14, 0, "hub2", 1, 22, 19, 0]
    ];
    
    // Puzzles
    puzzles = [
      /*[7,13,0,,"0000000000000001111000111100001111000100000000000",2,2],
      [7,13,0,,"0000000001110000101000011100001110000110000000000",14,2],
      [6,13,0,,"000000001110011110011010001110000000",26,2],
      [7,13,0,,"0000000001100000111000011100001110000110000000000",2,11],
      [7,13,0,,"0000000000000001111100101010011111000000000000000",14,11],
      [7,13,0,,"0000000000000000001100001110001111001111000000000",26,11],*/
      
      // Abandoned puzzles :'(
      [7,13,0,,"0000000011000001111100011110001100000000000000000",2,2],
      [6,13,0,,"000000011000011100011110011110000000",14,2],
      [7,13,0,,"0000000010000001110000111100011110001000000000000",2,11],
      [7,13,0,,"0000000000000000111000011100011110001110000000000",14,11]
    ];
    
    cubes = [];
    
    drawobjects();
    
    scene.style.transition = 'transform .8s, transform-origin .8s linear';
    resetsnake();
    movesnake();
  }
  
}

// Reset the snake's positions and angles
resetsnake = function(noresethistory){
  
  // Delete the snake
  snake.innerHTML = "";
      
  if(!noresethistory){
    
    // Reset positions & angles
    snakex = [];
    snakey = [];
    snakez = [];
    snakeangle = [];
  }
  
  // Compute cubes sizes in vh (editor only)
  if(b.className == "editor"){
    sidesize = 32 / size;
  }
  
  head = snakelength - 1;
  
  if(!noresethistory){
    
    // Editor
    if(b.className == "editor"){
      for(i = 0; i < snakelength; i++){
        snakex[head - i] = -i - 1;
        snakey[head - i] = ~~(size/2);
        snakez[head - i] = 0;
        snakeangle[head - i] = -Math.PI/2;
      } 
    }
    
    else if(localStorage["snakex"]){
      var x = +localStorage["snakex"];
      var y = +localStorage["snakey"];
      var z = +localStorage["snakez"];
        
      // Arrive from left
      if(x < 2){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x - i;
          snakey[head - i] = y;
          snakez[head - i] = z;
          snakeangle[head - i] = -Math.PI / 2;
        }
      }
      
      // Arrive from right
      else if(x > 28){
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
      else if(y > 18){
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = x;
          snakey[head - i] = y + i;
          snakez[head - i] = z;
          snakeangle[head - i] = 0;
        }
      }
      
      // Debug (when localStorage is corrupted)
      else {
        for(i = 0; i < snakelength; i++){
          snakex[head - i] = 10;
          snakey[head - i] = 10;
          snakez[head - i] = -i;
          snakeangle[head - i] = Math.PI;
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
  
  // Draw 16 snake cubes (or more if snalelength is > 16)
  // The first one (the head) has a tongue (Y) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 6 * div
  for(i = 0; i < Math.max(snakelength, 16); i++){
    snake.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style="transform:translateX(50vh)translateY(50vh)translateZ(-10vh);width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake" id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=front>${i<1?"‿":""}</div><div class=up style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=right></div><div class=left></div><div class=back></div><div class=down>`;
  }
}
