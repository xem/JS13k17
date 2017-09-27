touchintervals = [];

ac = new AirConsole({orientation : AirConsole.ORIENTATION_LANDSCAPE});

/*up.onclick = function() {
    ac.message(AirConsole.SCREEN, 'up')
}

down.onclick = function() {
    ac.message(AirConsole.SCREEN, 'down')
}*/


window["TS"] = (n) => {
  if(touchintervals[n]){
    clearInterval(touchintervals[n]);
  }
  
  // onkeydown({which:n});
  ac.message(AirConsole.SCREEN, n);
  touchintervals[n] = setInterval(()=>{
    ac.message(AirConsole.SCREEN, n);
    // onkeydown({which: n});
  },150);
};

window["TE"] = (n) => {
  setTimeout(()=>{
    clearInterval(touchintervals[n]);
    //onkeyup();
  },150);
};
