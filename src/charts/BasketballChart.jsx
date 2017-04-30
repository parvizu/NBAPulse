import React, { Component } from 'react';

import StatControl from './StatControl';
import PulseChart from './PulseChart';

import styles from './StatControl.css';

// import gameLogDummy from '../../data/samples/PlaybyPlay_OKCvHOU-Game5.json';
// import gameLogDummy from '../../data/samples/PlaybyPlay_GSWvPOR-Game4.json';

// fetch("http://stats.nba.com/stats/playbyplayv2?GameID=0041600165&StartPeriod=00&EndPeriod=03")
//   .then(resp => resp.json())
// 

const headers =["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION", "momentId"];

export default class BasketballChart extends Component {
	
	constructor(props) {
		super(props);

		this.processEvent = this.processEvent.bind(this);
		this.processGameLog = this.processGameLog.bind(this);

		this.timeLog = [];

		this.getPlayerLog = this.getPlayerLog.bind(this);
		this.getPlayerInSeries = this.getPlayerInSeries.bind(this);
		this.createBasicTimeLog = this.createBasicTimeLog.bind(this);

		this.state = {
			made: '',
			missed: '',
			assist: '',
			rebound: '',
			steal: '',
			block: '',
			turnover: '',
			foul: ''
		};

		this.handleStatClick = this.handleStatClick.bind(this);
	}

	handleStatClick(stat) {
		
		let newState = {};
		newState[stat] = this.state[stat] === '' ? 'stat-hidden' : '';

		this.setState(newState);

	}

	createBasicTimeLog (periods) {
		let basicLog = [];
		let momentId = 0;

		for (let q = 1; q<=periods; q++) {
			for (let m = 12; m >= 0; m--) {
				if (m == 12) {					
					basicLog.push({
						gameClock: "12:00",
						momentId: momentId++,
						quarter: q
					});

				} else {
					for (let s = 59; s>= 0; s--) {
						let second = s<10 ? "0"+s : s;
						basicLog.push({
							gameClock: m+":"+second,
							momentId: momentId++,
							quarter: q
						});
					}	
				}
				
			}
		}

		return basicLog;
	}

	processGameLog(gameData) {
		let gameLog = [];
		let refactoredEvents = [];

		gameData.resultSets[0].rowSet.forEach(event => {
			let brokenDown = {};
			event.forEach((stat,i) => {
				brokenDown[headers[i]] = stat;
			});
			gameLog = gameLog.concat(this.processEvent(brokenDown));
		});

		return gameLog;
	}

