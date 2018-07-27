import rand from '../libs/rand';

class Snake {
	constructor(ctx, canvas, staticAbstractLayer, privateSocket, users, user) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.staticAbstractLayer = staticAbstractLayer;
		this.userData = user;
		this.speed = 6;
		this.r = 40;
		this.pos = {
			x: 0,
			y: 0
		};
		this.color = "red";
		this.users = users;
		this.privateSocket = privateSocket;
		this.mouse = {
			x: 0,
			y: 0
		};

		this.init();
	}

	init() {
		// init position
		this.pos.x = 5600;
		this.pos.y = 2340;
		if(this.users.length < 2) {
			this.pos.x = rand(0+(this.r*5), this.staticAbstractLayer.width-(this.r*5));
			this.pos.y = rand(0+(this.r*5), this.staticAbstractLayer.height-(this.r*5));
		}
		// init player color
		this.color = "rgb("+rand(50,230)+","+rand(50,230)+","+rand(50,230)+")";
	}

	draw() {
		this.drawUsers();
		this.drawHero();
		this.drawUsername();
		this.movable();
	}

	drawHero() {
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.r, 0, 2*Math.PI);
		this.ctx.fill();
	}

	drawUsername() {
		const username = this.userData.username;
		const widthText = this.ctx.measureText(username).width;
		this.ctx.font = "14pt Arial";
		this.ctx.strokeStyle = "#3a3a3a";
		this.ctx.lineWidth = 1;
		this.ctx.strokeText(username,this.canvas.width/2-widthText/2, this.canvas.height/2+4);
		this.ctx.fillStyle = "white";
		this.ctx.fillText(username, this.canvas.width/2-widthText/2, this.canvas.height/2+4);
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
		const resX = (this.canvas.width/2)-this.mouse.x;
		const resY = (this.canvas.height/2)-this.mouse.y;

		if(resX > 0 && this.pos.x-this.r-resX/55 > 0) {
			this.pos.x -= resX/55;
		} else if(resX < 0 && this.pos.x+this.r+Math.abs(resX)/55 < this.staticAbstractLayer.width) {
			this.pos.x += Math.abs(resX)/55;
		} 
		if(resY > 0 && this.pos.y-this.r-resY/50 > 0) {
			this.pos.y -= resY/50;
		} else if(resY < 0 && this.pos.y+this.r+Math.abs(resY)/50 < this.staticAbstractLayer.height) {
			this.pos.y += Math.abs(resY)/50;
		}
	}

	mouseMove(clientX, clientY) {
		this.mouse.x = clientX;
		this.mouse.y = clientY;
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
			speed: this.speed,
			pos: this.pos,
			r: this.r,
			color: this.color
		};
	}
}

export default Snake;