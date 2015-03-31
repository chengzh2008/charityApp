'use strict';

var eat = require('eat'),
    User = require('../models/users');

module.exports = function(appSecret) {
    return function(req, res, next) {
        var token = req.headers.token || req.body.token;
        if (!token) return res.status(403).send({msg: 'could not authenticate'});
        eat.decode(token, appSecret, function(err, decoded) {
            if (err) return res.status(403).send({msg: 'could not authenticate'});

            User.findOne({'basic.email': decoded.email}, function (err, user) {
                if(err)  return res.status(403).send({msg: 'could not authenticate'});
                if (!user) return res.status(403).send({msg: 'could not authenticate'});
                req.user = user; // user is authenticated!
                next();
            });
        });
    };
};