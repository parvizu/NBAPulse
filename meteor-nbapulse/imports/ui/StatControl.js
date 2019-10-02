import React, { Component } from 'react';

import styles from '../css/StatControl.css';

export default class StatControl extends Component {
	
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
		this.handleChartClick = this.handleChartClick.bind(this);
		this.getStatsOption = this.getStatsOption.bind(this);
	}

	handleClick(e) {
		e.preventDefault();

		let stat = e.target.getAttribute('value') !== null ? e.target.getAttribute('value') : e.target.parentElement.getAttribute('value');
		this.props.onStatClick(stat);
	}

	handleChartClick(e) {
		e.preventDefault();
		const chartType = e.target.getAttribute('value');
		this.props.onChangeChartType(chartType);
	}

	getStatsOption(stat, label) {
		return (
			<div className={"stat  "+this.props.selectedStats[stat]} value={stat} onClick={this.handleClick}>
					<div className={"cord stat-"+stat}></div>
					<div className={"rect stat-"+stat}></div>
					<div className="stat-label">{label}</div>
			</div>
		);
	}

	render() {
		//console.log("RENDERING", "StatControl.js", this.count++);

		return (
			<div className="stat-control">
				{this.getStatsOption('made', 'MADE BASKET')}
				{this.getStatsOption('missed', 'MISSED BASKET')}
				{this.getStatsOption('assist', 'ASSISTS')}
				{this.getStatsOption('rebound', 'REBOUNDS')}
				{this.getStatsOption('steal', 'STEALS')}
				{this.getStatsOption('block', 'BLOCKS')}
				{this.getStatsOption('turnover', 'TURNOVERS')}
				{this.getStatsOption('foul', 'FOULS')}
			</div>
		);
	}
}