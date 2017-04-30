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
		const barHeight = height-10;

		// Scales & Axis definition
		const xScale = d3.scale.linear()
			.domain([0,this.props.timeLog.length])
			.range([0, width-5 ]);

		const svg = d3.select(node).append('svg')
			.attr({
				width: width,
				height: height,
				class: 'pulse-chart'
			});


		// TODO: Hardcoding for. Eventually will need to dinamically create them from the game specs. 
		// 		i.e. if the game went to overtime.
		const periodEnds = [
			{
				gameClock: '12:00',
				quarter:1,
				breakType: 'quarter',
				momentId: 0,
			},
			{
				gameClock: '6:00',
				quarter:1,
				breakType: 'mid-quarter',
				momentId: 360,
			},
			{
				gameClock: '0:00',
				quarter:1,
				breakType: 'quarter',
				momentId: 720,
			},
			{
				gameClock: '6:00',
				quarter:2,
				breakType: 'mid-quarter',
				momentId: 1081,
			},
			{
				gameClock: '0:00',
				quarter:2,
				breakType: 'half',
				momentId: 1441,
			},
			{
				gameClock: '6:00',
				quarter:3,
				breakType: 'mid-quarter',
				momentId: 1802,
			},
			{
				gameClock: '0:00',
				quarter:3,
				breakType: 'quarter',
				momentId: 2163,
			},
			{
				gameClock: '6:00',
				quarter:4,
				breakType: 'mid-quarter',
				momentId: 2523,
			},
			{
				gameClock: '0:00',
				quarter:4,
				breakType: 'half',
				momentId: 2884,
			}
		];


		svg.selectAll('rect.period-end')
			.data(periodEnds)
			.enter()
			.append('rect')
				.attr({
					transform: (b) => {
						return 'translate('+xScale(b.momentId)+',0)';
					},
					class: (b) => {
						// return b.gameClock !== '6:00'? 'period-end '+ b.breakType : b.breakType;
						return 'period-end ' + b.breakType;
					},
					height: height
				});

		// Adding player actions
		svg.selectAll('g.play')
			.data(this.props.playerLog)
			.enter()
			.append('g')
				.attr({
					transform: (p) => {
						return 'translate('+xScale(p['momentId'])+','+((height/2)-(barHeight/2))+')';
					},
					class: 'play'
				})
				.append('rect')
					.attr({
						class: (p) => {
							return p.playText
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