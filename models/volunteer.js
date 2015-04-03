'use strict';

var mongoose = require('mongoose'),
    volunteerSchema = new mongoose.Schema({
        email: String,
        phone: String,
        role: {type: String, default: 'volunteer'},
        name: {
            firstname: String,
            lastname: String
        },
        imgUrl: {type: String, default: 'http://google.com/help/hc/images/helpouts/helpouts_icon_full_color.png'},
        city: String,
        bio: String,
        causes: String,
        skills: String,
        createdSince: String
        //events: {type: [String]}
    });

module.exports = mongoose.model('volunteer', volunteerSchema);


