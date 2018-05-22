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
			calendarType:'playoffs',
			teamSelected: '',
			teamGamesList: [],
			gameSelected: '',
			gameData: {},
			playersSelected: {
				"ATL": ['203471'],
				"BKN": ['1626156'],
				"BOS": ['201143','1627759','1628369'],
				"CHA": ['202689'],
				"CHI": ['1628374'],
				"CLE": ['2544','201567'],
				"DAL": ['203084'],
				"DEN": ['203999'],
				"DET": ['203083'],
				"GSW": ['201939','201142','203110','202691'],
				"HOU": ['201935','101108'],
				"IND": ['203506'],
				"LAC": ['201599'],
				"LAL": ['1627742','1628366'],
				"MEM": ['201188'],
				"MIA": ['201609'],
				"MIL": ['203507'],
				"MIN": ['1626157'],
				"NOP": ['203076'],
				"NYK": ['204001'],
				"OKC": ['201566'],
				"ORL": ['203932'],
				"PHI": ['203954'],
				"PHX": ['1626164'],
				"POR": ['203081'],
				"SAC": ['1628368'],
				"SAS": ['200746'],
				"TOR": ['201942'],
				"UTA": ['1628378'],
				"WAS": ['202322']
			}
		};

		this.count = 0;
		this.willProps = 0;

		this.onSelectCalendar = this.onSelectCalendar.bind(this);
		this.onSelectTeam = this.onSelectTeam.bind(this);
		this.onSelectGame = this.onSelectGame.bind(this);
		this.onStatClick = this.onStatClick.bind(this);
		this.onSelectTeamPlayer = this.onSelectTeamPlayer.bind(this);
		this.getPlayersSelected = this.getPlayersSelected.bind(this);
		this.getSelectedStats = this.getSelectedStats.bind(this);
		this.renderGame = this.renderGame.bind(this);
	}

	componentDidMount() {
		this.onSelectTeam('CLE');
		this.onSelectGame('0041700304');
	}

	onSelectTeam(teamAbbr) {
		if (teamAbbr !== this.state.teamSelected) {
			Meteor.call('loadTeamGames', teamAbbr, this.state.calendarType, (error, results) => {
				this.setState({
					teamSelected: teamAbbr,
					teamGamesList: results
				});
			});
		}
	}

	onSelectGame(gid) {
		const self = this;

		Meteor.call("getGameData", gid, function(error, results) {
			self.setState({
				gameSelected: gid,
				gameData: results
	        });
	    });
	}

	onSelectCalendar(calendarType) {
		if (calendarType !== this.state.calendarType) {
			Meteor.call('loadTeamGames', this.state.teamSelected, calendarType, (error, results) => {
				this.setState({
					calendarType: calendarType,
					teamGamesList: results
				});
			});
		}
	}

	onStatClick(stat) {
		let newState = this.state.stats;
		newState[stat] = this.state.stats[stat] === '' ? 'stat-hidden' : '';
		this.setState({
			'stats': newState
		});
	}

	onSelectTeamPlayer(teamAbbr, playerId) {
		// console.log("Player selected ", playerId)
		const playerIndex = this.state.playersSelected[teamAbbr].indexOf(playerId);
		let newSelectedPlayers = this.state.playersSelected;
		
		if (playerIndex > -1) {
			// removing selected player from list
			newSelectedPlayers[teamAbbr].splice(playerIndex, 1);
		} else {
			// adding selected player to list
			newSelectedPlayers[teamAbbr].push(playerId);
		}

		this.setState({
			playersSelected: newSelectedPlayers
		});
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

		const homePlayers = this.state.playersSelected[homeAbbr],
			  awayPlayers = this.state.playersSelected[awayAbbr];

		const playersSelected = {
			home: homePlayers,
			away: awayPlayers
		};

		return playersSelected;
	}

	getSelectedStats() {
		const self = this;
		let selectedStats = {};
		Object.keys(this.state.stats).forEach(stat => {
			if(self.state.stats[stat] === '') {
				selectedStats[stat] = '';
			}
		});

		return selectedStats;
	}

	renderGame() {
		if (Object.keys(this.state.gameData).length > 0) {
			return (
				<Game
					gameSelected={this.state.gameSelected}
					gameData={this.state.gameData}
					playersSelected={this.getPlayersSelected()}
					onStatClick={this.onStatClick}
					selectedStats={this.state.stats}
					onSelectTeamPlayer={this.onSelectTeamPlayer}
					/>
			);
		}

		return (
			<div className="empty-game">
				<h1>THIS GAME IS NOT AVAILABLE YET</h1>
			</div>
		)
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
					teamGamesList={this.state.teamGamesList}
					onSelectCalendar={this.onSelectCalendar}
					calendarType={this.state.calendarType}
					/>

				{ this.renderGame() }
			</div>
		);
	}
}

export default withTracker(() => {
	Meteor.subscribe('League');
	Meteor.subscribe('Teams');

	return {
		league: League.findOne({},{'teamsDetails':1,'teamsAbbr':1, '_id':0}),
		teams: Teams.find({"season":"2017-2018"}).fetch()
	};
})(NBAPulse);
