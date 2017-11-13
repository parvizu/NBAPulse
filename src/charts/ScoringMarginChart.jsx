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

		// TODO: determine which is the away and which is the home team to define the order and orientation of the chart.
		const determineLimits = () => {
			
			const limits = d3.extent(this.props.scoringLog, d => {
				return d.margin;
			});

			const limit = (limits[0] * -1) > limits[1] ? limits[0] * -1 : limits[1];

			return limit < 8 ? 8 : limit+2;
		}
		const domainLimit = determineLimits();
		const yScale = d3.scale.linear()
			.domain([domainLimit,(domainLimit*-1)])
			.range([0, chartHeight]);

		const line = d3.svg.line()
			.x(d => {
				return xScale(d.momentId);
			})
			.y(d => {
				return yScale(d.margin);
			})
			.interpolate('step-after');

		const svg = d3.select(node).append('svg')
			.attr({
				width: width,
				height: chartHeight,
				class: 'scoring-margin'
			});

		let ticks = domainLimit > 10 ? domainLimit/2 : 8;

		const yAxis = d3.svg.axis()
			.scale(yScale)
			.orient('right')
			.ticks(ticks)
			.innerTickSize([width])
			.outerTickSize([0])
			.tickFormat("");
			
		svg.append('g')
			.attr({
				class: 'y axis axisLeft',
				transform: 'translate(0,0)'
			})
			.call(yAxis)

		// Scoring path
		svg.append('path')
			.attr({
				d: line(this.props.scoringLog),
				class: 'scoring-margin-path'
			});
			
		// Adding tick labels
		yAxis.orient('right')
			.innerTickSize([0])
			.outerTickSize([0])
			.tickFormat(d=>{
				return d >= 0 ? d : d*-1;
			});
		svg.append('g')
			.attr({
				class: 'y axis axisLeftLabels',
				transform: 'translate(0,0)'
			})
			.call(yAxis)
		svg.selectAll('.axisLeftLabels .tick text')
			.attr({
				'transform': d => {
					const yAdjust = d >= 0 ? 4 : -4;
					return 'translate(7,'+ yAdjust+')';
				}
			});

		
		yAxis.orient('left');
		svg.append('g')
			.attr({
				class: 'y axis axisRightLabels',
				transform: 'translate('+xScale(2885)+',0)'
			})
			.call(yAxis);
		svg.selectAll('.axisRightLabels .tick text')
			.attr({
				'transform': d => {
					const yAdjust = d >= 0 ? 4 : -4;
					return 'translate(-5,'+ yAdjust+')';
				}
			});


		// Adding X Axis
		const xAxis = d3.svg.axis()
			.scale(xScale)
			.ticks(0);

		svg.append('g')
			.attr({
				class: 'x axis',
				transform: 'translate(0,'+yScale(0)+')'
			})
			.call(xAxis)
			.selectAll(".tick text")
				.attr({
					transform: 'translate(10,0)'
				});

		

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
				<h4 className="chart-label"> {this.props.label} </h4>
				<div className="chart-container">
					{ this.createChart() }
				</div>
			</div>
		);
	}
}