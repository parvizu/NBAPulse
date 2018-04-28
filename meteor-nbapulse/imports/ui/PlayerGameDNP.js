import React, {Component} from 'react';
import classNames from 'classnames';

import PlayerCard from './PlayerCard.js';
import styles from  '../css/DNPChart.css';

export default class PlayerGameDNP extends Component {
	constructor(props) {
		super(props);
	}


	render() {

		const classnames = classNames(
			'cord-chart-container'
		);

		const selectedStats = Object.keys(this.props.selectedStats).filter(stat => {
			return this.props.selectedStats[stat] === ''
		});

		return (
			<div className="player-container">
				<div className={classnames} >
					<PlayerCard
						playerId={this.props.playerDetails.playerId}
						playerStats={null}
						label={this.props.playerDetails.playerName}
						selectedStats={this.props.selectedStats}
						/>

					<div className="player-chart-dnp">
						<h4>DID NOT PLAY</h4>
					</div>
				</div>
			</div>
		);
	}
}