'use strict';

var mongoose = require('mongoose'),
    organizerSchema = new mongoose.Schema({
        email: String,
        role:{type: String, default:'organizer'},
        orgName: String,
        firstname: String,
        lastname: String,
        mission: String,
        address: String,
        city: String,
        phone: String,
        type: String,
        website: String,
        createdSince: {type: Date, default: Date.now},
        events: [String]
    });

module.exports = mongoose.model('Organizer', organizerSchema);
