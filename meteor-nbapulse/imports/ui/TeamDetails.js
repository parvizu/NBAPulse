import React, { Component } from 'react';
import classnames from 'classnames';

export default class TeamDetails extends Component {
	
	constructor(props) {
		super(props);

		this.getTeamPlayers = this.getTeamPlayers.bind(this);
		this.handleSelectTeamPlayer = this.handleSelectTeamPlayer.bind(this);

		this.count =0;
	}

	handleSelectTeamPlayer(e) {
		e.preventDefault();
		const playerId = e.target.attributes['data-playerid'].value,
			  teamType = e.target.attributes['data-team'].value;

		this.props.onSelectTeamPlayer(teamType,playerId);
	}

	getTeamPlayers(roster, team) {
		if (typeof roster === 'undefined') {
			return;
		}

		return roster.map((player) => {
			// let imgUrl = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/"+player.playerId+".png";

			const classes = classnames({
				'team-details-player-item': true,
				'selected': this.props.playersSelected.indexOf(player.playerId.toString()) > -1
			});

			const playerName = player.playerName.split(' ');

			return (
				<li 
					key={'team-roster-'+player.playerId}
					className={classes}
					data-playerid={player.playerId}
					data-playernum={player.playerNum}
					data-team={team}
					onClick={this.handleSelectTeamPlayer} >
						{player.playerNum}
						<p> {playerName[1]}</p>
				</li>
			);
		});
	}


	render() {

		//console.log("RENDERING", "TeamDetails.js", this.count++);
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