import React, {Component} from 'react';
import classNames from 'classnames';

import styles from '../css/BoxScoreChart.css';

export default class BoxScoreChart extends Component {

	constructor(props) {
		super(props);

		this.processStats = this.processStats.bind(this);
		this.getStatBoxScore = this.getStatBoxScore.bind(this);
	}

	processStats() {
		const log = this.props.playerData.playerLog;
		const stats = ['points', 'made-fg', 'made-3pt', 'made-ft','missed-fg', 'missed-3pt', 'missed-ft', 'assist', 'rebound','steal', 'block','turnover','foul'];
		let playerStats = {};

		stats.forEach(stat => {
			playerStats[stat] = {
				q1:0,
				q2:0,
				q3:0,
				q4:0
			}
		});


		log.forEach(event => {
			const qtr = 'q'+event.quarter;
			if (playerStats[event.playText] === undefined) {
				playerStats[event.playText] = {
					q1:0,
					q2:0,
					q3:0,
					q4:0
				};
			}

			if (playerStats[event.playText][qtr] === undefined) {
				playerStats[event.playText][qtr] = 0;
			}

			if (playerStats['points'][qtr] === undefined) {
				playerStats['points'][qtr] = 0;
			}

			// Calculating points
			if (event.playType === 8) {
				playerStats.points[qtr]+=2;
			} else if (event.playType === 6) {
				playerStats.points[qtr]+=3;
			} else if (event.playType === 4) {
				playerStats.points[qtr]+=1;
			}

			playerStats[event.playText]['q'+event.quarter]+=1;
		});

		return playerStats;
	}


	getStatBoxScore(stat, playerStats, totalStats) {
		if (stat === 'made' || stat === 'missed' || stat === 'undefined') {
			return ;
		}

		
		let classnames = 'player-total-stats ';
		if (stat === 'points') {
			classnames += 'stat-made stat-points';
		} else if (stat === 'made-fg' || stat === 'made-3pt' || stat === 'made-ft') {
			classnames += 'stat-made';
		} else {
			classnames += 'stat-'+stat;
		}

		console.log(stat, playerStats, totalStats);

		if (stat === 'made-fg' || stat === 'made-3pt' || stat === 'made-ft') {
			const sufix = stat.split('-')[1];
			let label = '3 pointers';
			if (sufix === 'fg') {
				label = 'field goals'
			} else if (sufix === 'ft') {
				label = 'free throws'
			}

			return (
				<div className="player-game-stats">
					<div className="player-half-stats">
						<div>{playerStats[stat]['q1']+"/"+(playerStats['missed-'+sufix]['q1']+playerStats[stat]['q1'])}</div>
						<div>{playerStats[stat]['q2']+"/"+(playerStats['missed-'+sufix]['q2']+playerStats[stat]['q2'])}</div>
					</div>
					<div className={classnames}>
						{totalStats[stat]+"/"+(totalStats['missed-'+sufix]+totalStats[stat])}
						<div className="player-stat-label">{label}</div>	
					</div>
					<div className="player-half-stats">
						<div>{playerStats[stat]['q3']+"/"+(playerStats['missed-'+sufix]['q3']+playerStats[stat]['q3'])}</div>
						<div>{playerStats[stat]['q4']+"/"+(playerStats['missed-'+sufix]['q4']+playerStats[stat]['q4'])}</div>
					</div>
				</div>
			)
		}


		return (
			<div className="player-game-stats">
				<div className="player-half-stats">
					<div>{playerStats[stat]['q1']}</div>
					<div>{playerStats[stat]['q2']}</div>
				</div>
				<div className={classnames}>
					{totalStats[stat]}
					<div className="player-stat-label">{stat}</div>	
				</div>
				<div className="player-half-stats">
					<div>{playerStats[stat]['q3']}</div>
					<div>{playerStats[stat]['q4']}</div>
				</div>
			</div>
		)
	}

	render() {
		const playerStats = this.processStats();
		let selectedStats = ['points', 'made-fg','made-3pt','made-ft'].concat(this.props.selectedStats);

		const boxScore = selectedStats.map(stat => {
			return this.getStatBoxScore(stat, playerStats, this.props.playerData.playerStats);
		});

		return (
			<div className="player-boxscore-container">
				{boxScore}
			</div>
		);
	}


}