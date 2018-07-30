import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RankItem extends Component {
	static propTypes = {
		user: PropTypes.object,
		pos: PropTypes.number
	}

	specialClass = () => {
		switch(this.props.pos) {
			case 1:
				return "first";
			case 2:
				return "second";
			case 3: 
				return "third";
			default:
				return "common";
		}
	};

	render() {
		const user = this.props.user;
		return (
			<div className={`rank-item ${this.specialClass()}`}>
				<div className="rank-item-position">
					<p>{`${this.props.pos}.`}</p>
				</div>
				<div className="rank-item-username">
					<p>{user.username}</p>
				</div>
				<div className="rank-item-points">
					<p>{Math.floor(user.points)}</p>
				</div>
			</div>
		);
	}
}

export default RankItem;