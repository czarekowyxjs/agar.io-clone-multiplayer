import React, { Component } from 'react';
import Snake from '../../models/Snake';

import "./Canvas.css";

class Canvas extends Component {
	constructor(props) {
		super(props);

		this.init = this.init.bind(this);
		this.draw = this.draw.bind(this);
		// ref
		this.canvasRef = React.createRef();
	}

	config = {
		last: 0,
		fps: 60
	}

	componentDidMount() {
		this.init();
	}

	init() {
		this.draw();
	}

	draw(time) {
		window.requestAnimationFrame(this.draw);
		const ctx = this.canvasRef.current.getContext('2d');

		if(time-this.config.last >= 1000/this.config.fps) {
			this.config.last = time;
		}
	}

	render() {
		return (
			<canvas ref={this.canvasRef}/>
		);
	}
}

export default Canvas;