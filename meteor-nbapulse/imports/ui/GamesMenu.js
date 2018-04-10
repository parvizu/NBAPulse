import React, { Component } from 'react';
import classnames from 'classnames';

export default class GamesMenu extends Component {
	
	constructor(props) {
		super(props);

		this.handleSelectGame = this.handleSelectGame.bind(this);
		this.getGames = this.getGames.bind(this);
	}

	handleSelectGame(e) {
		e.preventDefault();

		const gid = e.target.attributes['data-game'].value;
		if (gid !== this.props.gameSelected) {
			this.props.onSelectGame(gid);
		}
	}

	getGames() {
		const gameList = this.props.gamesList.map(gameDetails => {
			let opponentAbbr = this.props.teamSelected === gameDetails.h.ta ? gameDetails.v.ta : gameDetails.h.ta;

			let classes = classnames({
				'team-games-item': true,
				'selected': this.props.gameSelected === gameDetails.gid
				// 'disabled': Objet.keys(gameDetails.data).length === 0
			});

			return (
				<li 
					className={classes}
					onClick={this.handleSelectGame}
					data-game={gameDetails.gid} 
					key={"game-item-"+gameDetails.gid} >
					{opponentAbbr}
				</li>
			);
		});

		return gameList;
	}


	render() {
		return (
			<div>{ this.getGames() }</div>
		);
	}

}
