import React, { Component } from 'react';

import styles from './GameDetails.css';

export default class GameDetails extends Component {
	
	constructor(props) {
		super(props);

		this.handleSelectTeamPlayer = this.handleSelectTeamPlayer.bind(this);
		this.getTeamPlayers = this.getTeamPlayers.bind(this);
	}

	handleSelectTeamPlayer(e) {
		e.preventDefault();
		const playerId = e.target.attributes['data-playerid'].value;
		const playerNum = parseInt(e.target.attributes['data-playerNum'].value);
		const teamType = e.target.attributes['data-team'].value;

		this.props.onSelectPlayer(teamType,playerNum);
	}


	getTeamPlayers(roster, team, selected) {
		return roster.map((player,i) => {
			// let imgUrl = "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/"+player.playerId+".png";
			let classess = 'team-details-player-item';
			classess += selected.indexOf(i)>-1 ? ' selected' : '';
			return (
				<li className={classess}
					data-playerid={player.playerId}
					data-playerNum={i}
					data-team={team}
					onClick={this.handleSelectTeamPlayer} >
						{player.playerName}
				</li>
			);
		});
	}

	render() { 
		return (
			<div className="game-menu-container">
				<div className="team-details">
					<div className={'game-details-team-logo ' + this.props.awayTeam}>
						<div className="team-players-list">
							{this.getTeamPlayers(this.props.awayRoster.players,this.props.awayTeam, this.props.awayPlayersSelected)}
						</div>
					</div>
				</div>
				<div className="game-details">
					<h3>{this.props.awayTeam}</h3> @ 
					<h3>{this.props.homeTeam}</h3>
				</div>
				<div className="team-details">
					<div className={'game-details-team-logo ' + this.props.homeTeam}>
						<div className="team-players-list">
							{this.getTeamPlayers(this.props.homeRoster.players,this.props.homeTeam, this.props.homePlayersSelected)}
						</div>

					</div>
				</div>
			</div>
		);
	}
}