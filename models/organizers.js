'use strict';

var mongoose = require('mongoose'),
    organizerSchema = new mongoose.Schema({
        email: String,
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
        logo: String,
        events: [String]
    });

module.exports = mongoose.model('Organizer', organizerSchema);
