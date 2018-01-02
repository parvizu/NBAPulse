import React, { Component } from 'react';

import GameDetails from '../GameDetails';
import TeamsMenu from '../TeamsMenu';

import StatControl from './StatControl';
import PulseChart from './PulseChart';
import CordChart from './CordChart';
import ScoringMarginChart from './ScoringMarginChart';


import styles from './StatControl.css';
import styles2 from './BasketballChart.css'



// import games from '../../data/games-updated.json';


const headers =["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION", "momentId"];

export default class BasketballChart extends Component {
	
	constructor(props) {
		super(props);

		this.timeLog = [];

		this.state = {
			teamSelected: 'GSW',
			gameSelected: 'g1',
			selections: {
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
			game: {
				file: '',
				periods: 4,
				timeLog: {},
				rawData: {},
				gameLog: {},
				scoringLog: {},
				substitutions: {}
			},
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
				"POR": [2],
				"SAC": [6,4],
				"SAS": [6,0,3],
				"TOR": [2,1],
				"UTA": [0,3],
				"WAS": [2,4]
			}
		};

		this.loadGame = this.loadGame.bind(this);
		this.processEvent = this.processEvent.bind(this);
		this.processGameLog = this.processGameLog.bind(this);
		this.getPlayerLog = this.getPlayerLog.bind(this);
		this.getPlayerInSeries = this.getPlayerInSeries.bind(this);
		this.createBasicTimeLog = this.createBasicTimeLog.bind(this);
		this.setGameData = this.setGameData.bind(this);
		this.handleStatClick = this.handleStatClick.bind(this);
		this.getSelectedStats = this.getSelectedStats.bind(this);
		this.getCordChart = this.getCordChart.bind(this);
		this.getPlayerInGame = this.getPlayerInGame.bind(this);
		this.getTeamLog = this.getTeamLog.bind(this);
		this.getTeamInGame = this.getTeamInGame.bind(this);
		this.createScoringChart = this.createScoringChart.bind(this);
		this.getPlayerInSeries = this.getPlayerInSeries.bind(this);
		this.getGame = this.getGame.bind(this);
		this.onSelectGame = this.onSelectGame.bind(this);
		this.onSelectTeam = this.onSelectTeam.bind(this);
		this.onSelectPlayer = this.onSelectPlayer.bind(this);

		this._processTeamSubstitutions = this._processTeamSubstitutions.bind(this);
		this._processGameSubstitutions = this._processGameSubstitutions.bind(this);
	}

	componentWillMount() {
		this.setGameData(this.props.games.s2018.season.team.GSW.g1.data);
	}

	setGameData(gameFile) {

		let loadedGame = this.loadGame(gameFile);
		const subs = this._processGameSubstitutions(loadedGame);

		loadedGame['substitutions'] = subs;

		this.setState({
			game: loadedGame
		});
	}

	loadGame(gameFile) {
		let game = {};

		game['file'] = gameFile;
		game['rawData'] = require('../../data/2018/'+game.file);
		game['periods'] = game.rawData.parameters.EndPeriod;
		game['timeLog'] = this.createBasicTimeLog(game.periods);
		game['gameLog'] = this.processGameLog(game.rawData, game.timeLog);
		game['scoringLog'] = game.gameLog.filter(p=> {
			return [4,6,8].includes(p.playType) || p.momentId === 0;
		});

		game.scoringLog.push({
			momentId: game.timeLog.length,
			margin: 0
		});
		game.scoringLog.push({
			momentId: game.timeLog.length+1,
			margin: 0
		});

		return game;
	}

	getGame(gameFile) {
		
		if (this.state.game.file !== gameFile) {
			this.setGameData(gameFile)
		}	

		return this.state.game;
	}

	getMaxPeriods(gameList) {
		return Math.max.apply(Math,gameList.map((gameFileName) => {
			let gameData = require('../../data/samples/'+gameFileName);
			return gameData.parameters.EndPeriod;
		}));
	}

