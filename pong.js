var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var then = new Date().getTime(), now, delta = 0;
var targetUPS = 10;
var left, right, a, d; 
var paddleSpeed = 7;
var topScore = 0, bottomScore = 0;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ball = {
	x: canvas.width / 2 - 10 / 2,
	y: canvas.height / 2 - 10 / 2,
	width: 10,
	height: 10,
	velX: chooseNumber(4, 6, -4, -6),
	velY: chooseNumber(4, 6, -4, -6),
	render: function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	
	update: function() {
		this.x += this.velX;
		this.y += this.velY;
		
		if(checkCollision(this, paddleTop) || checkCollision(this, paddleBottom) && (this.x > paddleTop.x + paddleTop.width || this.x > paddleBottom.x + paddleBottom.width || this.x + this.width < paddleTop.x || this.x + this.width < paddleBottom.x)) {
			this.velX *= -1;
			return;
		}
		
		if(checkCollision(this, paddleTop) || checkCollision(this, paddleBottom)) {
			this.velY *= -1;
		}
		
		if(this.x + this.width >= canvas.width || this.x <= 0) {
			this.velX *= -1;
		}
		
		if(this.y < 0 - this.width || this.y > canvas.height) {
			topScore += this.y > canvas.height / 2 ? 1 : 0;
			bottomScore += this.y < canvas.height / 2 ? 1 : 0;
			this.x = canvas.width / 2 - 10 / 2;
			this.y = canvas.height / 2 - 10 / 2;
			this.velX = chooseNumber(4, 6, -4, -6);
			this.velY = chooseNumber(4, 6, -4, -6);
			this.velX *= 1.1;
			this.velY *= 1.1;
			paddleSpeed *= 1.1;
		}
		
		
	}
};

var paddleTop = {
	x: canvas.width / 2 - 70 / 2,
	y : 0,
	width : 70,
	height : 5,
	render: function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	
	update: function() {
		this.x -= a === true ? paddleSpeed : 0;
		this.x += d === true ? paddleSpeed : 0;
	}
};

var paddleBottom = {
	x: canvas.width / 2 - 70 / 2,
	y : canvas.height - 5,
	width : 70,
	height : 5,
	render: function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},
	
	update: function() {
		this.x -= left === true ? paddleSpeed : 0;
		this.x += right === true ? paddleSpeed : 0;
	}
};

function chooseNumber(v1, v2, v3, v4) {
	rand = Math.random();
	if(rand < 0.25)
		return v1;
	else if(rand < 0.50)
		return v2;
	else if(rand < 0.75)
		return v3;
	else
		return v4;
}

function checkCollision(ball, paddle) {
	if (ball.x < paddle.x + paddle.width && ball.x + ball.width > paddle.x && ball.y < paddle.y + paddle.height && ball.height + ball.y > paddle.y) {
		return true;
	}
	return false
}

function mainGameLoop() {
	now = new Date().getTime();
	delta += now - then;
	then = now;
	
	if(delta >= 1000 / targetUPS) {
		update();
		delta = 0;
	}
	
	render();
	
	window.requestAnimationFrame(mainGameLoop);
}

function render() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ball.render();
	paddleTop.render();
	paddleBottom.render();
	
	ctx.fillStyle = "white";
	ctx.fillText(bottomScore, 0, canvas.height - 20);
	ctx.fillText(topScore, 0, 20);
}

function update() {
	ball.update();
	paddleTop.update();
	paddleBottom.update();
}

window.addEventListener('resize', function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

document.addEventListener('keydown', function(event) {
	switch(event.keyCode) {
		case 37:
			left = true;
			break;
		case 39:
			right = true;
			break;
		case 65:
			a = true;
			break;
		case 68:
			d = true;
			break;
		default:
			break;
	}
});

document.addEventListener('keyup', function(event) {
	switch(event.keyCode) {
		case 37:
			left = false;
			break;
		case 39:
			right = false;
			break;
		case 65:
			a = false;
			break;
		case 68:
			d = false;
			break;
		default:
			break;
	}
});

mainGameLoop();