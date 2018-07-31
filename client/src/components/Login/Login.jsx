import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import DefaultBackground from '../DefaultBackground/DefaultBackground.jsx';

import { simpleLogin } from '../../actions/authActions';

import "./Login.css";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			playStatus: 'STOPPED'
		};

		this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
	}

	static propTypes = {
		auth: PropTypes.shape({
			logged: PropTypes.bool,
			authError: PropTypes.object
		}),
		simpleLogin: PropTypes.func
	}

	handleLoginSubmit(e) {
		e.preventDefault();

		this.props.simpleLogin(this.state.username);
	}

	render() {
		if(this.props.auth.logged) {
			return <Redirect to="/game"/>;
		}

		return (
			<div className="landing">
				<div className="landing-auth">
					<form onSubmit={this.handleLoginSubmit}> 
						<input
							type="text"
							id="username"
							onChange={(e) => this.setState({ username: e.target.value })}
							value={this.state.username}
						/>
						{this.state.username.length > 0 ? <button type="submit">Play</button> : <label htmlFor="username">Username</label>}
					</form>
				</div>
				<div className="landing-media">
					<div className="landing-item github">
						<a href="https://github.com/czarekowyxjs/agar.io-clone-multiplayer" target="_BLANK">
							<img src="/images/github.svg" alt="Github account"/>
							<p>czarekowyxjs</p>
						</a>
					</div>
				</div>
				<DefaultBackground/>
			</div>
		);
	}
};

const mapStateToProps = state => {
	return {
		auth: state.auth
	};
};

export default connect(mapStateToProps, { simpleLogin })(Login);