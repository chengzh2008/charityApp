'use strict';

var mongoose = require('mongoose'),
    imageSchema = new mongoose.Schema({
        email: String,
        imgUrl: String
    });

module.exports = mongoose.model('Image', imageSchema);
