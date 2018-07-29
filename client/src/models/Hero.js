import rand from '../libs/rand';

class Hero {
	constructor(ctx, canvas, staticAbstractLayer, privateSocket, users, user, socket) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.minLength = Math.min(this.canvas.width, this.canvas.height);
		this.scale = this.minLength*0.01;
		this.staticAbstractLayer = staticAbstractLayer;
		this.userData = user;
		this.points = [];
		this.speed = 6;
		this.reachedPoints = 0;
		this.staticR = 30;
		this.staticComputationalR = 10;
		this.r = this.staticR;
		this.pos = {
			x: 0,
			y: 0
		};
		this.color = "red";
		this.users = users;
		this.privateSocket = privateSocket;
		this.socket = socket;
		this.mouse = {
			x: 0,
			y: 0
		};
		this.logged = false;
		this.lastPointCollision = {
			pointX: 0,
			pointY: 0
		};
		this.lastPlayerCollision = {
			socket: ''
		};
		this.init();
	}

	init() {
		// init position
		if(this.users.length < 2) {
			this.pos.x = rand(0+(this.staticR*5), this.staticAbstractLayer.width-(this.staticR*5));
			this.pos.y = rand(0+(this.staticR*5), this.staticAbstractLayer.height-(this.staticR*5));
		}
		// init player color
		this.color = "rgb("+rand(50,230)+","+rand(50,230)+","+rand(50,230)+")";
	}

	draw() {
		this.drawUsers();
		this.updateRadius();
		this.drawHero();
		this.drawUsername(this.userData.username, this.canvas.width/2, this.canvas.height/2);
		this.drawPoints(this.reachedPoints, this.canvas.width/2, this.canvas.height/2);
		this.movable();
		this.playersCollision();
		this.pointsCollision();
	}

	drawHero() {
		this.ctx.fillStyle = this.color;
		this.ctx.beginPath();
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.r, 0, 2*Math.PI);
		this.ctx.fill();
	}

	updateRadius() {
		for(let i = 0;i < this.users.length;++i) {
			if(this.users[i].socket === this.privateSocket) {
				this.reachedPoints = this.users[i].points;
			}
		}
		this.r = this.staticR+(this.reachedPoints/this.staticComputationalR);

		if(this.r > this.canvas.height/4) {
			this.r = this.canvas.height/4;
		}
	}

	drawUsername(username, x, y) {
		const widthText = this.ctx.measureText(username).width;
		this.ctx.font = "14pt Arial";
		this.ctx.strokeStyle = "#3a3a3a";
		this.ctx.lineWidth = 1;
		this.ctx.strokeText(username,x-widthText/2, y+4);
		this.ctx.fillStyle = "white";
		this.ctx.fillText(username, x-widthText/2, y+4);
	}

	drawPoints(_pointsValue, x, y) {
		const pointsValue = Math.floor(_pointsValue).toString();
		const widthText = this.ctx.measureText(pointsValue).width;
		this.ctx.font = "13pt Arial";
		this.ctx.lineWidth = 1;
		this.ctx.strokeText(pointsValue, x-widthText/2, y+22);
		this.ctx.fillStyle = "white";
		this.ctx.fillText(pointsValue, x-widthText/2, y+22);
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

					let newRadius;

					newRadius = this.staticR+(this.users[i].points/this.staticComputationalR);

					if(newRadius > this.canvas.height/4) {
						newRadius = this.canvas.height/4;
					}

					this.ctx.fillStyle = this.users[i].draw.color;
					this.ctx.beginPath();
					this.ctx.arc(xMove, yMove, newRadius, 0, 2*Math.PI);
					this.ctx.fill();
					this.drawUsername(this.users[i].username, xMove, yMove);
					this.drawPoints(this.users[i].points, xMove, yMove);
				}
			}
		}
	}

	movable() {
		const resX = (this.canvas.width/2)-this.mouse.x;
		const resY = (this.canvas.height/2)-this.mouse.y;
		//
		let resXConv = Math.abs(resX)/45;
		let resYConv = Math.abs(resY)/30;
		//
		if(resXConv > 13) {
			resXConv = 13;
		}
		//
		if(resYConv > 11) {
			resYConv = 11;
		}
		//
		if(resX > 0 && this.pos.x-this.r-resXConv > 0) {
			this.pos.x -= resXConv;
		} else if(resX < 0 && this.pos.x+this.r+resXConv < this.staticAbstractLayer.width) {
			this.pos.x += resXConv;
		} 
		//
		if(resY > 0 && this.pos.y-this.r-resYConv > 0) {
			this.pos.y -= resYConv;
		} else if(resY < 0 && this.pos.y+this.r+resYConv < this.staticAbstractLayer.height) {
			this.pos.y += resYConv;
		}
	}

	mouseMove(clientX, clientY) {
		this.mouse.x = clientX;
		this.mouse.y = clientY;
	}

	playersCollision() {
		for(let i = 0;i < this.users.length;++i) {
			this.detectPlayerCollision(this.users[i], i);
		}
	}

	detectPlayerCollision(user, index) {
		if(user.socket === this.privateSocket || !user.draw) {
			return;
		}
		//
		const enemyX = user.draw.pos.x;
		const enemyY = user.draw.pos.y;
		const enemyPoints = user.points;
		const heroX = this.pos.x;
		const heroY = this.pos.y;
		const heroPoints = this.reachedPoints;
		//
		let enemyR = this.staticR+(enemyPoints/this.staticComputationalR);
		let heroR = this.staticR+(heroPoints/this.staticComputationalR);
		//
		if(heroR > this.canvas.height/4) {
			heroR = this.canvas.height/4;
		}
		//
		if(enemyR > this.canvas.height/4) {
			enemyR = this.canvas.height/4;
		}
		//
		const diff = Math.abs(heroPoints-enemyPoints);
		const minPoints = Math.min(heroPoints, enemyPoints);
		//
		if(diff > minPoints/10) {
			let winnerData, loserData;
			//
			const heroData = {
				username: this.userData.username,
				socket: this.privateSocket
			};
			//
			if(heroPoints > enemyPoints) {
				winnerData = heroData;
				loserData = user;
			} else {
				winnerData = user;
				loserData = heroData;
			}
			//
			const distance = Math.sqrt(Math.pow((enemyX-heroX), 2)+Math.pow((enemyY-heroY), 2));
			const maxRadius = Math.max(enemyR, heroR);
			//
			if(distance < maxRadius) {
				if(this.lastPlayerCollision.socket !== user.socket) {
					this.lastPlayerCollision.socket = user.socket;
					console.log(this.users);
					console.log('collision: '+winnerData);
					this.socket.emit("playersCollision", {
						winnerData: winnerData,
						loserData: loserData
					});
				}
			}
		}
	}

	pointsCollision() {
		for(let i = 0;i < this.points.length;++i) {
			this.detectPointCollision(this.points[i], i);
		}
	}

	detectPointCollision(point, index) {
		const pointX = point.x;
		const pointY = point.y;
		const heroX = this.pos.x;
		const heroY = this.pos.y;
		//
		const distance = Math.sqrt(Math.pow((pointX-heroX), 2)+Math.pow((pointY-heroY), 2));
		//
		const pointR = point.r-(this.reachedPoints/200);
		//
		if(distance < pointR+this.r) {
			if(this.lastPointCollision.pointX === pointX && this.lastPointCollision.pointY === pointY) {

			} else {
				this.lastPointCollision = {
					pointX: pointX,
					pointY: pointY
				};
				//
				this.socket.emit("pointCollision", {
					pointIndex: index
				});
			}
		}
	}

	inject(data, type) {
		switch(type) {
			case "users":
				this.users = data;
				break;
			case "privateSocket":
				this.privateSocket = data;
				break;
			case "points":
				this.points = data;
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
			color: this.color,
			points: this.reachedPoints
		};
	}
}

export default Hero;