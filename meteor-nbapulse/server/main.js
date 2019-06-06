import { Meteor } from 'meteor/meteor';
import axios from 'axios';
import fetch from 'node-fetch';

import { GameHelpers } from './GameHelpers.js';
import { DBInitializer} from './DBInitializer.js';

import {
	Schedule,
	Games,
	Teams,
	League,
	Players
} from '../imports/api/collections.js';


Meteor.startup(() => {
	// code to run on server at startup

	if (Players.find({}).count() === 0) {
		const players = DBInitializer._getPlayers();

		console.log("Inserting players into DB.");
		players.forEach(player => {
			console.log("Inserting playerId:", player.personId, player.firstName, player.lastName);
			Players.insert(player);
		});
	}

	if (Schedule.find({}).count() === 0) {
		console.log('Inserting season schedule to DB.');
		const schedule = DBInitializer._loadSchedule();

		Schedule.insert(schedule);
	}

	// TESTING ROSTER GENERATING
	// console.log(GameHelpers._generateSeasonRosters('2018-2019'));


	// Inserting team rosters by season into DB
	if (Teams.find({}).count() === 0) {

		const rosters = GameHelpers._generateSeasonRosters('2018-2019');

		rosters.forEach(roster => {
			console.log("Saving team roster to DB", roster.teamName);
			Teams.insert(roster);
		});
	}

	// Inserting list of teams and team details into DB
	if (League.find({}).count() === 0) {
		console.log("League has no records. Inserting Team details to DB.");
		League.insert({
			"status": "current",
			"teamsAbbr": ["ATL", "BKN", "BOS", "CHA", "CHI", "CLE", "DAL", "DEN", "DET", "GSW", "HOU", "IND", "LAC", "LAL", "MEM", "MIA", "MIL", "MIN", "NOP", "NYK", "OKC", "ORL", "PHI", "PHX", "POR", "SAC", "SAS", "TOR", "UTA", "WAS"],
			"teamsDetails": [{
				"teamKey": "ATL",
				"teamLogo": "ATL.svg",
				"teamId": 1610612737,
				"teamName": "Hawks",
				"teamCity": "Atlanta",
				"teamColors": {
					"main": {
						"rgb": "(224,58,62)",
						"hex": "#E03A3E"
					},
					"alternate": {
						"rgb": "(37,40,42)",
						"hex": "#25282A"
					}
				}
			}, {
				"teamKey": "BKN",
				"teamLogo": "BKN.svg",
				"teamId": 1610612751,
				"teamName": "Nets",
				"teamCity": "Brooklyn",
				"teamColors": {
					"main": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					},
					"alternate": {
						"rgb": "(255,255,255)",
						"hex": "#FFFFFF"
					}
				}
			}, {
				"teamKey": "BOS",
				"teamLogo": "BOS.svg",
				"teamId": 1610612738,
				"teamName": "Celtics",
				"teamCity": "Boston",
				"teamColors": {
					"main": {
						"rgb": "(0,130,72)",
						"hex": "#008248"
					},
					"alternate": {
						"rgb": "(255,255,255)",
						"hex": "#FFFFFF"
					}
				}
			}, {
				"teamKey": "CHA",
				"teamLogo": "CHA.svg",
				"teamId": 1610612766,
				"teamName": "Hornets",
				"teamCity": "Charlotte",
				"teamColors": {
					"main": {
						"rgb": "(29,17,96)",
						"hex": "#1D1160"
					},
					"alternate": {
						"rgb": "(0,120,140)",
						"hex": "#00788C"
					}
				}
			}, {
				"teamKey": "CHI",
				"teamLogo": "CHI.svg",
				"teamId": 1610612741,
				"teamName": "Bulls",
				"teamCity": "Chicago",
				"teamColors": {
					"main": {
						"rgb": "#CE1141",
						"hex": "(206,17,65)"
					},
					"alternate": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					}
				}
			}, {
				"teamKey": "CLE",
				"teamLogo": "CLE.svg",
				"teamId": 1610612739,
				"teamName": "Cavaliers",
				"teamCity": "Cleveland",
				"teamColors": {
					"main": {
						"rgb": "(111,38,51)",
						"hex": "#6F2633"
					},
					"alternate": {
						"rgb": "(4,30,66)",
						"hex": "#041E42"
					}
				}
			}, {
				"teamKey": "DAL",
				"teamLogo": "DAL.svg",
				"teamId": 1610612742,
				"teamName": "Mavericks",
				"teamCity": "Dallas",
				"teamColors": {
					"main": {
						"rgb": "(0,125,197)",
						"hex": "#007DC5"
					},
					"alternate": {
						"rgb": "(196,206,212)",
						"hex": "#C4CED4"
					}
				}
			}, {
				"teamKey": "DEN",
				"teamLogo": "DEN.svg",
				"teamId": 1610612743,
				"teamName": "Nuggets",
				"teamCity": "Denver",
				"teamColors": {
					"main": {
						"rgb": "(80,145,205)",
						"hex": "#5091CD"
					},
					"alternate": {
						"rgb": "(253,185,39)",
						"hex": "#FDB927"
					}
				}
			}, {
				"teamKey": "DET",
				"teamLogo": "DET.svg",
				"teamId": 1610612765,
				"teamName": "Pistons",
				"teamCity": "Detroit",
				"teamColors": {
					"main": {
						"rgb": "(12,76,147)",
						"hex": "#0C4C93"
					},
					"alternate": {
						"rgb": "(224,30,56)",
						"hex": "#E01E38"
					}
				}
			}, {
				"teamKey": "GSW",
				"teamLogo": "GSW.svg",
				"teamId": 1610612744,
				"teamName": "Warriors",
				"teamCity": "Golden State",
				"teamColors": {
					"main": {
						"rgb": "(36,62,144)",
						"hex": "#243E90"
					},
					"alternate": {
						"rgb": "(255,205,52)",
						"hex": "#FFCD34"
					}
				}
			}, {
				"teamKey": "HOU",
				"teamLogo": "HOU.svg",
				"teamId": 1610612745,
				"teamName": "Rockets",
				"teamCity": "Houston",
				"teamColors": {
					"main": {
						"rgb": "(206,17,65)",
						"hex": "#CE1141"
					},
					"alternate": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					}
				}
			}, {
				"teamKey": "IND",
				"teamLogo": "IND.svg",
				"teamId": 1610612754,
				"teamName": "Pacers",
				"teamCity": "Indiana",
				"teamColors": {
					"main": {
						"rgb": "(0,45,98)",
						"hex": "#002D62"
					},
					"alternate": {
						"rgb": "(253,187,48)",
						"hex": "#FDBB30"
					}
				}
			}, {
				"teamKey": "LAC",
				"teamLogo": "LAC.svg",
				"teamId": 1610612746,
				"teamName": "Clippers",
				"teamCity": "Los Angeles",
				"teamColors": {
					"main": {
						"rgb": "(237,23,76)",
						"hex": "#ED174C"
					},
					"alternate": {
						"rgb": "(0,107,182)",
						"hex": "#006BB6"
					}
				}
			}, {
				"teamKey": "LAL",
				"teamLogo": "LAL.svg",
				"teamId": 1610612747,
				"teamName": "Lakers",
				"teamCity": "Los Angeles",
				"teamColors": {
					"main": {
						"rgb": "(85,37,131)",
						"hex": "#552583"
					},
					"alternate": {
						"rgb": "(253,185,39)",
						"hex": "#FDB927"
					}
				}
			}, {
				"teamKey": "MEM",
				"teamLogo": "MEM.svg",
				"teamId": 1610612763,
				"teamName": "Grizzlies",
				"teamCity": "Memphis",
				"teamColors": {
					"main": {
						"rgb": "(97,137,185)",
						"hex": "#6189B9"
					},
					"alternate": {
						"rgb": "(0,40,94)",
						"hex": "#00285E"
					}
				}
			}, {
				"teamKey": "MIA",
				"teamLogo": "MIA.svg",
				"teamId": 1610612748,
				"teamName": "Heat",
				"teamCity": "Miami",
				"teamColors": {
					"main": {
						"rgb": "(152,0,46)",
						"hex": "#98002E"
					},
					"alternate": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					}
				}
			}, {
				"teamKey": "MIL",
				"teamLogo": "MIL.svg",
				"teamId": 1610612749,
				"teamName": "Bucks",
				"teamCity": "Milwaukee",
				"teamColors": {
					"main": {
						"rgb": "(0,71,27)",
						"hex": "#00471B"
					},
					"alternate": {
						"rgb": "(238,225,198)",
						"hex": "#EEE1C6"
					}
				}
			}, {
				"teamKey": "MIN",
				"teamLogo": "MIN.svg",
				"teamId": 1610612750,
				"teamName": "Timberwolves",
				"teamCity": "Minnesota",
				"teamColors": {
					"main": {
						"rgb": "(0,43,92)",
						"hex": "#002B5C"
					},
					"alternate": {
						"rgb": "(0,80,131)",
						"hex": "#005083"
					}
				}
			}, {
				"teamKey": "NOP",
				"teamLogo": "NOP.svg",
				"teamId": 1610612740,
				"teamName": "Pelicans",
				"teamCity": "New Orleans",
				"teamColors": {
					"main": {
						"rgb": "(0,22,65)",
						"hex": "#0C2340"
					},
					"alternate": {
						"rgb": "(225,58,62)",
						"hex": "#C8102E"
					}
				}
			}, {
				"teamKey": "NYK",
				"teamLogo": "NYK.svg",
				"teamId": 1610612752,
				"teamName": "Knicks",
				"teamCity": "New York",
				"teamColors": {
					"main": {
						"rgb": "(0,107,182)",
						"hex": "#006BB6"
					},
					"alternate": {
						"rgb": "(245,132,38)",
						"hex": "#F58426"
					}
				}
			}, {
				"teamKey": "OKC",
				"teamLogo": "OKC.svg",
				"teamId": 1610612760,
				"teamName": "Thunder",
				"teamCity": "Oklahoma City",
				"teamColors": {
					"main": {
						"rgb": "(0,122,193)",
						"hex": "#007AC1"
					},
					"alternate": {
						"rgb": "(240,81,51)",
						"hex": "#F05133"
					}
				}
			}, {
				"teamKey": "ORL",
				"teamLogo": "ORL.svg",
				"teamId": 1610612753,
				"teamName": "Magic",
				"teamCity": "Orlando",
				"teamColors": {
					"main": {
						"rgb": "(11,119,189)",
						"hex": "#0B77BD"
					},
					"alternate": {
						"rgb": "(194,204,210)",
						"hex": "#C2CCD2"
					}
				}
			}, {
				"teamKey": "PHI",
				"teamLogo": "PHI.svg",
				"teamId": 1610612755,
				"teamName": "76ers",
				"teamCity": "Philadelphia",
				"teamColors": {
					"main": {
						"rgb": "(0,107,182)",
						"hex": "#006BB6"
					},
					"alternate": {
						"rgb": "(237,23,76)",
						"hex": "#ED174C"
					}
				}
			}, {
				"teamKey": "PHX",
				"teamLogo": "PHX.svg",
				"teamId": 1610612756,
				"teamName": "Suns",
				"teamCity": "Phoenix",
				"teamColors": {
					"main": {
						"rgb": "(229,96,32)",
						"hex": "#E56020"
					},
					"alternate": {
						"rgb": "(29,17,96)",
						"hex": "#1D1160"
					}
				}
			}, {
				"teamKey": "POR",
				"teamLogo": "POR.svg",
				"teamId": 1610612757,
				"teamName": "Trailblazers",
				"teamCity": "Portland",
				"teamColors": {
					"main": {
						"rgb": "(225,58,62)",
						"hex": "#E13A3E"
					},
					"alternate": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					}
				}
			}, {
				"teamKey": "SAC",
				"teamLogo": "SAC.svg",
				"teamId": 1610612758,
				"teamName": "Kings",
				"teamCity": "Sacramento",
				"teamColors": {
					"main": {
						"rgb": "(90,45,129)",
						"hex": "#5A2D81"
					},
					"alternate": {
						"rgb": "(99,114,122)",
						"hex": "#63727A"
					}
				}
			}, {
				"teamKey": "SAS",
				"teamLogo": "SAS.svg",
				"teamId": 1610612759,
				"teamName": "Spurs",
				"teamCity": "San Antonio",
				"teamColors": {
					"main": {
						"rgb": "(196,206,212)",
						"hex": "#C4CED4"
					},
					"alternate": {
						"rgb": "(0,0,0)",
						"hex": "#000000"
					}
				}
			}, {
				"teamKey": "TOR",
				"teamLogo": "TOR.svg",
				"teamId": 1610612761,
				"teamName": "Raptors",
				"teamCity": "Toronto",
				"teamColors": {
					"main": {
						"rgb": "(205,17,65)",
						"hex": "#CD1141"
					},
					"alternate": {
						"rgb": "(160,160,163)",
						"hex": "#A0A0A3"
					}
				}
			}, {
				"teamKey": "UTA",
				"teamLogo": "UTA.svg",
				"teamId": 1610612762,
				"teamName": "Jazz",
				"teamCity": "Utah",
				"teamColors": {
					"main": {
						"rgb": "(12,35,64)",
						"hex": "#0C2340"
					},
					"alternate": {
						"rgb": "(249,160,27)",
						"hex": "#F9A01B"
					}
				}
			}, {
				"teamKey": "WAS",
				"teamLogo": "WAS.svg",
				"teamId": 1610612764,
				"teamName": "Wizards",
				"teamCity": "Washington",
				"teamColors": {
					"main": {
						"rgb": "(0,43,92)",
						"hex": "#002B5C"
					},
					"alternate": {
						"rgb": "(227,24.55)",
						"hex": "#E31837"
					}
				}
			}]
		});
	}

	// Inserting the list of games in an NBA Schedule
	if (Games.find().count() === 0) {
		const season = Schedule.findOne({}, {
			'lscd': 1
		});

		season.lscd.forEach((lscd) => {
			let month = lscd.mscd.mon;
			let games = lscd.mscd.g;

			let newGame = {};
			games.forEach((game) => {
				game['season'] = '2018-2019';
				game['month'] = month;

				newGame['details'] = game;
				newGame['data'] = {};
				newGame['gid'] = game.gid;
				newGame['gcode'] = game.gcode;
				newGame['gfile'] = 'pbp_' + game.gcode.replace('/', '_') + '.json';


				console.log("Inserting game: " + newGame.gcode);
				Games.insert(newGame);
			})
		});
	}

	/**** SERVER FUNCTIONALITY ****/
	if (Meteor.isServer) {

		Meteor.publish("League", () => {
			// console.log("**** Publishing League Collection ****");
			return League.find({});
		});

		Meteor.publish("Teams", () => {
			return Teams.find({});
		})

		Meteor.publish("Games", () => {
			return Games.find({});
		})


		Meteor.methods({

			// Function that will get the game Play by Play
			getGameData: (gid) => {
				console.log("GID", gid);
				const gameData = Games.findOne({
					'gid': gid
				}, {
					fields: {
						'_id': 0
					}
				});

				console.log("GID", gid, "Game Data length", Object.keys(gameData.data).length);
				let response = "";

				// Check if game data is already in the DB
				if (Object.keys(gameData.data).length > 0 && (gameData.hasOwnProperty('processed') && gameData.processed !== null) && gameData.processed.hasOwnProperty('playerLogs') && gameData.hasOwnProperty('teams')) {
					console.log("GID", gid, "Game has already been loaded");

					return gameData;
				}

				console.log("GAME NOT IN DB:", gid);

				// COMMENT OUT FOR NOT DB GAMES TO BE LOADED LOCALLY
				// return {};

				const url = "http://stats.nba.com/stats/playbyplayv2?GameID=" + gid + "&StartPeriod=00&EndPeriod=08";
				console.log("FETCHING DATA", gid, "URL", url);

				const config = {
					method: 'get',
					url: url,
					responseType: 'json'
				};


				return axios(config).catch((error) => {
						console.log("ERROR", error);
					})
					.then(results => {
						console.log('RECEIVED DATA', gid);
						return GameHelpers._handleNBADataResponse(results,gid, gameData, url);
					});
			},

			// Function that loads the list of regular season games for a specific team
			loadTeamGames: (teamSelected, calendarType) => {

				console.log('TNAME', teamSelected, calendarType, "Start Loading team games");
				let teamGames = [];
				let query = {};
				const options = { 
					sort: {'gid':1},
					fields: {
						details: 1,
						_id: 0
					}
				};

				if (calendarType === 'season') {
					// Loading games in regular season
					// teamGames = Games.find(
					query =  {
						$or: [
							{ 'details.v.ta': teamSelected },
							{ 'details.h.ta': teamSelected }
						],
						'details.gdte': {
							$gte: "2017-10-17"
						},
						'details.seri': ''
					}

				} else if (calendarType === 'playoffs') {
					// Loading games in playoffs
					// teamGames = Games.find(
					query = {
						$or: [
							{ 'details.v.ta': teamSelected },
							{ 'details.h.ta': teamSelected }
						],
						'details.gdte': {
							$gte: "2019-04-12"
						},
						'details.seri': {
							$ne: ''
						}
					};
				}

				teamGames = Games.find(query,options).fetch();
				// Cleaning up the results before returning
				const results = teamGames.map(gameInfo => {
					return gameInfo.details;
				});

				console.log('TNAME', teamSelected, "Done Loading team games");
				return results;
			},

			getTeamRoster: (teamId, season) => {
				console.log("TID", teamId, "Start Retrieving team roster");
				const roster = Teams.findOne({
					'season': season,
					'teamId': parseInt(teamId)
				}, {
					fields: {
						_id: 0
					}
				});

				console.log("TID", teamId, "Done Retrieving team roster", roster.teamKey, roster.players.length + " players");

				return roster;
			},

			getGameRosters: (teamId1, teamId2, season) => {
				console.log("TID1", teamId1,"TID2", teamId2, "Start Retrieving game rosters");
				const rosters = Teams.find({
					'season': season,
					$or: [
						{'teamId': parseInt(teamId1) },
						{'teamId': parseInt(teamId2) }
					]
				}, {
					fields: {
						_id: 0
					}
				}).fetch();

				console.log("TID1", teamId1,"TID2", teamId2, "Done Retrieving team roster", rosters[0].teamKey, rosters[0].players.length + " players", rosters[1].teamKey, rosters[1].players.length + " players");

				return rosters;
			},

			getFilterStats:(filter, gid, gameData) => {
				console.log("GID", gid, "FILTER", filter);
				return GameHelpers._filterGamePlayerLogs(filter, gameData);
			}
		});
	}
});