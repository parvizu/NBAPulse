import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import styles from '../css/Footer.css';


export default class Footer extends Component {
	
	constructor(props) {
		super(props);
	}

	getComparinGreatness() {
		const random = Math.floor(Math.random() * Math.floor(2));
		let image = random === 0 ? 'img/comparinggreatness.png' : 'img/comparinggreatness1.png';
		return (
			<img src={image} />
		)

	}

	render() {
		return (
			<div className="footer-container">
				<div>
					<a href="https://twitter.com/arvizualization?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-size="large" data-show-count="false">Follow @arvizualization</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script><br/>
					<a href="https://twitter.com/sirgalahad88?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-size="large" data-show-count="false">Follow @sirgalahad88</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
				</div>
				<div className="social-buttons">
					<div className="addthis_inline_share_toolbox"></div>
				</div>
				<div className="footer-greatness">
					<a href="http://www.morethanjustsports.com/ComparingGreatness" target="_blank">
						Checkout out: &nbsp;<span className="footer-title">Comparing NBA Greatness</span>
						{this.getComparinGreatness()}
					</a>
				</div>
				<div className="footer-copyrights">
					v1.3.6 BETA (06/13/19)<br/><br/>
					Image credits: Logos and images are property of the ©NBA
				</div>
			</div>
		);
	}
}

