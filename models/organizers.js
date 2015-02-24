'use strict';

var mongoose = require('mongoose'),
    organizerSchema = new mongoose.Schema({
        email: String,
        username: String,
        contactPerson: {
            firstname: String,
            lastname: String
        },
        logo: {data: Buffer, contentType: String},
        type: {type: String, enum: ['animal', 'education', 'Christian', 'homelessness']}, // type of organization
        mission: String,
        address: {
            line: String,
            state: String,
            zip: String
        },
        phone: String,
        createdSince: {type: Date, default: Date.now},
        events: [eventSchema]
    });

module.exports = mongoose.model('Organizer', organizerSchema);
