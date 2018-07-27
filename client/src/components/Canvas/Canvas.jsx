import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Hero from '../../models/Hero';
import Background from '../../models/Background';

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

	abstractLayer = {
		width: 6000,
		height: 6000
	}

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
		this.hero = new Hero(this.ctx, this.canvasRef.current, this.abstractLayer);
		this.background = new Background(this.ctx, this.canvasRef.current, this.abstractLayer);
		//
		this.draw();
	}

	draw(time) {
		window.requestAnimationFrame(this.draw);

		if(time-this.config.last >= 1000/this.config.fps) {
			this.config.last = time;
			this.ctx.clearRect(0,0,this.canvasRef.current.width,this.canvasRef.current.height);
			//
			this.background.draw();
			//
			this.hero.inject(this.privateSocket, "privateSocket");
			this.hero.inject(this.users, "users");
			this.hero.draw();
			//
			this.props.socket.emit('dataExchange', {
				heroData: this.hero.getHeroData()
			});
		}
	}

	handleKeyDown(e) {
		switch(e.key) {
			case "w":
			case "ArrowUp":
				return this.hero.keyDown('up');
			case "s":
			case "ArrowDown":
				return this.hero.keyDown('down');
			case "a":
			case "ArrowLeft":
				return this.hero.keyDown('left');
			case "d":
			case "ArrowRight":
				return this.hero.keyDown('right');
			default:
				return;
		}
	}

	handleKeyUp(e) {
		switch(e.key) {
			case "w":
			case "ArrowUp":
				return this.hero.keyUp('up');
			case "s":
			case "ArrowDown":
				return this.hero.keyUp('down');
			case "a":
			case "ArrowLeft":
				return this.hero.keyUp('left');
			case "d":
			case "ArrowRight":
				return this.hero.keyUp('right');
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