import React, { Component } from 'react';
import classnames from 'classnames';

import ScoringMarginChart from './ScoringMarginChart.js';
import PlayerGameCord from './PlayerGameCord.js';

import styles from '../css/GameVisualization.css';

export default class GameVisualization extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			specs: {
				width: 1175,
				height: 150,
				padding: 25,
				xParam: 'sec',
				yParam: 'dif'
			},
			config: {
				height: 350,
				label: ''
			}
		};
	}

	getTeamPlayersViz(team, playersSelected) {
		const self = this,
			  teamSelectedPlayers = playersSelected;


		const teamPlayers = team.players.map((player,index) => {
			if (teamSelectedPlayers.indexOf(player.playerId.toString()) > -1) {

				let playerData = {};
				playerData = this.props.gameData.playerLogs[player.playerId];

				const playerSubs = this.props.gameData.substitutions[player.playerId] || [];

				// CLEANUP: This check shouldn't be necessary. If player didn't play then its gamelog should be empty not 'undefined'.
				if (typeof playerData !== 'undefined') {
					const playerKey = this.props.gameId+"-"+player.playerId+"-cord";

					return (
						<PlayerGameCord
							key={playerKey}
							playerDetails={player}
							playerData={playerData}
							playerSubs={playerSubs}
							timeLog={this.props.gameData.timeLog}
							periods={this.props.gameData.periods}
							specs={this.state.specs}
							selectedStats={this.props.selectedStats}
							/>
					);
				}
			}
		});

		return teamPlayers;
	}

	render() {
		return (
			<div className="main-visualization-container">

				<div className={"home-players-visualization-container team-bg " + this.props.homeTeam.teamKey}>
					{ this.getTeamPlayersViz(this.props.homeTeam, this.props.playersSelected.home) }
				</div>
				<div className="game-scoring-margin">

					<ScoringMarginChart
						specs={this.state.specs}
						timeLog={this.props.gameData.timeLog}
						scoringLog={this.props.gameData.scoringLog}
						periods={this.props.gameData.periods}
						height={this.state.config.height}
						label={this.state.config.label}
						/>
				</div>
				<div className={"away-players-visualization-container team-bg " + this.props.awayTeam.teamKey}>
					{ this.getTeamPlayersViz(this.props.awayTeam, this.props.playersSelected.away) }
				</div>
			</div>
		);
	}
}
