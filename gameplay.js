// GAMEPLAY

// Snake

// Move the snake
// when snakex/y/z and snakeangle have been updated (or reset)
// Also, eat apples
// Also, open doors
// Also, enter puzzles
movesnake = function(){
  
  for(i = 0; i < snakelength; i++){
    
    // oldx/y/z and newx/y/z are the positions where the cube disappear and reappear during the wrap animation  
    var wrapping = oldx = oldy = oldz = newx = newy = newz = 0;
    
    // Wrap transition
    if(wrapenabled){
      
      // Left
      if(snakex[(head - i) - 1] == 0 && snakex[(head - i)] == size - 1){
        wrapping = 1;
        oldx = -1;
        newx = size;
        oldy = newy = snakey[(head - i)];
        oldz = newz = snakez[(head - i)];
      }
      
      // Right
      if(snakex[(head - i) - 1] == size - 1 && snakex[(head - i)] == 0){
        wrapping = 1;
        oldx = size;
        newx = -1;
        oldy = newy = snakey[(head - i)];
        oldz = newz = snakez[(head - i)];
      }
      
      // Forwards
      if(snakey[(head - i) - 1] == 0 && snakey[(head - i)] == size - 1){
        wrapping = 1;
        oldy = -1;
        newy = size;
        oldx = newx = snakex[(head - i)];
        oldz = newz = snakez[(head - i)];
      }
      
      // Backwards
      if(snakey[(head - i) - 1] == size - 1 && snakey[(head - i)] == 0){
        wrapping = 1;
        oldy = size;
        newy = -1;
        oldx = newx = snakex[(head - i)];
        oldz = newz = snakez[(head - i)];
      }
      
      // Upwards
      if(snakez[(head - i) - 1] == 0 && snakez[(head - i)] == size - 1){
        wrapping = 1;
        oldz = -1;
        newz = size;
        oldx = newx = snakex[(head - i)];
        oldy = newy = snakey[(head - i)];
      }
      
      // Downwards
      if(snakez[(head - i) - 1] == size - 1 && snakez[(head - i)] == 0){
        wrapping = 1;
        oldz = size;
        newz = -1;
        oldx = newx = snakex[(head - i)];
        oldy = newy = snakey[(head - i)];
      }
    }
    
    // Wrapping transition
    if(wrapping){
      
      // Rotate
      top["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[(head - i)]}rad)`;
      
      // Disappear after the wrap start
      top["snakecubemove"+i].style.transform = `translateX(${oldx*sidesize+.5}vh)translateY(${oldy*sidesize+.5}vh)translateZ(${oldz*sidesize+.5}vh)scale(.01)scaleZ(.01)`;
      
      // Disable transitions
      setTimeout("snakecubemove"+i+".style.transition='none'", 150);
      
      // Move cube at the position before the end of the wrap
      setTimeout("snakecubemove"+i+".style.transform=`translateX(${"+newx+"*sidesize+.5}vh)translateY(${"+newy+"*sidesize+.5}vh)translateZ(${"+newz+"*sidesize+.5}vh)scale(.01)`", 175);
      
      // Reenable transitions and finish the wrap
      setTimeout("snakecubemove"+i+".style.transition='';snakecubemove"+i+".style.transform=`translateX(${snakex["+(head - i)+"]*sidesize+.5}vh)translateY(${snakey["+(head - i)+"]*sidesize+.5}vh)translateZ(${snakez["+(head - i)+"]*sidesize+.5}vh)`", 200);
    }
    
    // Normal transition (just update snakecubemove and snakecuberotate)
    else{
      top["snakecubemove"+i].style.transform = `translateX(${snakex[(head - i)]*sidesize+.5}vh)translateY(${snakey[(head - i)]*sidesize+.5}vh)translateZ(${snakez[(head - i)]*sidesize+.9}vh)`;
      top["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[(head - i)]}rad)`;
    }
    
    // Shadow
    top["snakeshadow"+i].style.display = snakez[(head - i)] == 0 ? "" : "none";
    
    // no puzzle: camera follows the snake
    if(b.className != "editor" && b.className != "editor playing"){
      
      if(currentpuzzle === null){
        if(b.className == "hub" || b.className == "hub2"){
          scene.style.transform="translateX("+(-snakex[head]*sidesize)+"vh)translateY("+(-snakey[head]*sidesize)+"vh)translateZ(-5vh)rotateX(45deg)";
          scene.style.transformOrigin=""+(snakex[head]*sidesize)+"vh "+(snakey[head]*sidesize)+"vh";
        }
      }
      
      // Puzzle: fixed camera
      else{
        scene.style.transform="translateX(" + (-(puzzles[currentpuzzle][5] + puzzles[currentpuzzle][1]/2) * sidesize + 15) + "vh)translateY(" + (-(puzzles[currentpuzzle][6] + puzzles[currentpuzzle][1]/2) * sidesize + 13) + "vh)translateZ(30vh)rotateX(25deg)";
        
        scene.style.transformOrigin = ""+((puzzles[currentpuzzle][5] + puzzles[currentpuzzle][1]/2) * sidesize) +"vh "+((puzzles[currentpuzzle][6] + puzzles[currentpuzzle][1]/2) * sidesize + 13) +"vh";
      }
    }
  }
  
  // Doors
  var x = snakex[head],
  y = snakey[head],
  z = snakez[head];
  
  for(var i in doors){
    
    // Open a door if the snake's length is big enough
    if(doors[i][3] > 0 && snakelength >= doors[i][3] && Math.hypot(x - doors[i][0], y - doors[i][1]) < 4){
      top["door"+i].className = "door open";
      
      // Save that in localstorage for next visit
      localStorage["door"+pagename+i] = 1;
    }
    
    // Walk on a door path if the door is open
    if(top["door"+i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) < 2){
      localStorage["page"] = pagename = doors[i][5];
      setTimeout(enterroom,1000);
      
      // Save snake future position in localstorage
      localStorage["snakex"] = doors[i][7];
      localStorage["snakey"] = doors[i][8];
      localStorage["snakez"] = 0;
      localStorage["snakeangle"] = snakeangle[head];
    }
  }
  
  // Puzzles
  if(b.className != "editor playing"){
    
    checkgrid();
    
    currentpuzzle = null;
    
    dg = [];
  
    for(p in puzzles){
      if(
        x >= puzzles[p][5]
        && x < puzzles[p][5] + puzzles[p][0]
        && y >= puzzles[p][6]
        && y < puzzles[p][6] + puzzles[p][0]
      ){
        
        currentpuzzle = +p;
        issolved = 0;
        if(localStorage["puzzle"+pagename+p]){
          issolved = 1;
        }
        cellprefix = p;
        hasground = !!puzzles[p][4];
        haswall = !!puzzles[p][3];
        leftoffset = puzzles[p][5];
        topoffset = puzzles[p][6];
        size = puzzles[p][0];
        for(i = 0; i < size; i++){
          dg[i] = [];
          for(j = 0; j < size; j++){
            dg[i][j] = +puzzles[p][4][i*puzzles[p][0]+j];
          }
        }
        checkgrid();
      }
    }
  }
};

// Check if a position is free and in bounds
checkmove = function(x,y,z){
  
  stuck = 0;
  
  // Editor map boundaries
  if(b.className == "editor playing"){
    if(x < -5 || x > size + 3 || y < -2 || y > size){
      stuck = 1;
    }
  }
  
  // Hub boundaries
  if(b.className == "hub" || b.className == "hub2"){
    if(x < 0 || x >= 40 || y < 0 || y >= 20){
      stuck = 1;
    }
  }
  
  // Emoji hitbox
  for(var i in trees){
    if(x >= trees[i][0] - 1 && x <= trees[i][0] + 1 && y == trees[i][1]){
      stuck = 1;
    }
  }
  
  // Apples
  for(var i in apples){
    if(localStorage["appleappeared"+pagename+i] && x == apples[i][0] && y == apples[i][1]){
      
      // Eat an apple
      delete apples[i];
      top["apple"+i].remove();
      top["appleshadow"+i].remove();
      snakelength++;
      localStorage["snakelength"] = snakelength;
      localStorage["appleeaten"+pagename+i] = 1;
    }
  }
  
  // Rock
  for(var i in cubes){
    if(x == cubes[i][0] && y == cubes[i][1]){
      stuck = 1;
    }
  }
  
  // Doors
  for(var i in doors){
    
    // Walk on a door path if the door is open
    if(top["door"+i].className == "door open" && Math.hypot(x - doors[i][0], y - doors[i][1]) <= 2){
      stuck = 0;
    }
  }
  
  // Other snake cubes hitbox
  // NB: no need to check if the last cube (the tail) is there because when the snake will move, that cube won't be here anymore so we can take its place. Hence the "snakelength - 2"
  for(i = snakelength - 2; i > 0; i--){
    if(snakex[head - i] == x && snakey[head - i] == y && snakez[head - i] == z){
      stuck = 1;
    }
  }
}

// Check if the grid is solved
checkgrid = function(e){
  
  if(issolved){
    return;
  }
  
  if(currentpuzzle === null) return;
  
  solved = 1;
  
  // Repaint everything in black and white
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      if(top[`g${cellprefix}-${i}-${j}`]){
        top[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "black" : "white";
      }
      if(top[`w${cellprefix}-{i}-${j}`]){
        top[`w${cellprefix}-{i}-${j}`].style.background = dw[i][j] ? "black" : "white";
      }
    }
  }
  
  // If head is not in the puzzle, return
  if(snakex[head] < leftoffset || snakex[head] > leftoffset + size - 1 || snakey[head] < topoffset || snakey[head] > topoffset + size - 1 || snakez[head] < 0 || snakez[head] > size - 1){
      return;
  }
  
  for(i = 0; i < snakelength; i++){
 
    // Paint the good cells in green and the bad ones in red (if they exist, hence the try/catch)
    if(top[`g${cellprefix}-${snakey[head - i] - topoffset}-${snakex[head - i] - leftoffset}`]){
      top[`g${cellprefix}-${snakey[head - i] - topoffset}-${snakex[head - i] - leftoffset}`].style.background = dg[snakey[head - i] - topoffset][snakex[head - i] - leftoffset] ? "green" : "red";
    }
    
    //top[`w${cellprefix}-${size - 1 - snakez[head - i]}-${snakex[head - i]}`].style.background = dw[size - 1 - snakez[head - i]][snakex[head - i]] ? "green" : "red";
  
    // If a snake part is out of the grid, not solved
    if(snakex[head - i] < leftoffset || snakex[head - i] > leftoffset + size - 1 || snakey[head - i] < topoffset || snakey[head - i] > topoffset + size - 1 || snakez[head - i] < 0 || snakez[head - i] > size - 1){
      solved = 0;
    }
  
    // If a snake part is at a place where it shouldn't be (red cell), not solved
    if(hasground && dg[snakey[head - i] - topoffset] && !dg[snakey[head - i] - topoffset][snakex[head - i] - leftoffset]){
      solved = 0;
    }
    
    if(haswall && dw[size - 1 - snakez[head - i]] && !dw[size - 1 - snakez[head - i]][snakex[head - i] - leftoffset]){
      solved = 0;
    }
  }
  
  // If a snake part is not at a place where it should be, not solved
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      if(hasground && top[`g${cellprefix}-${i}-${j}`].style.backgroundColor == "black"){
        solved = 0;
      }
      if(haswall && top[`w${cellprefix}-${i}-${j}`].style.backgroundColor == "black"){
        solved = 0;
      }
    }
  }
  
  // Solved
  if(solved){
    issolved = 1;
    localStorage["puzzle"+pagename+currentpuzzle] = 1;
    for(i = 0; i < size; i++){
      for(j = 0; j < size; j++){
        if(top[`g${cellprefix}-${i}-${j}`]){
          top[`g${cellprefix}-${i}-${j}`].style.background = dg[i][j] ? "green" : "gold";
        }
        if(top[`w${cellprefix}-{i}-${j}`]){
          top[`w${cellprefix}-{i}-${j}`].style.background = dw[i][j] ? "green" : "gold";
        }
      }
    }
  }
}

