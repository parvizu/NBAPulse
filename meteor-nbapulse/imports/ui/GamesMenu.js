import React, { Component } from 'react';
import classnames from 'classnames';

export default class GamesMenu extends Component {
	
	constructor(props) {
		super(props);

		this.handleSelectGame = this.handleSelectGame.bind(this);
		this.getRounds = this.getRounds.bind(this);
	}

	handleSelectGame(e) {
		e.preventDefault();

		const gid = e.target.attributes['data-game'].value;
		if (gid !== this.props.gameSelected) {
			this.props.onSelectGame(gid);
		}
	}

	getRounds() {

		let rounds = [];
		const gameRounds = {
			'1': { 'label': 'First Round', 'games': [] },
			'2': { 'label': 'Conference Semifinals', 'games': [] },
			'3': { 'label': 'Conference Finals', 'games': [] },
			'4': { 'label': 'NBA Finals', 'games': [] }
		};

		if (this.props.gamesList.length > 0) {
			this.props.gamesList.forEach(gameDetails => {
				const round = gameDetails.gid.charAt(7);
				gameRounds[round]['games'].push(gameDetails);
			});

			Object.keys(gameRounds).forEach(round => {
				if (gameRounds[round]['games'].length > 0) {
					rounds.push(
						<div className="playoff-series">
							<div className="series-label">{gameRounds[round]['label']}</div>
							<div className="series-games">{this.getRoundGames(gameRounds[round]['games'])}</div>
						</div>
					);
				}
			});

			return rounds;
		}

	}

	getRoundGames(roundGames) {
		const gameList = roundGames.map(gameDetails => {
			const teamIsHome = this.props.teamSelected === gameDetails.h.ta;
			const opponentAbbr = teamIsHome ? gameDetails.v.ta : gameDetails.h.ta;

			const gameResult = gameDetails.h.s - gameDetails.v.s;

			let classes = classnames({
				'team-games-item': true,
				'team-game-visiting': !teamIsHome,
				'team-game-defeat': (teamIsHome === gameResult < 0) && gameResult !== 0,
				'team-game-victory': (teamIsHome === gameResult > 0) && gameResult !== 0,
				'selected': this.props.gameSelected === gameDetails.gid,
				'new-series': gameDetails.gid.charAt(9) === '1' && this.props.calendarType === 'playoffs'
				// 'disabled': Objet.keys(gameDetails.data).length === 0
			});

			console.log("new series?", gameDetails.gid.charAt(9), gameDetails.gid.charAt(9) === '1')

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
			<div className="games-list">
				{ this.getRounds() }
			</div>
		);
	}

}
