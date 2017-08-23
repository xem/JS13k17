// GAMEPLAY

// Advance
// Each snake cube > 0 gets the position, angle and wrap of the previous cube
advance = function(e){
  for(i = snakelength - 1; i > 0; i--){
    snakeangle[i] = snakeangle[i-1];
    snakex[i] = snakex[i-1];
    snakey[i] = snakey[i-1];
    snakez[i] = snakez[i-1];
  }
}

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
  for(var i in emoji){
    if(x == emoji[i][0] && y == emoji[i][1]){
      stuck = 1;
    }
  }
  
  // here, "+snakelengthe - 2" means that we don't check if the last cube of the snake is where we want to go. We don't need to check it because we already know that it will move elsewhere as soon as the rest of the snake advances, so the head can always take its place.  
  for(i = snakelength - 2; i > 0; i--){
    if(snakex[i] == x && snakey[i] == y && snakez[i] == z){
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
      top[`g${snakey[i]}${snakex[i]}`].style.background = dg[snakey[i]][snakex[i]] ? "green" : "red";
      top[`w${size-1-snakez[i]}${snakex[i]}`].style.background = dw[size-1-snakez[i]][snakex[i]] ? "green" : "red";
    }catch(e){}
  
    // If a snake part is out of the grid, not solved
    if(snakex[i] < 0 || snakex[i] > size - 1 || snakey[i] < 0 || snakey[i] > size - 1 || snakez[i] < 0 || snakez[i] > size - 1){
      solved = 0;
    }
  
    // If a snake part is at a place where it shouldn't be, not solved
    if(ground.checked && dg[snakey[i]] && !dg[snakey[i]][snakex[i]]){
      solved = 0;
    }
    
    if(wall.checked && dw[size - 1 - snakez[i]] && !dw[size - 1 - snakez[i]][snakex[i]]){
      solved = 0;
    }
  }
  
  // If a snake part is not at a place where it should be, not solved
  for(i = 0; i < +size; i++){
    for(j = 0; j < +size; j++){
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
stuck = 0;
onkeydown = function(e){
  
  // Update u/d/l/r flags
  top['lurd************************l**r************l*d***u**u'[e.which - 37]] = 1;
  
  // Shift = 16
  if(e.which == 16){
    s = 1;
  }
  
  // Ctrl = 17
  if(e.which == 17){
    c = 1;
  }

  // Allow F5 = 116 / Ctrl = 17 / R = 82, F12 = 123, disable the rest
  if(e.keyCode != 116 && e.keyCode != 82 && e.keyCode != 17 && e.keyCode != 123){
    e.preventDefault();
  }
  
  var inbounds = 0;
  if(puzzling && snakex[0] >= 0 && snakex[0] < size && snakey[0] >= 0 && snakey[0] < size && snakez[0] >= 0 && snakez[0] < size){
    inbounds = 1;
  }
  
  if(playing && !lock){
    
    stuck = 0;
      
    // Left
    if(l){
      
      // Angle
      if(snakex[1] != snakex[0] - 1){
        snakeangle[0] = Math.PI/2;
      }
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakex[0] == 0){
        checkmove(size - 1, snakey[0], snakez[0]);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakex[0] = size - 1;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[0] - 1, snakey[0], snakez[0]);
        
        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakex[0]--;
        }
      }
    }
  
    // Right
    else if(r){
      
      // Angle
      if(snakex[1] != snakex[0] + 1){
        snakeangle[0] = -Math.PI/2;
      }
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakex[0] == size - 1){
        
        checkmove(0, snakey[0], snakez[0]);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakex[0] = 0;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[0]+1, snakey[0], snakez[0]);

        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakex[0]++;
        }
      }
    }
  
    // Forwards (Up)
    else if(u){
      
      // Angle
      if(snakey[1] != snakey[0] - 1){
        snakeangle[0] = Math.PI;
      }
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakey[0] == 0){
        checkmove(snakex[0], size - 1, snakez[0]);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakey[0] = size - 1;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[0], snakey[0] - 1, snakez[0]);
        
        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakey[0]--;
        }
      }
    }
  
    // Backwards (Down)
    else if(d){
      
      // Angle
      if(snakey[1] != snakey[0] + 1){
        snakeangle[0] = 0;
      }
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakey[0] == size - 1){
        checkmove(snakex[0], 0, snakez[0]);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakey[0] = 0;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[0], snakey[0] + 1, snakez[0]);
        
        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakey[0]++;
        }
      }
    }
    
    // Upwards (shift)
    else if(top["wall"] && wall.checked && s){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakez[0] == size - 1){
        checkmove(snakex[0], snakey[0], 0);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakez[0] = 0;
        }
      }
      
      // No wrap
      else {
        checkmove(snakex[0], snakey[0], snakez[0] + 1);
        
        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakez[0]++;
        }
      }
    }
    
    // Downwards (ctrl)
    else if(top["wall"] && wall.checked && c){
      
      // Wrap
      if(top["wrap"] && wrap.checked && inbounds && snakez[0] == 0){
        checkmove(snakex[0], snakey[0], size - 1);
        
        if(!stuck){
        
          // Move tail
          advance();
        
          // Move head
          snakez[0] = size - 1;
        }
      }
      
      // No wrap, can't go below the ground
      else if(snakez[0] == 0){
        stuck = 1;
      }
      
      // No wrap
      else {
        checkmove(snakex[0], snakey[0], snakez[0] - 1);
        
        if(!stuck){
      
          // Move tail
          advance();
        
          // Move head
          snakez[0]--;
        }
      }
    }
  
    // If a move key was pressed
    if(u || r || d || l || s || c){
        
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
  u = r = d = l = s = c = 0;
}