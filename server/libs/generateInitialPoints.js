import generatePoint from './generatePoint';
import config from '../config/server.conf';

export default () => {
	const maxPoints = config.game.pointsCapacity;
	let points = [];
	let point;
	for(let i = 0;i < maxPoints;++i) {
		point = generatePoint(points);
		points[i] = point;
	}

	return points;
};