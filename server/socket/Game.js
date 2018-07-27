class Game {
	constructor(io, socket, users) {
		this.io = io;
		this.socket = socket;
		this.users = users;
	
		this.initHandlers();
	}

	initHandlers() {
		this.handleJoin();
		this.handleDataExchange();
		this.handleDisconnect();
	}

	handleJoin() {
		this.socket.on('join', data => {

			this.users.push({
				username: data.username,
				socket: this.socket.id,
				createdAt: Math.floor(new Date().getTime()/1000),
				draw: null
			});

			this.socket.emit('privateSocket', {
				socket: this.socket.id
			});

			this.io.emit('refreshUsers', {
				users: this.users
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
				users: this.users
			});
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
				users: this.users
			});
		});
	}
}

export default Game;