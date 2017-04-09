import React, { Component } from 'react';
import LineChart from './LineChart';

export default class BasketballChart extends Component {
	
	constructor(props) {
		super(props);


	}


	render() {
		return (
			<LineChart data={this.props.gameLog} specs={this.props.specs} />
		)
	}
}