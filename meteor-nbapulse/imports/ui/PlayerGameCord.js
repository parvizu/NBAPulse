import React, {Component} from 'react';
import classNames from 'classnames';

import CordChart from './CordChart.js';
import PlayerCard from './PlayerCard.js';

export default class PlayerGameCord extends Component {
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
						playerStats={this.props.playerStats}
						label={this.props.playerDetails.playerName}
						selectedStats={this.props.selectedStats}
						/>

					<CordChart 
						timeLog={this.props.timeLog}
						specs={this.props.specs}
						playerId={this.props.playerDetails.playerId}
						playerLog={this.props.playerData.playerLog}
						// playerStats={this.props.playerData.playerStats}
						playerSubs={this.props.playerSubs}
						// key={"cord_" + this.props.playerDetails.playerId}
						periods={this.props.periods}
						selectedStats={ selectedStats}
						height={100}
						filter={this.props.filter}
						/>
				</div>
			</div>
		);
	}
}