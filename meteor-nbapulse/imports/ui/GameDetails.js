import React, { Component } from 'react';
import classnames from 'classnames';

import GameHeader from './GameHeader.js';
import TeamDetails from './TeamDetails.js';

import styles from '../css/GameDetails.css';

export default class GameDetails extends Component {
	
	constructor(props) {
		super(props);

		this.state ={

		}
	}

	render() {

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
					/>
				<TeamDetails 
					team={this.props.awayTeam} 
					type="away"
					playersSelected={this.props.playersSelected.away}
					/>
			</div>
		);
	}
}
