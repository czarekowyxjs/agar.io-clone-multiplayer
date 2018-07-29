import rand from './rand';
import config from '../config/server.conf';

export default (points) => {

	let exist = true;
	let was;
	let x,y;
	while(exist) {
		x = rand(config.game.pointsRange.width.from, config.game.pointsRange.width.to);
		y = rand(config.game.pointsRange.height.from, config.game.pointsRange.height.to);
		was = false;

		for(let i = 0;i < points.length;++i) {
			if(x === points[i].x && y === points[i].y) {
				was = true;
			}
		}

		if(!was) {
			exist = false;
		}
	}

	return {
		color: "rgb("+rand(50,230)+","+rand(50,230)+","+rand(50,230)+")",
		r: config.game.pointRadius,
		x: x,
		y: y
	};
};