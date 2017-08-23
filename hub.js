// HUB
// 30 x 30 cells

// When the page loads
onload = function(){
  
  debug = 0;
  
  emoji = [
    [24,22,"tree"],
    [7,7,"tree"],
  ];
  
  for(i in emoji){
    objects.innerHTML += 
    `<div class="emoji ${emoji[i][2]}" style="left:${emoji[i][0]*sidesize}vh;top:${emoji[i][1]*sidesize}vh">🌳</div><div class="emojishadow ${emoji[i][2]}shadow" style="left:${emoji[i][0]*sidesize}vh;top:${emoji[i][1]*sidesize}vh">🌳`;
  }
  
  if(debug){
    scene.style.transition='.2s';resetsnake();movesnake();advance();snakez[0]++;movesnake();
  }
  
  else{
    
    // Lock controls
    lock = 1;

    // Resize and place snake at the right place, slow it down
    setTimeout('resetsnake();movesnake();snakecubemove0.style.transition=".5s"',2000);
    
    // Head goes out of the ground
    setTimeout("advance();snakez[0]++;movesnake()",4000);
    
    // Shake head and shadow
    setTimeout("snakecubemove0.style.transition='';snakeshadow0.style.transition=snakecuberotate0.style.transition='.2s';snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+-Math.PI/4+"rad)'",4500);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='rotateZ("+Math.PI/4+"rad)'",5000);
    setTimeout("snakeshadow0.style.transform=snakecuberotate0.style.transform='';",5500);
    
    // Reset custom transitions and unlock keyboard
    setTimeout("scene.style.transition='.2s';snakeshadow0.style.transition=snakecuberotate0.style.transition='';lock=0",7000);
  }
  
  
  // Camera rotation
  rot = 0;
  move_scene = function(){
    scene.style.transform = "translateX(-"+snakex[0]*sidesize+"vh)translateY(-"+snakey[0]*sidesize+"vh)translateZ(30vh)rotateX(35deg)rotateZ(" + rot + "rad)";
  }
  b_rl.onclick = function(){rot -= Math.PI/4; move_scene()};
  b_rr.onclick = function(){rot += Math.PI/4; move_scene()};

}