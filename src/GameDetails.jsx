import React, { Component } from 'react';

import styles from './GameDetails.css';

export default class GameDetails extends Component {
	
	constructor(props) {
		super(props);
	}


	render() {
		return (
			<div className="game-menu-container">
				<div className="team-details">
					<div className="game-details-team-logo">
						<img className="" src={this.props.teamsData.teamLogos[this.props.awayTeam]} />
					</div>
				</div>
				<div className="game-details">
					<h3>{this.props.awayTeam}</h3> @ 
					<h3> {this.props.homeTeam}</h3>
				</div>
				<div className="team-details">
					<div className="game-details-team-logo">
						<img className="" src={this.props.teamsData.teamLogos[this.props.homeTeam]} />
					</div>
				</div>
			</div>
		);
	}
}