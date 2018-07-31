import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import DefaultBackground from '../DefaultBackground/DefaultBackground.jsx';
import FormatUnixTime from '../../libs/FormatUnixTime';
import { logout } from '../../actions/authActions';

import "./Lost.css";

class Lost extends Component {
	static propTypes = {
		auth: PropTypes.shape({
			logged: PropTypes.bool,
			authError: PropTypes.object
		}),
		logout: PropTypes.func
	}

	handleAgainClick = (e) => {
		this.props.logout();
		this.props.history.replace({
			pathname: "/"
		});
	}

	render() {
		if(!this.props.auth.logged) {
			return <Redirect to="/"/>;
		} 
		return (
			<div className="landing">
				<div className="lost-view">
					<div className='lost-wrapper'>
						<div className="lost-title">
							<p>{`You was killed by ${this.props.location.state.killData.killer}`}</p>
						</div>
						<div className="lost-result">
							<div className="lost-item">
								<h4>Reached points</h4>
								<p>{Math.floor(this.props.location.state.killData.userData.points)}</p>
							</div>
							<div className="lost-item">
								<h4>Time alive</h4>
								<p>{FormatUnixTime(this.props.location.state.killData.userData.createdAt)}</p>
							</div>
						</div>
						<div className="lost-again">
							<button
								type="submit"
								onClick={this.handleAgainClick}>
								Play again
							</button>
						</div>
					</div>
				</div>
				<DefaultBackground/>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		auth: state.auth
	};
};

export default connect(mapStateToProps, { logout })(Lost);