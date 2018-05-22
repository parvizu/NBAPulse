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

	// Inserting team rosters by season into DB
	if (Teams.find({}).count() === 0) {

		const rosters = [
			{
				"season": "2017-2018",
				"teamKey": "ATL",
				"teamId": 1610612737,
				"teamName": "Hawks",
				"teamCity": "Atlanta",
				"players": [
					{
						"playerId": 203473,
						"playerName": "Dewayne Dedmon"
					}, {
						"playerId": 203471,
						"playerName": "Dennis Schroder"
					}, {
						"playerId": 101141,
						"playerName": "Ersan Ilyasova"
					}, {
						"playerId": 203145,
						"playerName": "Kent Bazemore"
					}, {
						"playerId": 1627752,
						"playerName": "Taurean Prince"
					}, {
						"playerId": 1628381,
						"playerName": "John Collins"
					}, {
						"playerId": 201158,
						"playerName": "Marco Belinelli"
					}, {
						"playerId": 203488,
						"playerName": "Mike Muscala"
					}, {
						"playerId": 1627098,
						"playerName": "Malcolm Delaney"
					}, {
						"playerId": 1627761,
						"playerName": "DeAndre' Bembry"
					}, {
						"playerId": 203705,
						"playerName": "Josh Magette"
					}, {
						"playerId": 202337,
						"playerName": "Luke Babbitt"
					}, {
						"playerId": 1627819,
						"playerName": "Isaiah Taylor"
					}, {
						"playerId": 1628463,
						"playerName": "Tyler Cavanaugh"
					}, {
						"playerId": 203101,
						"playerName": "Miles Plumlee"
					}
				]
			},
			{
				"season": "2017-2018",
				"teamKey": "BKN",
				"teamId": 1610612751,
				"teamName": "Nets",
				"teamCity": "Brooklyn",
				"players": [{
					"playerId": 202389,
					"playerName": "Timofey Mozgov"
				}, {
					"playerId": 1626178,
					"playerName": "Rondae Hollis-Jefferson"
				}, {
					"playerId": 201960,
					"playerName": "DeMarre Carroll"
				}, {
					"playerId": 202391,
					"playerName": "Jeremy Lin"
				}, {
					"playerId": 1626156,
					"playerName": "D'Angelo Russell"
				}, {
					"playerId": 203112,
					"playerName": "Quincy Acy"
				}, {
					"playerId": 203459,
					"playerName": "Allen Crabbe"
				}, {
					"playerId": 202344,
					"playerName": "Trevor Booker"
				}, {
					"playerId": 1627747,
					"playerName": "Caris LeVert"
				}, {
					"playerId": 203915,
					"playerName": "Spencer Dinwiddie"
				}, {
					"playerId": 203092,
					"playerName": "Tyler Zeller"
				}, {
					"playerId": 203925,
					"playerName": "Joe Harris"
				}, {
					"playerId": 203930,
					"playerName": "Sean Kilpatrick"
				}, {
					"playerId": 1628386,
					"playerName": "Jarrett Allen"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "BOS",
				"teamId": 1610612738,
				"teamName": "Celtics",
				"teamCity": "Boston",
				"players": [{
					"playerId": 201143,
					"playerName": "Al Horford"
				}, {
					"playerId": 202681,
					"playerName": "Kyrie Irving"
				}, {
					"playerId": 202330,
					"playerName": "Gordon Hayward"
				}, {
					"playerId": 1627759,
					"playerName": "Jaylen Brown"
				}, {
					"playerId": 1628369,
					"playerName": "Jayson Tatum"
				}, {
					"playerId": 203935,
					"playerName": "Marcus Smart"
				}, {
					"playerId": 203382,
					"playerName": "Aron Baynes"
				}, {
					"playerId": 1628400,
					"playerName": "Semi Ojeleye"
				}, {
					"playerId": 1626179,
					"playerName": "Terry Rozier"
				}, {
					"playerId": 203499,
					"playerName": "Shane Larkin"
				}, {
					"playerId": 202694,
					"playerName": "Marcus Morris"
				}, {
					"playerId": 1628464,
					"playerName": "Daniel Theis"
				}, {
					"playerId": 1627846,
					"playerName": "Abdel Nader"
				}, {
					"playerId": 1627824,
					"playerName": "Guerschon Yabusele"
				}, {
					"playerId": 1628444,
					"playerName": "Jabari Bird"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "CHA",
				"teamId": 1610612766,
				"teamName": "Hornets",
				"teamCity": "Charlotte",
				"players": [{
					"playerId": 2730,
					"playerName": "Dwight Howard"
				}, {
					"playerId": 1628407,
					"playerName": "Dwayne Bacon"
				}, {
					"playerId": 202689,
					"playerName": "Kemba Walker"
				}, {
					"playerId": 203087,
					"playerName": "Jeremy Lamb"
				}, {
					"playerId": 101107,
					"playerName": "Marvin Williams"
				}, {
					"playerId": 1626163,
					"playerName": "Frank Kaminsky"
				}, {
					"playerId": 1628370,
					"playerName": "Malik Monk"
				}, {
					"playerId": 203469,
					"playerName": "Cody Zeller"
				}, {
					"playerId": 202933,
					"playerName": "Julyan Stone"
				}, {
					"playerId": 1626203,
					"playerName": "Treveon Graham"
				}, {
					"playerId": 203077,
					"playerName": "Michael Kidd-Gilchrist"
				}, {
					"playerId": 203487,
					"playerName": "Michael Carter-Williams"
				}, {
					"playerId": 201587,
					"playerName": "Nicolas Batum"
				}, {
					"playerId": 203948,
					"playerName": "Johnny O'Bryant III"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "CHI",
				"teamId": 1610612741,
				"teamName": "Bulls",
				"teamCity": "Chicago",
				"players": [{
					"playerId": 201577,
					"playerName": "Robin Lopez"
				}, {
					"playerId": 1628374,
					"playerName": "Lauri Markkanen"
				}, {
					"playerId": 1626170,
					"playerName": "Jerian Grant"
				}, {
					"playerId": 203200,
					"playerName": "Justin Holiday"
				}, {
					"playerId": 1627835,
					"playerName": "Paul Zipser"
				}, {
					"playerId": 1627756,
					"playerName": "Denzel Valentine"
				}, {
					"playerId": 1627853,
					"playerName": "Ryan Arcidiacono"
				}, {
					"playerId": 1626245,
					"playerName": "Cristiano Felicio"
				}, {
					"playerId": 1628021,
					"playerName": "David Nwaba"
				}, {
					"playerId": 202347,
					"playerName": "Quincy Pondexter"
				}, {
					"playerId": 1627770,
					"playerName": "Kay Felder"
				}, {
					"playerId": 1628469,
					"playerName": "Antonio Blakeney"
				}, {
					"playerId": 1627739,
					"playerName": "Kris Dunn"
				}, {
					"playerId": 1626171,
					"playerName": "Bobby Portis"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "CLE",
				"teamId": 1610612739,
				"teamName": "Cavaliers",
				"teamCity": "Cleveland",
				"players": [{
					"playerId": 201567,
					"playerName": "Kevin Love"
				}, {
					"playerId": 201565,
					"playerName": "Derrick Rose"
				}, {
					"playerId": 2544,
					"playerName": "LeBron James"
				}, {
					"playerId": 202738,
					"playerName": "Isaiah Thomas"
				}, {
					"playerId": 203109,
					"playerName": "Jae Crowder"
				}, {
					"playerId": 2548,
					"playerName": "Dwyane Wade"
				}, {
					"playerId": 202684,
					"playerName": "Tristan Thompson"
				}, {
					"playerId": 2747,
					"playerName": "JR Smith"
				}, {
					"playerId": 202697,
					"playerName": "Iman Shumpert"
				}, {
					"playerId": 201145,
					"playerName": "Jeff Green"
				}, {
					"playerId": 2594,
					"playerName": "Kyle Korver"
				}, {
					"playerId": 101181,
					"playerName": "Jose Calderon"
				}, {
					"playerId": 1626224,
					"playerName": "Cedi Osman"
				}, {
					"playerId": 101112,
					"playerName": "Channing Frye"
				}, {
					"playerId": 1627790,
					"playerName": "Ante Zizic"
				}, {
					"playerId": 204066,
					"playerName": "John Holland"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "DAL",
				"teamId": 1610612742,
				"teamName": "Mavericks",
				"teamCity": "Dallas",
				"players": [{
					"playerId": 203084,
					"playerName": "Harrison Barnes"
				}, {
					"playerId": 1628372,
					"playerName": "Dennis Smith Jr."
				}, {
					"playerId": 202083,
					"playerName": "Wesley Matthews"
				}, {
					"playerId": 1717,
					"playerName": "Dirk Nowitzki"
				}, {
					"playerId": 1627812,
					"playerName": "Yogi Ferrell"
				}, {
					"playerId": 203457,
					"playerName": "Nerlens Noel"
				}, {
					"playerId": 200826,
					"playerName": "J.J. Barea"
				}, {
					"playerId": 2734,
					"playerName": "Devin Harris"
				}, {
					"playerId": 203939,
					"playerName": "Dwight Powell"
				}, {
					"playerId": 1627827,
					"playerName": "Dorian Finney-Smith"
				}, {
					"playerId": 1628492,
					"playerName": "Gian Clavell"
				}, {
					"playerId": 1628467,
					"playerName": "Maxi Kleber"
				}, {
					"playerId": 203481,
					"playerName": "Jeff Withey"
				}, {
					"playerId": 1628499,
					"playerName": "Antonius Cleveland"
				}, {
					"playerId": 1628405,
					"playerName": "Johnathan Motley"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "DEN",
				"teamId": 1610612743,
				"teamName": "Nuggets",
				"teamCity": "Denver",
				"players": [{
					"playerId": 200794,
					"playerName": "Paul Millsap"
				}, {
					"playerId": 1627750,
					"playerName": "Jamal Murray"
				}, {
					"playerId": 203914,
					"playerName": "Gary Harris"
				}, {
					"playerId": 203999,
					"playerName": "Nikola Jokic"
				}, {
					"playerId": 201163,
					"playerName": "Wilson Chandler"
				}, {
					"playerId": 203115,
					"playerName": "Will Barton"
				}, {
					"playerId": 203486,
					"playerName": "Mason Plumlee"
				}, {
					"playerId": 1626144,
					"playerName": "Emmanuel Mudiay"
				}, {
					"playerId": 202702,
					"playerName": "Kenneth Faried"
				}, {
					"playerId": 1627823,
					"playerName": "Juan Hernangomez"
				}, {
					"playerId": 1626168,
					"playerName": "Trey Lyles"
				}, {
					"playerId": 1627736,
					"playerName": "Malik Beasley"
				}, {
					"playerId": 1628470,
					"playerName": "Torrey Craig"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "DET",
				"teamId": 1610612765,
				"teamName": "Pistons",
				"teamCity": "Detroit",
				"players": [{
					"playerId": 203083,
					"playerName": "Andre Drummond"
				}, {
					"playerId": 202699,
					"playerName": "Tobias Harris"
				}, {
					"playerId": 202340,
					"playerName": "Avery Bradley"
				}, {
					"playerId": 1626169,
					"playerName": "Stanley Johnson"
				}, {
					"playerId": 202704,
					"playerName": "Reggie Jackson"
				}, {
					"playerId": 203961,
					"playerName": "Eric Moreland"
				}, {
					"playerId": 202720,
					"playerName": "Jon Leuer"
				}, {
					"playerId": 202397,
					"playerName": "Ish Smith"
				}, {
					"playerId": 204038,
					"playerName": "Langston Galloway"
				}, {
					"playerId": 1627740,
					"playerName": "Henry Ellenson"
				}, {
					"playerId": 201229,
					"playerName": "Anthony Tolliver"
				}, {
					"playerId": 1277,
					"playerName": null
				}, {
					"playerId": 1628379,
					"playerName": "Luke Kennard"
				}, {
					"playerId": 203493,
					"playerName": "Reggie Bullock"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "GSW",
				"teamId": 1610612744,
				"teamName": "Warriors",
				"teamCity": "Golden State",
				"players": [{
					"playerId": 201939,
					"playerName": "Steph Curry"
				}, {
					"playerId": 201142,
					"playerName": "Kevin Durant"
				}, {
					"playerId": 203110,
					"playerName": "Draymond Green"
				}, {
					"playerId": 202691,
					"playerName": "Klay Thompson"
				}, {
					"playerId": 2738,
					"playerName": "Andre Iguodala"
				}, {
					"playerId": 2585,
					"playerName": "Zaza Pachulia"
				}, {
					"playerId": 2733,
					"playerName": "Shaun Livingston"
				}, {
					"playerId": 1627775,
					"playerName": "Patrick McCaw"
				}, {
					"playerId": 201956,
					"playerName": "Omri Casspi"
				}, {
					"playerId": 1628395,
					"playerName": "Jordan Bell"
				}, {
					"playerId": 1626172,
					"playerName": "Kevon Looney"
				}, {
					"playerId": 201156,
					"playerName": "Nick Young"
				}, {
					"playerId": 201580,
					"playerName": "JaVale McGee"
				}, {
					"playerId": 1626188,
					"playerName": "Quinn Cook"
				}, {
					"playerId": 2561,
					"playerName": "David West"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "HOU",
				"teamId": 1610612745,
				"teamName": "Rockets",
				"teamCity": "Houston",
				"players": [{
					"playerId": 203991,
					"playerName": "Clint Capela"
				}, {
					"playerId": 201583,
					"playerName": "Ryan Anderson"
				}, {
					"playerId": 201935,
					"playerName": "James Harden"
				}, {
					"playerId": 101108,
					"playerName": "Chris Paul"
				}, {
					"playerId": 2772,
					"playerName": "Trevor Ariza"
				}, {
					"playerId": 200782,
					"playerName": "PJ Tucker"
				}, {
					"playerId": 201569,
					"playerName": "Eric Gordon"
				}, {
					"playerId": 201601,
					"playerName": "Luc Mbah a Moute"
				}, {
					"playerId": 2403,
					"playerName": "Nene"
				}, {
					"playerId": 204028,
					"playerName": "Tarik Black"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "IND",
				"teamId": 1610612754,
				"teamName": "Pacers",
				"teamCity": "Indiana",
				"players": [{
					"playerId": 1626167,
					"playerName": "Myles Turner"
				}, {
					"playerId": 202711,
					"playerName": "Bojan Bogdanovic"
				}, {
					"playerId": 201954,
					"playerName": "Darren Collison"
				}, {
					"playerId": 201152,
					"playerName": "Thaddeus Young"
				}, {
					"playerId": 203506,
					"playerName": "Victor Oladipo"
				}, {
					"playerId": 202362,
					"playerName": "Lance Stephenson"
				}, {
					"playerId": 202709,
					"playerName": "Cory Joseph"
				}, {
					"playerId": 1627734,
					"playerName": "Domantas Sabonis"
				}, {
					"playerId": 2863,
					"playerName": "Damien Wilkins"
				}, {
					"playerId": 1628388,
					"playerName": "TJ Leaf"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "LAC",
				"teamId": 1610612746,
				"teamName": "Clippers",
				"teamCity": "Los Angeles",
				"players": [{
					"playerId": 201599,
					"playerName": "DeAndre Jordan"
				}, {
					"playerId": 201933,
					"playerName": "Blake Griffin"
				}, {
					"playerId": 201568,
					"playerName": "Danilo Gallinari"
				}, {
					"playerId": 201976,
					"playerName": "Patrick Beverley"
				}, {
					"playerId": 1628462,
					"playerName": "Milos Teodosic"
				}, {
					"playerId": 203085,
					"playerName": "Austin Rivers"
				}, {
					"playerId": 101150,
					"playerName": "Lou Williams"
				}, {
					"playerId": 203186,
					"playerName": "Willie Reed"
				}, {
					"playerId": 202325,
					"playerName": "Wesley Johnson"
				}, {
					"playerId": 1626155,
					"playerName": "Sam Dekker"
				}, {
					"playerId": 1628414,
					"playerName": "Sindarius Thornwell"
				}, {
					"playerId": 1626149,
					"playerName": "Montrezl Harrell"
				}, {
					"playerId": 203710,
					"playerName": "C.J. Williams"
				}, {
					"playerId": 1628393,
					"playerName": "Jawun Evans"
				}, {
					"playerId": 1627820,
					"playerName": "Tyrone Wallace"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "LAL",
				"teamId": 1610612747,
				"teamName": "Lakers",
				"teamCity": "Los Angeles",
				"players": [{
					"playerId": 201572,
					"playerName": "Brook Lopez"
				}, {
					"playerId": 1627742,
					"playerName": "Brandon Ingram"
				}, {
					"playerId": 1626204,
					"playerName": "Larry Nance Jr."
				}, {
					"playerId": 1628366,
					"playerName": "Lonzo Ball"
				}, {
					"playerId": 2736,
					"playerName": "Luol Deng"
				}, {
					"playerId": 203903,
					"playerName": "Jordan Clarkson"
				}, {
					"playerId": 101106,
					"playerName": "Andrew Bogut"
				}, {
					"playerId": 1628398,
					"playerName": "Kyle Kuzma"
				}, {
					"playerId": 203944,
					"playerName": "Julius Randle"
				}, {
					"playerId": 1627936,
					"playerName": "Alex Caruso"
				}, {
					"playerId": 201147,
					"playerName": "Corey Brewer"
				}, {
					"playerId": 203898,
					"playerName": "Tyler Ennis"
				}, {
					"playerId": 1628404,
					"playerName": "Josh Hart"
				}, {
					"playerId": 203484,
					"playerName": "Kentavious Caldwell-Pope"
				}, {
					"playerId": 1627826,
					"playerName": "Ivica Zubac"
				}, {
					"playerId": 203505,
					"playerName": "Vander Blue"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "MEM",
				"teamId": 1610612763,
				"teamName": "Grizzlies",
				"teamCity": "Memphis",
				"players": [{
					"playerId": 201188,
					"playerName": "Marc Gasol"
				}, {
					"playerId": 203210,
					"playerName": "JaMychal Green"
				}, {
					"playerId": 203516,
					"playerName": "James Ennis III"
				}, {
					"playerId": 201144,
					"playerName": "Mike Conley"
				}, {
					"playerId": 1626150,
					"playerName": "Andrew Harrison"
				}, {
					"playerId": 201148,
					"playerName": "Brandan Wright"
				}, {
					"playerId": 1628415,
					"playerName": "Dillon Brooks"
				}, {
					"playerId": 201596,
					"playerName": "Mario Chalmers"
				}, {
					"playerId": 201936,
					"playerName": "Tyreke Evans"
				}, {
					"playerId": 202718,
					"playerName": "Chandler Parsons"
				}, {
					"playerId": 1626185,
					"playerName": "Jarell Martin"
				}, {
					"playerId": 203463,
					"playerName": "Ben McLemore"
				}, {
					"playerId": 1628424,
					"playerName": "Kobi Simmons"
				}, {
					"playerId": 1627738,
					"playerName": "Deyonta Davis"
				}, {
					"playerId": 1628397,
					"playerName": "Ivan Rabb"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "MIA",
				"teamId": 1610612748,
				"teamName": "Heat",
				"teamCity": "Miami",
				"players": [{
					"playerId": 202355,
					"playerName": "Hassan Whiteside"
				}, {
					"playerId": 203079,
					"playerName": "Dion Waiters"
				}, {
					"playerId": 203482,
					"playerName": "Kelly Olynyk"
				}, {
					"playerId": 201609,
					"playerName": "Goran Dragic"
				}, {
					"playerId": 1626196,
					"playerName": "Josh Richardson"
				}, {
					"playerId": 204020,
					"playerName": "Tyler Johnson"
				}, {
					"playerId": 201949,
					"playerName": "James Johnson"
				}, {
					"playerId": 1626159,
					"playerName": "Justise Winslow"
				}, {
					"playerId": 1628389,
					"playerName": "Bam Adebayo"
				}, {
					"playerId": 201961,
					"playerName": "Wayne Ellington"
				}, {
					"playerId": 2617,
					"playerName": "Udonis Haslem"
				}, {
					"playerId": 1628476,
					"playerName": "Derrick Walton Jr."
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "MIL",
				"teamId": 1610612749,
				"teamName": "Bucks",
				"teamCity": "Milwaukee",
				"players": [{
					"playerId": 1627748,
					"playerName": "Thon Maker"
				}, {
					"playerId": 203507,
					"playerName": "Giannis Antetokounmpo"
				}, {
					"playerId": 203114,
					"playerName": "Khris Middleton"
				}, {
					"playerId": 1627763,
					"playerName": "Malcolm Brogdon"
				}, {
					"playerId": 203503,
					"playerName": "Tony Snell"
				}, {
					"playerId": 202328,
					"playerName": "Greg Monroe"
				}, {
					"playerId": 203521,
					"playerName": "Matthew Dellavedova"
				}, {
					"playerId": 203089,
					"playerName": "John Henson"
				}, {
					"playerId": 203141,
					"playerName": "Mirza Teletovic"
				}, {
					"playerId": 1626173,
					"playerName": "Rashad Vaughn"
				}, {
					"playerId": 1891,
					"playerName": "Jason Terry"
				}, {
					"playerId": 1628425,
					"playerName": "Sterling Brown"
				}, {
					"playerId": 1628391,
					"playerName": "D.J. Wilson"
				}, {
					"playerId": 202732,
					"playerName": "DeAndre Liggins"
				}, {
					"playerId": 1627780,
					"playerName": "Gary Payton II"
				}, {
					"playerId": 202339,
					"playerName": "Eric Bledsoe"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "MIN",
				"teamId": 1610612750,
				"teamName": "Timberwolves",
				"teamCity": "Minnesota",
				"players": [{
					"playerId": 1626157,
					"playerName": "Karl-Anthony Towns"
				}, {
					"playerId": 201952,
					"playerName": "Jeff Teague"
				}, {
					"playerId": 201959,
					"playerName": "Taj Gibson"
				}, {
					"playerId": 202710,
					"playerName": "Jimmy Butler"
				}, {
					"playerId": 203952,
					"playerName": "Andrew Wiggins"
				}, {
					"playerId": 203476,
					"playerName": "Gorgui Dieng"
				}, {
					"playerId": 203498,
					"playerName": "Shabazz Muhammad"
				}, {
					"playerId": 2037,
					"playerName": "Jamal Crawford"
				}, {
					"playerId": 1626145,
					"playerName": "Tyus Jones"
				}, {
					"playerId": 202357,
					"playerName": "Nemanja Bjelica"
				}, {
					"playerId": 201166,
					"playerName": "Aaron Brooks"
				}, {
					"playerId": 1627875,
					"playerName": "Marcus Georges-Hunt"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "NOP",
				"teamId": 1610612740,
				"teamName": "Pelicans",
				"teamCity": "New Orleans",
				"players": [{
					"playerId": 203076,
					"playerName": "Anthony Davis"
				}, {
					"playerId": 202734,
					"playerName": "E'Twaun Moore"
				}, {
					"playerId": 202326,
					"playerName": "DeMarcus Cousins"
				}, {
					"playerId": 201950,
					"playerName": "Jrue Holiday"
				}, {
					"playerId": 201967,
					"playerName": "Dante Cunningham"
				}, {
					"playerId": 203546,
					"playerName": "Ian Clark"
				}, {
					"playerId": 203121,
					"playerName": "Darius Miller"
				}, {
					"playerId": 2754,
					"playerName": "Tony Allen"
				}, {
					"playerId": 202348,
					"playerName": "Jordan Crawford"
				}, {
					"playerId": 1627767,
					"playerName": "Cheick Diallo"
				}, {
					"playerId": 1243,
					"playerName": null
				}, {
					"playerId": 200765,
					"playerName": "Rajon Rondo"
				}, {
					"playerId": 2749,
					"playerName": "Jameer Nelson"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "NYK",
				"teamId": 1610612752,
				"teamName": "Knicks",
				"teamCity": "New York",
				"players": [{
					"playerId": 204001,
					"playerName": "Kristaps Porzingis"
				}, {
					"playerId": 202683,
					"playerName": "Enes Kanter"
				}, {
					"playerId": 203501,
					"playerName": "Tim Hardaway Jr."
				}, {
					"playerId": 201196,
					"playerName": "Ramon Sessions"
				}, {
					"playerId": 201584,
					"playerName": "Courtney Lee"
				}, {
					"playerId": 202498,
					"playerName": "Lance Thomas"
				}, {
					"playerId": 1627758,
					"playerName": "Ron Baker"
				}, {
					"playerId": 203926,
					"playerName": "Doug McDermott"
				}, {
					"playerId": 201563,
					"playerName": "Michael Beasley"
				}, {
					"playerId": 203124,
					"playerName": "Kyle O'Quinn"
				}, {
					"playerId": 1628373,
					"playerName": "Frank Ntilikina"
				}, {
					"playerId": 202898,
					"playerName": null
				}, {
					"playerId": 1626195,
					"playerName": "Willy Hernangomez"
				}, {
					"playerId": 1628422,
					"playerName": "Damyean Dotson"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "OKC",
				"teamId": 1610612760,
				"teamName": "Thunder",
				"teamCity": "Oklahoma City",
				"players": [{
					"playerId": 203500,
					"playerName": "Steven Adams"
				}, {
					"playerId": 2546,
					"playerName": "Carmelo Anthony"
				}, {
					"playerId": 202331,
					"playerName": "Paul George"
				}, {
					"playerId": 201566,
					"playerName": "Russell Westbrook"
				}, {
					"playerId": 203460,
					"playerName": "Andre Roberson"
				}, {
					"playerId": 203518,
					"playerName": "Alex Abrines"
				}, {
					"playerId": 203924,
					"playerName": "Jerami Grant"
				}, {
					"playerId": 1628390,
					"playerName": "Terrance Ferguson"
				}, {
					"playerId": 101109,
					"playerName": "Raymond Felton"
				}, {
					"playerId": 202335,
					"playerName": "Patrick Patterson"
				}, {
					"playerId": 1626177,
					"playerName": "Dakari Johnson"
				}, {
					"playerId": 203962,
					"playerName": "Josh Huestis"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "ORL",
				"teamId": 1610612753,
				"teamName": "Magic",
				"teamCity": "Orlando",
				"players": [{
					"playerId": 202696,
					"playerName": "Nikola Vucevic"
				}, {
					"playerId": 203082,
					"playerName": "Terrence Ross"
				}, {
					"playerId": 203901,
					"playerName": "Elfrid Payton"
				}, {
					"playerId": 203095,
					"playerName": "Evan Fournier"
				}, {
					"playerId": 203932,
					"playerName": "Aaron Gordon"
				}, {
					"playerId": 203613,
					"playerName": "Jonathon Simmons"
				}, {
					"playerId": 202687,
					"playerName": "Bismack Biyombo"
				}, {
					"playerId": 1628371,
					"playerName": "Jonathan Isaac"
				}, {
					"playerId": 201571,
					"playerName": "D.J. Augustin"
				}, {
					"playerId": 201167,
					"playerName": "Arron Afflalo"
				}, {
					"playerId": 1626209,
					"playerName": "Mario Hezonja"
				}, {
					"playerId": 202714,
					"playerName": "Shelvin Mack"
				}, {
					"playerId": 203920,
					"playerName": "Khem Birch"
				}, {
					"playerId": 1628411,
					"playerName": "Wes Iwundu"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "PHI",
				"teamId": 1610612755,
				"teamName": "76ers",
				"teamCity": "Philadelphia",
				"players": [{
					"playerId": 203954,
					"playerName": "Joel Embiid"
				}, {
					"playerId": 1627732,
					"playerName": "Ben Simmons"
				}, {
					"playerId": 200755,
					"playerName": "JJ Redick"
				}, {
					"playerId": 203496,
					"playerName": "Robert Covington"
				}, {
					"playerId": 201573,
					"playerName": "Jerryd Bayless"
				}, {
					"playerId": 101161,
					"playerName": "Amir Johnson"
				}, {
					"playerId": 1628365,
					"playerName": "Markelle Fultz"
				}, {
					"playerId": 203967,
					"playerName": "Dario Saric"
				}, {
					"playerId": 204456,
					"playerName": "T.J. McConnell"
				}, {
					"playerId": 1627789,
					"playerName": "Timothe Luwawu-Cabarrot"
				}, {
					"playerId": 1626147,
					"playerName": "Justin Anderson"
				}, {
					"playerId": 1626158,
					"playerName": "Richaun Holmes"
				}, {
					"playerId": 2719,
					"playerName": null
				}, {
					"playerId": 202344,
					"playerName": "Trevor Booker"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "PHX",
				"teamId": 1610612756,
				"teamName": "Suns",
				"teamCity": "Phoenix",
				"players": [{
					"playerId": 2199,
					"playerName": "Tyson Chandler"
				}, {
					"playerId": 202339,
					"playerName": "Eric Bledsoe"
				}, {
					"playerId": 1626164,
					"playerName": "Devin Booker"
				}, {
					"playerId": 1628367,
					"playerName": "Josh Jackson"
				}, {
					"playerId": 203933,
					"playerName": "TJ Warren"
				}, {
					"playerId": 1627755,
					"playerName": "Tyler Ulis"
				}, {
					"playerId": 1627737,
					"playerName": "Marquese Chriss"
				}, {
					"playerId": 1627733,
					"playerName": "Dragan Bender"
				}, {
					"playerId": 203584,
					"playerName": "Troy Daniels"
				}, {
					"playerId": 1628409,
					"playerName": "Alec Peters"
				}, {
					"playerId": 1627884,
					"playerName": "Derrick Jones Jr."
				}, {
					"playerId": 1628455,
					"playerName": "Mike James"
				}, {
					"playerId": 203458,
					"playerName": "Alex Len"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "POR",
				"teamId": 1610612757,
				"teamName": "Trailblazers",
				"teamCity": "Portland",
				"players": [{
					"playerId": 203994,
					"playerName": "Jusuf Nurkic"
				}, {
					"playerId": 203090,
					"playerName": "Maurice Harkless"
				}, {
					"playerId": 203081,
					"playerName": "Damian Lillard"
				}, {
					"playerId": 203468,
					"playerName": "CJ McCollum"
				}, {
					"playerId": 202329,
					"playerName": "Al-Farouq Aminu"
				}, {
					"playerId": 202323,
					"playerName": "Evan Turner"
				}, {
					"playerId": 1626192,
					"playerName": "Pat Connaughton"
				}, {
					"playerId": 203894,
					"playerName": "Shabazz Napier"
				}, {
					"playerId": 1628403,
					"playerName": "Caleb Swanigan"
				}, {
					"playerId": 202334,
					"playerName": "Ed Davis"
				}, {
					"playerId": 1627774,
					"playerName": "Jake Layman"
				}, {
					"playerId": 203086,
					"playerName": "Meyers Leonard"
				}, {
					"playerId": 1628380,
					"playerName": "Zach Collins"
				}, {
					"playerId": 203943,
					"playerName": "Noah Vonleh"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "SAC",
				"teamId": 1610612758,
				"teamName": "Kings",
				"teamCity": "Sacramento",
				"players": [{
					"playerId": 1626161,
					"playerName": "Willie Cauley-Stein"
				}, {
					"playerId": 1627746,
					"playerName": "Skal Labissiere"
				}, {
					"playerId": 201588,
					"playerName": "George Hill"
				}, {
					"playerId": 1628382,
					"playerName": "Justin Jackson"
				}, {
					"playerId": 1627741,
					"playerName": "Buddy Hield"
				}, {
					"playerId": 202066,
					"playerName": "Garrett Temple"
				}, {
					"playerId": 1628368,
					"playerName": "De'Aaron Fox"
				}, {
					"playerId": 201585,
					"playerName": "Kosta Koufos"
				}, {
					"playerId": 1713,
					"playerName": "Vince Carter"
				}, {
					"playerId": 1627781,
					"playerName": "Malachi Richardson"
				}, {
					"playerId": 2216,
					"playerName": "Zach Randolph"
				}, {
					"playerId": 1628412,
					"playerName": "Frank Mason"
				}, {
					"playerId": 203992,
					"playerName": "Bogdan Bogdanovic"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "SAS",
				"teamId": 1610612759,
				"teamName": "Spurs",
				"teamCity": "San Antonio",
				"players": [{
					"playerId": 2200,
					"playerName": "Pau Gasol"
				}, {
					"playerId": 201980,
					"playerName": "Danny Green"
				}, {
					"playerId": 1627749,
					"playerName": "Dejounte Murray"
				}, {
					"playerId": 200746,
					"playerName": "LaMarcus Aldridge"
				}, {
					"playerId": 203937,
					"playerName": "Kyle Anderson"
				}, {
					"playerId": 201988,
					"playerName": "Patty Mills"
				}, {
					"playerId": 1938,
					"playerName": "Manu Ginobili"
				}, {
					"playerId": 200752,
					"playerName": "Rudy Gay"
				}, {
					"playerId": 203530,
					"playerName": "Joffrey Lauvergne"
				}, {
					"playerId": 202722,
					"playerName": "Davis Bertans"
				}, {
					"playerId": 1628401,
					"playerName": "Derrick White"
				}, {
					"playerId": 203464,
					"playerName": "Brandon Paul"
				}, {
					"playerId": 1627854,
					"playerName": "Bryn Forbes"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "TOR",
				"teamId": 1610612761,
				"teamName": "Raptors",
				"teamCity": "Toronto",
				"players": [{
					"playerId": 202685,
					"playerName": "Jonas Valanciunas"
				}, {
					"playerId": 201942,
					"playerName": "DeMar DeRozan"
				}, {
					"playerId": 200768,
					"playerName": "Kyle Lowry"
				}, {
					"playerId": 201586,
					"playerName": "Serge Ibaka"
				}, {
					"playerId": 1626181,
					"playerName": "Norman Powell"
				}, {
					"playerId": 1627751,
					"playerName": "Jakob Poeltl"
				}, {
					"playerId": 101139,
					"playerName": "CJ Miles"
				}, {
					"playerId": 1628384,
					"playerName": "OG Anunoby"
				}, {
					"playerId": 1626153,
					"playerName": "Delon Wright"
				}, {
					"playerId": 1627832,
					"playerName": "Fred VanVleet"
				}, {
					"playerId": 1627783,
					"playerName": "Pascal Siakam"
				}, {
					"playerId": 1628035,
					"playerName": "Alfonzo McKinnie"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "UTA",
				"teamId": 1610612762,
				"teamName": "Jazz",
				"teamCity": "Utah",
				"players": [{
					"playerId": 203497,
					"playerName": "Rudy Gobert"
				}, {
					"playerId": 202324,
					"playerName": "Derrick Favors"
				}, {
					"playerId": 204060,
					"playerName": "Joe Ingles"
				}, {
					"playerId": 201937,
					"playerName": "Ricky Rubio"
				}, {
					"playerId": 1628378,
					"playerName": "Donovan Mitchell"
				}, {
					"playerId": 2207,
					"playerName": "Joe Johnson"
				}, {
					"playerId": 203918,
					"playerName": "Rodney Hood"
				}, {
					"playerId": 202692,
					"playerName": "Alec Burks"
				}, {
					"playerId": 202327,
					"playerName": "Ekpe Udoh"
				}, {
					"playerId": 200757,
					"playerName": "Thabo Sefolosha"
				}, {
					"playerId": 1626220,
					"playerName": "Royce O'Neale"
				}]
			},
			{
				"season": "2017-2018",
				"teamKey": "WAS",
				"teamId": 1610612764,
				"teamName": "Wizards",
				"teamCity": "Washington",
				"players": [{
					"playerId": 101162,
					"playerName": "Marcin Gortat"
				}, {
					"playerId": 201160,
					"playerName": "Jason Smith"
				}, {
					"playerId": 203078,
					"playerName": "Bradley Beal"
				}, {
					"playerId": 203490,
					"playerName": "Otto Porter Jr."
				}, {
					"playerId": 202322,
					"playerName": "John Wall"
				}, {
					"playerId": 1626162,
					"playerName": "Kelly Oubre Jr."
				}, {
					"playerId": 203118,
					"playerName": "Mike Scott"
				}, {
					"playerId": 201975,
					"playerName": "Jodie Meeks"
				}, {
					"playerId": 101133,
					"playerName": "Ian Mahinmi"
				}, {
					"playerId": 204025,
					"playerName": "Tim Frazier"
				}, {
					"playerId": 203107,
					"playerName": "Tomas Satoransky"
				}]
			}
		];

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
				game['season'] = '2017-2018';
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
							$gte: "2018-04-14"
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
			}
		});
	}
});