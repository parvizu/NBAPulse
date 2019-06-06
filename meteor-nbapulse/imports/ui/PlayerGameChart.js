import React, {Component} from 'react';
import classNames from 'classnames';

import CordChart from './CordChart.js';
import PlayerCard from './PlayerCard.js';
import BoxScoreChart from './BoxScoreChart.js';

export default class PlayerGameChart extends Component {
	constructor(props) {
		super(props);


		this.getPlayerChart = this.getPlayerChart.bind(this);
	}

	getPlayerChart(selectedStats) {
		if (this.props.chartType === 'cord') {
			return (
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
					height={this.props.specs.height}
					filter={this.props.filter}
					/>
			);
		} else {
			return (
				<BoxScoreChart 
					selectedStats={selectedStats}
					playerData={this.props.playerData}
					/>
			);
		}
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
						height={this.props.specs.height}
						team={this.props.team}
						/>

				{ this.getPlayerChart(selectedStats) }
					
				</div>
			</div>
		);
	}
}

	