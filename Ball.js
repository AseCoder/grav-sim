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
	}
	mass() {
		return this.r ** 2;
	}
}