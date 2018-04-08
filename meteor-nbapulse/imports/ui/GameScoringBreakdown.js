import React, { Component } from 'react';

export default class GameScoringBreakdown extends Component {
	
	constructor(props) {
		super(props);

		this.getScoringBreakdown = this.getScoringBreakdown.bind(this);

		this.count = 0;
	}

	getScoringBreakdown() {
		if (Object.keys(this.props.scoreBreakdown).length === 0) {
			return;
		}

		let breakdown = Object.keys(this.props.scoreBreakdown).map((period) => {
			let periodScore = this.props.scoreBreakdown[period];

			return (
				<div className="period-scoring" key={'breakdown_p'+period}>
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

		breakdown.unshift(<div className="period-scoring" key={'breakdown_pname'}>
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
		//console.log("RENDERING", "GameScoringBreakdown.js", this.count++);
		return(
			<div className="game-details">
				{ this.getScoringBreakdown() }
			</div>
		);
	}
}