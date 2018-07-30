class DefaultBackground {
	constructor(ctx, canvas) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.lineWidth = 1;
		this.lineSpace = 50;
		this.bgColor = "white";
		this.lineColor = "#dedede";
	}

	draw() {
		this.drawBg();
		this.drawCircles();
	}

	drawBg() {
		for(let x = 10;x <= this.canvas.width;x+=this.lineSpace) {
			this.ctx.fillStyle = this.lineColor;
			this.ctx.fillRect(x, 0, this.lineWidth, this.canvas.height);
		}

		for(let y = 19;y <= this.canvas.height;y+=this.lineSpace) {
			this.ctx.fillStyle = this.lineColor;
			this.ctx.fillRect(0, y, this.canvas.width, this.lineWidth);
		}		
	}

	drawCircles() {	

	}
}

export default DefaultBackground;