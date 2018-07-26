class Snake {
	constructor(ctx, canvas) {
		this.ctx = ctx;
		this.speed = 3;
		this.fields = [];
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

	draw() {
		this.drawSnake();
		this.updateFields();
	}

	init() {
		this.fields.push({
			x: 200,
			y: 200,
			width: 10,
			height: 10,
			color: 'white'
		});
	}

	drawSnake() {
		for(let f of this.fields) {
			this.ctx.fillStyle = f.color;
			this.ctx.fillRect(f.x, f.y, f.width, f.height);
		}
	}

	drawUsers() {

	}

	updateFields() {
		for(let i = 0;i < this.fields.length;++i) {
			if(this.keys.up) {
				this.fields[i].y -= this.speed;
			} else if(this.keys.down) {
				this.fields[i].y += this.speed;
			} else if(this.keys.left) {
				this.fields[i].x -= this.speed;
			} else if(this.keys.right) {
				this.fields[i].x += this.speed;
			}
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

	getSnakeData() {
		return {
			fields: this.fields,
			keys: this.keys,
			speed: this.speed
		};
	}
}

export default Snake;