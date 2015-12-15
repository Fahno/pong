var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var targetFPS = 60;
var delta = 0, then = 0, now  = 0;
var gameObjects = [];
var left = false, right = false, a = false, d = false;

var gameObject = function(x, y, width, height, id) {
  gameObjects[gameObjects.length] = {
    x: x,
    y: y,
    width: width,
    height: height,
    id: id
  };
}

var update = function() {
  console.log("a: " + a + ", right: " + right);
};

var render = function() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.fillStyle = "white";
  for(var i = 0; i < gameObjects.length; i++) {
    curObject = gameObjects[i];
    ctx.fillRect(curObject.x, curObject.y, curObject.width, curObject.height);
  }
  
};

var mainGameLoop = function () {
  
  now = new Date().getTime();
  delta += now - then;
  then = now;

  if(delta >= 1000) {
    update();
    delta = 0;
  }
  
  console.log(gameObjects);
  
  render();
  window.requestAnimationFrame(mainGameLoop);
};

var init = function() {
  gameObject(window.innerWidth / 2 - 10 / 2, window.innerHeight / 2 - 10 / 2, 10, 10, "ball");
  gameObject(window.innerWidth / 2 - 70 / 2, 0, 70, 10, "topPaddle");
  gameObject(window.innerWidth / 2 - 70 / 2, window.innerHeight - 10, 70, 10, "bottomPaddle");

  document.addEventListener('keydown', function(event) {
    if(event.keyCode === 37) { left = true } else { left = false }
    if(event.keyCode === 39) { right = true } else { right = false }
    if(event.keyCode === 97) { a = true } else { a = false }
    if(event.keyCode === 100) { d = true } else { d = false }
  });
};

init();
mainGameLoop();