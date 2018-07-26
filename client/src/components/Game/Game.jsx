import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import socket_io from 'socket.io-client';
import Canvas from '../Canvas/Canvas.jsx';

import "./Game.css";

let socket = socket_io("http://localhost:4000");

class Game extends Component {
	static propTypes = {
		auth: PropTypes.shape({
			logged: PropTypes.bool,
			authError: PropTypes.object
		}),
		user: PropTypes.shape({
			username: PropTypes.string
		})
	}

	componentWillUnmount() {
		socket.disconnect();
	}

	render() {
		if(!this.props.auth.logged) {
			return <Redirect to="/"/>;
		}

		return (
			<div className="game-window">
				<div className="game-body-canvas">
					<Canvas user={this.props.user} socket={socket}/>
				</div>
			</div>
		);
	}
};

const mapStateToProps = state => {
	return {
		auth: state.auth,
		user: state.user
	};
};

export default connect(mapStateToProps)(Game);