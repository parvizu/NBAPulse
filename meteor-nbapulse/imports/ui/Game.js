import React, { Component } from 'react';
import classnames from 'classnames';

import GameDetails from './GameDetails.js';
import StatControl from './StatControl.js';
import GameVisualization from './GameVisualization.js';

export default class Game extends Component {
	
	constructor(props) {
		super(props);


		this.state = {
			homeTeam: {
				teamName: '',
				teamKey: '',
				teamCity: ''
			},
			awayTeam: {
				teamName: '',
				teamKey: '',
				teamCity: ''
			},
			gameSelected: '',
			gameData: {
			},
			gameBreakDown: {
				final: {
					home: "",
					away: ""
				}
			},
		}

		this.count = 0;
	}

	render() {
		if (typeof this.props.gameData.processed !== 'undefined') {
			return (
				<div>
					<div className="game-menu-container">
						<GameDetails
							gameDetails={this.props.gameData.details}
							homeTeam={this.props.gameData.teams.home}
							awayTeam={this.props.gameData.teams.away}
							scoreBreakdown={this.props.gameData.processed.breakdown}
							playersSelected={this.props.playersSelected}
							onSelectTeamPlayer={this.props.onSelectTeamPlayer}
							/>

					</div>
					<StatControl
							onStatClick={this.props.onStatClick}
							selectedStats={this.props.selectedStats}
							/>
					<GameVisualization
							gameId={this.props.gameData.gameSelected}
							gameData={this.props.gameData.processed}
							homeTeam={this.props.gameData.teams.home}
							awayTeam={this.props.gameData.teams.away}
							selectedStats={this.props.selectedStats}
							playersSelected={this.props.playersSelected}
							/>
				</div>
			);
		}

		return null;
	}
}
