import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
const d3 = require('d3');

import styles from './lineChart.css';


export default class LineChart extends Component {
	
	constructor(props) {
		super(props);

		this.createLineChart = this.createLineChart.bind(this);
	}

	createLineChart() {
		const node = ReactFauxDOM.createElement('div');
		const { width, height, padding, xParam, yParam } = this.props.specs;

		// Scales & Axis definition
		const xScale = d3.scale.linear()
			.domain(d3.extent(this.props.data, (d)=>{ return d[xParam]; }))
			.range([padding, width - padding]);

		const yScale = d3.scale.linear()
			.domain(d3.extent(this.props.data, (d)=>{ return d[yParam]; }))
			.range([height - padding, padding]);

		const line = d3.svg.line()
			.x(d => { 
				return xScale(d[xParam])
			})
			.y(d => { 
				return yScale(d[yParam]) 
			});

		// Creating svg container
		const svg = d3.select(node).append('svg')
			.attr({
				width: width,
				height: height,
				class: 'line-chart'
			});

		// Adding line to svg
		svg.append('path')
			.attr({
				d: line(this.props.data),
				class: 'line-chart__path'
			});

		const xAxis = d3.svg.axis()
			.scale(xScale);

		svg.append('g')
			.attr({
				class: 'x axis',
				transform: 'translate(0,'+yScale(0)+')'
			})
			.call(xAxis);

		const yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('left');

		svg.append('g')
			.attr({
				class: 'y axis',
				transform: 'translate('+padding+',0)'
			})
			.call(yAxis);

		return node.toReact();
	}


	render() {

		return (
			<div className="d3-object">
				{ this.createLineChart() }
			</div>
		); 
	}
}