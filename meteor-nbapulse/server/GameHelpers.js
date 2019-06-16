import {
	Schedule,
	Games,
	Teams,
	League,
	Players
} from '../imports/api/collections.js';

export const GameHelpers = {

	headers: ["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION", "momentId"],

	_processGameDataForStorage: (gameData) => {
		/* Function that gets the rawData and process it into a structure log of events that can be consumed by the frontend */

		let game = {};

		// console.log(Helpers);
		game['periods'] = GameHelpers._getGamePeriodsPlayed(gameData);
		game['timeLog'] = GameHelpers._createBasicTimeLog(game.periods);
		game['gameLog'] = GameHelpers._processGameLog(gameData, game.timeLog);
		game['substitutions'] = GameHelpers._processGameSubstitutions(gameData, game.gameLog);
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

		let gameLog = gameData.data.resultSets[0].rowSet;
		let newGameLog = [];

		// function to sort gamelog make sure events are in right order.
		const sortGameLog = (a,b) => {
			if (a[1] < b[1]) return -1;
			if (a[1] > b[1]) return 1;
			return 0;
		};

		gameLog = gameLog.sort(sortGameLog);

		gameLog.forEach(event => {
			let brokenDown = {};
			event.forEach((stat,i) => {
				brokenDown[GameHelpers.headers[i]] = stat;
			});
			newGameLog = newGameLog.concat(GameHelpers._processEvent(brokenDown, timeLog));
		});



		return newGameLog;
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
			} else if (description.indexOf('Dunk') !== -1 || description.indexOf('Jumper') !== -1 || description.indexOf('Fadeaway') !== -1 || (description.indexOf('Shot') !== -1 && description.indexOf('Shot Clock') === -1)|| description.indexOf('Layup') !== -1) {
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
				eventType: event['EVENTMSGTYPE'],
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

		let quarterBreakdown = {};
		gameLog.forEach(event => {
			if (!quarterBreakdown.hasOwnProperty(event.quarter)) {
				quarterBreakdown[event.quarter] = [];
			}
			quarterBreakdown[event.quarter].push(event);
		});

		const sortEvents = (a, b) => {
		    return a["momentId"] - b["momentId"] || a["eventId"] - b["eventId"];
		}

		Object.keys(quarterBreakdown).forEach(period => {
			quarterBreakdown[period] = quarterBreakdown[period].sort(sortEvents);

			// Getting last event in the quarter (EventType 13).
			let event = quarterBreakdown[period].find(event => event.eventType === 13);

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
		})

		breakdown['final'] = {
			label: 'Final',
			home: previous.home,
			away: previous.away,
			homeScore: previous.home,
			awayScore: previous.away,
		};
		return breakdown;
	},

	_filterGamePlayerLogs: (filter, gameData) => {
		let filteredStats = {};
		const players = Object.keys(gameData.playerLogs);

		// Looping through all game players
		players.forEach(playerId => {
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

			gameData.playerLogs[playerId].playerLog.forEach(event => {
				if (event.momentId > filter.start && event.momentId <= filter.end) {
					const playType = GameHelpers.__processPlayerEvent(event.playType);
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
			filteredStats[playerId] = playerStats;
		});

		return filteredStats;
	},

	__processPlayerEvent: (playType) => {
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

		gameLog.forEach((event) => {
			let playType;
			if (event.playerId == playerId) {
				playerPlays.push(event);
				playType = GameHelpers.__processPlayerEvent(event.playType);
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
	},


	_processGameSubstitutions(gameData, gameLog) {

		let gameSubs = Object.assign({},
				this._processTeamSubstitutions(gameData, 7),
				this._processTeamSubstitutions(gameData, 9));

		for (let playerId in gameSubs) {
			let playerSubs = gameSubs[playerId];

			playerSubs.forEach(sub => {
				let checkIn = false,
					checkOut = false;
				for (let e = 0; e<gameLog.length; e++) {

					if (sub.in === gameLog[e].eventId) {
						sub['momentIn'] = gameLog[e].momentId;
						checkIn = true;
					}

					if (sub.out === gameLog[e].eventId) {
						sub['momentOut'] = gameLog[e].momentId;
						checkOut = true;
					}

					if (checkIn === true && checkOut === true) {
						break;
					}
				}
			});
		}

		return gameSubs;
	},

	_processTeamSubstitutions(game, teamDescIndex) {
		const data = game.data.resultSets[0].rowSet;
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
		});

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

					if (!('in' in temp )) {
						// Player subbed in during period break or game start
						temp['type'] = 'court';
						temp['in'] = quarters['q'+subs[i].period].start;
						temp['clockIn'] = '12:00';
						temp['play'] = subs[i].desc;
						temp['period'] = subs[i].period;
					}

					if (subs[i].period !== temp.period) {

						const quarterDiff = subs[i].period - temp.period;

						for (let j = 0; j<quarterDiff; j++ ) {
							// Player in court from one quarter to the next
							temp['out'] = quarters["q"+temp.period].end;
							temp['clockOut'] = "0:00";

							// Saving subout at end of SubbedIn quarter
							processed[player].push({
								type: 'court',
								in: temp['in'],
								clockIn: temp['clockIn'],
								out: temp['out'],
								clockOut: temp['clockOut'],
								period: temp['period'],
								play: temp['play']
							});

							// Updating temp to beginning of subbedout quarter
							temp['type'] = 'court';
							temp['in'] = quarters["q"+(j+1)].start;
							temp['clockIn'] = "12:00";
							temp['play'] = subs[i].desc;
							temp['period'] = temp.period +1;
						}
					}

					//  Player subbed out during game
					temp['out'] = subs[i].out;
					// temp['period'] = subs[i].period;
					temp['clockOut'] = subs[i].clock;
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

							if (!this._confirmBenchForQuarter(player, p, data)) {
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

					if (act.period !== numPeriods) {
						for (let p = act.period; p<=numPeriods; p++) {
							temp = {
								type: 'bench',
								in: quarters['q'+p].start,
								clockIn: '12:00',
								out: quarters['q'+p].end,
								clockOut: '0:00',
								period: p,
								play: 'On bench for the quarter'
							};

							if (!this._confirmBenchForQuarter(player, p, data)) {
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

					if (act.period !== playerSubs[i+1].period) {
						temp['out'] = quarters['q'+act.period].end;
						temp['clockOut'] = '0:00';
						temp['period'] = act.period,
						temp['play'] = act.play;

						playerActivity.push(temp);
						temp = {};

						for (let k = act.period+1; k<playerSubs[i+1].period; k++) {
							temp = {
								type: 'bench',
								in: quarters['q'+k].start,
								clockIn: '12:00',
								out: quarters['q'+k].end,
								clockOut: '0:00',
								period: k,
								play: "On bench for the quarter"
							};

							if (!this._confirmBenchForQuarter(player, k, data)) {
								temp['type'] = 'court';
								temp['play'] = 'Played the whole quarter';
							}

							playerActivity.push(temp);
							temp = {};
						}

						temp = {
							type: 'bench',
							in: quarters['q'+playerSubs[i+1].period].start,
							clockIn: '12:00',
							out: playerSubs[i+1].in,
							clockOut: playerSubs[i+1].clockIn,
							period: playerSubs[i+1].period,
							play: "On bench to start the quarter"
						};
						playerActivity.push(temp);
						temp = {};
					} else {
						temp['out'] = playerSubs[i+1].in;
						temp['clockOut'] = playerSubs[i+1].clockIn;
						temp['period'] = playerSubs[i+1].period,
						temp['play'] = playerSubs[i+1].desc;

						playerActivity.push(temp);
						temp = {};
					}
				}
			});
			processed[player] = playerActivity;
		});
		// console.log(processed);
		return processed;

	},

	_confirmBenchForQuarter(playerId, period, rowSets) {
		playerId = parseInt(playerId);
		let playerPlays = rowSets.filter(row => {
			let isPlayer = (row[13] === playerId || row[20] === playerId || row[27] === playerId);
			return (row[4] == period ) && isPlayer;
		});

		return playerPlays.length === 0;
	},

	_handleNBADataResponse(results, gid, gameData, url) {
		// Checking if the game has been played or already
		if (results.data.resultSets[0].rowSet.length === 0) {
			response = "This game has not been played yet";
			console.log("GID", gid, response);
			return '';
		}

		// Process game data for storage
		let processedData = GameHelpers._processGameDataForStorage(results);

		// Getting team rosters for the game
		const rosters = Teams.find({
			'season': '2018-2019',
			$or: [
				{'teamId': parseInt(gameData.details.h.tid) },
				{'teamId': parseInt(gameData.details.v.tid) }
			]
		}, {
			fields: {
				_id: 0
			}
		}).fetch();

		const teams = {
			home: rosters[0].teamId === gameData.details.h.tid ? rosters[0] : rosters[1],
			away: rosters[1].teamId === gameData.details.v.tid ? rosters[1] : rosters[0]
		};
		// Update the game data to the DB and return to client
		console.log("GID", gid, 'Inserting new game data for game.', 'URL: ' + url);
		Games.update({
			'gid': gid
		}, {
			$set: {
				'data': results.data,
				'teams': teams,
				'processed': processedData
			}
		});

		console.log("GID", gid, 'New game data done updating/inserting');
		gameData.data = results.data;
		gameData.processed = processedData;
		gameData.teams = teams;
		response = gameData;
		return response;
	},


	_generateSeasonRosters(year) {
		const teams = League.findOne({'status':'current'},{'teamDetails':1});
		const players = Players.find({}).fetch();
		let playersTeams = {};

		console.log(players.length);


		players.forEach(player => {
			const teamId = player.teamId;
			if (!(teamId in playersTeams)) {
				playersTeams[teamId] = [];
			}
			
			playersTeams[teamId].push({
				playerId: player.personId,
				playerName: player.firstName +' '+ player.lastName,
				playerNum: player.jersey,
				playerPosition: player.pos
			});
		});

		let seasonRosters = [];
		teams.teamsDetails.forEach(team => {
			seasonRosters.push({
				season: year,
				teamKey: team.teamKey,
				teamId: team.teamId,
				teamName: team.teamName,
				teamCity: team.teamCity,
				players:playersTeams[team.teamId]
			});
		});

		return seasonRosters;

	}

}
