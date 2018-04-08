import React, { Component } from 'react';

import styles from '../css/StatControl.css';

export default class StatControl extends Component {
	
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);

		this.count = 0;
	}

	handleClick(e) {
		e.preventDefault();

		let stat = e.target.getAttribute('value');
		this.props.onStatClick([stat]);
	}


	render() {
		//console.log("RENDERING", "StatControl.js", this.count++);
		return (
			<div id="stat-control">
				<div className={"stat stat-made "+this.props.selectedStats.made} value="made" onClick={this.handleClick}>MADE BASKET</div>
				<div className={"stat stat-missed "+this.props.selectedStats.missed} value="missed" onClick={this.handleClick}>MISSED BASKET</div>
				<div className={"stat stat-assist "+this.props.selectedStats.assist} value="assist" onClick={this.handleClick}>ASSISTS</div>
				<div className={"stat stat-rebound "+this.props.selectedStats.rebound} value="rebound" onClick={this.handleClick}>REBOUNDS</div>
				<div className={"stat stat-steal "+this.props.selectedStats.steal} value="steal" onClick={this.handleClick}>STEALS</div>
				<div className={"stat stat-block "+this.props.selectedStats.block} value="block" onClick={this.handleClick}>BLOCKS</div>
				<div className={"stat stat-turnover "+this.props.selectedStats.turnover} value="turnover" onClick={this.handleClick}>TURNOVERS</div>
				<div className={"stat stat-foul "+this.props.selectedStats.foul} value="foul" onClick={this.handleClick}>FOULS</div>
			</div>
		);
	}
}