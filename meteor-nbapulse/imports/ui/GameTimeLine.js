import React, { Component } from 'react';
import ReactFauxDOM from 'react-faux-dom';
import classNames from 'classnames';
import d3 from 'd3';

import styles from '../css/GameTimeLine.css';

export default class GameTimeLine extends Component {
	
	constructor(props) {
		super(props);

		this.buildTimeLine = this.buildTimeLine.bind(this);
		this.handleQuarterFilter = this.handleQuarterFilter.bind(this);
		this.handleFilterSelection = this.handleFilterSelection.bind(this);
	}

	handleQuarterFilter(e) {
		// console.log(e);
		this.props.onFilterSelection(e);
	}

	handleFilterSelection(e) {
		console.log("SELECTED: ", e);

		this.props.onFilterSelection({
			start: e.momentId,
			quarter: e.quarter,
			momentId: e.momentId,
			end: this.props.timeLog.length-1
		});
	}


	buildTimeLine() {
		let quarterLabels = [],
			gameMinutes = [],
			gameMidQuarterMinutes = [],
			periodLabels = [],
			periodBreaks = [];

		const timeLineHeight = (this.props.height/3)*2;

		const node = ReactFauxDOM.createElement('div');
		
		// Scales & Axis definition
		const xScale = d3.scale.linear()
			.domain([0,this.props.timeLog.length])
			.range([0, this.props.specs.width-5]);

		let svg = d3.select(node).append('svg')
			.attr({
				class: 'timeline-chart',
				width: this.props.specs.width,
				height: this.props.height
			});

		// Adding minute ticks to Time line
	
		this.props.timeLog.forEach(moment => {
			if (moment.gameClock.split(':')[1] === '00') {
				if (moment.gameClock !== '0:00') {
					gameMinutes.push({
						gameClock: moment.gameClock,
						quarter:moment.quarter,
						breakType: 'minute',
						momentId: moment.momentId,
					});
				}
			}
		});

		svg.selectAll('.minute')
			.data(gameMinutes)
			.enter()
			.append('rect')
				.attr({
					transform: (m) => {
						const adjustment = m.gameClock !== '6:00' ? (timeLineHeight+timeLineHeight/3) : timeLineHeight;
						return 'translate('+xScale(m.momentId)+','+adjustment+')';
					},
					class: 'minute',
					height: (m) => {
						// const adjustment = m.gameClock !== '6:00' ? (this.props.height/3) : 0;
						return timeLineHeight;
					}
				});


		// Adding thicker ticks for Period Breaks
		periodBreaks.push({
				gameClock: '12:00',
				quarter:1,
				breakType: 'quarter',
				momentId: 0,
			});

		for (let i = 1; i<=this.props.periods; i++) {
			if ( i <=4 ) {
				// half quarter mark
				periodBreaks.push({
					gameClock: '6:00',
					quarter:i,
					breakType: 'mid-quarter',
					momentId: i>1 ? ((i*2)-1) * 361 : 361,
				});
				// end quarter mark
				periodBreaks.push({
					gameClock: '0:00',
					quarter:i,
					breakType: (i%2) === 0 ? 'quarter' : 'half',
					momentId: 721 * i,
				});

				quarterLabels.push({
					quarter: i,
					momentId: i>1 ? ((i*2)-1) * 361 : 361,
					start: 721 * (i-1),
					end: (721 * (i))
				});

			} else {
				// overtime end quarter mark
				periodBreaks.push({
					gameClock: '0:00',
					quarter:i,
					breakType: 'quarter',
					momentId: (721*4) + ((i-4) * 301),
				});

				quarterLabels.push({
					quarter: i,
					momentId: (721*4) + ((i-4) * 301),
					start: (721*4) + (((i-1)-4) * 301),
					end: (721*4) + (((i)-4) * 301)

				});
			}
		}

		svg.selectAll('.period-end')
			.data(periodBreaks)
			.enter()
			.append('rect')
				.attr({
					transform: (b) => {
						return 'translate('+xScale(b.momentId)+','+timeLineHeight+')';
					},
					class: (b) => {
						return 'period-end ' + b.breakType;
					},
					height: timeLineHeight
				});


		// Adding Quarter labels
		svg.selectAll('rect.period-label')
			.data(quarterLabels)
			.enter()
			.append('text')
				.attr({
					class: (b) => {
						return 'period-label'
					},
					transform: b => {
						// Checking if quarter is OT for center alignment.
						const momentId = b.quarter > 4 ? b.momentId-150 : b.momentId;
						return 'translate('+ (xScale(momentId)) +',12)';
					}
				})
				.text((b) => {
					if (b.quarter === 1) {
						return '1st Quarter';
					} else if (b.quarter === 2) {
						return '2nd Quarter';
					} else if (b.quarter === 3) {
						return '3rd Quarter';
					} else if (b.quarter === 4) {
						return '4th Quarter';
					} else {
						return 'OT'+(b.quarter - 4);
					}
				}).on('click',(e) => {
					this.handleQuarterFilter(e);
				});

		// Adding sections for selections
		svg.selectAll('g.filter-moment')
			.data(this.props.timeLog)
			.enter()
			.append('g')
				.attr({
					class: 'filter-moment',
					transform: b => {
						return 'translate('+(xScale(b.momentId))+',20)';
					}
				}).on('click', (e) => {
					this.handleFilterSelection(e);
				});

		svg.selectAll('g.filter-moment').append('rect')
			.attr({
				width: 2,
				height: this.props.height-20,
				fill: 'transparent',
			})

		// svg.selectAll('g.filter-moment').append('circle')
		// 	.attr({
		// 		r: 5,
		// 		cx: 1,
		// 		fill: 'transparent'
		// 	});


		return node.toReact();
	}

	render() {

		return (
			<div className="game-time-line">
				<div className="time-axis-labels"></div>
				<div className='time-axis-container'>
					{ this.buildTimeLine() }
				</div>
			</div>
		);
	}
}