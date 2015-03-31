'use strict';

var mongoose = require('mongoose'),
    volunteerSchema = new mongoose.Schema({
        email: String,
        role: {type: String, default: 'volunteer'},
        name: {
            firstname: String,
            lastname: String
        },
        imgUrl: {type: String, default: 'http://google.com/help/hc/images/helpouts/helpouts_icon_full_color.png'},
        ageReq: Boolean,
        city: String,
        bio: String,
        causes: {type: [String]},
        skills: {type: [String]},
        events: {type: [String]},
        avatar: String
    });

module.exports = mongoose.model('volunteer', volunteerSchema);


