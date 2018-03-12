import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

export default class GamesMenu extends Component {
	
	constructor(props) {
		super(props);

		this.state = {
			gameSelected: '',
			gameList: [],
			teamSelected: ''
		};

		this.loadTeamGames = this.loadTeamGames.bind(this);
		this.handleSelectGame = this.handleSelectGame.bind(this);
		this.getGames = this.getGames.bind(this);
	}

	componentWillMount() {
		this.loadTeamGames();
	}

	loadTeamGames() {
		Meteor.call('loadTeamGames', this.props.teamSelected, (error, results) => {
			console.log(this.props.teamSelected, results);
			this.setState({
				gameSelected: this.props.gameSelected,
				teamSelected: this.props.teamSelected,
				gameList: results
			});	
		});	
	}

	handleSelectGame(e) {
		e.preventDefault();

		const gid = e.target.attributes['data-game'].value;
		if (gid !== this.state.gameSelected) {
			this.props.onSelectGame(gid);
		}
	}

	getGames() {
		if (this.state.teamSelected !== this.props.teamSelected) {
			this.loadTeamGames();
		}

		const gameList = this.state.gameList.map(gameDetails => {
			let opponentAbbr = this.state.teamSelected === gameDetails.h.ta ? gameDetails.v.ta : gameDetails.h.ta;

			return (
				<li 
					className="team-games-item"
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
