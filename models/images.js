'use strict';

var mongoose = require('mongoose'),
    imageSchema = new mongoose.Schema({
        email: String,
        img: { data: Buffer, contentType: String }
    });

module.exports = mongoose.model('Image', imageSchema);
