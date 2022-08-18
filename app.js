const balls = [new Ball({ posx: 200, posy: 500, r: 1, vely: -0.07 }), new Ball({ posx: 650, posy: 400, r: 25 }), new Ball({ posx: 800, posy: 700, r: 5, velx: 0.1 }), new Ball({ posx: 860, posy: 700, r: 0.5, vely: 0.05, velx: 0.1 })];
const minFrameTime = 30;
let prevCalcTime = 0;
let prevDrawTime = 0;
let paused = true;

const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.id = 'canvas';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');

function toDrawOrNot() {
	if (balls.length > 0
		&& window.performance.now() - minFrameTime >= prevDrawTime) return draw(); else return false;
}
let calcStartTime = window.performance.now();
function update() {
	const now = window.performance.now();
	prevCalcTime = now - calcStartTime;
	if (paused) return;
	calcStartTime = now;
	// force update
	for (ball of balls) {
		ball.accx = 0;
		ball.accy = 0;
	}
	for (let i = 0; i < balls.length - 1; i++) {
		const ball1 = balls[i];
		for (let j = i + 1; j < balls.length; j++) {
			const ball2 = balls[j];
			const dx = (ball2.posx - ball1.posx) * 10;
			const dy = (ball2.posy - ball1.posy) * 10;
			const distsq = dx ** 2 + dy ** 2;
			const force = ball1.mass() * ball2.mass() / distsq;
			ball1.accx += ball2.mass() / distsq * Math.cos(Math.atan(dy / dx)) * (ball1.posx > ball2.posx ? -1 : 1);
			ball1.accy += ball2.mass() / distsq * Math.sin(Math.atan(dy / dx)) * (ball1.posx > ball2.posx ? -1 : 1);
			ball2.accx += ball1.mass() / distsq * Math.cos(Math.atan(dy / dx)) * (ball2.posx > ball1.posx ? -1 : 1);
			ball2.accy += ball1.mass() / distsq * Math.sin(Math.atan(dy / dx)) * (ball2.posx > ball1.posx ? -1 : 1);
			console.log(ball1.accx,
ball1.accy,
ball2.accx,
ball2.accy);
console.log('ball1 x', ball1.posx, 'ball2 x', ball2.posx);
			// when this objects (1) x is greater than the other's (2), flip x&y of this
		}
	}
	// velocity update
	for (ball of balls) {
		ball.velx += ball.accx * prevCalcTime;
		ball.vely += ball.accy * prevCalcTime;
	}
	// pos update
	for (ball of balls) {
		ball.posx += ball.velx * prevCalcTime;
		ball.posy += ball.vely * prevCalcTime;
	}
	console.log(prevCalcTime);
	if (now >= prevDrawTime + minFrameTime) toDrawOrNot();
	window.requestAnimationFrame(update);
}
ctx.fillStyle = '#ffffff';
ctx.strokeStyle = '#ff0000';
function draw() {
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	prevDrawTime = window.performance.now();
	balls.forEach((ball, i) => {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#ff5555';
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.arc(ball.posx, ball.posy, ball.r * 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.beginPath()
		ctx.moveTo(ball.posx, ball.posy);
		ctx.lineTo(ball.posx + ball.accx * 1000000, ball.posy + ball.accy * 1000000);
		ctx.stroke();
		ctx.font = "30px Arial";
		ctx.fillText('ball ' + (i + 1), ball.posx + 20, ball.posy - 20);
	});
}

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	toDrawOrNot();
};

draw();
