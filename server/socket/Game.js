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
		this.handlePlayerWinnerCollision();
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
			// data exchange
			this.users[toExchange].draw = data.heroData;
			
			// update user points
			const actualPoints = this.users[toExchange].points;
			if(actualPoints > 300 && actualPoints <= 500) {
				this.users[toExchange].points -= 0.07;
			} else if(actualPoints > 500 && actualPoints <= 700) {
				this.users[toExchange].points -= 0.12;
			} else if(actualPoints > 700 && actualPoints <= 1000) {
				this.users[toExchange].points -= 0.16;
			} else if(actualPoints > 1000 && actualPoints <= 1500) {
				this.users[toExchange].points -= 0.25;
			} else if(actualPoints > 1500 && actualPoints <= 2500) {
				this.users[toExchange].points -= 0.6;
			} else if(actualPoints > 2500 && actualPoints <= 5000) {
				this.users[toExchange].points -= 1.1;
			} else if(actualPoints > 5000){
				this.users[toExchange].points -= 2;
			}

			this.socket.emit("refreshUsers", {
				users: this.users,
				points: this.points
			});
		});
	}

	handlePlayerWinnerCollision() {
		
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