import rand from './rand';

export default (points) => {

	let exist = true;
	let was;
	let x,y;
	while(exist) {
		x = rand(100, 4900);
		y = rand(100, 4900);
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
		r: 12,
		x: x,
		y: y
	};
};