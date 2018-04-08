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

		this.count = 0;
	}

	render() {
		//console.log("RENDERING", "GameDetails.js", this.count++);
		return (
			<div>
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
				<GameScoringBreakdown
					homeTeam={this.props.homeTeam.teamKey}
					awayTeam={this.props.awayTeam.teamKey}
					scoreBreakdown={this.props.scoreBreakdown}
					/>
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
