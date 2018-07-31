export default (seconds) => {
	const time = Math.floor(new Date().getTime()/1000)-seconds;

	if(time < 60) {
		return time+(time === 1 ? " second" : " seconds");
	} else if(time < 3600) {
		const minutes = Math.floor(time/60);
		return minutes+(minutes === 1 ? " minute" : " minutes");
	} else {
		const hours = Math.floor(time/3600);
		return hours+(hours === 1 ? " hour" : " hours");
	}
};