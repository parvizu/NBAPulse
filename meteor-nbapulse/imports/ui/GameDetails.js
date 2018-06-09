import React, { Component } from 'react';
import classnames from 'classnames';

import GameHeader from './GameHeader.js';
import TeamDetails from './TeamDetails.js';
import GameScoringBreakdown from './GameScoringBreakdown.js';

import styles from '../css/GameDetails.css';

export default class GameDetails extends Component {
	
	constructor(props) {
		super(props);

		this.state ={

		}

		this.shouldShowBanner = this.shouldShowBanner.bind(this);
	}

	shouldShowBanner() {

		let logoImg = "/img/logos/playoffsLogo.png";
		if (this.props.gameDetails.gid >= '0041700401') {
			logoImg = "/img/logos/nbafinalslogo.png";
		}

		return (
			<div className="game-banner">
				<img src={logoImg} />
			</div>
		);
	}

	render() {
		//console.log("RENDERING", "GameDetails.js", this.count++);
		return (
			<div>
				{ this.shouldShowBanner() }
				<GameHeader 
					homeTeam={this.props.homeTeam}
					awayTeam={this.props.awayTeam}
					scoreBreakdown={this.props.scoreBreakdown}
					/>

				<TeamDetails 
					team={this.props.homeTeam} 
					type="home"
					playersSelected={this.props.playersSelected.home}
					onSelectTeamPlayer={this.props.onSelectTeamPlayer}
					/>
				<div className="game-details">
					<div className="game-details-information">
						<div className="game-details-info-section game-details-date">
							{ this.props.gameDetails.gdte }
						</div>
						<div className="game-details-info-section game-details-arena">
							{ this.props.gameDetails.an }
						</div>
						<div className="game-details-info-section game-details-location">
							{ this.props.gameDetails.ac }, { this.props.gameDetails.as }
						</div>
					</div>
					<GameScoringBreakdown
					homeTeam={this.props.homeTeam.teamKey}
					awayTeam={this.props.awayTeam.teamKey}
					scoreBreakdown={this.props.scoreBreakdown}
					/>
				</div>
				<TeamDetails 
					team={this.props.awayTeam} 
					type="away"
					playersSelected={this.props.playersSelected.away}
					onSelectTeamPlayer={this.props.onSelectTeamPlayer}
					/>
			</div>
		);
	}
}
