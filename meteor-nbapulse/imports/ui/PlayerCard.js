import React, { Component } from 'react';
import classNames from 'classnames';

import styles from '../css/PlayerCard.css';

export default class PlayerCard extends Component {
	
	constructor(props) {
		super(props);

		this.emptyStats = {
			'points': 0,
			'made-fg': 0,
			'missed-fg': 0,
			'made-3pt': 0,
			'missed-3pt': 0,
			'made-ft': 0,
			'missed-ft': 0,
			'assist': 0,
			'rebound': 0,
			'steal': 0,
			'block': 0,
			'turnover': 0,
			'foul': 0
		}
	}

	render() {

		const imgUrl = 'https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/'+this.props.playerId+'.png';

		const selectedStats = this.props.selectedStats;
		const stats = this.props.playerStats !== null ? this.props.playerStats : this.emptyStats;
		const dnp = this.props.playerStats === null ? 'hidden' : '';

		const classes = classNames(
				'chart-label',
				'player-label',
				this.props.team.teamKey
			);

		return(
			<div className={classes} style={{height: this.props.height+'px'}}>
				<div className={dnp + " player-stats top-section"}>
					<h4>{this.props.label}</h4>
					<div className={dnp + " player-stat player-points " + selectedStats['made']}>
						{stats.points}
						<div className="player-stat-label">POINTS</div>
					</div>
					<img src={imgUrl} />
				</div>
				<div className={dnp + " player-stats bottom-section"}>
					<div className={"player-stat player-fg " + selectedStats['made']}>
						{stats['made-fg']+"/"+(stats['made-fg']+stats['missed-fg'] )}
						<div className="player-stat-label">FG</div>
					</div>
					<div className={"player-stat player-3pt " + selectedStats['made']}>
						{stats['made-3pt']+"/"+(stats['made-3pt']+stats['missed-3pt'] )}
						<div className="player-stat-label">3PT</div>
					</div>
					<div className={"player-stat player-ft " + selectedStats['made']}>
						{stats['made-ft']+"/"+(stats['made-ft']+stats['missed-ft'] )}
						<div className="player-stat-label">FT</div>
					</div>
					<div className={"player-stat player-assists " + selectedStats['assist']}>
						{stats.assist}
						<div className="player-stat-label">AST</div>
					</div>
					<div className={"player-stat player-rebounds " + selectedStats['rebound']}>
						{stats.rebound}
						<div className="player-stat-label">REB</div>
					</div>
					<div className={"player-stat player-steals " + selectedStats['steal']}>
						{stats.steal}
						<div className="player-stat-label">STL</div>
					</div>
					<div className={"player-stat player-blocks " + selectedStats['block']}>
						{stats.block}
						<div className="player-stat-label">BLK</div>
					</div>
					<div className={"player-stat player-turnovers " + selectedStats['turnover']}>
						{stats.turnover}
						<div className="player-stat-label">TOV</div>
					</div>
					<div className={"player-stat player-fouls " + selectedStats['foul']}>
						{stats.foul}
						<div className="player-stat-label">PF</div>
					</div>
				</div>
			</div>
		);
	}


}