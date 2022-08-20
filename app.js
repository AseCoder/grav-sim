const balls = [
	new Ball({ posx: 830, posy: 400, r: 1, vely: -0.28, name: 'Mercury', color: '#938f7f' }),
	new Ball({ posx: 1000, posy: 400, r: 15, color: '#ffee55', name: 'Sun' }),
	new Ball({ posx: 1000, posy: 850, r: 6, velx: 0.18, color: '#3366ff', name: 'Earth' }),
	new Ball({ posx: 1050, posy: 850, r: 0.5, vely: 0.13, velx: 0.18, name: 'Moon' })];
const minFrameTime = 30;
const distMulti = 15;
const config = {
	drawAccVectors: false,
	accVectorLength: 50000
}
const viewportDragOffset = [0, 0];
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
			const dx = (ball2.posx - ball1.posx) * distMulti;
			const dy = (ball2.posy - ball1.posy) * distMulti;
			const distsq = dx ** 2 + dy ** 2;
			ball1.accx += ball2.mass() / distsq * Math.cos(Math.atan(dy / dx)) * (ball1.posx > ball2.posx ? -1 : 1);
			ball1.accy += ball2.mass() / distsq * Math.sin(Math.atan(dy / dx)) * (ball1.posx > ball2.posx ? -1 : 1);
			ball2.accx += ball1.mass() / distsq * Math.cos(Math.atan(dy / dx)) * (ball2.posx > ball1.posx ? -1 : 1);
			ball2.accy += ball1.mass() / distsq * Math.sin(Math.atan(dy / dx)) * (ball2.posx > ball1.posx ? -1 : 1);
			// when this objects (1) x is greater than the other's (2), flip x&y of this
		}
	}
	// velocity update
	for (ball of balls) {
		ball.velx += ball.accx * prevCalcTime;
		ball.vely += ball.accy * prevCalcTime;
	}
	if (now >= prevDrawTime + minFrameTime) toDrawOrNot();
	// pos update
	for (ball of balls) {
		ball.posx += ball.velx * prevCalcTime;
		ball.posy += ball.vely * prevCalcTime;
		ball.newPosHistory();
	}
	// console.log(prevCalcTime);
	window.requestAnimationFrame(update);
}
ctx.fillStyle = '#ffffff';
function draw() {
	ctx.lineWidth = 10;
	ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
	prevDrawTime = window.performance.now();
	ctx.translate(...viewportDragOffset);
	// lines
	const diff = 180;
	ctx.strokeStyle = '#0b0e18';
	for (let i = Math.ceil(-viewportDragOffset[0] / diff); i < Math.ceil((canvas.width - viewportDragOffset[0]) / diff); i++) {
		ctx.beginPath();
		ctx.moveTo(i * diff, 0 - viewportDragOffset[1]);
		ctx.lineTo(i * diff, canvas.height - viewportDragOffset[1]);
		ctx.stroke();
	}
	for (let i = Math.ceil(-viewportDragOffset[1] / diff); i < Math.ceil((canvas.height - viewportDragOffset[1]) / diff); i++) {
		ctx.beginPath();
		ctx.moveTo(0 - viewportDragOffset[0], i * diff);
		ctx.lineTo(canvas.width - viewportDragOffset[0], i * diff);
		ctx.stroke();
	}
	// balls
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#ff0000';
	balls.forEach((ball, i) => {
		ctx.fillStyle = ball.color;
		ctx.strokeStyle = ball.color;
		// trace
		ball.revPosHistory().forEach((pos, i, a) => {
			if (i === 0) return;
			ctx.beginPath();
			ctx.moveTo(...a[i - 1]);
			ctx.lineTo(...pos);
			ctx.globalAlpha = (a.length - i) / a.length * 0.5;
			console.log('hi');
			ctx.stroke();
		});
		ctx.globalAlpha = 1;
		ctx.strokeStyle = '#ff5555';
		
		ctx.beginPath();
		ctx.arc(ball.posx, ball.posy, 5 * ball.r ** 0.5, 0, Math.PI * 2);
		ctx.fill();
		// acc vector
		if (config.drawAccVectors) {
			ctx.beginPath()
			ctx.moveTo(ball.posx, ball.posy);
			ctx.lineTo(ball.posx + config.accVectorLength * ball.accx, ball.posy + config.accVectorLength * ball.accy);
			ctx.stroke();
		}
		ctx.font = "15px Dubai";
		ctx.fillText(ball.name, ball.posx + Math.sqrt(12.5 * ball.r), ball.posy - Math.sqrt(12.5 * ball.r));
	});
	ctx.resetTransform();
}

window.onresize = () => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	toDrawOrNot();
};

draw();
