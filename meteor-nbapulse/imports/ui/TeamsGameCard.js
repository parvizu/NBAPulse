import React, { Component } from 'react';
import classNames from 'classnames';

import styles from '../css/GameCard.css';

export default class TeamsGameCard extends Component {
	constructor(props) {
		super(props);
	}



	render() {

		const homeClasses = classNames(
				'game-card-team',
				'game-card-team-home',
				'team-bg',
				this.props.home.teamKey
			);
		const awayClasses = classNames(
				'game-card-team',
				'game-card-team-away',
				'team-bg',
				this.props.away.teamKey
			);

		return (
			<div className="chart-label game-card">
					<div className="scoring-label"> &#8592;  Scoring Margin  &#8594;</div>
					<div className={homeClasses}>
						<h4 className={"game-card-team-name " +this.props.home.teamKey}>{ this.props.home.teamCity +" "+ this.props.home.teamName}</h4>
					</div>
					<div className={awayClasses}>
						<h4 className={"game-card-team-name " +this.props.away.teamKey}>{ this.props.away.teamCity +" "+ this.props.away.teamName}</h4>
					</div>
			</div>
			
		);
	}


}
