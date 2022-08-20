class Ball {
	constructor(options = {}) {
		this.posx = options.posx ?? window.innerWidth / 2;
		this.posy = options.posy ?? window.innerHeight / 2;
		this.r = options.r ?? 1;
		this.velx = options.velx ?? 0;
		this.vely = options.vely ?? 0;
		this.accx = options.accx ?? 0;
		this.accy = options.accy ?? 0;
		this.uid = Date.now();
		this.name = options.name ?? 'Ball';
		this.color = options.color ?? '#ffffff';
		this.posHistory = [];
	}
	mass() {
		return this.r ** 3;
	}
	revPosHistory() {
		const rev = new Array(...this.posHistory);
		rev.reverse();
		return rev;
	}
	newPosHistory(x, y) {
		this.posHistory.push([x ?? this.posx, y ?? this.posy]);
		if (this.posHistory.length > 500) this.posHistory.shift();
	}
}