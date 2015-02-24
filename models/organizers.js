'use strict';

var mongoose = require('mongoose'),
    organizerSchema = new mongoose.Schema({
        email: String,
        orgName: String,
        firstname: String,
        lastname: String,
        logo: {data: Buffer, contentType: String},
        type: String,
        mission: String,
        address: String,
        city: String,
        phone: String,
        website: String,
        createdSince: {type: Date, default: Date.now}
    });

module.exports = mongoose.model('Organizer', organizerSchema);
