import React, {Component} from 'react';
import ReactFauxDom from 'react-faux-dom';

import styles from './PulseChart.css';

const d3 = require('d3');

const headers =["GAME_ID", "EVENTNUM", "EVENTMSGTYPE", "EVENTMSGACTIONTYPE", "PERIOD", "WCTIMESTRING", "PCTIMESTRING", "HOMEDESCRIPTION", "NEUTRALDESCRIPTION", "VISITORDESCRIPTION", "SCORE", "SCOREMARGIN", "PERSON1TYPE", "PLAYER1_ID", "PLAYER1_NAME", "PLAYER1_TEAM_ID", "PLAYER1_TEAM_CITY", "PLAYER1_TEAM_NICKNAME", "PLAYER1_TEAM_ABBREVIATION", "PERSON2TYPE", "PLAYER2_ID", "PLAYER2_NAME", "PLAYER2_TEAM_ID", "PLAYER2_TEAM_CITY", "PLAYER2_TEAM_NICKNAME", "PLAYER2_TEAM_ABBREVIATION", "PERSON3TYPE", "PLAYER3_ID", "PLAYER3_NAME", "PLAYER3_TEAM_ID", "PLAYER3_TEAM_CITY", "PLAYER3_TEAM_NICKNAME", "PLAYER3_TEAM_ABBREVIATION"];

const eventTypes = {
	1: 'fg',
	2: 'fg-miss',
	3: 'free throw',
	4: 'rebound',
	5: 'turnover',
	6: 'foul',
	7: 'violation',
	8: 'substitute',
	9: 'timeout',
	10: '',
	11: '',
	12: 'start-period',
	13: 'end-period'
}

export default class PulseChart extends Component {

	constructor(props) {
		super(props);

		this.state = {
			selectedPlay: {
				momentId: -1,
				fullPlay: ''
			}
		};

		this.handlePlayHover = this.handlePlayHover.bind(this);
	}

	handlePlayHover(momentId,fullPlay) {
		this.setState({
			selectedPlay: {
				momentId: momentId,
				fullPlay: fullPlay
			}
		});
	}

	createPulseChart() {
		const node = ReactFauxDom.createElement('div');

		const { width, height, padding, xParam, yParam } = this.props.specs;

		const chartHeight = this.props.height ? this.props.height: height;
		const barHeight = chartHeight;

		// Scales & Axis definition
		const xScale = d3.scale.linear()
			.domain([0,this.props.timeLog.length])
			.range([0, width-5 ]);

		const svg = d3.select(node).append('svg')
			.attr({
				width: width,
				height: chartHeight,
				class: 'pulse-chart'
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

		// Adding player actions
		svg.selectAll('g.play')
			.data(this.props.playerLog)
			.enter()
			.append('g')
				.attr({
					transform: (p) => {
						return 'translate('+xScale(p['momentId'])+','+((chartHeight/2)-(barHeight/2))+')';
					},
					class: 'play'
				})
				.append('rect')
					.attr({
						class: (p) => {
							let stat = p.playText.split(' ')[0];
							return p.playText +" "+this.props.selectedStats[stat];
						},
						height: barHeight,
						alt: (p) => {
							return p.fullPlay;
						}
					})
			.on('mouseover', (p) => {
				this.handlePlayHover(p.momentId, p.fullPlay);
			})
			.on('mouseout', (p) => {
				this.handlePlayHover(p.momentId, "");
			});



		return node.toReact();
	}


	render() {


		return (
			<div>
				<h4 className="chart-label"> {this.props.label} </h4>
				<div className="chart-container">{ this.createPulseChart() }</div>
				<div id="play-text">{this.state.selectedPlay.fullPlay}</div>
			</div>
		);
	}


}