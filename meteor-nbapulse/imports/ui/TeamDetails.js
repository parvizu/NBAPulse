import React, { Component } from 'react';
import classnames from 'classnames';

export default class TeamDetails extends Component {
	
	constructor(props) {
		super(props);

		this.getTeamPlayers = this.getTeamPlayers.bind(this);
		this.handleSelectTeamPlayer = this.handleSelectTeamPlayer.bind(this);
	}

	handleSelectTeamPlayer(e) {
		e.preventDefault();
		const playerId = e.target.attributes['data-playerid'].value;
		const playerNum = parseInt(e.target.attributes['data-playernum'].value);
		const teamType = e.target.attributes['data-team'].value;

		this.props.onSelectPlayer(teamType,playerNum);
	}

	getTeamPlayers(roster, team) {
		if (typeof roster === 'undefined') {
			return;
		}

		return roster.map((player,i) => {
			// let imgUrl = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/"+player.playerId+".png";

			const classes = classnames({
				'team-details-player-item': true,
				'selected': this.props.playersSelected.indexOf(i) > -1
			});

			return (
				<li 
					key={'team-roster-'+player.playerId}
					className={classes}
					data-playerid={player.playerId}
					data-playernum={i}
					data-team={team}
					onClick={this.handleSelectTeamPlayer} >
						{player.playerName}
				</li>
			);
		});
	}


	render() {

		const containerClasses = classnames({
			"team-details": true,
			"team-home": this.props.type === 'home',
			"team-away": this.props.type === 'away'
		});

		const logoClasses = classnames(
			'game-details-team-logo',
			this.props.team.teamKey
		);

		return (
			<div className={containerClasses}>
				<div className={logoClasses}>
					<div className="team-players-list">
						{this.getTeamPlayers(this.props.team.players, this.props.team.teamKey)}
					</div>
				</div>
			</div>
		);
	}
}