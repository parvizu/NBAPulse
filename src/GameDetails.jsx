import React, { Component } from 'react';

import styles from './GameDetails.css';

export default class GameDetails extends Component {
	
	constructor(props) {
		super(props);

		this.handleSelectTeamPlayer = this.handleSelectTeamPlayer.bind(this);
		this.getTeamPlayers = this.getTeamPlayers.bind(this);
		this.getScoringBreakdown = this.getScoringBreakdown.bind(this);
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

	getScoringBreakdown() {
		 let breakdown = Object.keys(this.props.scoreBreakdown).map((period) => {
			let periodScore = this.props.scoreBreakdown[period];

			return (
				<div className="period-scoring">
					<div className="period-scoring-section">
						{periodScore.label}
					</div>
					<div className="period-scoring-home period-scoring-section">
						{periodScore.home}
					</div>
					<div className="period-scoring-away period-scoring-section">
						{periodScore.away}
					</div>
				</div>
			);
		});

		breakdown.unshift(<div className="period-scoring">
					<div className="period-scoring-section">
						&nbsp;
					</div>
					<div className="period-scoring-home period-scoring-section">
						{this.props.homeTeam}
					</div>
					<div className="period-scoring-away period-scoring-section">
						{this.props.awayTeam}
					</div>
				</div>);

		return breakdown;
	}

	render() { 
		return (
			<div className="game-menu-container">
				<div className="teams-header">
					<h2 className={"team-name team-name-away "+this.props.awayTeam}>
						<div className="team-name-text">{this.props.awayRoster.teamCity + " " + this.props.awayRoster.teamName}</div>
						<div className={"team-name-logo "+ this.props.awayTeam}></div>
						<div className="team-score team-away-score">{this.props.scoreBreakdown.final.away}</div>
					</h2>
					<h2 className={"team-name team-name-home "+this.props.homeTeam}>
						<div className={"team-name-logo "+this.props.homeTeam}></div>
						<div className="team-name-text">{this.props.homeRoster.teamCity + " " + this.props.homeRoster.teamName}
						</div>
						<div className="team-score team-home-score">{this.props.scoreBreakdown.final.home}</div>
					</h2>
				</div>
				<div className="team-details team-away">
					<div className={'game-details-team-logo ' + this.props.awayTeam}>
						<div className="team-players-list">
							{this.getTeamPlayers(this.props.awayRoster.players,this.props.awayTeam, this.props.awayPlayersSelected)}
						</div>
					</div>
				</div>
				<div className="game-details">
					<div className="period-scoring-container">
						{this.getScoringBreakdown()}
					</div>
				</div>
				<div className="team-details team-home">
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