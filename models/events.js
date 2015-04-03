'use strict';

var mongoose = require('mongoose'),
    eventSchema = new mongoose.Schema({
        organizerId: String,
        title: String,
        date: Date,
        time: Date,
        location: String,
        imgUrl: String,
        description: String,
        volunteerJobs: [{
            _id: false,
            title: String,
            skills: [String]
        }],
        messages: [{
            _id: false,
            username: String,
            body: String,
            date: Date
        }],
        createdSince: { type : Date, default: Date.now },
        closed: Boolean
    });

module.exports = mongoose.model('Event', eventSchema);
