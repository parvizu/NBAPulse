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
	}

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

