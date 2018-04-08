import React from 'react';
import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';
import {Games, Schedule, Teams, League } from '../imports/api/collections.js';

import NBAPulse from '../imports/ui/NBAPulse.js';

Meteor.startup(() => {
	if (Meteor.isClient) {
		ReactDOM.render(<NBAPulse />, document.getElementById('app-container'));
	}
});