	getSelectedStats() {
		let selectedStats = [];

		for (let i = 0; i<Object.keys(this.state.selections).length; i++) {
			let stat = Object.keys(this.state.selections)[i];
			let statClass = this.state.selections[stat];
			if (statClass === '') {
				selectedStats.push(stat);
			}
		}
		return selectedStats;
	}

	handleStatClick(stats) {
		let newState = this.state.selections;
		stats.forEach(stat => {
			newState[stat] = this.state.selections[stat] === '' ? 'stat-hidden' : '';
		});
		this.setState({
			'selections':newState
		});
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

	processGameLog(gameData, timeLog) {
		let gameLog = [];
		let refactoredEvents = [];

		gameData.resultSets[0].rowSet.forEach(event => {
			let brokenDown = {};
			event.forEach((stat,i) => {
				brokenDown[headers[i]] = stat;
			});
			gameLog = gameLog.concat(this.processEvent(brokenDown, timeLog));
		});

		return gameLog;
	}

	processEvent(event, timeLog) {
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
			} else if (description.indexOf('Dunk') !== -1 || description.indexOf('Jumper') !== -1 || (description.indexOf('Shot') !== -1 && description.indexOf('Shot Clock') === -1)|| description.indexOf('Layup') !== -1) {
				if (description.indexOf('MISS') !== -1) {
					play.type = 7;
					play.text = 'missed-fg';
				} else {
					play.type = 8;
					play.text = 'made-fg';
				}
			} else if (description.indexOf('Turnover') !== -1 || description.indexOf('Shot Clock') !== -1) {
				play.type = 9;
				play.text = 'turnover';
			} else if (description.indexOf('SUB:') !== -1) {
				play.type = 13;
				play.text = 'sub-out';
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
			} else if (description.indexOf('SUB:') !== -1) {
				play.type = 14;
				play.text = 'sub-in';
			}

			return play;
		}

