// GAMEPLAY

// Snake

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
  if(top["size"]){
    sidesize = 32 / size;
  }
  
  head = snakelength - 1;
  
  if(!noresethistory){
    if(b.className == "editor"){
      for(i = 0; i < snakelength; i++){
        snakex[head - i] = -i;
        snakey[head - i] = ~~(size/2);
        snakez[head - i] = 0;
        snakeangle[head - i] = -Math.PI/2;
      }
    }
    
    if(b.className == "hub"){
      for(i = 0; i < snakelength; i++){
        snakex[head - i] = 15;
        snakey[head - i] = 15;
        snakez[head - i] = -i - 1;
        snakeangle[head - i] = 0;
      }
    }
  }
  
  // Draw all snake's cubes
  // The first one (the head) has a tongue (Y) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 6 * div
  for(i = 0; i < 16; i++){
    snake.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style="transform:translateX(50vh)translateY(50vh)translateZ(-10vh);width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake" id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=front>${i<1?"‿":""}</div><div class=up style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=right></div><div class=left></div><div class=back></div><div class=down>`;
  }

  // Put all the cubes at the right place
  movesnake();
}

// Move the snake
// when snakex/y/z and snakeangle have been updated (or reset)
movesnake = function(e){
  
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
    
    // Camera follow
    if(b.className == "hub"){
      scene.style.transform="translateX("+(-snakex[head]*sidesize)+"vh)translateY("+(-snakey[head]*sidesize)+"vh)translateZ(20vh)rotateX(40deg)";
      scene.style.transformOrigin=""+(snakex[head]*sidesize)+"vh "+(snakey[head]*sidesize)+"vh";
    }
  }
  for(i = snakelength; i < 16; i++){
    top["snakecubemove"+i].style.transform = `translateX(${snakex[head - snakelength]*sidesize+.5}vh)translateY(${snakey[head - snakelength]*sidesize+.5}vh)translateZ(${-100*sidesize}vh)`;
  }
};

// Check if a position is free and in bounds
checkmove = function(x,y,z){
  
  // Editor map boundaries
  if(b.className == "editor playing"){
    if(x < -5 || x > size + 3 || y < -2 || y > size){
      stuck = 1;
    }
  }
  
  // Hub boundaries
  if(b.className == "hub"){
    if(x < 0 || x > 30 || y < 0 || y > 30){
      stuck = 1;
    }
  }
  
  // Emoji hitbox
  for(var i in emojis){
    if(x == emojis[i][0] && y == emojis[i][1]){
      
      // Eat an apple
      if(emojis[i][2] == "apple"){
        delete emojis[i];
        top["emoji"+i].remove();
        top["emojishadow"+i].remove();
        snakelength++;
      }
      
      // Hit
      else {
        stuck = 1;
      }
    }
  }
  
  // Other snake cubes hitbox
  // NB: no need to check if the last cube (the tail) is there because when the snake will move, that cube won't be here anymore so we can take its place. Hence the "snakelengthe - 2"
  for(i = snakelength - 2; i > 0; i--){
    if(snakex[head - i] == x && snakey[head - i] == y && snakez[head - i] == z){
      stuck = 1;
    }
  }
}

// Check if the grid is solved
checkgrid = function(e){
  
  solved = 1;
  
  // Repaint everything in black and white
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      top[`g${i}${j}`].style.background = dg[i][j] ? "black" : "white";
      top[`w${i}${j}`].style.background = dw[i][j] ? "black" : "white";
    }
  }
  
  for(i = 0; i < snakelength; i++){
    
    // Paint the good cells in green and the bad ones in red (if they exist, hence the try/catch)
    try{
      top[`g${snakey[head - i]}${snakex[head - i]}`].style.background = dg[snakey[head - i]][snakex[head - i]] ? "green" : "red";
      top[`w${size - 1 - snakez[head - i]}${snakex[head - i]}`].style.background = dw[size - 1 - snakez[head - i]][snakex[head - i]] ? "green" : "red";
    }
    catch(e){}
  
    // If a snake part is out of the grid, not solved
    if(snakex[head - i] < 0 || snakex[head - i] > size - 1 || snakey[head - i] < 0 || snakey[head - i] > size - 1 || snakez[head - i] < 0 || snakez[head - i] > size - 1){
      solved = 0;
    }
  
    // If a snake part is at a place where it shouldn't be, not solved
    if(ground.checked && dg[snakey[head - i]] && !dg[snakey[head - i]][snakex[head - i]]){
      solved = 0;
    }
    
    if(wall.checked && dw[size - 1 - snakez[head - i]] && !dw[size - 1 - snakez[head - i]][snakex[head - i]]){
      solved = 0;
    }
  }
  
  // If a snake part is not at a place where it should be, not solved
  for(i = 0; i < size; i++){
    for(j = 0; j < size; j++){
      if(ground.checked && top[`g${i}${j}`].style.backgroundColor == "black"){
        solved = 0;
      }
      if(wall.checked && top[`w${i}${j}`].style.backgroundColor == "black"){
        solved = 0;
      }
    }
  }
  
  if(solved){
    setTimeout('alert("SOLVED")',300);
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
  
    // If a move key was pressed
    if(!stuck && (u || r || d || l || s || c || B)){
        
      // Update snake position
      movesnake();
      
      // Check grid
      if(b.className == "editor playing"){
        checkgrid();
      }
      
      lock = 1;
      setTimeout("lock=0", 100);
    }
  }
}

onkeyup = function(e){
  u = r = d = l = s = c = B = 0;
}