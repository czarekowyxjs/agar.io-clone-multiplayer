import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Snake from '../../models/Snake';

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);

		this.init = this.init.bind(this);
		this.draw = this.draw.bind(this);
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		// ref
		this.canvasRef = React.createRef();
	}

	static propTypes = {
		user: PropTypes.shape({
			username: PropTypes.string
		}),
		socket: PropTypes.object
	}

	config = {
		last: 0,
		fps: 60
	}

	ctx = null
	snake = null
	users = []
	privateSocket = ''

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {
		this.canvasRef.current.removeEventListener('resize', this.onResize, false);
	}

	init() {
		this.props.socket.emit("join", {
			username: this.props.user.username
		});

		this.props.socket.on('refreshUsers', data => {
			this.users = data.users;
		});

		this.props.socket.on('privateSocket', data => {
			this.privateSocket = data.socket;
		});

		this.canvasRef.current.width = window.innerWidth;
		this.canvasRef.current.height = window.innerHeight;
		this.ctx = this.canvasRef.current.getContext('2d');
		window.addEventListener('keydown', this.handleKeyDown, false);
		window.addEventListener('keyup', this.handleKeyUp, false);
		//
		this.snake = new Snake(this.ctx, this.canvasRef.current);
		//
		this.draw();
	}

	draw(time) {
		window.requestAnimationFrame(this.draw);

		if(time-this.config.last >= 1000/this.config.fps) {
			this.config.last = time;
			//
			this.ctx.fillStyle = "black";
			this.ctx.fillRect(0,0,this.canvasRef.current.width,this.canvasRef.current.height);
			//
			this.snake.inject(this.privateSocket, "privateSocket");
			this.snake.inject(this.users, "users");
			this.snake.draw();
			//
			this.props.socket.emit('dataExchange', {
				snakeData: this.snake.getSnakeData()
			});
		}
	}

	handleKeyDown(e) {
		switch(e.key) {
			case "w":
			case "ArrowUp":
				return this.snake.keyDown('up');
			case "s":
			case "ArrowDown":
				return this.snake.keyDown('down');
			case "a":
			case "ArrowLeft":
				return this.snake.keyDown('left');
			case "d":
			case "ArrowRight":
				return this.snake.keyDown('right');
			default:
				return;
		}
	}

	handleKeyUp(e) {
		switch(e.key) {
			case "w":
			case "ArrowUp":
				return this.snake.keyUp('up');
			case "s":
			case "ArrowDown":
				return this.snake.keyUp('down');
			case "a":
			case "ArrowLeft":
				return this.snake.keyUp('left');
			case "d":
			case "ArrowRight":
				return this.snake.keyUp('right');
			default:
				return;
		}
	}

	render() {
		return (
			<canvas ref={this.canvasRef}/>
		);
	}
}

export default Canvas;