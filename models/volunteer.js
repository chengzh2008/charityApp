'use strict';

var mongoose = require('mongoose');

var volunteerSchema = new mongoose.Schema({

	email :String, // same as userid ???
	name:{	// if same as userid no need of name since it iwll come from username
		firstname:String,
		lastname:String
	},
	age18:String,
	address:{
		line :String,
		state:String,
		zip  :String
	},
	profilepic: {data: Buffer, contentType: String},
	aboutme: String,
 	causes: {type:[String]},
  	skills: {type:[String]},
  	events: {type:[String]}
});

module.exports = mongoose.model('volunteer', volunteerSchema);


