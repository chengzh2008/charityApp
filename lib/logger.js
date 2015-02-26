'use strict';
var RequestRecord = require('../models/request_record');

//middleware for saving the request history.
module.exports = function() {
    return function(req, res, next) {
        console.log("req info from ios", req)
        var newRequest = new RequestRecord();
        newRequest.method = req.method;
        newRequest.url = req.url;
        newRequest.params = req.params;
        newRequest.save(function(err, data) {
            next();
        })
    };
};