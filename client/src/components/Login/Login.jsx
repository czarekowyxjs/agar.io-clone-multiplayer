import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import { simpleLogin } from '../../actions/authActions';

import "./Login.css";

class Login extends Component {
	constructor(props) {
		super(props);

		this.state = {
			username: ''
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
						<label htmlFor="username">Username</label>
						<input
							type="text"
							id="username"
							onChange={(e) => this.setState({ username: e.target.value })}
							value={this.state.username}
						/>
						<button type="submit">Play</button>
					</form>
				</div>
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