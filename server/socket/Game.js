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
		this.handlePlayersCollision();
		this.handlePointCollision();
		this.handleDisconnect();
	}

	handleJoin() {
		this.socket.on('join', data => {

			this.users.push({
				username: data.username,
				socket: this.socket.id,
				createdAt: Math.floor(new Date().getTime()/1000),
				canvas: {
					width: data.canvasWidth,
					height: data.canvasHeight
				},
				points: 0,
				draw: null,
				playing: true
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

	static updateUsersPoints(users) {
		let actualPoints;
		if(users) {
			for(let i = 0;i < users.length;++i) {
				if(users[i]) {
					actualPoints = users[i].points;
					if(actualPoints > 300 && actualPoints <= 500) {
						users[i].points -= 0.04;
					} else if(actualPoints > 500 && actualPoints <= 700) {
						users[i].points -= 0.06;
					} else if(actualPoints > 700 && actualPoints <= 1000) {
						users[i].points -= 0.08;
					} else if(actualPoints > 1000 && actualPoints <= 1500) {
						users[i].points -= 0.1;
					} else if(actualPoints > 1500 && actualPoints <= 2500) {
						users[i].points -= 0.13;
					} else if(actualPoints > 2500 && actualPoints <= 5000) {
						users[i].points -= 0.2;
					} else if(actualPoints > 5000){
						users[i].points -= 0.4;
					}
				}
			}
		}
	}

	handlePlayersCollision() {
		this.socket.on("playersCollision", data => {
			const winner = data.winnerData;
			const loser = data.loserData;
			//
			let winnerIndex, loserIndex = null;
			//
			for(let i = 0;i < this.users.length;++i) {
				if(winnerIndex && loserIndex) break;
				if(this.users[i].socket === winner.socket) winnerIndex = i;
				if(this.users[i].socket === loser.socket) loserIndex = i;
			}
			//
			this.users[winnerIndex].points += (this.users[loserIndex].points/2);
			//
			this.io.to(loser.socket).emit("lostGame", {
				killer: winner.username,
				userData: this.users[loserIndex]
			});
			//
		});
	}

	handleDataExchange() {
		this.socket.on('dataExchange', data => {
			//
			let toExchange;
			//
			for(let i = 0;i < this.users.length;++i) {
				if(this.users[i].socket === this.socket.id) {
					toExchange = i;
					break;
				}
			}
			// data exchange
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