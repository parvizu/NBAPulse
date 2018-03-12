import React from 'react';
import {Meteor} from 'meteor/meteor';
import ReactDOM from 'react-dom';

import NBAPulse from '../imports/ui/NBAPulse.js';

Meteor.startup(() => {
	ReactDOM.render(<NBAPulse />, document.getElementById('app-container'));
});
