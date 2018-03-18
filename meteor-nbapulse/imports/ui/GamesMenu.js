import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import classnames from 'classnames';

export default class GamesMenu extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			gameList: [],
			teamSelected: ''
		};

		this.loadTeamGames = this.loadTeamGames.bind(this);
		this.handleSelectGame = this.handleSelectGame.bind(this);
		this.getGames = this.getGames.bind(this);
	}

	componentWillReceiveProps(newProps) {
		if (this.state.teamSelected !== newProps.teamSelected) {
			this.loadTeamGames(newProps.teamSelected);
		}
	}

	loadTeamGames(teamSelected) {
		Meteor.call('loadTeamGames', teamSelected, (error, results) => {
			this.setState({
				teamSelected: teamSelected,
				gameList: results
			});	
		});
	}

	handleSelectGame(e) {
		e.preventDefault();

		const gid = e.target.attributes['data-game'].value;
		if (gid !== this.props.gameSelected) {
			this.props.onSelectGame(gid);
		}
	}

	getGames() {
		const gameList = this.state.gameList.map(gameDetails => {
			let opponentAbbr = this.state.teamSelected === gameDetails.h.ta ? gameDetails.v.ta : gameDetails.h.ta;

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
