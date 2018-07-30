import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RankItem from './RankItem.jsx';

import "./Rank.css";

class Rank extends PureComponent {
	state = {
		users: []
	}

	static propTypes = {
		socket: PropTypes.object
	}

	componentDidMount() {
		this.props.socket.on('usersList', data => {
			this.setState({
				users: data.users
			});
		});
	}

	componentWillUnmount() {
		
	}

	sortRankItems = (arr) => {
			
		let tmp = {};

		for(let i = 0;i < arr.length;++i) {
			for(let j = 0;j < arr.length;++j) {
				if(arr[i].points > arr[j].points) {
					tmp = arr[i];
					arr[i] = arr[j];
					arr[j] = tmp;
				}
			}
		}

		return arr;
	}

	renderRankItems = () => {
		const users = this.state.users;

		return this.sortRankItems(users).map((key, index) => {
			if(index > 9) return null;
			return <RankItem key={key.socket} user={key} pos={index+1}/>;
		});
	}

	render() {
		return (
			<div className="global-rank">
				<div className="globl-rank-content">
					<div className="global-rank-title">
						<h3>Leaderboard</h3>
					</div>
					<div className="global-rank-body">
						{this.renderRankItems()}
					</div>
				</div>
			</div>
		);
	}
}

export default Rank;