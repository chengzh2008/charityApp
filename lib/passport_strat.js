'use strict';

var BasicStrategy = require('passport-http').BasicStrategy,
    User = require('../models/users');

module.exports = function (passport) {
    passport.use('basic', new BasicStrategy({}, function (email, password, done) {
        //console.log("email ", email, "password ", password);

        User.findOne({'basic.email': email}, function (err, user) {
            if (err) return done('could not authenticate');
            if (!user) return done('could not authenticate');
            if (!user.validPassword(password)) return done('could not authenticate');
            console.log('user logggined in', user);
            return done(null, user);
        })
    }))

};