// Check if a new apple can appear after a certain snake length or number of puzzles solved, and make it appear
checkapple = function(e){
  for(var i in apples){
    
    //console.log(i, localStorage["appleappeared"+pagename+i], apples[i][3], snakelength, apples[i][4], totalsolved);

    if(!localStorage["appleappeared"+pagename+i] &&((apples[i][3] > 0 && apples[i][3] == snakelength) || (apples[i][4] > 0 && apples[i][4] == totalsolved))){
      
        lock = 1;
        
        // Focus on new apple 
        setTimeout(`scene.style.transform="translateX("+(-apples[`+i+`][0]*sidesize)+"vh)translateY("+(-apples[`+i+`][1]*sidesize)+"vh)translateZ(-5vh)rotateX(25deg)";
        
        localStorage["appleappeared"+pagename+"`+i+`"] = 1;
        
        scene.style.transformOrigin=""+(apples[`+i+`][0]*sidesize)+"vh "+(apples[`+i+`][1]*sidesize)+"vh";

        // Show apple
        top["apple"+`+i+`].className = "emoji apple";
        top["appleshadow"+`+i+`].className = "emojishadow appleshadow";`, 250);
        
        // Focus back on snake
        setTimeout("movesnake();lock=0", 2000);

    }
  }
}


// On key down
onkeydown = function(e){
  
  // Update u/d/l/r flags
  top['lurd************************l**r************l*d***u**u'[e.which - 37]] = 1;
  
  // Backspace = 8 / Alt = 18
  if(e.which == 8 || e.which == 18){
    B = 1;
  }
  
  // Shift = 16
  if(e.which == 16){
    s = 1;
  }
  
  // Ctrl = 17
  if(e.which == 17){
    c = 1;
  }

  // Allow F5 = 116 / Ctrl = 17 / R = 82, F12 = 123, disable the other keys that can ruin the gameplay (space, backspace, scroll, etc...)
  if(e.keyCode != 116 && e.keyCode != 82 && e.keyCode != 17 && e.keyCode != 123){
    e.preventDefault();
  }
  
  var inbounds = 0;
  if(playing && puzzling && snakex[head] >= 0 && snakex[head] < size && snakey[head] >= 0 && snakey[head] < size && snakez[head] >= 0 && snakez[head] < size){
    inbounds = 1;
  }
  
  if(playing && !lock){
    
    stuck = 0;
      
    // Left
    if(l){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakex[head] == 0){
        checkmove(size - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(size - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] - 1, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head] - 1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI/2);
          head++;
        }
      }
    }
  
    // Right
    else if(r){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakex[head] == size - 1){
        
        checkmove(0, snakey[head], snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(0);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head] + 1, snakey[head], snakez[head]);

        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]+1);
          snakey.push(snakey[head]);
          snakez.push(snakez[head]);
          snakeangle.push(-Math.PI/2);
          head++;
        }
      }
    }
  
    // Forwards (Up)
    else if(u){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakey[head] == 0){
        checkmove(snakex[head], size - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(size - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] - 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] - 1);
          snakez.push(snakez[head]);
          snakeangle.push(Math.PI);
          head++;
        }
      }
    }
  
    // Backwards (Down)
    else if(d){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakey[head] == size - 1){
        checkmove(snakex[head], 0, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(0);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head] + 1, snakez[head]);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head] + 1);
          snakez.push(snakez[head]);
          snakeangle.push(0);
          head++;
        }
      }
    }
    
    // Upwards (shift)
    else if(top["wall"] && wall.checked && s){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakez[head] == size - 1){
        checkmove(snakex[head], snakey[head], 0);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(0);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[head], snakey[head], snakez[head] + 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] + 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Downwards (ctrl)
    else if(top["wall"] && wall.checked && c){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakez[head] == 0){
        checkmove(snakex[head], snakey[head], size - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(size - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
      
      // No wrap, can't go below the ground
      else if(snakez[head] == 0){
        stuck = 1;
      }
      
      // No wrap, can go down
      else {
        checkmove(snakex[head], snakey[head], snakez[head] - 1);
        
        if(!stuck){
        
          // Move head
          snakex.push(snakex[head]);
          snakey.push(snakey[head]);
          snakez.push(snakez[head] - 1);
          snakeangle.push(snakeangle[head]);
          head++;
        }
      }
    }
    
    // Get back (backspace or alt)
    else if(B){
      
      // Remove the record of the last move and place the snake there
      // NB: the snake can always get back, even if the head is there, because the head will also move when the tail will get back.
      if(head > snakelength){
        snakeangle.pop();
        snakex.pop();
        snakey.pop();
        snakez.pop();
        head--;
      }
    }
  
    // If a move key was pressed and snake is not stuck
    if(!stuck && (u || r || d || l || s || c || B)){
        
      // Update snake & camera position
      movesnake();
      
      // Check grid
      if(b.className == "editor playing"){
        checkgrid();
      }
      
      // Update snake & camera position again if needed
      movesnake();
      
      
      // Check is a new apple can appear
      checkapple();
      
      // Lock the keys for .1s unless there's an apple animation already locking them
      if(!lock){
        lock = 1;
        setTimeout("lock=0", 100);
      }
    }
  }
}

onkeyup = function(e){
  u = r = d = l = s = c = B = 0;
}