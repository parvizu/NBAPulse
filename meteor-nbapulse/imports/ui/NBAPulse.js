import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Header from './Header.js';
import Game from './Game.js';

import {Games, Schedule, Teams, League } from '../api/collections.js';

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
			teamSelected: 'GSW',
			gameSelected: '',
			gameData: {},
			playersSelected: {
				"ATL": [1,6],
				"BKN": [4],
				"BOS": [0,3,1],
				"CHA": [2],
				"CHI": [1,0],
				"CLE": [0,2],
				"DAL": [0,3],
				"DEN": [1,3],
				"DET": [0,2],
				"GSW": [0,1,2,3],
				"HOU": [2,3],
				"IND": [4,7],
				"LAC": [1,0],
				"LAL": [3,7,1],
				"MEM": [0,3],
				"MIA": [3,0],
				"MIL": [1],
				"MIN": [3,4,0],
				"NOP": [2,0],
				"NYK": [0,2],
				"OKC": [2,1,3],
				"ORL": [4,0],
				"PHI": [0,1],
				"PHX": [2],
				"POR": [2,3],
				"SAC": [6,4],
				"SAS": [6,0,3],
				"TOR": [2,1],
				"UTA": [0,3],
				"WAS": [2,4]
			}
		};

		this.onSelectTeam = this.onSelectTeam.bind(this);
		this.onSelectGame = this.onSelectGame.bind(this);
		this.getPlayersSelected = this.getPlayersSelected.bind(this);
	}

	componentWillMount() {
		this.onSelectGame('0021700002');
	}

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

	        self.setState({
				gameSelected: gid,
				gameData: results
	        });
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

		return playersSelected = {
			home: this.state.playersSelected[homeAbbr],
			away: this.state.playersSelected[awayAbbr]
		};
	}


	render() {
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
					playersSelected={this.getPlayersSelected() }
					/>
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		league: League.findOne({},{'teamsDetails':1,'teamsAbbr':1, '_id':0}),
		games: Games.find({}).fetch(),
		schedule: Schedule.find({"season":"2017-2018"}).fetch(),
		teams: Teams.find({"season":"2017-2018"}).fetch()
	};
})(NBAPulse);
