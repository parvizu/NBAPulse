import React, { Component } from 'react';
import ReactFauxDom from 'react-faux-dom';

const d3 = require('d3');

import styles from './PulseChart.css';


export default class CordChart extends Component {
	
	constructor(props) {

		super(props);

		this.getStatSeries = this.getStatSeries.bind(this);
		this.createChart = this.createChart.bind(this);
	}

	getStatSeries(stat) {
		const stats = this.props.playerLog.filter((moment) => {
			if (stat === 'made') {
				return moment.playText === 'made-fg' || moment.playText === 'made-ft' || moment.playText === 'made-3pt';
			} else if (stat === 'missed') {
				return moment.playText === 'missed-fg' || moment.playText === 'missed-ft' || moment.playText === 'missed-3pt';
			} else {
				return moment.playText === stat;	
			}
		});
		return stats;
	}



	createChart() {
		const node = ReactFauxDom.createElement('div');

		const { width, height, padding, xParam, yParam } = this.props.specs;

		const chartHeight = this.props.height ? this.props.height: height;
		
		// Scales & Axis definition
		const xScale = d3.scale.linear()
			.domain([0,this.props.timeLog.length])
			.range([0, width-5]);

		const yScale = d3.scale.ordinal()
			.domain(this.props.selectedStats)
			.rangeBands([0,chartHeight],.1,.1);

		const barHeight = yScale.rangeBand();

		const svg = d3.select(node).append('svg')
			.attr({
				class: 'cord-chart',
				width: width,
				height: chartHeight
			});

		// TODO: Hardcoding for. Eventually will need to dinamically create them from the game specs. 
		// 		i.e. if the game went to overtime.
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

		// Adding statistic cords
		const line = d3.svg.line()
			.x(d => {
				return d.x;
			})
			.y(d => {
				return d.y;
			});

		this.props.selectedStats.forEach(stat => {
			let stringLine = []			
			stringLine.push({
				x: xScale(1),
				y: yScale(stat)+barHeight/2
			});
			stringLine.push({
				x: xScale(this.props.timeLog.length),
				y: yScale(stat)+barHeight/2
			});

			svg.append('path')
				.attr({
					class: 'stat-string '+stat,
					d: line(stringLine)
				});
		})


		svg.selectAll('.period-end')
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

		const renderAddStatMoments = (stats,statName) => {
			let moments = svg.selectAll('.event-'+statName)
				.data(stats)
				.enter()
				.append('g')
					.attr({
						class: 'cord-event event-'+statName,
						transform: p => {
							let stat;
							if (p.playText.indexOf('made') !== -1) {
								stat = 'made'
							} else if (p.playText.indexOf('missed') !== -1) {
								stat = 'missed';
							} else {
								stat = p.playText;
							}

							return 'translate('+xScale(p.momentId-6)+','+yScale(stat)+')';
						}
					});

			moments.append('rect')
				.attr({
					class: (p) => {
						return p.playText;
					},
					height: () => {
						return barHeight;
					},
					width: 9
				});

			moments.append('text')
				.attr({
					x: p => {
						if (p.playText === 'rebound') {
							return .5;
						} else {
							return 1.5;
						}
					},
					y: () => {
						return barHeight/2;
						// return (barHeight/3) * 2;
					},
					'alignment-baseline': 'middle'
				})
				.text(p =>{
					if (p.playText.indexOf('fg') !== -1) {
						return '2';
					} else if ( p.playText.indexOf('3pt') !== -1) {
						return '3';
					} else if (p.playText.indexOf('ft') !== -1) {
						return '1';
					} 
					return null;
				});
		}

		this.props.selectedStats.forEach((stat) => {
			let stats = this.getStatSeries(stat)
			renderAddStatMoments(stats,stat);
		});

		return node.toReact();
	}


	render() {
		return (
			<div>
				<h4 className="chart-label"> {this.props.label} </h4>
				<div className="chart-container">{ this.createChart() }</div>
			</div>
		);
	}
}

