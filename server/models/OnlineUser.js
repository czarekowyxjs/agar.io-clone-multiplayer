import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
	username: {
		type: String
	},
	socket: {
		type: String,
		unique: true
	},
	points: {
		type: Number
	}
});

export default mongoose.model("OnlineUser", Schema);
