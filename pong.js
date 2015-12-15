var canvas = getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
var targetFPS = 60;
var delta, then, now;
var date = new Date();

var paddle = function() {
  this.width = 150;
  this.height = 5;
  
  this.x = width / 2 - this.width / 2;
  this.y = (pos == "top") ? 0 : height; 
};

var update = function() {

};

var render = function() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
};

var mainGameLoop = function () {
  now = date.getTime();
  delta += now - then;
  then = now;
  
  if(delta >= 1000) {
    update();
  }
  render();
  window.requestAnimationFrame(mainGameLoop);
};
