import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import styles from '../css/Footer.css';


export default class Footer extends Component {
	
	constructor(props) {
		super(props);

	}

	render() {
		return (
			<div className="sticky-footer-container">
				<div className="sticky-footer">
					<div>
						<a href="https://twitter.com/sirgalahad88" className="twitter-follow-button" data-show-count="false">Follow @sirgalahad88</a>
					</div>
					<div className="sharing-section">
						<input type="text" name="shared-field" />
						<a href="">COPY URL</a>
					</div>
					<div className="social-buttons">

					</div>
					<div>
						Logos and images are property of the ©NBA
					</div>
				</div>
			</div>
		);
	}
}

