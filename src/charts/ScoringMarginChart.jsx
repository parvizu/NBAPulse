import React, { Component } from 'react';
import ReactFauxDom from 'react-faux-dom';
const d3 = require('d3');

import styles from './ScoringMarginChart.css';

export default class ScoringMarginChart extends Component {
	
	constructor(props) {

		super(props);

		this.createChart = this.createChart.bind(this);
	}


	createChart() {
		const node = ReactFauxDom.createElement('div');

		const { width, height, padding } = this.props.specs;

		const chartHeight = this.props.height ? this.props.height: height;

		const xScale = d3.scale.linear()
			.domain([0,this.props.timeLog.length])
			.range([0,width-5]);

		const determineLimits = () => {
			
			const limits = d3.extent(this.props.scoringLog, d => {
				return d.margin;
			});

			const limit = (limits[0] * -1) > limits[1] ? limits[0] * -1 : limits[1];

			return [
				limit < 8 ? 8 : limit+2,
				limit < 8 ? -8 : (limit*-1)-2
			]
		}
		const domainLimits = determineLimits();
		const yScale = d3.scale.linear()
			.domain([domainLimits[0],domainLimits[1]])
			.range([0, chartHeight]);

		const line = d3.svg.line()
			.x(d => {
				return xScale(d.momentId);
			})
			.y(d => {
				console.log(d.eventId + " | " + d.momentId + " | " +d.margin);
				return yScale(d.margin);
			})
			.interpolate('step-after');

		const svg = d3.select(node).append('svg')
			.attr({
				width: width,
				height: chartHeight,
				class: 'scoring-margin'
			});

		svg.append('path')
			.attr({
				d: line(this.props.scoringLog),
				class: 'scoring-margin-path'
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
				transform: 'translate(1,0)'
			})
			.call(yAxis);

		//	Adding the quarter breaks
		let periodBreaks = [{
				gameClock: '12:00',
				quarter:1,
				breakType: 'quarter',
				momentId: 0,
			}];

		for (let i = 1; i<=this.props.periods; i++) {
			// half quarter mark
			periodBreaks.push({
				gameClock: '6:00',
				quarter:i+1,
				breakType: 'mid-quarter',
				momentId: i>1 ? ((i*2)-1) * 361 : 361,
			});
			// end quarter mark
			periodBreaks.push({
				gameClock: '0:00',
				quarter:i,
				breakType: (i%2) === 0 ? 'quarter' : 'half',
				momentId: 721 * i,
			})
		}

		svg.selectAll('rect.period-end')
			.data(periodBreaks)
			.enter()
			.append('rect')
				.attr({
					transform: (b) => {
						return 'translate('+xScale(b.momentId)+',0)';
					},
					class: (b) => {
						return 'period-end ' + b.breakType;
					},
					height: chartHeight
				});

		return node.toReact();
	}
	
	render() {
		return (
			<div className="scoring-margin-chart-container">
				<h4 className="chart-label"> Score: </h4>
				<div className="chart-container">
					{ this.createChart() }
				</div>
			</div>
		);
	}
}