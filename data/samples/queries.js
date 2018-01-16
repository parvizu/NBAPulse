QUERIES

// Russell Westbrook Game Stats 2016-17 
// PlayerID = 201566

fetch("http://stats.nba.com/stats/playergamelog?PlayerID=201566&Season=2016-17&SeasonType=Regular%20Season")
  .then(resp => resp.json())
  .then(data => console.log(data))

 fetch("http://stats.nba.com/stats/playbyplayv2?GameID=0041600165&StartPeriod=00&EndPeriod=05")
  .then(resp => resp.json())


// <h3> Game 2 Matchup </h3>
		// {this.getGameMatchup(seriesFiles.OKCvHOU[1],okcPlayers,houPlayers)}
		// <hr />
		// <h3> Russell Westbrook </h3>
		// { this.getPlayerInSeries(201566,"Russell Westbrook", seriesFiles.OKCvHOU) }
		// <br />
		// <h3> James Harden </h3>
		// { this.getPlayerInSeries(201935,"James Harden", seriesFiles.OKCvHOU) }




		// <h3> Game 1 Matchup </h3>
				// {this.getGameMatchup(seriesFiles.GSWvPOR[0],gswPlayers,porPlayers)}


		// { this.getPlayerInSeries(bosPlayers[0].playerId,bosPlayers[0].playerName, seriesFiles.BOSvWIZ) }
		// {this.getGameMatchup(seriesFiles.BOSvWIZ[1],bosPlayers,[])}


		// <CordChart timeLog={this.timeLog}
		// 	specs={this.props.specs}
		// 	playerId={player.playerId}
		// 	playerLog={playerLog}
		// 	label={player.playerName}
		// 	key={"cord_" + player.playerId}
		// 	selectedStats={this.getSelectedStats()}
		// 	periods={seriesGameRawData.parameters.EndPeriod}
		// 	/>

						// <hr />
				// <h3> { houPlayers[0].playerName } </h3>
				// { this.getPlayerInSeries(houPlayers[0].playerId,houPlayers[0].playerName, seriesFiles.SASvHOU) }
