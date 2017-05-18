import React, { Component } from 'react';

import StatControl from './StatControl';
import PulseChart from './PulseChart';
import CordChart from './CordChart';

import styles from './StatControl.css';

// import gameLogDummy from '../../data/samples/PlaybyPlay_OKCvHOU-Game5.json';
// import gameLogDummy from '../../data/samples/PlaybyPlay_GSWvPOR-Game4.json';

// fetch("http://stats.nba.com/stats/playbyplayv2?GameID=0041600165&StartPeriod=00&EndPeriod=03")
//   .then(resp => resp.json())
// 

import games from '../../data/games.json';
import teams from '../../data/teams.json';

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
			foul: 'stat-hidden',
			periods: 4
		};

		this.handleStatClick = this.handleStatClick.bind(this);
		this.getSelectedStats = this.getSelectedStats.bind(this);
		this.getCordChart = this.getCordChart.bind(this);
		this.getPlayerInGame = this.getPlayerInGame.bind(this);
		this.getTeamLog = this.getTeamLog.bind(this);
		this.getTeamInGame = this.getTeamInGame.bind(this);
	}

	getMaxPeriods(gameList) {
		return Math.max.apply(Math,gameList.map((gameFileName) => {
			let gameData = require('../../data/samples/'+gameFileName);
			return gameData.parameters.EndPeriod;
		}));
	}

	getSelectedStats() {
		let selectedStats = [];

		for (let i = 0; i<Object.keys(this.state).length; i++) {
			let stat = Object.keys(this.state)[i];
			let statClass = this.state[stat];
			if (statClass === '') {
				selectedStats.push(stat);
			}
		}
		return selectedStats;
	}

	handleStatClick(stats) {
		
		let newState = {};
		stats.forEach(stat => {
			newState[stat] = this.state[stat] === '' ? 'stat-hidden' : '';
		});
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
		const playText = [event['HOMEDESCRIPTION'], event['VISITORDESCRIPTION'],event['NEUTRALDESCRIPTION']].join(', ');


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
				play.text = 'rebound';
			} else if (description.indexOf('Free Throw') !== -1) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 3;
					play.text = 'missed-ft';
				} else {
					play.type = 4;
					play.text = 'made-ft';
				}
			} else if (description.indexOf('3PT') !== -1 ) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 5;
					play.text = 'missed-3pt';
				} else {
					play.type = 6;
					play.text = 'made-3pt';
				}
			} else if (description.indexOf('Dunk') !== -1 || description.indexOf('Jumper') !== -1 || description.indexOf('Shot') !== -1 || description.indexOf('Layup') !== -1) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 7;
					play.text = 'missed-fg';
				} else {
					play.type = 8;
					play.text = 'made-fg';
				}
			} else if (description.indexOf('Turnover') !== -1) {
				play.type = 9;
				play.text = 'turnover';
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
				play.text = 'assist';
			} else if (description.indexOf('BLK') !== -1) {
				// player3
				play.type = 11;
				play.text = 'block';
			} else if (description.indexOf('STL') !== -1) {
				// player2
				play.type = 12;
				play.text = 'steal';
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

		let play = getPrimaryPlayType(playText);
		parsedPlays.push(parsePlayerActions('PLAYER1', play));

		play = getSecondaryPlayType(playText);
		if (play.type === 11) {
			parsedPlays.push(parsePlayerActions('PLAYER3', play));
		} else if (play.type === 12 || play.type == 10) {
			parsedPlays.push(parsePlayerActions('PLAYER2', play));
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

	getTeamLog(teamId, gameLog, players) {

		return gameLog.filter( event => {
			if (typeof players === 'undefined') {
				return teamId === event.teamId;
			} else {
				const playerIds = players.map( p => {
					return p.playerId;
				})
				return playerIds.includes(event.playerId);
			}
		});
	}

	getPlayerInSeries(playerId, playerName, series) {

		const maxPeriods = this.getMaxPeriods(series);
		let playerSeriesCharts = series.map((gameFile, i) => {

			const seriesGameRawData = require('../../data/samples/'+gameFile);
			this.timeLog = this.createBasicTimeLog(maxPeriods);
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
					periods={maxPeriods}
					/>
			)
		});

		return playerSeriesCharts;

	}

	getGameMatchup(game, homeTeam, playersHomeTeam, awayTeam, playersAwayTeam) {
		
		const homePlayers = playersHomeTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none',homeTeam.players[player], game) }</div>);
		});

		const awayPlayers = playersAwayTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none', awayTeam.players[player], game) }</div>);
		})

		this.getTeamInGame('bottom', homeTeam, game, playersHomeTeam);


		return (
			<div>
				{ homePlayers}
				<div> {this.getTeamInGame('bottom', homeTeam, game, playersHomeTeam) }</div>
				<hr />
				<div> {this.getTeamInGame('top', awayTeam, game, playersAwayTeam) }</div>
				{awayPlayers}
			</div>
		);
	}

	getCordChart(player, gameFile) {

		const seriesGameRawData = require('../../data/samples/'+gameFile);
		this.timeLog = this.createBasicTimeLog(seriesGameRawData.parameters.EndPeriod);
		const gameLog = this.processGameLog(seriesGameRawData);

		const playerLog = this.getPlayerLog(player.playerId, gameLog);

		const selected = this.getSelectedStats();
		console.log(selected);

		return (
			<CordChart timeLog={this.timeLog}
				specs={this.props.specs}
				playerId={player.playerId}
				playerLog={playerLog}
				label={player.playerName}
				key={"cord_" + player.playerId}
				selectedStats={selected}
				periods={seriesGameRawData.parameters.EndPeriod}
				/>
			);
	}

	getPlayerInGame(position, player, gameFile) {
		const seriesGameRawData = require('../../data/samples/'+gameFile);
		this.timeLog = this.createBasicTimeLog(seriesGameRawData.parameters.EndPeriod);
		const gameLog = this.processGameLog(seriesGameRawData);

		const playerLog = this.getPlayerLog(player.playerId, gameLog);
		const selected = this.getSelectedStats();

		const pulseChart = (
			<PulseChart timeLog={this.timeLog}
					specs={this.props.specs}
					playerId={player.playerId}
					playerLog={playerLog}
					label={player.playerName}
					key={player.playerId+"_game"}
					selectedStats={this.state}
					periods={seriesGameRawData.parameters.EndPeriod}
					height={25}
					/>);

		const top = position ==='top' ? pulseChart : null;
		const bottom = position ==='bottom' ? pulseChart : null;

		const classes = 'cord-chart-container '+position;
		return (
			<div className="player-container">
				{top}
				<div className={classes} >
					<CordChart timeLog={this.timeLog}
						specs={this.props.specs}
						playerId={player.playerId}
						playerLog={playerLog}
						label={player.playerName}
						key={"cord_" + player.playerId}
						selectedStats={selected}
						periods={seriesGameRawData.parameters.EndPeriod}
						height={100}
						/>
				</div>
				{bottom}
			</div>
		);
	}


	getTeamInGame(position, team, gameFile, playersIndex) {
		const seriesGameRawData = require('../../data/samples/'+gameFile);
		this.timeLog = this.createBasicTimeLog(seriesGameRawData.parameters.EndPeriod);
		const gameLog = this.processGameLog(seriesGameRawData);

		const players = playersIndex.map(i => {
			return team.players[i];
		});

		const teamLog = this.getTeamLog(team.teamId, gameLog, players);
		const selected = this.getSelectedStats();

		const pulseChart = (
			<PulseChart timeLog={this.timeLog}
					specs={this.props.specs}
					playerId={team.teamId}
					playerLog={teamLog}
					label={team.teamName}
					key={team.teamId+"_game"}
					selectedStats={this.state}
					periods={seriesGameRawData.parameters.EndPeriod}
					height={50}
					/>);

		const top = position ==='top' ? pulseChart : null;
		const bottom = position ==='bottom' ? pulseChart : null;

		const classes = 'cord-chart-container '+position;
		return (
			<div className="player-container">
				{top}
				<div className={classes} >
					<CordChart timeLog={this.timeLog}
						specs={this.props.specs}
						playerId={team.teamId}
						playerLog={teamLog}
						label={team.teamName}
						key={"cord_" + team.teamId}
						selectedStats={selected}
						periods={seriesGameRawData.parameters.EndPeriod}
						height={250}
						/>
				</div>
				{bottom}
			</div>
		);
	}






	render() {

		// <LineChart data={this.props.gameLog} specs={this.props.specs} />

		return (
			<div>
				<StatControl handleStatClick={this.handleStatClick} selectedStats={this.state}/>

				{ this.getGameMatchup(games.BOSvCLE[0],
						teams.bos,
						[0,1],
						teams.cle,
						[0,1]
						) }

				<br /><br /><br />
			</div>
		);
	}
}





















