import React, { Component } from 'react';
// import LineChart from './LineChart';

import PulseChart from './PulseChart';

import gameLogDummy from '../../data/samples/PlaybyPlay_OKCvHOU-Game5.json';
// import gameLogDummy from '../../data/samples/PlaybyPlay_GSWvPOR-Game4.json';

const headers =["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION", "momentId"];

const eventTypes = {
	1: 'fg',
	2: 'fg miss',
	3: 'free throw',
	4: 'rebound',
	5: 'turnover',
	6: 'foul',
	7: 'violation',
	8: 'substitute',
	9: 'timeout',
	10: '',
	11: '',
	12: 'start period',
	13: 'end period'
}

export default class BasketballChart extends Component {
	
	constructor(props) {
		super(props);


		this.getMomentEvents = this.getMomentEvents.bind(this);
		this.processEvent = this.processEvent.bind(this);
		this.processGameLog = this.processGameLog.bind(this);

		this.timeLog = [];
		this.gamelog = this.createGameLog(4);

		// TODO: This needs to be replace with a prop probably
		this.gameDataRaw = gameLogDummy;
		this.gameEvents;

		// this.gamelog = 

		this.state = {
			gameLog: this.processGameLog(gameLogDummy)
		};

		this.getPlayerLog = this.getPlayerLog.bind(this);
	}

	createGameLog (periods) {
		let basicLog = [];
		let momentId = 0;

		for (let q = 1; q<=periods; q++) {
			for (let m = 12; m >= 0; m--) {
				if (m == 12) {
					basicLog.push({
							momentId: momentId,
							quarter: q,
							gameClock: "12:00",
							plays: "",
							players: [],
							score: "",
							margin: 0
						});
					
					this.timeLog.push({
						gameClock: "12:00",
						momentId: momentId++,
						quarter: q
					});

				} else {
					for (let s = 59; s>= 0; s--) {
						// let minute = m<10 ? "0"+m : m;
						let second = s<10 ? "0"+s : s;
						basicLog.push({
							momentId: momentId,
							quarter: q,
							gameClock: m+":"+second,
							plays: "",
							players: [],
							score: "",
							margin: 0
						});

						this.timeLog.push({
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

	getMomentEvents(moment) {
		for (let e = 1; e<this.gameEvents.length; e++) {
			let event = this.gameEvents[e];

			if (event['PERIOD'] > moment.quarter)
				break;

			let players = {};
			if (event['PERIOD'] === moment.quarter && event['PCTIMESTRING'] === moment.gameClock) {				

				[1,2,3].forEach(i=> {
					let prefix = 'PLAYER'+i;

					if (event[prefix+'_ID'] !== 0) {
						moment.players[event[prefix+'_ID']] = {
							playerid: event[prefix+'_ID'],
							playerName: event[prefix+'_NAME'],
							teamId: event[prefix+'_TEAM_ID'],
							teamCity: event[prefix+'_TEAM_CITY'],
							teamNickname: event[prefix+'_TEAM_NICKNAME'],
							teamAbbreviation: event[prefix+'_TEAM_ABBREVIATION'],
							personType: event['PERSON'+i+'TYPE'],
							playTypeId: event['EVENTMSGTYPE'],
							playTypeText: eventTypes[event['EVENTMSGTYPE']],
							actionTypeId: event['EVENTMSGACTIONTYPE']
						};						
					}
				});
				
				
				let playText = '';
				if (event['HOMEDESCRIPTION'])
					playText += event['HOMEDESCRIPTION'] + ' ';
				else if (event['NEUTRALDESCRIPTION']) 
					playText += event['NEUTRALDESCRIPTION'] + ' ';
				else if (event['VISITORDESCRIPTION'])
					playText += event['VISITORDESCRIPTION'];

				moment.plays += playText.trim()+'. ';

				moment.score = event['SCORE'];
				moment.margin = event['SCOREMARGIN'];
			}
		}

		moment.plays = moment.plays.trim();
	}

	processGameLog(gameData) {
		let gameLog = [];
		let refactoredEvents = [];
		
		this.gameDataRaw.resultSets[0].rowSet.forEach(event => {
			let brokenDown = {};
			event.forEach((stat,i) => {
				brokenDown[headers[i]] = stat;
			});
			gameLog = gameLog.concat(this.processEvent(brokenDown));
		});

		return gameLog;
	}

	getPlayerLog(playerId) {

		let playerPlays = []
		this.state.gameLog.forEach((event) => {
			if (event.playerId == playerId) {
				playerPlays.push(event);
			}
		});

		return playerPlays;
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
			} else if (description.indexOf('STEAL') !== -1) {
				// player3
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


		let prefix = 'PLAYER1';
		let play = getPrimaryPlayType(playText);
		parsedPlays.push(parsePlayerActions(prefix, play));

		play = getSecondaryPlayType(playText);
		if (play.type === 12 || play.type === 11) {
			prefix = 'PLAYER3';
			parsedPlays.push(parsePlayerActions(prefix, play));
		} else if (play.type == 10) {
			prefix = 'PLAYER2';
			parsedPlays.push(parsePlayerActions(prefix, play));
		}

		return parsedPlays;
	}


	render() {

		// <LineChart data={this.props.gameLog} specs={this.props.specs} />

		// Harden: 201935
		// Westbrook: 201566
		// Oladipo: 203506
		// Beverly: 201976

		// Curry: 201939
		// Durant: 201142
		// Green: 203110

		// Lillard: 203081
		// McCollum: 203468

		// <PulseChart gameLog={this.gamelog}
				// 	timeLog={this.timeLog}
				// 	specs={this.props.specs} 
				// 	playerId={201939} 
				// 	playerLog={this.getPlayerLog(201939)} 
				// 	playerName="Steph Curry"
				// 	/>

				// <PulseChart gameLog={this.gamelog}
				// 	timeLog={this.timeLog}
				// 	specs={this.props.specs} 
				// 	playerId={201142} 
				// 	playerLog={this.getPlayerLog(201142)} 
				// 	playerName="Kevin Durant"
				// 	/>

				// <PulseChart gameLog={this.gamelog}
				// 	timeLog={this.timeLog}
				// 	specs={this.props.specs} 
				// 	playerId={203110} 
				// 	playerLog={this.getPlayerLog(203110)} 
				// 	playerName="Draymond Green"
				// 	/>

				// <br />

				// <PulseChart gameLog={this.gamelog}
				// 	timeLog={this.timeLog}
				// 	specs={this.props.specs} 
				// 	playerId={203081} 
				// 	playerLog={this.getPlayerLog(203081)} 
				// 	playerName="Damian Lillard"
				// 	/>

				// <PulseChart gameLog={this.gamelog}
				// 	timeLog={this.timeLog}
				// 	specs={this.props.specs} 
				// 	playerId={203468} 
				// 	playerLog={this.getPlayerLog(203468)} 
				// 	playerName="CJ McCollum"
				// 	/>

		return (
			<div>


				<PulseChart gameLog={this.gamelog}
					timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={201935} 
					playerLog={this.getPlayerLog(201935)} 
					playerName="James Harden"
					/>

				<PulseChart gameLog={this.gamelog}
					timeLog={this.timeLog}
					specs={this.props.specs} 
					playerId={201566} 
					playerLog={this.getPlayerLog(201566)} 
					playerName="Russell Westbrook"
					/>

			</div>
		)
	}
}





















