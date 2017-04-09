import React, { Component } from 'react';

import BasketballChart from './charts/BasketballChart';

import gameData from './gameLog-dummy.json';

// const data = [{x:0,y:0},{x:1,y:3},{x:2,y:4},{x:3,y:6},{x:4,y:9},{x:5,y:-5},{x:6,y:-2}];

// const data2 = [{x:0,y:45},{x:1,y:300},{x:2,y:76},{x:3,y:150},{x:4,y:-51}];

export default class Root extends Component {

	constructor(props) {
		super(props);

		this.state = {
			specs: {
				width: 650,
				height: 300,
				padding: 25,
				xParam: 'sec',
				yParam: 'dif'
			},
			data: gameData
		};

		this.handleNewSizeSpecs = this.handleNewSizeSpecs.bind(this);
	}

	handleNewSizeSpecs(e) {
		e.preventDefault();

		const newSpecs = this.state.specs;
		const attr = e.target.getAttribute('value');

		let newValue = attr === 'padding' ? 5 : 10;
		
		if (e.target.text === '-')
			newValue = newValue * -1;

		newSpecs[attr] = newSpecs[attr] + newValue;

		this.setState({
			specs: newSpecs
		});
	}

	render() {
		return (
			<div>
				<h1> Line Chart </h1>
				<a href="" onClick={this.handleNewSizeSpecs} value="height">-</a> Height <a href="" onClick={this.handleNewSizeSpecs} value="height" >+</a>
				<br />
				<a href="" onClick={this.handleNewSizeSpecs} value="width">-</a> Width <a href="" onClick={this.handleNewSizeSpecs} value="width" >+</a>
				<br />
				<a href="" onClick={this.handleNewSizeSpecs} value="padding">-</a> Padding <a href="" onClick={this.handleNewSizeSpecs} value="padding" >+</a>
				<br />
				<BasketballChart gameLog={this.state.data.gameLog} specs={this.state.specs} />
			</div>
		);
	}
	
}