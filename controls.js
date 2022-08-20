document.getElementById('new').onclick = () => {
	balls.push(new Ball({ velx: 0.1 }));
	console.log('new ball');
	toDrawOrNot();
}
document.getElementById('playpause').onclick = e => {
	if (e.target.classList.contains('active')) {
		paused = true;
		e.target.classList.remove('active');
		e.target.innerText = '▶';
	} else {
		paused = false;
		e.target.classList.add('active');
		e.target.innerText = '\u23F8\uFE0E';
		calcStartTime = window.performance.now();
		update();
	}
	console.log('paused', paused);
}

window.onkeyup = e => {
	if (e.keyCode === 32) {
		document.getElementById('playpause').click();
	}
	// console.log(e.keyCode);
	// w 87, a 65, s 83, d 68
}
let mouseDown = false;
window.onmousedown = e => {
	mouseDown = true;
	console.log('mouse down');
}
window.onmouseup = e => {
	mouseDown = false;
	console.log('mouse up');
}
document.getElementById('canvas').onmousemove = e => {
	if (!mouseDown) return;
	viewportDragOffset[0] += e.movementX;
	viewportDragOffset[1] += e.movementY;
	toDrawOrNot();
};