	processEvent(event) {
		let parsedPlays = [];
		let playText;

		if (event['HOMEDESCRIPTION'] !== null ) {
			playText = event['HOMEDESCRIPTION'];
		} else if (event['VISITORDESCRIPTION'] !== null) {
			playText = event['VISITORDESCRIPTION'];
		} else {
			playText = event['NEUTRALDESCRIPTION'];
		}


		const getPrimaryPlayType = (description) => {
			let play = {
				type: 0,
				text: ''
			}

			if (description === null) {
				play.type = -1;
				play.text = '';
			} else if (description.indexOf('FOUL') !== -1) {
				play.type = 1;
				play.text = 'foul';
			} else if (description.indexOf('REBOUND') !== -1) {
				play.type = 2;
				play.text = 'rebound positive';
			} else if (description.indexOf('Free Throw') !== -1) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 3;
					play.text = 'missed-ft negative';
				} else {
					play.type = 4;
					play.text = 'made-ft positive';
				}
			} else if (description.indexOf('3PT') !== -1 ) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 5;
					play.text = 'missed-3pt negative';
				} else {
					play.type = 6;
					play.text = 'made-3pt positive';
				}
			} else if (description.indexOf('Dunk') !== -1 || description.indexOf('Jumper') !== -1 || description.indexOf('Shot') !== -1 || description.indexOf('Layup') !== -1) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 7;
					play.text = 'missed-fg negative';
				} else {
					play.type = 8;
					play.text = 'made-fg positive';
				}
			} else if (description.indexOf('Turnover') !== -1) {
				play.type = 9;
				play.text = 'turnover negative';
			} 

			return play;
		}

		const getSecondaryPlayType = (description) => {
			let play = {
				type: 0,
				text: ''
			}

			if (description === null) {
				play.type = -1;
				play.text = '';
			} else if (description.indexOf('AST') !== -1) {
				// player2
				play.type = 10;
				play.text = 'assist positive';
			} else if (description.indexOf('BLK') !== -1) {
				// player3
				play.type = 11;
				play.text = 'block positive';
			} else if (description.indexOf('STL') !== -1) {
				// player2
				play.type = 12;
				play.text = 'steal positive';
			}

			return play;
		}

		const parsePlayerActions = (playernum, play)  => {
			let momentId = -1;
			for (let i = 0; i<this.timeLog.length; i++) {
				let moment = this.timeLog[i];
				if (moment.quarter === event['PERIOD'] && moment.gameClock === event['PCTIMESTRING']) {
					momentId = moment.momentId;
					break;
				}
			}

			return {			
				momentId: momentId,
				eventId: event['EVENTNUM'],
				quarter: event['PERIOD'],
				clock: event['PCTIMESTRING'],			
				fullPlay: playText,
				playType: play.type,
				playText: play.text,
				playerId: event[playernum+'_ID'],
				playerName: event[playernum+'_NAME'],
				teamId: event[playernum+'_TEAM_ID'],
				teamName: event[playernum+'_TEAM_NICKNAME'],
				teamAbbreviation: event[playernum+'_TEAM_ABBREVIATION'],
				teamCity: event[playernum+'_TEAM_CITY']
			};
		}


		let prefix = 'PLAYER1';
		let play = getPrimaryPlayType(playText);
		parsedPlays.push(parsePlayerActions(prefix, play));

		play = getSecondaryPlayType(playText);
		if (play.type === 11) {
			prefix = 'PLAYER3';
			parsedPlays.push(parsePlayerActions(prefix, play));
		} else if (play.type === 12 || play.type == 10) {
			prefix = 'PLAYER2';
			parsedPlays.push(parsePlayerActions(prefix, play));
		}

		return parsedPlays;
	}


	getPlayerLog(playerId, gameLog) {

		let playerPlays = []
		gameLog.forEach((event) => {
			if (event.playerId == playerId) {
				playerPlays.push(event);
			}
		});

		return playerPlays;
	}

	getPlayerInSeries(playerId, playerName, series) {
		let playerSeriesCharts = series.map((gameFile, i) => {

			const seriesGameRawData = require('../../data/samples/'+gameFile);
			this.timeLog = this.createBasicTimeLog(4);
			const gameLog = this.processGameLog(seriesGameRawData);
			const playerLog = this.getPlayerLog(playerId, gameLog);

			return (
				<PulseChart timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={playerId} 
					playerLog={playerLog} 
					label={"Game "+(i+1)}
					key={playerId+"_"+i}
					selectedStats={this.state}
					/>
			)
		});

		return playerSeriesCharts;

	}

	getGameMatchup(gameFile, playersHomeTeam, playersAwayTeam) {
		const seriesGameRawData = require('../../data/samples/'+gameFile);
		this.timeLog = this.createBasicTimeLog(4);
		const gameLog = this.processGameLog(seriesGameRawData);
		
		const homeTeamCharts = playersHomeTeam.map((player,i) => {
			const playerLog = this.getPlayerLog(player.playerId, gameLog);

			return (
				<PulseChart timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={player.playerId} 
					playerLog={playerLog} 
					label={player.playerName}
					key={player.playerId+"_"+i}
					selectedStats={this.state}
					/>
			);
		});

		const awayTeamCharts = playersAwayTeam.map((player,i) => {
			const playerLog = this.getPlayerLog(player.playerId, gameLog);

			return (
				<PulseChart timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={player.playerId} 
					playerLog={playerLog} 
					label={player.playerName}
					key={player.playerId+"_"+i}
					selectedStats={this.state}
					/>
			);
		});

		return [].concat(homeTeamCharts).concat([(<br />)]).concat(awayTeamCharts);
	}


	render() {

		// <LineChart data={this.props.gameLog} specs={this.props.specs} />

		// 	PLAYERS		
			// Harden: 201935
			// Westbrook: 201566
			// Oladipo: 203506
			// Beverly: 201976

			// Curry: 201939
			// Durant: 201142
			// Green: 203110

			// Lillard: 203081
			// McCollum: 203468

		const seriesFiles = {
			OKCvHOU: [
				'PlaybyPlay_OKCvHOU-Game1.json',
				'PlaybyPlay_OKCvHOU-Game2.json',
				'PlaybyPlay_OKCvHOU-Game3.json',
				'PlaybyPlay_OKCvHOU-Game4.json',
				'PlaybyPlay_OKCvHOU-Game5.json'],

			GSWvPOR: [
				'PlaybyPlay_GSWvPOR-Game1.json',
				'PlaybyPlay_GSWvPOR-Game2.json',
				'PlaybyPlay_GSWvPOR-Game3.json',
				'PlaybyPlay_GSWvPOR-Game4.json']
		}

		const okcPlayers = [{
			playerId: 201566,
			playerName: "Russell Westbrook"
		}];

		const houPlayers = [{
			playerId: 201935,
			playerName: "James Harden"
		}];

		const gswPlayers = [{
			playerId: 201939,
			playerName: "Steph Curry"
		},{
			playerId: 201142,
			playerName: "Kevin Durant"
		},{
			playerId: 203110,
			playerName: "Draymond Green"
		},{
			playerId: 202691,
			playerName: "Klay Thompson"
		}];
		const porPlayers = [{
			playerId: 203468,
			playerName: "CJ McCollum"
		},{
			playerId: 203081,
			playerName: "Damien Lillard"
		}];


		// <h3> Game 2 Matchup </h3>
		// {this.getGameMatchup(seriesFiles.OKCvHOU[1],okcPlayers,houPlayers)}
		// <hr />
		// <h3> Russell Westbrook </h3>
		// { this.getPlayerInSeries(201566,"Russell Westbrook", seriesFiles.OKCvHOU) }
		// <br />
		// <h3> James Harden </h3>
		// { this.getPlayerInSeries(201935,"James Harden", seriesFiles.OKCvHOU) }


		// <h3> Game 1 Matchup </h3>
				// {this.getGameMatchup(seriesFiles.GSWvPOR[0],gswPlayers,porPlayers)}
		return (
			<div>
				<StatControl handleStatClick={this.handleStatClick} selectedStats={this.state}/>

				

				<hr />
				<br /><br />
				<h3> {gswPlayers[3].playerName} </h3>
				{ this.getPlayerInSeries(gswPlayers[3].playerId, gswPlayers[3].playerName, seriesFiles.GSWvPOR) }
				<br />
				<h3> {porPlayers[0].playerName} </h3>
				{ this.getPlayerInSeries(porPlayers[0].playerId,porPlayers[0].playerName, seriesFiles.GSWvPOR) }
			</div>
		)
	}
}





















