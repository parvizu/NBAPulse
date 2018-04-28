import React, { Component } from 'react';
import classnames from 'classnames';

import styles from '../css/TeamsMenu.css';

export default class TeamsMenu extends Component {
	
	constructor(props) {
		super(props);

		this.handleSelectTeam = this.handleSelectTeam.bind(this);

		this.count = 0;
	}

	handleSelectTeam(e) {
		e.preventDefault();

		let teamAbbr = e.target.attributes['data-team'].value;
		this.props.onSelectTeam(teamAbbr);
	}

	getTeams() {
		const teamSelected = this.props.teamSelected;

		let teamList = this.props.teamList.map(team => {
			const teamLogo = '/img/logos/'+team+'.svg',
				  classes = classnames({
					  'team-logo': true,
					  'selected': team === teamSelected
				  });

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
		//console.log("RENDERING", "TeamsMenu.js", this.count++);
		return (
			<div className="teams-select-menu-container header-section">
				<div className="teams-menu-list">
					{ this.getTeams() }
				</div>	
			</div>
		);
	}
}

