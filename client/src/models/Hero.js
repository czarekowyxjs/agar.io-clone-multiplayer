class Snake {
	constructor(ctx, canvas, staticAbstractLayer) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.staticAbstractLayer = staticAbstractLayer;
		this.speed = 6;
		this.r = 30;
		this.pos = {
			x: 0,
			y: 0
		};
		this.color = "red";
		this.users = [];
		this.privateSocket = '';
		this.keys = {
			up: false,
			down: false,
			left: false,
			right: false
		};

		this.init();
	}

	init() {
		this.pos.x = 5600;
		this.pos.y = 2340;
	}

	draw() {
		this.drawUsers();
		this.drawHero();
		this.movable();
	}

	drawHero() {
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.r, 0, 2*Math.PI);
		this.ctx.fill();
	}

	drawUsers() {
		for(let i = 0;i < this.users.length;++i) {
			if(this.users[i].draw) {
				if(this.users[i].socket.toString() !== this.privateSocket.toString()) {
					const spaceX = this.pos.x - this.users[i].draw.pos.x;
					const spaceY = this.pos.y - this.users[i].draw.pos.y;
					const width = this.canvas.width/2;
					const height = this.canvas.height/2;
					let xMove;
					let yMove;

					if(spaceX >= 0) {
						xMove = width-spaceX;
					} else if(spaceX <= 0) {
						xMove = width+Math.abs(spaceX);
					}

					if(spaceY >= 0) {
						yMove = height-spaceY;
					} else if(spaceY <= 0) {
						yMove = height+Math.abs(spaceY);
					}

					this.ctx.fillStyle = this.users[i].draw.color;
					this.ctx.beginPath();
					this.ctx.arc(xMove, yMove, this.users[i].draw.r, 0, 2*Math.PI);
					this.ctx.fill();
				}
			}
		}
	}

	movable() {
		if(this.keys.up) {
			this.pos.y -= this.speed;
		} else if(this.keys.down) {
			this.pos.y += this.speed;
		} else if(this.keys.left && this.pos.x+this.r > 0+this.r) {
			this.pos.x -= this.speed;
		} else if(this.keys.right && this.pos.x+this.r < this.staticAbstractLayer.width) {
			this.pos.x += this.speed;
		}
	}

	keyDown(key) {
		this.keys[key] = true;
	}

	keyUp(key) {
		this.keys[key] = false;
	}

	inject(data, type) {
		switch(type) {
			case "users":
				this.users = data;
				break;
			case "privateSocket":
				this.privateSocket = data;
				break;
			default:
				return false;
		}
	}

	getHeroData() {
		return {
			keys: this.keys,
			speed: this.speed,
			pos: this.pos,
			r: this.r,
			color: this.color
		};
	}
}

export default Snake;