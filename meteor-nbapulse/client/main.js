import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';

import NBAPulse from '../imports/ui/NBAPulse.js';

Meteor.startup(() => {
	render(<NBAPulse />, document.getElementById('app-container'));
});

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

// Template.hello.helpers({
//   counter() {
//     return Template.instance().counter.get();
//   },
// });

// Template.hello.events({
//   'click button'(event, instance) {
//     // increment the counter when button is clicked
//     instance.counter.set(instance.counter.get() + 1);
//   },
// });
