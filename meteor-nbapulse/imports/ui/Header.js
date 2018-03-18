import React, { Component } from 'react';

import TeamsMenu from './TeamsMenu.js';
import GamesMenu from './GamesMenu.js';

import styles from '../css/Header.css';

export default class Header extends Component {
	
	constructor(props) {
		super(props);

		this.getTeamsMenu = this.getTeamsMenu.bind(this);
		this.getGamesMenu = this.getGamesMenu.bind(this);

	}

	getTeamsMenu() {
		// Making sure that the needed collections have been loaded correctly
		if (typeof this.props.leagueDetails !== 'undefined') {
			
			return (
				<TeamsMenu
					teamSelected={this.props.teamSelected} 
					teamList={this.props.leagueDetails.teamsAbbr}
					gamesData={this.props.teamGames}
					onSelectGame={this.props.onSelectGame} 
					onSelectTeam={this.props.onSelectTeam} 
					/>
			);
		}
	}

	getGamesMenu() {
		return (
			<GamesMenu
				teamSelected={this.props.teamSelected}
				onSelectGame={this.props.onSelectGame}
				gameSelected={this.props.gameSelected}
				/>
		)
	}

	render() {
		return (

			<div id="header">
				<div id="updated">v0.8 (11/17/17)</div>
				<div className="header-top">
					<div className="header-section header-section-left header-top-left">
						<img src="/img/logos/nbaLogo.svg" /> 
						<h1> Game Pulse</h1> 
					</div>
					<div className="header-section header-section-main header-top-main">
						{ this.getTeamsMenu() }
					</div>
				</div>
				<div className="header-bottom">
					<div className="header-section header-section-left header-bottom-left">
						<a href="http://www.parvizu.com" target="_blank" id="madeby">by Pablo Arvizu</a> <a href="https://twitter.com/sirgalahad88" target="_blank" id="twitterLink"><img src="/img/twitter-256.png" /></a>
					</div>
					<div className="header-section header-section-main header-bottom-main">
						{ this.getGamesMenu() }
					</div>
				</div>
				<div className="addthis_sharing_toolbox"></div>
			</div>
		);
	}
}
