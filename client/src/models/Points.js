class Points {
	constructor(ctx, canvas, points) {
		this.ctx = ctx;
		this.canvas = canvas;
		this.points = points;
		this.heroData = {};
	}

	draw() {
		for(let i = 0;i < this.points.length;++i) {
			this.drawPoint(this.points[i]);
		}
	}

	drawPoint(point) {
		const halfCanvasWidth = this.canvas.width/2;
		const halfCanvasHeight = this.canvas.height/2;
		const pointX = point.x;
		const pointY = point.y;
		const heroX = this.heroData.pos.x;
		const heroY = this.heroData.pos.y;

		const diffX = heroX-pointX;
		const diffY = heroY-pointY;

		let x, y = 0;

		if(diffX > 0) {
			x = halfCanvasWidth-diffX;
		} else if(diffX < 0) {
			x = halfCanvasWidth+Math.abs(diffX);
		}

		if(diffY > 0) {
			y = halfCanvasHeight-diffY;
		} else if(diffY < 0) {
			y = halfCanvasHeight+Math.abs(diffY);
		}


		this.ctx.fillStyle = point.color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, point.r, 0, 2*Math.PI);
		this.ctx.fill();
		
	}

	inject(data, type) {
		switch(type) {
			case "hero":
				this.heroData = data;
				break;
			case "points":
				this.points = data;
				break;
			default:
				return;
		}
	}
}

export default Points;