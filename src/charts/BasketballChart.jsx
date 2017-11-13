import React, { Component } from 'react';

import GameDetails from '../GameDetails';
import TeamsMenu from '../TeamsMenu';

import StatControl from './StatControl';
import PulseChart from './PulseChart';
import CordChart from './CordChart';
import ScoringMarginChart from './ScoringMarginChart';


import styles from './StatControl.css';

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
				foul: 'stat-hidden',
				periods: 4
			},
			game: {
				file: '',
				periods: 4,
				timeLog: {},
				rawData: {},
				gameLog: {},
				scoringLog: {}
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
	}

	componentWillMount() {
		this.setGameData(this.props.games.s2018.season.team.GSW.g1.data);
	}

	setGameData(gameFile) {
		this.setState({
			game: this.loadGame(gameFile)
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

	processGameSustitutions(gameFile) {
		let gameData = this.getGame(gameFile);
		let playersGameTime = {};

		['homeTeam','awayTeam'].forEach(team => {
			gameData.rawData.lineups[team].starters.forEach(p => {
			if (typeof playersGameTime[p.playerId] === 'undefined') {
					playersGameTime[p.playerId] = [gameData.gameLog[0]];
					
				}
			});	
		});
		

		gameData.gameLog.forEach(play => {
			if (play.playType === 13 || play.playType === 14) {
				if (typeof playersGameTime[play.playerId] === 'undefined') {
					playersGameTime[play.playerId] = [];
				}

				playersGameTime[play.playerId].push(play);
			}
		})

		let lbj = playersGameTime[2544];

		let subIn = -1,
			subOut = -1,
			inGame = false;
		let substitutions = [];
		lbj.forEach((play,i) => {
			if (i === 0 && play.playType === 0) {
				subIn = play.momentId;
				inGame = true;
			}

			// If player is in the game
			if (inGame) {
				if (play.playType === 13) {
					subOut = play.momentId; 
					inGame = false;
				} else if (play.playType === 14) {
					subIn = play.quarter*720+play.quarter;
					subOut = -1;
				}

			} else {
				// If player is on the bench
				if (play.playType === 14) {
					subIn = play.momentId;
					inGame = true;
					subOut = -1;
				} else if (play.playType === 13) {
					subIn = ((play.quarter-1)*720+(play.quarter))-1;
					subOut = play.momentId;
				}
			}


			if (subIn !== -1 && subOut !== -1) {
				substitutions.push({
					in: subIn,
					out: subOut
				});

				subIn = -1;
				subOut = -1;
			}

			console.log(substitutions);

		})






		return playersGameTime;
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
			const playerLog = this.getPlayerLog(playerId, gameLog);

			return (
				<PulseChart timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={playerId} 
					playerLog={playerLog} 
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
			<div>
				{ 
					homePlayers
				}
				<div> {
					// this.getTeamInGame('none', homeTeam, gameData, playersHomeTeam) 
				}</div>
				{ this.createScoringChart(gameData) }
				<div> {
					// this.getTeamInGame('none', awayTeam, gameData, playersAwayTeam) 
				}</div>
				{
					awayPlayers
				}
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

		const playerLog = this.getPlayerLog(player.playerId, gameData.gameLog);
		const selected = this.getSelectedStats();

		return (
			<CordChart timeLog={gameData.timeLog}
				specs={this.props.specs}
				playerId={player.playerId}
				playerLog={playerLog}
				label={player.playerName}
				key={"cord_" + player.playerId}
				selectedStats={selected}
				periods={gameData.periods}
				/>
			);
	}

	getPlayerInGame(position, player, gameData, label) {

		const playerLog = this.getPlayerLog(player.playerId, gameData.gameLog);
		const selected = this.getSelectedStats();

		const playerLabel = typeof label === 'undefined' ? player.playerName : label;

		const pulseChart = (
			<PulseChart timeLog={gameData.timeLog}
					specs={this.props.specs}
					playerId={player.playerId}
					playerLog={playerLog}
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
						playerLog={playerLog}
						label={playerLabel}
						key={"cord_" + player.playerId}
						selectedStats={selected}
						periods={gameData.periods}
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
				height:200,
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
		console.log(gameData);

		this.setGameData(gameData);

		this.setState({
			gameSelected: gameKey
		});
	}


	// getPlayerPlayingTime(playerId, rawGameLog) {
	// 	let playingTime = [];


	// 	const subs = rawGameLog.filter(p=> {
	// 		return (p['HOMEDESCRIPTION'].indexOf('SUB:') !== -1 || p['VISITORDESCRIPTION'].indexOf('SUB:') !== -1) && (p['PLAYER1_ID'] === playerId || p['PLAYER2_ID'] === playerId);
	// 	});
		
	// 	if ()
	// }


	render() {
		// const gameSelected = this.props.games.s2018.season.team.GSW.g5.data;
		const gameSelectedFile = this.state.game.file;
		const homeTeam = gameSelectedFile.split("_")[2].substr(3,3);
		const awayTeam = gameSelectedFile.split("_")[2].substr(0,3);
		const homePlayers = this.props.teams.rosters.s2018[homeTeam];
		const awayPlayers = this.props.teams.rosters.s2018[awayTeam];
		const teamGames = this.props.games.s2018.season.team[this.state.teamSelected];

		return (
			<div className="main-container">
				
				<TeamsMenu
					teamSelected={this.state.teamSelected} 
					teamList={this.props.teams.teamList}
					teamLogos={this.props.teams.teamLogos}
					gamesData={teamGames}
					gameSelected={this.state.gameSelected}
					onSelectGame={this.onSelectGame} />

				<GameDetails 
					homeTeam={homeTeam}
					homeRoster={homePlayers}
					awayRoster={awayPlayers}
					awayTeam={awayTeam}
					gameData={this.props.game}
					teamsData={this.props.teams} />

				<StatControl handleStatClick={this.handleStatClick} selectedStats={this.state.selections}/>


				{
					// this.processGameSustitutions(games.GSWvCLE[4])

					// this.createScoringChart(this.loadGame(games.GSWvCLE[2]), { height: 300})


					// Game Matchup with Individual Players
					this.getGamePlayersMatchup(gameSelectedFile,
						homePlayers,
						[0,1],
						awayPlayers,
						[0,1]
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





















