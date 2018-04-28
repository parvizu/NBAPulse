import React, { Component } from 'react';
import classnames from 'classnames';

export default class GameHeader extends Component {
	
	constructor(props) {
		super(props);


		this.state ={
			scoreBreakdown: {
				final: {
					home: "",
					away: ""
				}
			}
		}

		this.count = 0;
	}

	componentWillReceiveProps(newProps) {
		if (this.state.scoreBreakdown.final.home !== newProps.scoreBreakdown.final.home) {
			this.setState({
				scoreBreakdown: newProps.scoreBreakdown
			});
		}
	}

	render() {
		//console.log("RENDERING", "GameHeader.js", this.count++);
		return (
			<div className="teams-header">
				<h2 className={"team-name team-name-away "+this.props.awayTeam.teamKey}>
					<div className="team-name-text">{this.props.awayTeam.teamCity + " " + this.props.awayTeam.teamName}</div>
					<div className={"team-name-logo "+ this.props.awayTeam.teamKey}></div>
					<div className="team-score team-away-score">{this.state.scoreBreakdown.final.away}</div>
					
				</h2>
				<h2 className={"team-name team-name-home "+this.props.homeTeam.teamKey}>
					<div className={"team-name-logo "+this.props.homeTeam.teamKey}></div>
					<div className="team-name-text">{this.props.homeTeam.teamCity + " " + this.props.homeTeam.teamName}
					</div>
					<div className="team-score team-home-score">{this.state.scoreBreakdown.final.home}</div>
					
				</h2>
			</div>
		);
	}
}
