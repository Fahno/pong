var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var then = new Date().getTime(), now, delta = 0;
var targetUps = 120;
var p, l, s, w;
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
		this.y -= p === true ? paddleSpeed : 0;
		this.y += l === true ? paddleSpeed : 0;
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

	window.requestAnimationFrame(mainGameLoop);
}

function render() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ball.render();
	paddleLeft.render();
	paddleRight.render();

	ctx.fillStyle = "white";
	ctx.fillText(leftScore, 20, 20);
	ctx.fillText(rightScore, canvas.width - 20, 20);
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
		case 80:
			p = true;
			break;
		case 76:
			l = true;
			break;
		case 87:
			w = true;
			break;
		case 83:
			s = true;
			break;
		default:
			break;
	}
});

document.addEventListener('keyup', function(event) {
	switch(event.keyCode) {
		case 80:
			p = false;
			break;
		case 76:
			l = false;
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
