import React, { Component } from 'react';
import classnames from 'classnames';

export default class GameHeader extends Component {
	
	constructor(props) {
		super(props);


		this.state ={

		}
	}

	render() {

		return (
			<div className="teams-header">
				<h2 className={"team-name team-name-away "+this.props.awayTeam.teamKey}>
					<div className="team-name-text">{this.props.awayTeam.teamCity + " " + this.props.awayTeam.teamName}</div>
					<div className={"team-name-logo "+ this.props.awayTeam.teamKey}></div>
					
				</h2>
				<h2 className={"team-name team-name-home "+this.props.homeTeam.teamKey}>
					<div className={"team-name-logo "+this.props.homeTeam.teamKey}></div>
					<div className="team-name-text">{this.props.homeTeam.teamCity + " " + this.props.homeTeam.teamName}
					</div>
					
				</h2>
			</div>
		);
	}
}
// <div className="team-score team-away-score">{this.props.scoreBreakdown.final.away}</div>

// <div className="team-score team-home-score">{this.props.scoreBreakdown.final.home}</div>