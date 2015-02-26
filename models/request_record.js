'use strict';

var mongoose = require('mongoose'),
    requestRecordSchema = new mongoose.Schema({
        method: String,
        url: String,
        time: { type : Date, default: Date.now },
        host: String,
        params: {}
    });

module.exports = mongoose.model('RequestRecord', requestRecordSchema);