		const parsePlayerActions = (playernum, play, timeLog)  => {
			let momentId = -1;

			for (let i = 0; i<timeLog.length; i++) {
				let moment = timeLog[i];
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
				margin: event['SCOREMARGIN'] !== null && event['SCOREMARGIN'] !== 'TIE' ? parseInt(event['SCOREMARGIN']) : 0,
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
		parsedPlays.push(parsePlayerActions('PLAYER1', play, timeLog));

		play = getSecondaryPlayType(playText);
		if (play.type === 11) {
			parsedPlays.push(parsePlayerActions('PLAYER3', play, timeLog));
		} else if (play.type === 12 || play.type == 10  || play.type === 14) {
			parsedPlays.push(parsePlayerActions('PLAYER2', play, timeLog));
		}

		return parsedPlays;
	}

	getPlayerLog(playerId, gameLog) {

		let playerPlays = []
		let playerStats = {
			points: 0,
			assist: 0,
			rebound: 0,
			steal: 0,
			turnover: 0,
			foul: 0,
			block: 0,
			"made-fg": 0,
			"missed-fg": 0,
			"made-3pt": 0,
			"missed-3pt": 0,
			'made-ft': 0,
			'missed-ft': 0
		};

		const processPlayerEvent = (playType) => {
			switch(playType) {
				case 1:
					return 'foul';

				case 2:
					return 'rebound';

				case 3:
					return 'missed-ft';

				case 4:
					return 'made-ft';

				case 5:
					return 'missed-3pt';

				case 6:
					return 'made-3pt';

				case 7:
					return 'missed-fg';

				case 8:
					return 'made-fg';

				case 9:
					return 'turnover';

				case 10:
					return 'assist';

				case 11:
					return 'block';

				case 12:
					return 'steal';
			}
		};

		gameLog.forEach((event) => {
			let playType;
			if (event.playerId == playerId) {
				playerPlays.push(event);
				playType = processPlayerEvent(event.playType);
				playerStats[playType]+=1;

				if (playType === 'made-fg') {
					playerStats.points += 2;
				} else if (playType === 'made-3pt') {
					playerStats.points += 3;
					playerStats['made-fg'] += 1;
				} else if (playType === 'made-ft') {
					playerStats.points += 1;
				} else if (playType === 'missed-3pt') {
					playerStats['missed-fg'] += 1;
				}
			}
		});

		return {
			playerLog: playerPlays,
			playerStats: playerStats
		};
	}

	getTeamLog(teamId, gameLog, players) {

		return gameLog.filter( event => {
			if (players.length === 0) {
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
			const playerData = this.getPlayerLog(playerId, gameLog);

			return (
				<PulseChart timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={playerId} 
					playerLog={playerData.playerLog}
					playerStats={playerData.playerStats}
					label={"Game "+(i+1)}
					key={playerId+"_"+i}
					selectedStats={this.state.selections}
					periods={maxPeriods}
					/>
			)
		});

		return playerSeriesCharts;
	}

	getGamePlayersMatchup(game, homeTeam, playersHomeTeam, awayTeam, playersAwayTeam) {
		const gameData = this.getGame(game);
		const homePlayers = playersHomeTeam.length === 0 ? null : playersHomeTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none',homeTeam.players[player], gameData) }</div>);
		});

		const awayPlayers = playersAwayTeam.length === 0 ? null : playersAwayTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none', awayTeam.players[player], gameData) }</div>);
		});

		

		return (
			<div className="main-visualization-container">
				<div className={"home-players-visualization-container team-bg " + homeTeam.teamKey}>
					{ homePlayers }
				</div>
				<div> 
				{
					// this.getTeamInGame('none', homeTeam, gameData, playersHomeTeam) 
				}
				</div>
					{ this.createScoringChart(gameData) }
				<div> {
					// this.getTeamInGame('none', awayTeam, gameData, playersAwayTeam) 
				}</div>
				<div className={"away-players-visualization-container team-bg " + awayTeam.teamKey}>
					{ awayPlayers }
				</div>
			</div>
		);
	}

	getGameTeamMatchup(game, homeTeam, playersHomeTeam, awayTeam, playersAwayTeam) {
		const gameData = this.getGame(game);
		const homePlayers = playersHomeTeam.length === 0 ? null : playersHomeTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none',homeTeam.players[player], gameData) }</div>);
		});

		const awayPlayers = playersAwayTeam.length === 0 ? null : playersAwayTeam.map(player => {
			return (<div>{ this.getPlayerInGame('none', awayTeam.players[player], gameData) }</div>);
		});

		

		return (
			<div>
				{ 
					// homePlayers
				}
				<div> {
					this.getTeamInGame('none', homeTeam, gameData, playersHomeTeam) 
				}</div>
				{ this.createScoringChart(gameData) }
				<div> {
					this.getTeamInGame('none', awayTeam, gameData, playersAwayTeam) 
				}</div>
				{
					// awayPlayers
				}
			</div>
		);
	}

	getSinglePlayerMatchup(gameFile, homePlayer, awayPlayer) {

		const gameData = this.getGame(gameFile);
		return (
			<div>
				{ this.getPlayerInGame('bottom', homePlayer, gameData) }
				{ this.createScoringChart(gameData) }
				{ this.getPlayerInGame('top', awayPlayer, gameData) }
			</div>
		)
	}

	getCordChart(player, gameData) {

		const playerData = this.getPlayerLog(player.playerId, gameData.gameLog);
		const selected = this.getSelectedStats();
		const playerSubs = gameData.substitutions[player.playerId] || [];

		return (
			<CordChart timeLog={gameData.timeLog}
				specs={this.props.specs}
				playerId={player.playerId}
				playerLog={playerData.playerLog}
				playerStats={playerData.playerStats}
				playerSubs={playerSubs}
				label={player.playerName}
				key={"cord_" + player.playerId}
				selectedStats={selected}
				periods={gameData.periods}
				/>
			);
	}

	getPlayerInGame(position, player, gameData, label) {

		const playerData = this.getPlayerLog(player.playerId, gameData.gameLog);
		const selected = this.getSelectedStats();

		const playerLabel = typeof label === 'undefined' ? player.playerName : label;
		const playerSubs = gameData.substitutions[player.playerId] || [];

		const pulseChart = (
			<PulseChart timeLog={gameData.timeLog}
					specs={this.props.specs}
					playerId={player.playerId}
					playerLog={playerData.playerLog}
					playerStats={playerData.playerStats}
					playerSubs={playerSubs}
					label={playerLabel}
					key={player.playerId+"_game"}
					selectedStats={selected}
					periods={gameData.periods}
					height={25}
					/>);

		const top = position ==='top' ? pulseChart : null;
		const bottom = position ==='bottom' ? pulseChart : null;

		const classes = 'cord-chart-container '+position;
		return (
			<div className="player-container">
				{top}
				<div className={classes} >
					<CordChart timeLog={gameData.timeLog}
						specs={this.props.specs}
						playerId={player.playerId}
						playerLog={playerData.playerLog}
						playerStats={playerData.playerStats}
						playerSubs={playerSubs}
						label={playerLabel}
						key={"cord_" + player.playerId}
						selectedStats={selected}
						periods={gameData.periods}
						selectedStats2={this.state.selections}
						height={100}
						/>
				</div>
				{bottom}
			</div>
		);
	}

	getTeamInGame(position, team, gameData, playersIndex) {

		const players = playersIndex.map(i => {
			return team.players[i];
		});

		const teamLog = this.getTeamLog(team.teamId, gameData.gameLog, players);
		const selected = this.getSelectedStats();

		const pulseChart = (
			<PulseChart timeLog={gameData.timeLog}
					specs={this.props.specs}
					playerId={team.teamId}
					playerLog={teamLog}
					label={team.teamName}
					key={team.teamId+"_game"}
					selectedStats={selected}
					periods={gameData.periods}
					height={50}
					/>);

		const top = position ==='top' ? pulseChart : null;
		const bottom = position ==='bottom' ? pulseChart : null;

		const classes = 'cord-chart-container '+position;
		return (
			<div className="player-container">
				{top}
				<div className={classes} >
					<CordChart timeLog={gameData.timeLog}
						specs={this.props.specs}
						playerId={team.teamId}
						playerLog={teamLog}
						label={team.teamName}
						key={"cord_" + team.teamId}
						selectedStats={selected}
						periods={gameData.periods}
						height={250}
						/>
				</div>
				{bottom}
			</div>
		);
	}

	createScoringChart(gameData, config) {

		if (typeof config === 'undefined') {
			config = {
				height:350,
				label: ''
			};
		}

		return (
			<div className="game-scoring-margin">
				<ScoringMarginChart 
					specs={this.props.specs}
					timeLog={gameData.timeLog}
					scoringLog={gameData.scoringLog}
					periods={gameData.periods}
					height={config.height}
					label={config.label}
				/>
			</div>
		)
	}

	getSeriesScoring(series) {
		return series.map((gameFile,i) => {
			const gameData = this.loadGame(gameFile);
			const config = {
				height: 80,
				label: 'Game '+(i+1)
			};
			return this.createScoringChart(gameData, config);
		})
	}

	getPlayerInSeries(series, player) {
		const playerGames = series.map((gameFile,i) => {
			const gameData = this.loadGame(gameFile);
			const config = {
				height: 80,
				label: 'Game '+(i+1)
			};
			const gameLabel = 'Game '+(i+1)
			return this.getPlayerInGame('none', player, gameData, gameLabel);
		});

		return (
			<div>
				<h3> {player.playerName} </h3>
				{playerGames}
			</div>
		)
	}

	onSelectGame(gameKey, gameData) {
		this.setGameData(gameData);

		this.setState({
			gameSelected: gameKey
		});
	}

	onSelectTeam(teamId) {
		this.setState({
			teamSelected: teamId,
			gameSelected: 'g1',
		});

		// this._processTeamPlayers(teamId);

	}

	onSelectPlayer(teamAbbr, playerNum) {
		let currentPlayers = this.state.playersSelected;

		if (!(teamAbbr in currentPlayers)) {
			currentPlayers[teamAbbr] = [];
		}

		let index = currentPlayers[teamAbbr].indexOf(playerNum);
		if (index > -1) {
			currentPlayers[teamAbbr].splice(index, 1);
		} else {
			currentPlayers[teamAbbr].push(playerNum);
		}

		console.log(teamAbbr, currentPlayers[teamAbbr]);

		this.setState({
			playersSelected: currentPlayers
		});
	}

	_processTeamPlayers(teamId) {

		let teamPlayers = {};
		let teamPlayersList = [];
		let teamGames = this.props.games.s2018.season.team[teamId];
		let games =Object.keys(teamGames).map(gameKey => {
			return teamGames[gameKey].data;
		})

		let checkPlayer = (teamSelected, playerTeamCity, playerId, playerName) => {
			if (playerTeamCity === teamSelected && playerTeamCity !== null) {
				if (!(playerId in teamPlayers)) {
					teamPlayers[playerId] = {
						"playerId": playerId,
						"playerName": playerName
					};
					teamPlayersList.push({
						"playerId": playerId,
						"playerName": playerName
					});
				}
			}
		}
		
		games.forEach(gameFile => {
			let gameData = require('../../data/2018/'+gameFile);
			gameData.resultSets[0].rowSet.forEach(row => {
				for (let i = 1; i<=3; i++) {
					let playerId = row[headers.indexOf('PLAYER'+i+'_ID')];
					let playerName = row[headers.indexOf('PLAYER'+i+'_NAME')];
					let playerTeamCity = row[headers.indexOf('PLAYER'+i+'_TEAM_ABBREVIATION')];

					checkPlayer(teamId, playerTeamCity, playerId, playerName);
				}
			});
		});

		console.log(teamPlayersList);

	}

	_processTeamSubstitutions(game, teamDescIndex) {
		// const game = this.state.game;
		const data = game.rawData.resultSets[0].rowSet;

		let quarters = {};

		data.forEach(row => {
			// EVENTNUM 12 means start of period
			if (row[2] === 12) {
				quarters['q'+row[4]]= {
					start: row[1],
					end: -1
				};
			}
			// EVENTNUM 13 means end of period
			if (row[2] === 13) {
				quarters['q'+row[4]].end = row[1]
			}
		})

		let rowData = data.filter(row => {
			// process Home Subs
			return (row[teamDescIndex] !== null && row[teamDescIndex].search('SUB') > -1)
		});

		let filtered = {};
		rowData.forEach(row => {
			// Get substitution moments for each player from Play by Play.
			const playerOut = row[13],
				  playerIn = row[20];


			if (!(playerOut in filtered)) {
				filtered[playerOut] = []
			}

			if (!(playerIn in filtered)) {
				filtered[playerIn] = []
			}

			filtered[playerOut].push({
				action: 'out',
				out: row[1],
				in: '',
				desc: row[teamDescIndex],
				period: row[4],
				clock: row[6]
			});

			filtered[playerIn].push({
				action: 'in',
				out: '',
				in: row[1],
				desc: row[teamDescIndex],
				period: row[4],
				clock: row[6]
			});
		});

		let processed = {}
		Object.keys(filtered).forEach(player => {
			// Creating onCourt moments for each player
			processed[player] = [];
			let subs = filtered[player];
			let temp = {};

			for(let i=0; i<subs.length; i++) {
				if (subs[i].action === 'in') {
					temp['type'] = 'court';
					temp['in'] = subs[i].in;
					temp['clockIn'] = subs[i].clock;
					temp['play'] = subs[i].desc;
					temp['period'] = subs[i].period;

					if (i+1 === subs.length || subs[i+1].action === 'in') {
						// Last substitution of the player and taken out at the end of period or end of game.
						temp['out'] = quarters['q'+subs[i].period].end;
						temp['clockOut'] = '0:00';
						
						processed[player].push({
							type: temp['type'],
							in: temp['in'],
							clockIn: temp['clockIn'],
							out: temp['out'],
							clockOut: temp['clockOut'],
							period: temp['period'],
							play: temp['play']
						});
						temp = {};

					}

				} else if (subs[i].action === 'out') {
					//  Player subbed out during game
					temp['out'] = subs[i].out;
					// temp['period'] = subs[i].period;
					temp['clockOut'] = subs[i].clock;
					
					if (!('in' in temp )) {
						// Player subbed in during period break or game start
						temp['type'] = 'court';
						temp['in'] = quarters['q'+subs[i].period].start;
						temp['clockIn'] = '12:00';
						temp['play'] = subs[i].desc;
						temp['period'] = subs[i].period;
					}
				}

				// Regular substitution completed. Saving.
				if ('in' in temp && 'out' in temp) {
					processed[player].push({
						type: 'court',
						in: temp['in'],
						clockIn: temp['clockIn'],
						out: temp['out'],
						clockOut: temp['clockOut'],
						period: temp['period'],
						play: temp['play']
					});
					temp = {};
				}
			}

			// console.log("COURT",processed[player]);
			let playerActivity = [];
			let playerSubs = processed[player];
			const numPeriods = Object.keys(quarters).length;
			temp = {};

			playerSubs.forEach((act, i) => {

				// Player is not a starter
				if (i === 0 && act.in !== 2) {
					if (act.period !== 1) {
						for (let p = 1; p<act.period; p++) {
							temp = {
								type: 'bench',
								in: quarters['q'+p].start,
								clockIn: '12:00',
								out: quarters['q'+p].end,
								clockOut: '0:00',
								period: p,
								play: 'On bench for the quarter'
							};

							if (!this._confirmBenchForQuarter(player, temp, data)) {
								temp['type'] = 'court';
								temp['play'] = 'Played the whole quarter';
							}

							playerActivity.push(temp);
							temp = {};
						}
					}

					temp = {
						type: 'bench',
						in: quarters['q'+act.period].start,
						clockIn: '12:00',
						out: act.in,
						clockOut: act.clockIn,
						period: act.period,
						play: act.desc
					};

					playerActivity.push(temp);
					temp = {};
				}

				playerActivity.push(act);

				for (const q in quarters) {
					if (act.period === parseInt(q.substr(1))) {
						if (!(act.in >= quarters[q].start && act.out <=quarters[q].end)) {
							console.log('REVIEW: ');
							console.log(act);
						}
					}
				}

				temp['type'] = 'bench';
				temp['in'] = act.out;
				temp['clockIn'] = act.clockOut;

				// if activity is the last one of player
				if (i+1 === playerSubs.length) {
					temp['type'] = 'bench';
					temp['in'] = act.out;
					temp['clockIn'] = act.clockOut;
					temp['out'] = quarters['q'+act.period].end;
					temp['clockOut'] = '0:00';
					temp['period'] = act.period,
					temp['play'] = act.desc;

					if (act.clockOut !== '0:00') {
						playerActivity.push(temp);
						temp = {};
					}

					if (act.period+1 !== numPeriods) {
						for (let p = act.period+1; p<=numPeriods; p++) {
							temp = {
								type: 'bench',
								in: quarters['q'+p].start,
								clockIn: '12:00',
								out: quarters['q'+p].end,
								clockOut: '0:00',
								period: p,
								play: 'On bench for the quarter'
							};

							if (!this._confirmBenchForQuarter(player, temp, data)) {
								temp['type'] = 'court';
								temp['play'] = 'Played the whole quarter';
							}

							playerActivity.push(temp);
							temp = {};
						}
					}
				} else {
					temp['type'] = 'bench';
					temp['in'] = act.out;
					temp['clockIn'] = act.clockOut;
					temp['out'] = playerSubs[i+1].in;
					temp['clockOut'] = playerSubs[i+1].clockIn;
					temp['period'] = playerSubs[i+1].period,
					temp['play'] = playerSubs[i+1].desc;

					playerActivity.push(temp);
					temp = {};
				}
			});
			// console.log("BENCH", playerActivity);
			processed[player] = playerActivity;
		});

		// console.log(processed);
		return processed;

	}

	_confirmBenchForQuarter(playerId, playerInfo, rowSets) {
		playerId = parseInt(playerId);
		let playerPlays = rowSets.filter(row => {
			let isPlayer = (row[13] === playerId || row[20] === playerId || row[27] === playerId);
			return row[1] >= playerInfo.in && row[1] <= playerInfo.out && isPlayer;
		});

		return playerPlays.length === 0;
	} 

	_processGameSubstitutions(game) {

		let gameSubs = Object.assign({},
				this._processTeamSubstitutions(game, 7),
				this._processTeamSubstitutions(game, 9));

		for (let playerId in gameSubs) {
			let playerSubs = gameSubs[playerId];

			playerSubs.forEach(sub => {
				let checkIn = false,
					checkOut = false;
				for (let e = 0; e<game.gameLog.length; e++) {

					if (sub.in === game.gameLog[e].eventId) {
						sub['momentIn'] = game.gameLog[e].momentId;
						checkIn = true;
					}

					if (sub.out === game.gameLog[e].eventId) {
						sub['momentOut'] = game.gameLog[e].momentId;
						checkOut = true;
					}

					if (checkIn === true && checkOut === true) {
						break;
					}
				}
			});
		}

		return gameSubs;
	}


	render() {
		// const gameSelected = this.props.games.s2018.season.team.GSW.g5.data;
		const gameSelectedFile = this.state.game.file;
		const homeTeam = gameSelectedFile.split("_")[2].substr(3,3);
		const awayTeam = gameSelectedFile.split("_")[2].substr(0,3);
		const homePlayers = this.props.teams.rosters.s2018[homeTeam];
		const awayPlayers = this.props.teams.rosters.s2018[awayTeam];
		const teamGames = this.props.games.s2018.season.team[this.state.teamSelected];
		const homePlayersSelected = this.state.playersSelected[homeTeam];
		const awayPlayersSelected = this.state.playersSelected[awayTeam];

		return (
			<div>
				
				<TeamsMenu
					teamSelected={this.state.teamSelected} 
					teamList={this.props.teams.teamList}
					teamLogos={this.props.teams.teamLogos}
					gamesData={teamGames}
					gameSelected={this.state.gameSelected}
					onSelectGame={this.onSelectGame} 
					onSelectTeam={this.onSelectTeam} />

				<GameDetails 
					homeTeam={homeTeam}
					homeRoster={homePlayers}
					homePlayersSelected={homePlayersSelected}
					awayRoster={awayPlayers}
					awayTeam={awayTeam}
					awayPlayersSelected={awayPlayersSelected}
					gameData={this.props.game}
					teamsData={this.props.teams}  
					onSelectPlayer={this.onSelectPlayer} />

				<StatControl handleStatClick={this.handleStatClick} selectedStats={this.state.selections}/>

				


				{
					// this.createScoringChart(this.loadGame(games.GSWvCLE[2]), { height: 300})


					// Game Matchup with Individual Players
					this.getGamePlayersMatchup(gameSelectedFile,
						homePlayers,
						homePlayersSelected,
						awayPlayers,
						awayPlayersSelected
					) 

					// this.getSinglePlayerMatchup(games.GSWvCLE[3],
					// 	teams.gsw.players[0],
					// 	teams.cle.players[0])
				


					// this.getSeriesScoring([gameSelected])
				
				

					// this.getPlayerInSeries(games.GSWvCLE, teams.gsw.players[2])
				

					// Game Matchup by team
					// this.getGameTeamMatchup(gameSelected,
					// 	homeTeam,
					// 	[],
					// 	awayTeam,
					// 	[]
					// ) 
				}
				

				
			</div>
		);
	}
}





















