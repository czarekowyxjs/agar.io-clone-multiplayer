class Background {
	constructor(ctx, canvas, staticAbstractLayer) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.staticAbstractLayer = staticAbstractLayer;
		this.lineWidth = 1;
		this.lineSpace = 150;
		this.bgColor = "black";
		this.lineColor = "white";
		this.hero = {};
	}

	draw() {
		this.drawBackground();
		this.drawLines();
	}

	drawBackground() {
		this.ctx.fillStyle = this.bgColor;
		this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
	}

	drawLines() {
		const heroPosX = this.hero.pos.x;
		const heroPosY = this.hero.pos.y;

		for(let x = -heroPosX;x <= this.canvas.width;x+=this.lineSpace) {
			this.ctx.fillStyle = this.lineColor;
			this.ctx.fillRect(x, 0, this.lineWidth, this.canvas.height);
		}

		for(let y = -heroPosY;y <= this.canvas.height;y+=this.lineSpace) {
			this.ctx.fillStyle = this.lineColor;
			this.ctx.fillRect(0, y, this.canvas.width, this.lineWidth);
		}
	}

	inject(data, type) {
		switch(type) {
			case "hero":
				this.hero = data;
				break;
			default:
				return;
		}
	}
}

export default Background;