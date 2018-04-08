
export const GameHelpers = {

	headers: ["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION", "momentId"],

	_processGameDataForStorage: (gameData) => {
		/* Function that gets the rawData and process it into a structure log of events that can be consumed by the frontend */

		let game = {};

		// console.log(Helpers);
		game['periods'] = GameHelpers._getGamePeriodsPlayed(gameData);
		game['timeLog'] = GameHelpers._createBasicTimeLog(game.periods);
		game['gameLog'] = GameHelpers._processGameLog(gameData, game.timeLog);
		game['breakdown'] = GameHelpers._processGameBreakdown(game.gameLog);
		game['playerLogs'] = GameHelpers._processGamePlayerLogs(game.gameLog);

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
	},


	_getGamePeriodsPlayed: (gameData) => {
		/* Function that returns the number of periods played in the game */
		const playByPlay = gameData.data.resultSets[0].rowSet;
		let lastEvent = playByPlay[playByPlay.length-1];

		return lastEvent[4];
	},


	_createBasicTimeLog: (periods) => {
		/* Function that creates the empty time log for the game based on periods played */

		let basicLog = [];
		let momentId = 0;

		for (let q = 1; q<=periods; q++) {
			const quarterLength = q <= 4 ? 12 : 5;
			const quarterBase = q <= 4? '12:00' : '5:00';

			for (let m = quarterLength; m >= 0; m--) {
				if (m == quarterLength) {
					basicLog.push({
						gameClock: quarterBase,
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
	},

	_processGameLog: (gameData, timeLog) => {
		/* Function that will process the raw play by play into events inside the timeLog of the game */

		let gameLog = [];

		gameData.data.resultSets[0].rowSet.forEach(event => {
			let brokenDown = {};
			event.forEach((stat,i) => {
				brokenDown[GameHelpers.headers[i]] = stat;
			});
			gameLog = gameLog.concat(GameHelpers._processEvent(brokenDown, timeLog));
		});

		return gameLog;
	},


	_processEvent: (event, timeLog) => {
		/* Function that process a single event into a structure moment in the game */

		let parsedPlays = [],
			play;

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
				teamCity: event[playernum+'_TEAM_CITY'],
				score: event['SCORE']
			};
		}

		play = getPrimaryPlayType(playText);
		parsedPlays.push(parsePlayerActions('PLAYER1', play, timeLog));

		play = getSecondaryPlayType(playText);
		if (play.type === 11) {
			parsedPlays.push(parsePlayerActions('PLAYER3', play, timeLog));
		} else if (play.type === 12 || play.type == 10  || play.type === 14) {
			parsedPlays.push(parsePlayerActions('PLAYER2', play, timeLog));
		}

		return parsedPlays;
	},


	_processGameBreakdown: (gameLog) => {
		/* Function that will create the period by period scoring breakdown for the game for both teams */

		let breakdown = {};
		let period = 0;
		let previous = {
			home: 0,
			away: 0
		}

		for (let i = 0; i < gameLog.length; i++) {
			let event = gameLog[i]
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
	},

	_processGamePlayerLogs: (gameLog) => {
		let gamePlayers = {};

		gameLog.forEach(moment => {
			if (moment.playerId > 0 && !(moment.playerId in gamePlayers)) {
				gamePlayers[moment.playerId] = GameHelpers._processPlayerLog(moment.playerId, gameLog);
			}
		});
		return gamePlayers;
	},

	_processPlayerLog: (playerId, gameLog) => {
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

		delete playerPlays['undefined'];
		return {
			playerLog: playerPlays,
			playerStats: playerStats
		};
	}
}
