import React, { Component } from 'react';

import styles from '../css/TeamsMenu.css';

export default class TeamsMenu extends Component {
	
	constructor(props) {
		super(props);

		// this.handleSelectGame = this.handleSelectGame.bind(this);
		this.handleSelectTeam = this.handleSelectTeam.bind(this);
	}

	handleSelectTeam(e) {
		e.preventDefault();

		let teamAbbr = e.target.attributes['data-team'].value;
		this.props.onSelectTeam(teamAbbr);
		// this.props.getTeamGameList(this.getGames());
	}
	
	// PROBABLY NEEDS TO BE MOVED TO ANOTHER COMPONENT
	/*
	handleSelectGame(e) {
		e.preventDefault();

		let gameKey = e.target.attributes['data-game'].value;
		const gameData = this.props.gamesData[gameKey].data;
		this.props.onSelectGame(gameKey, gameData);
	}

	getGames() {
		const teamSelected = this.props.teamSelected,
			  gameSelected = this.props.gameSelected,
			  teamGames = this.props.gamesData;

		let teamSchedule = Object.keys(teamGames).map(key => {
			let game = teamGames[key],
				homeTeam = game.data.split('_')[2].substr(3,3),
				awayTeam = game.data.split('_')[2].substr(0,3),
				classes = 'team-games-item',
				opponent = awayTeam,
				isHomeGame = 'home',
				isSelectedGame = '',
				awayWatermark = '';

			if (teamSelected !== homeTeam) {
				opponent = homeTeam;
				isHomeGame = 'away';
				awayWatermark = (
					<span className="team-game-item--away-watermark">@</span>
				);
				classes += ' away';
			}

			if (key === gameSelected) {
				classes += ' selected'
			}

			return (
				<li 
					className={classes} 
					onClick={this.handleSelectGame}
					data-game={key} >
						{opponent}
				</li>
			);
		});	
		
		return teamSchedule;
	}
	*/

	getTeams() {
		const teamSelected = this.props.teamSelected;

		let teamList = this.props.teamList.map(team => {
			let classes = 'team-logo';
			if (team === teamSelected) {
				classes += ' selected';
			}

			const teamLogo = '/img/logos/'+team+'.svg';

			return (
				<li key={team +"-menu-logo"}
					className={classes} 
					data-team={team}
					onClick={this.handleSelectTeam} >
					
					<img className="logo" src={teamLogo} alt={team} />
				</li>
			);
		});

		return teamList;
	}


	render() {
	
		return (
			<div className="teams-select-menu-container header-section">
				<div className="teams-menu-list">
					{ this.getTeams() }
				</div>	
			</div>
		);
	}
}

