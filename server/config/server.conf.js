/**
	*********************
	configuration
	*********************
	values "to" should be counterparts of the abstractLater dimensions(client side)
	values "from" can't be less than 0	
*/
export default {
	port: 4000 || process.env.PORT,
	game: {
		pointRadius: 12,
		pointsCapacity: 900,
		pointsRange: {
			width: {
				from: 100,
				to: 4900
			},
			height: {
				from: 100,
				to: 4900
			}
		}
	}
};