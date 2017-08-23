// Snake

// Reset the snake's positions and angles
resetsnake = function(e){
  
  // Delete the snake
  snake.innerHTML = "";
      
  // Reset positions & angles
  snakex = [];
  snakey = [];
  snakez = [];
  oldsnakex = [];
  oldsnakey = [];
  oldsnakez = [];
  snakeangle = [];
  
  // Compute cubes sizes in vh (editor only)
  if(top["size"]){
    sidesize = 32 / size;
  }
  
  if(b.className == "editor"){
    for(i = 0; i < snakelength; i++){
      oldsnakex[i] = snakex[i] = -1 - i;
      oldsnakey[i] = snakey[i] = ~~(size/2);
      oldsnakez[i] = snakez[i] = 0;
      snakeangle[i] = -Math.PI/2;
    }
  }
  
  if(b.className == "hub"){
    for(i = 0; i < snakelength; i++){
      oldsnakex[i] = snakex[i] = 15;
      oldsnakey[i] = snakey[i] = 15;
      oldsnakez[i] = snakez[i] = -i - 1;
      snakeangle[i] = 0;
    }
  }
  
  // Draw all snake's cubes
  // The first one (the head) has a tongue (Y) and eyes (👀)
  // DOM for each cube: #snakecubemove${i} > #snakecuberotate${i} > #snakecube${i} > 6 * div
  for(i = 0; i < snakelength; i++){
    snake.innerHTML += `<div id=snakecubemove${i} class=snakecubemove style="width:${sidesize-1}vh;height:${sidesize-1}vh"><div class=snakeshadow id=snakeshadow${i}></div><div id=snakecuberotate${i} class=snakecuberotate><div class="cube snake" id=snakecube${i}>${i<1?"<div class=tongue>Y</div>":""}<div class=front>${i<1?"‿":""}</div><div class=up style="font-size:${sidesize*.5}vh;line-height:${sidesize*.8}vh">${i<1?"👀":""}</div><div class=right></div><div class=left></div><div class=back></div><div class=down>`;
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
      if(oldsnakex[i] == 0 && snakex[i] == size - 1){
        wrapping = 1;
        oldx = -1;
        newx = size;
        oldy = newy = snakey[i];
        oldz = newz = snakez[i];
      }
      
      // Right
      if(oldsnakex[i] == size - 1 && snakex[i] == 0){
        wrapping = 1;
        oldx = size;
        newx = -1;
        oldy = newy = snakey[i];
        oldz = newz = snakez[i];
      }
      
      // Forwards
      if(oldsnakey[i] == 0 && snakey[i] == size - 1){
        wrapping = 1;
        oldy = -1;
        newy = size;
        oldx = newx = snakex[i];
        oldz = newz = snakez[i];
      }
      
      // Backwards
      if(oldsnakey[i] == size - 1 && snakey[i] == 0){
        wrapping = 1;
        oldy = size;
        newy = -1;
        oldx = newx = snakex[i];
        oldz = newz = snakez[i];
      }
      
      // Upwards
      if(oldsnakez[i] == 0 && snakez[i] == size - 1){
        wrapping = 1;
        oldz = -1;
        newz = size;
        oldx = newx = snakex[i];
        oldy = newy = snakey[i];
      }
      
      // Downwards
      if(oldsnakez[i] == size - 1 && snakez[i] == 0){
        wrapping = 1;
        oldz = size;
        newz = -1;
        oldx = newx = snakex[i];
        oldy = newy = snakey[i];
      }
    }
    
    // Wrapping transition
    if(wrapping){
      
      // Rotate
      top["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[i]}rad)`;
      
      // Disappear after the wrap start
      top["snakecubemove"+i].style.transform = `translateX(${oldx*sidesize+.5}vh)translateY(${oldy*sidesize+.5}vh)translateZ(${oldz*sidesize+.5}vh)scale(.01)scaleZ(.01)`;
      
      // Disable transitions
      setTimeout("snakecubemove"+i+".style.transition='none'", 150);
      
      // Move cube at the position before the end of the wrap
      setTimeout("snakecubemove"+i+".style.transform=`translateX(${"+newx+"*sidesize+.5}vh)translateY(${"+newy+"*sidesize+.5}vh)translateZ(${"+newz+"*sidesize+.5}vh)scale(.01)`", 175);
      
      // Reenable transitions and finish the wrap
      setTimeout("snakecubemove"+i+".style.transition='';snakecubemove"+i+".style.transform=`translateX(${snakex["+i+"]*sidesize+.5}vh)translateY(${snakey["+i+"]*sidesize+.5}vh)translateZ(${snakez["+i+"]*sidesize+.5}vh)`", 200);
    }
    
    // Normal transition (just update snakecubemove and snakecuberotate)
    else{
      top["snakecubemove"+i].style.transform = `translateX(${snakex[i]*sidesize+.5}vh)translateY(${snakey[i]*sidesize+.5}vh)translateZ(${snakez[i]*sidesize+.9}vh)`;
      top["snakecuberotate"+i].style.transform = `rotateZ(${snakeangle[i]}rad)`;
    }
    
    // Shadow
    top["snakeshadow"+i].style.display = snakez[i] == 0 ? "" : "none";
    
    // Update oldsnakex/y/z positions
    oldsnakex[i] = snakex[i];
    oldsnakey[i] = snakey[i];
    oldsnakez[i] = snakez[i];
    
    // Camera follow
    if(b.className == "hub"){
      scene.style.transform="translateX("+(-snakex[0]*sidesize)+"vh)translateY("+(-snakey[0]*sidesize)+"vh)translateZ(30vh)rotateX(40deg)";
      scene.style.transformOrigin=""+(snakex[0]*sidesize)+"vh "+(snakey[0]*sidesize)+"vh";
    
    }
  }
};