import React, { Component } from 'react';
import DefaultBg from '../../models/DefaultBackground';

import "./DefaultBackground.css";

class DefaultBackground extends Component {
	constructor(props) {
		super(props);
	
		this.defaultBackgroundCanvasRef = React.createRef();
	}

	config = {
		fps: 60,
		last: 0
	}

	animation = null
	bg = {}
	ctx = {}

	componentDidMount() {
		this.init();
	}

	componentWillUnmount() {
		window.cancelAnimationFrame(this.animation);
	}

	init = () => {
		this.ctx = this.defaultBackgroundCanvasRef.current.getContext('2d'); 
		this.defaultBackgroundCanvasRef.current.width = window.innerWidth;
		this.defaultBackgroundCanvasRef.current.height = window.innerHeight;
		this.bg = new DefaultBg(this.ctx, this.defaultBackgroundCanvasRef.current);
		this.draw();
	}

	draw = () => {
		this.animation = window.requestAnimationFrame(this.draw);
		this.bg.draw();
	}

	render() {
		return <canvas className="default-background" ref={this.defaultBackgroundCanvasRef}/>;
	}
}

export default DefaultBackground;