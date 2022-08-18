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