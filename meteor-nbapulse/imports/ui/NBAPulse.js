import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

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
			schedule: []
		};
	}

	
	render() {

		console.log(this.props);

		return (
			<div className="main-container">
				<div id="header">
					<div id="updated">v0.8 (11/17/17)</div>
					<img src="/img/logos/nbaLogo.svg" /> 
					<h1> Game Pulse</h1> <a href="http://www.parvizu.com" target="_blank" id="madeby">by Pablo Arvizu</a> <a href="https://twitter.com/sirgalahad88" target="_blank" id="twitterLink"><img src="/img/twitter-256.png" /></a>
					<div className="addthis_sharing_toolbox"></div>
				</div>

				
			</div>
		);
	}
}

export default withTracker(() => {
	return {
		league: League.find({}).fetch(),
		games: Games.find({}).fetch(),
		schedule: Schedule.findOne({"season":"2017-2018"}),
		teams: Teams.find({}).fetch()
	};
})(NBAPulse);