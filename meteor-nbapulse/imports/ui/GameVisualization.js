import React, { Component } from 'react';
import classnames from 'classnames';

import ScoringMarginChart from './ScoringMarginChart.js';
import PlayerGameChart from './PlayerGameChart.js';
import PlayerGameDNP from './PlayerGameDNP';
import TeamsGameCard from './TeamsGameCard';
import GameTimeLine from './GameTimeLine';

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
			},
			filter: {
				active: false,
				criteria: {},
				data : {}
			}
		};

		this.onFilterSelection = this.onFilterSelection.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.gameId !== this.props.gameId) {
			this.setState({
				filter: {
					active: false,
					criteria: {},
					data: {}
				}
			});
		}
	}

	onFilterSelection(selection) {

		const filter = {
			active: false,
			criteria: {},
			data: {}
		};

		if (selection.quarter !== this.state.filter.criteria.quarter) {
			Meteor.call('getFilterStats', selection, this.props.gameId, this.props.gameData, (error, results) => {
				this.setState({
					filter: {
						active: true,
						criteria: selection,
						data: results
					}
				});
			});
		} else {
			this.setState({
				filter:filter
			});
		}
	}

	getTeamPlayersViz(team, playersSelected) {
		const self = this,
			  teamSelectedPlayers = playersSelected;


		const teamPlayers = team.players.map((player,index) => {
			const playerId = player.playerId.toString();
			if (teamSelectedPlayers.indexOf(playerId) > -1) {

				let playerData = {};
				playerData = this.props.gameData.playerLogs[player.playerId];

				const playerSubs = this.props.gameData.substitutions[player.playerId] || [];

				// CLEANUP: This check shouldn't be necessary. If player didn't play then its gamelog should be empty not 'undefined'.
				const playerKey = this.props.gameId+"-"+player.playerId+"-cord";
				if (typeof playerData !== 'undefined') {

					// If filtered applied, pass player filtered statistics not the full game for the player card.
					const playerStats = this.state.filter.active ? this.state.filter.data[playerId] : playerData.playerStats;

					return (
						<PlayerGameChart
							key={playerKey}
							playerDetails={player}
							playerData={playerData}
							playerStats={playerStats}
							playerSubs={playerSubs}
							timeLog={this.props.gameData.timeLog}
							periods={this.props.gameData.periods}
							specs={this.state.specs}
							selectedStats={this.props.selectedStats}
							filter={this.state.filter}
							chartType={this.props.chartType}
							/>
					);
				}

				return (
					<PlayerGameDNP
						key={playerKey}
						playerDetails={player}
						selectedStats={this.props.selectedStats}
						/>
				);
			}
		});

		return teamPlayers;
	}

	render() {
		return (
			<div className="main-visualization-container">
				<GameTimeLine 
					timeLog={this.props.gameData.timeLog}
					specs={this.state.specs}
					periods={this.props.gameData.periods}
					height={20}
					onFilterSelection={this.onFilterSelection}
					/>

				<div className="home-players-visualization-container">
					{ this.getTeamPlayersViz(this.props.homeTeam, this.props.playersSelected.home) }
				</div>
				<div className="game-scoring-margin">
					<TeamsGameCard
						home={this.props.homeTeam}
						away={this.props.awayTeam}
						/>

					<ScoringMarginChart
						specs={this.state.specs}
						timeLog={this.props.gameData.timeLog}
						scoringLog={this.props.gameData.scoringLog}
						periods={this.props.gameData.periods}
						height={this.state.config.height}
						label={this.state.config.label}
						/>
				</div>
				<div className="away-players-visualization-container team-bg">
					{ this.getTeamPlayersViz(this.props.awayTeam, this.props.playersSelected.away) }
				</div>
			</div>
		);
	}
}
