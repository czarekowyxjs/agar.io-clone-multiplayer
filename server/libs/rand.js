export default (min, max) => {
	return Math.floor(Math.random()*(parseInt(max, 10)-parseInt(min, 10)+1)+parseInt(min, 10));
};