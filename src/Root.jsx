import React, { Component } from 'react';

import BasketballChart from './charts/BasketballChart';

import games from '../data/games-updated.json';
import teams from '../data/teams-updated.json';

// Preloading team logos to avoid having to load them each time.
teams.teamList.forEach(function(team) {
	var teamLogo = []
	teams.teamLogos[team] = require('./img/logos/'+team+'.svg');
});

const teamsData = teams;
const gamesData = games;

export default class Root extends Component {

	constructor(props) {
		super(props);

		this.state = {
			specs: {
				width: 1200,
				height: 150,
				padding: 25,
				xParam: 'sec',
				yParam: 'dif'
			}
		};

		this.handleNewSizeSpecs = this.handleNewSizeSpecs.bind(this);
	}

	handleNewSizeSpecs(e) {
		e.preventDefault();

		const newSpecs = this.state.specs;
		const attr = e.target.getAttribute('value');

		let newValue = attr === 'padding' ? 5 : 10;
		
		if (e.target.text === '-')
			newValue = newValue * -1;

		newSpecs[attr] = newSpecs[attr] + newValue;

		this.setState({
			specs: newSpecs
		});
	}

	render() {
		return (
			<div>
				<h1>NBA Pulse - 2017 Finals.</h1>

				<BasketballChart specs={this.state.specs} teams={teamsData} games={gamesData} />
			</div>
		);
	}
	
}

// <a href="" onClick={this.handleNewSizeSpecs} value="height">-</a> Height <a href="" onClick={this.handleNewSizeSpecs} value="height" >+</a>
// 				<br />
// 				<a href="" onClick={this.handleNewSizeSpecs} value="width">-</a> Width <a href="" onClick={this.handleNewSizeSpecs} value="width" >+</a>
// 				<br />
// 				<a href="" onClick={this.handleNewSizeSpecs} value="padding">-</a> Padding <a href="" onClick={this.handleNewSizeSpecs} value="padding" >+</a>
// 				<br />
// 				<br />

// THIS GOES INSIDE RENDER RETURN()
