'use strict';

var mongoose = require('mongoose'),
    eventSchema = new mongoose.Schema({
        eventId: String,
        title: String,
        date: Date,
        time: Date,
        location: String,
        description: String,
        volunteerJobs: [{
            title: String,
            number: Number,
            skills: [String]
        }],
        messages: [{
            username: String,
            body: String,
            date: Date
        }],
        createdSince: { type : Date, default: Date.now },
        closed: Boolean
    });

module.exports = mongoose.model('Event', eventSchema);
