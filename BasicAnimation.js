
var canvas = document.getElementById("canvas");

alert("look here");
var ctx = canvas.getContext("2d");

var grid_unit = 10;
var dino = new Dino(0,0);
var dino2 = new Dino(0,200);
var clip_x = 1440;
var clip_y = 0;
var clip_x2 = 1440;
var clip_y2 = 0;
var timer;


function Dino(x,y) {
  this.x = x;
  this.y = y;
  this.width = 20 * grid_unit;
  this.height = 20 * grid_unit;
}

function doKeyDown(e) {
  if (e.keyCode == 37) {
    clip_x = 2160;
    if (dino.x - grid_unit > 0)
      dino.x -= grid_unit;
  }
  else if (e.keyCode == 39) {
    clip_x = 1440;
    if (dino.x + grid_unit + dino.width < canvas.width)
      dino.x += grid_unit;
  }
  else if (e.keyCode == 40) {
    clip_x = 720;
    if (dino.y + grid_unit + dino.height < canvas.height)
      dino.y += grid_unit;
  }
  else if (e.keyCode == 38) {
    clip_x = 0;
    if (dino.y - grid_unit > 0)
      dino.y -= grid_unit;
  }
  else if (e.keyCode == 32) {
    clip_y = 720;
    setTimeout(function() {
      clip_y = 0;
    },300)
  }


  else if (e.keyCode == 65) {
    clip_x2 = 2160;
    if (dino2.x - grid_unit > 0)
      dino2.x -= grid_unit;
  }
  else if (e.keyCode == 68) {
    clip_x2 = 1440;
    if (dino2.x + grid_unit + dino2.width < canvas.width)
      dino2.x += grid_unit;
  }
  else if (e.keyCode == 83) {
    clip_x2 = 720;
    if (dino2.y + grid_unit + dino2.height < canvas.height)
      dino2.y += grid_unit;
  }
  else if (e.keyCode == 87) {
    clip_x2 = 0;
    if (dino2.y - grid_unit > 0)
      dino2.y -= grid_unit;
  }
  else if (e.keyCode == 88) {
    clip_y2 = 720;
    setTimeout(function() {
      clip_y2 = 0;
    },300)
  }

}


function init() {
  window.addEventListener("keydown",doKeyDown,false);
  Dino = document.getElementById("dino");
  Dino2 = document.getElementById("dino2");
  Info = document.getElementById("info");
  Info2 = document.getElementById("info2");
  
  timer = setInterval(draw, 10);
  return timer;
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgb(240,240,240)";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  ctx.drawImage(Dino, clip_x, clip_y, 720, 720, dino.x, dino.y, dino.width, dino.height);
  ctx.drawImage(Dino2, clip_x2, clip_y2, 720, 720, dino2.x, dino2.y, dino2.width, dino2.height);

  ctx.drawImage(info, 0, 450, 150, 150);
  ctx.drawImage(info2, 650, 450, 150, 150);
}