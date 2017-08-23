// HUB
// 30 x 30 cells

// When the page loads
onload = function(){
  
  debug = 1;
  
  emojis = [
    [24,22,"tree"],
    [7,7,"tree"],
    [9,6,"apple"],
    [5,8,"apple"],
    [22,22,"apple"],
    [24,21,"apple"],
  ];
  
  for(i in emojis){
    var emoji = {tree: "🌳", apple: "🍎"}[emojis[i][2]];
    
    objects.innerHTML += 
    `<div id=emoji${i} class="emoji ${emojis[i][2]}" style="left:${emojis[i][0]*sidesize}vh;top:${emojis[i][1]*sidesize}vh">${emoji}</div><div id=emojishadow${i} class="emojishadow ${emojis[i][2]}shadow" style="left:${emojis[i][0]*sidesize}vh;top:${emojis[i][1]*sidesize}vh">`+emoji;
  }
  
  if(debug){
    scene.style.transition='.2s';resetsnake();movesnake();snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake();
  }
  
  else{
    
    // Lock controls
    lock = 1;

    // Resize and place snake at the right place, slow it down
    setTimeout('resetsnake();movesnake();snakecubemove0.style.transition=".5s"',2000);
    
    // Head goes out of the ground
    setTimeout("snakex.push(snakex[head]);snakey.push(snakey[head]);snakez.push(0);snakeangle.push(snakeangle[head]);head++;movesnake()",6000);
    
    // Shake head and shadow
    setTimeout("snakecubemove0.style.transition='';snakeshadow0.style.transition=snakecuberotate0.style.transition='.2s';snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+-Math.PI/4+"rad)'",6500);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+Math.PI/4+"rad)'",7000);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='';",7500);
    
    // Reset custom transitions and unlock keyboard
    setTimeout("scene.style.transition='.2s';snakeshadow0.style.transition=snakecuberotate0.style.transition='';lock=0",9000);
  }
  
  
  // DEBUG
  
  // Camera rotation
  move_scene = function(){
    scene.style.transform = "translateX(-"+snakex[head]*sidesize+"vh)translateY(-"+snakey[head]*sidesize+"vh)translateZ(40vh)rotateX(40deg)rotateZ(" + rot + "rad)";
  }
}