import React, { Component } from 'react';
import {Meteor} from 'meteor/meteor';

import {Games, Schedule, Teams, League } from '../api/collections.js';

import { withTracker } from 'meteor/react-meteor-data';

import Header from './Header.js';
import Game from './Game.js';



import styles from '../css/NBAPulse.css';


class NBAPulse extends Component {

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
			stats: {
				made: '',
				missed: '',
				assist: '',
				rebound: '',
				steal: '',
				block: '',
				turnover: '',
				foul: '',
				periods: 4
			},
			teamSelected: '',
			gameSelected: '',
			gameData: {},
			playersSelected: {
				"ATL": [],
				"BKN": [],
				"BOS": [],
				"CHA": [],
				"CHI": [],
				"CLE": [],
				"DAL": [],
				"DEN": [],
				"DET": [],
				"GSW": [],
				"HOU": [],
				"IND": [],
				"LAC": [],
				"LAL": [],
				"MEM": [],
				"MIA": [],
				"MIL": [],
				"MIN": [],
				"NOP": [],
				"NYK": [],
				"OKC": [],
				"ORL": [],
				"PHI": [],
				"PHX": [],
				"POR": [],
				"SAC": [],
				"SAS": [],
				"TOR": [],
				"UTA": [],
				"WAS": []
				// "ATL": [1,6],
				// "BKN": [4],
				// "BOS": [0,3,1],
				// "CHA": [2],
				// "CHI": [1,0],
				// "CLE": [0,2],
				// "DAL": [0,3],
				// "DEN": [1,3],
				// "DET": [0,2],
				// "GSW": [0,1,2,3],
				// "HOU": [2,3],
				// "IND": [4,7],
				// "LAC": [1,0],
				// "LAL": [3,7,1],
				// "MEM": [0,3],
				// "MIA": [3,0],
				// "MIL": [1],
				// "MIN": [3,4,0],
				// "NOP": [2,0],
				// "NYK": [0,2],
				// "OKC": [2,1,3],
				// "ORL": [4,0],
				// "PHI": [0,1],
				// "PHX": [2],
				// "POR": [2,3],
				// "SAC": [6,4],
				// "SAS": [6,0,3],
				// "TOR": [2,1],
				// "UTA": [0,3],
				// "WAS": [2,4]
			}
		};

		this.count = 0;
		this.willProps = 0;

		this.onSelectTeam = this.onSelectTeam.bind(this);
		this.onSelectGame = this.onSelectGame.bind(this);
		this.onStatClick = this.onStatClick.bind(this);
		this.onSelectTeamPlayer = this.onSelectTeamPlayer.bind(this);
		this.getPlayersSelected = this.getPlayersSelected.bind(this);
		// this.renderHeader = this.renderHeader.bind(this);
		// this.renderSelectedGame = this.renderSelectedGame.bind(this);
	}

	// componentWillMount() {
	// 	this.onSelectGame('0021700002');
	// }


	// shouldComponentUpdate(newProps, newState) {
	// 	if (this.state.teamSelected !== newState.teamSelected) {
	// 		console.log("Team Selected triggered...", newState.teamSelected);
	// 		return true;
	// 	}

	// 	if (this.state.gameSelected !== newState.gameSelected) {
	// 		console.log("Game Selected triggered...", newState.gameSelected);
	// 		return true;
	// 	}

	// 	if (typeof this.props.league === 'undefined' && typeof newProps.league !== 'undefined') {
	// 		console.log("League teams have been loaded...");
	// 		return true;
	// 	}

	// 	return false;
	// }


	onSelectTeam(teamAbbr) {
		if (teamAbbr !== this.state.teamSelected) {
			this.setState({
				teamSelected: teamAbbr
			});
		}
	}

	onSelectGame(gid) {
		const self = this;

		Meteor.call("getGameData", gid, function(error, results) {
	        console.log("Game data", gid, results);

	        if (results !== 'empty') {
				self.setState({
					gameSelected: gid,
					gameData: results
		        });
	        }
	    });
	}

	onStatClick(stats) {
		let newState = this.state.stats;
		stats.forEach(stat => {
			newState[stat] = this.state.stats[stat] === '' ? 'stat-hidden' : '';
		});
		this.setState({
			'stats': newState
		});
	}

	onSelectTeamPlayer(teamAbbr, playerId) {
		console.log("Player selected ", playerId)
		if (this.state.playersSelected[teamAbbr].indexOf(playerId) === -1) {
			let newSelectedPlayers = this.state.playersSelected;
			newSelectedPlayers[teamAbbr].push(playerId);

			this.setState({
				playersSelected: newSelectedPlayers
			});
		}
	}

	getPlayersSelected() {
		if (Object.keys(this.state.gameData).length === 0) {
			return {
				home:[],
				away:[]
			};
		}

		const homeAbbr = this.state.gameData.details.h.ta,
			  awayAbbr = this.state.gameData.details.v.ta;

		const homePlayers = this.state.playersSelected[homeAbbr];
		const awayPlayers = this.state.playersSelected[awayAbbr];

		const playersSelected = {
			home: homePlayers,
			away: awayPlayers
		};

		console.log(playersSelected);
		return playersSelected;
	}


	render() {
		// console.log("NBAPulse count", this.count++);
		return (
			<div className="main-container">
				<Header
					teamSelected={this.state.teamSelected}
					onSelectTeam={this.onSelectTeam}
					onSelectGame={this.onSelectGame}
					leagueDetails={this.props.league}
					gameSelected={this.state.gameSelected}
					/>

				<Game
					gameSelected={this.state.gameSelected}
					gameData={this.state.gameData}
					playersSelected={this.getPlayersSelected()}
					onStatClick={this.onStatClick}
					selectedStats={this.state.stats}
					onSelectTeamPlayer={this.onSelectTeamPlayer}
					/>
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('League');
	Meteor.subscribe('Teams');
	// Meteor.subscribe('Games');

	return {
		league: League.findOne({},{'teamsDetails':1,'teamsAbbr':1, '_id':0}),
		teams: Teams.find({"season":"2017-2018"}).fetch()
	};
})(NBAPulse);
