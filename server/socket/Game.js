import generatePoint from '../libs/generatePoint';

class Game {
	constructor(io, socket, users, points) {
		this.io = io;
		this.socket = socket;
		this.users = users;
		this.points = points;
	
		this.initHandlers();
	}

	initHandlers() {
		this.handleJoin();
		this.handleDataExchange();
		this.handlePointCollision();
		this.handleDisconnect();
	}

	handleJoin() {
		this.socket.on('join', data => {

			this.users.push({
				username: data.username,
				socket: this.socket.id,
				createdAt: Math.floor(new Date().getTime()/1000),
				points: 0,
				draw: null
			});

			this.socket.emit('privateSocket', {
				socket: this.socket.id
			});

			this.io.emit('refreshUsers', {
				users: this.users,
				points: this.points
			});

			this.socket.emit("startGame", {
				users: this.users,
				socket: this.socket.id,
				points: this.points
			});

		});
	}

	handleDataExchange() {
		this.socket.on('dataExchange', data => {

			let toExchange;

			for(let i = 0;i < this.users.length;++i) {
				if(this.users[i].socket === this.socket.id) {
					toExchange = i;
					break;
				}
			}
			this.users[toExchange].draw = data.heroData;
			
			this.socket.emit("refreshUsers", {
				users: this.users,
				points: this.points
			});
		});
	}

	handlePointCollision() {
		this.socket.on("pointCollision", data => {
			const index = data.pointIndex;
			this.points.splice(index, 1);

			this.points.push(generatePoint(this.points));

			for(let i = 0;i < this.users.length;++i) {
				if(this.users[i].socket.toString() === this.socket.id.toString()) {
					this.users[i].points += 1;
					break;
				}
			}
		});
	}

	handleDisconnect() {
		this.socket.on('disconnect', () => {
			let toRemove;
			for(let i = 0;i < this.users.length;++i) {
				if(this.users[i].socket === this.socket.id) {
					toRemove = i;
					break;
				}
			}
			this.users.splice(toRemove, 1);
			this.io.emit('refreshUsers', {
				users: this.users,
				points: this.points
			});
		});
	}
}

export default Game;