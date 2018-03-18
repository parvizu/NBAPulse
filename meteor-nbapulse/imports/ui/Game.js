import React, { Component } from 'react';
import classnames from 'classnames';

import GameDetails from './GameDetails.js';
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
			gameBreakDown: {},
		}

		this.getTeamRoster = this.getTeamRoster.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (this.state.gameSelected !== newProps.gameSelected) {
			this.getTeamRoster(newProps.gameData.details.h.tid,'homeTeam');
			this.getTeamRoster(newProps.gameData.details.v.tid,'awayTeam');

			const playByPlayLog = newProps.gameData.data.resultSets[0].rowSet;
			const breakdown = this._processGameBreakdown(playByPlayLog);
			this.setState({
				gameSelected: newProps.gameSelected,
				gameBreakDown: breakdown
			});
		}
	}

	getTeamRoster(teamId, teamType) {
		Meteor.call('getTeamRoster', teamId, '2017-2018', (error, results) => {
			let newState = {};
			newState[teamType] = results;
			console.log("TeamId", teamId, results);

			this.setState(newState);
		});
	}

	_processGameBreakdown(gameData) {
		let breakdown = {};
		let period = 0;
		let previous = {
			home: 0,
			away: 0
		}

		for (let i = 0; i < gameData.length; i++) {
			let event = gameData[i]
			if (event.clock === '0:00' && event.score !== null && period !== event.quarter) {
				period = event.quarter;
				let label = period;
				let score = event.score.split(' - ');
				if (period > 4) {
					label = "OT" + (period - 4);
				}

				breakdown[period] = {
					label: label,
					home: parseInt(score[1]) - previous.home,
					away: parseInt(score[0]) - previous.away,
					homeScore: parseInt(score[1]),
					awayScore: parseInt(score[0])
				};

				previous = {
					home: parseInt(score[1]),
					away: parseInt(score[0])
				};
			}
		}

		breakdown['final'] = {
			label: 'Final',
			home: previous.home,
			away: previous.away,
			homeScore: previous.home,
			awayScore: previous.away,
		};

		return breakdown;
	}

	render() {

		return (
			<div className="game-menu-container">
				<GameDetails 
					homeTeam={this.state.homeTeam}
					awayTeam={this.state.awayTeam}
					scoreBreakdown={this.state.gameBreakDown}
					playersSelected={this.props.playersSelected}
					/>
			</div>
		);
	}
}
