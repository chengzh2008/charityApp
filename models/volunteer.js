'use strict';

var mongoose = require('mongoose'),
    volunteerSchema = new mongoose.Schema({
        email: String,
        role: {type: String, default: 'volunteer'},
        name: {
            firstname: String,
            lastname: String
        },
        ageReq: Boolean,
        city: String,
        bio: String,
        causes: {type: [String]},
        skills: {type: [String]},
        events: {type: [String]},
        avatar: String
    });

module.exports = mongoose.model('volunteer', volunteerSchema);


