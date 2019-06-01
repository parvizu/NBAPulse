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
			const teamIsHome = this.props.teamSelected === gameDetails.h.ta;
			const opponentAbbr = teamIsHome ? gameDetails.v.ta : gameDetails.h.ta;

			const gameResult = gameDetails.h.s - gameDetails.v.s;

			let classes = classnames({
				'team-games-item': true,
				'team-game-visiting': !teamIsHome,
				'team-game-defeat': (teamIsHome === gameResult < 0) && gameResult !== 0,
				'team-game-victory': (teamIsHome === gameResult > 0) && gameResult !== 0,
				'selected': this.props.gameSelected === gameDetails.gid
				// 'disabled': Objet.keys(gameDetails.data).length === 0
			});

			if (gameResult === 0) {
				// console.log("GAME RESULT", gameResult, "GID", gameDetails.gid, gameDetails.h.s, gameDetails.v.s);
				// console.log("HOME", gameDetails.h);
				// console.log("VISITING", gameDetails.v);
			}


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
			<div className="games-list">{ this.getGames() }</div>
		);
	}

}
