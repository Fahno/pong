var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var then = new Date().getTime(), now, delta = 0;
var targetUps = 120;
var k, m, s, w, pause;
var paddleSpeed = 7, ballSpeedX = 5, ballSpeedY = 5;
var leftScore = 0, rightScore = 0;
var resizeFactorX = 1, resizeFactorY = 1;
//1280 * 650 normal 16:9 resolution (inner window)

canvas.width = 1280;
canvas.height = 650;

var ball = {
	x: canvas.width / 2 - 10 / 2,
	y: canvas.height / 2 - 10 / 2,
	width: 10,
	height: 10,
	velY: chooseNumber(ballSpeedY, -ballSpeedY),
	velX: chooseNumber(ballSpeedX, -ballSpeedX),
	render: function() {
		ctx.fillStyle = "black";
		ctx.fillRect(this.x - 1, this.y - 1, this.width + 2, this.height + 2);
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},

	update: function() {
		this.x += this.velX;
		this.y += this.velY;

		if(checkCollision(this, paddleLeft)) {
			this.velX *= -1;
			this.velY = ballSpeedY * 1.5 * ((this.y - (paddleLeft.y + paddleLeft.height / 2)) / paddleRight.height);
		}

		if(checkCollision(this, paddleRight)) {
			this.velX *= -1;
			this.velY = ballSpeedY * 1.5 * ((this.y - (paddleRight.y + paddleRight.height / 2)) / paddleRight.height);
		}

		if(this.y <= 0 || this.y + this.height >= canvas.height) {
			this.velY *= -1;
		}

		if(this.x + this.width > canvas.width || this.x < 0) {
			leftScore += this.x > canvas.width / 2 ? 1 : 0;
			rightScore += this.x < canvas.width / 2 ? 1 : 0;
			this.x = canvas.width / 2 - 10 / 2;
			this.y = canvas.height / 2 - 10 / 2;
			this.velY = chooseNumber(ballSpeedY, -ballSpeedY);
			this.velX = chooseNumber(ballSpeedX, -ballSpeedX);
		}
	}
};

var paddleLeft = {
	x: 10,
	y : canvas.height / 2 - 70 / 2,
	width : 5,
	height : 70,
	render: function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},

	update: function() {
		this.y += s === true ? paddleSpeed : 0;
		this.y -= w === true ? paddleSpeed : 0;
		this.y = clamp(this.y, 0, canvas.height - this.height);
	}
};

var paddleRight = {
	x: canvas.width - 15,
	y : canvas.height / 2 - 50 / 2,
	width : 5,
	height : 70,
	render: function() {
		ctx.fillStyle = "white";
		ctx.fillRect(this.x, this.y, this.width, this.height);
	},

	update: function() {
		this.y -= k === true ? paddleSpeed : 0;
		this.y += m === true ? paddleSpeed : 0;
		this.y = clamp(this.y, 0, canvas.height - this.height);
	}
};

function clamp(v, min, max) {
	v = v < min ? min : v;
	v = v > max ? max : v;
	return v;
}

function chooseNumber(v1, v2) {
	rand = Math.random();
	if(rand < 0.50)
		return v1;
	else
		return v2;
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

	if(delta >= 1000 / targetUps) {
		update();
		delta = 0;
	}

	render();

	if(pause) {
		targetUps = 0;
	} else {
		targetUps = 120;
	}

	window.requestAnimationFrame(mainGameLoop);
}

function render() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ball.render();
	paddleLeft.render();
	paddleRight.render();

	ctx.fillStyle = "white";
	for(var i = 0; i <= 15; i++) {
		ctx.fillRect(canvas.width / 2 - ball.width / 2, canvas.height / 30 * i * 2, ball.width, canvas.height / 30);
	}
	ctx.font = "30px Arial Rounded MT Bold";
	ctx.fillText(leftScore, 10, 25);
	ctx.fillText(rightScore, canvas.width - 30, 25);
	if(pause) {
		ctx.fillText("Paused", canvas.width / 2.1, canvas.height / 2.1);
	}
}

function update() {
	ball.update();
	paddleLeft.update();
	paddleRight.update();
}

function resize() {
	resizeFactorX = window.innerWidth / canvas.width;
	resizeFactorY = window.innerHeight / canvas.height;

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	paddleLeft.width *= resizeFactorX;
	paddleLeft.height *= resizeFactorY;
	paddleLeft.x *= resizeFactorX;
	paddleLeft.y *= resizeFactorY;

	paddleRight.width *= resizeFactorX;
	paddleRight.height *= resizeFactorY;
	paddleRight.x *= resizeFactorX;
	paddleRight.y *= resizeFactorY;

	ball.width *= resizeFactorX;
	ball.height *= resizeFactorY;
	ball.x *= resizeFactorX;
	ball.y *= resizeFactorY;
	ball.velX *= resizeFactorX;
	ball.velY *= resizeFactorY;

	ballSpeedX *= resizeFactorX;
	ballSpeedY *= resizeFactorY;
	paddleSpeed *= resizeFactorX;
}

window.addEventListener('resize', resize);

document.addEventListener('keydown', function(event) {
	switch(event.keyCode) {
		case 75:
			k = true;
			break;
		case 77:
			m = true;
			break;
		case 87:
			w = true;
			break;
		case 83:
			s = true;
			break;
		case 80:
		 pause = !pause;
		 break;
		default:
			break;
	}
});

document.addEventListener('keyup', function(event) {
	switch(event.keyCode) {
		case 75:
			k = false;
			break;
		case 77:
			m = false;
			break;
		case 87:
			w = false;
			break;
		case 83:
			s = false;
			break;
		default:
			break;
	}
});

resize();
mainGameLoop();
