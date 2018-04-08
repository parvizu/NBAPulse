import React, {Component} from 'react';
import classNames from 'classnames';

import CordChart from './CordChart.js';

export default class PlayerGameCord extends Component {
	constructor(props) {
		super(props);
	}


	render() {

		const classnames = classNames(
			'cord-chart-container'
		);

		const playerSubs = [];

		return (
			<div className="player-container">
				<div className={classnames} >
					<CordChart 
						timeLog={this.props.timeLog}
						specs={this.props.specs}
						playerId={this.props.playerDetails.playerId}
						playerLog={this.props.playerData.playerLog}
						playerStats={this.props.playerData.playerStats}
						playerSubs={playerSubs}
						label={this.props.playerDetails.playerName}
						key={"cord_" + this.props.playerDetails.playerId}
						periods={this.props.periods}
						selectedStats={ Object.keys(this.props.selectedStats)}
						selectedStats2={this.props.selectedStats}
						height={100}
						/>
				</div>
			</div>
		);
	}
}