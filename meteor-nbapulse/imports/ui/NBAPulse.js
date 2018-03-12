import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Header from './Header.js';

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
			teamSelected: 'GSW'
		};

		this.onSelectTeam = this.onSelectTeam.bind(this);
		this.onSelectGame = this.onSelectGame.bind(this);
	}

	onSelectTeam(teamAbbr) {
		if (teamAbbr !== this.state.teamSelected) {
			this.setState({
				teamSelected: teamAbbr
			});
		}
	}

	onSelectGame(gid) {
		Meteor.call("getGameData", gid, function(error, results) {
	        console.log(gid, results);
	    });
	}


	render() {
		return (
			<div className="main-container">
				<Header
					teamSelected={this.state.teamSelected}
					onSelectTeam={this.onSelectTeam}
					onSelectGame={this.onSelectGame}
					leagueDetails={this.props.league}
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
