'use strict';

var bodyparser = require('body-parser'),
    User = require('../models/users'),
    Organizer = require('../models/organizers'),
    logger = require('../lib/logger');

module.exports = function (app, passport, appSecret) {
    app.use(bodyparser.json());
    // middleware to log the request, should be placed before those request.
    app.use(logger());

    app.post('/create_user', function (req, res) {
        var newUser = new User();
        newUser.basic.email = req.body.email;
        newUser.basic.password = newUser.generateHashedPassword(req.body.password);
        newUser.role = req.body.role;
        // make it separate request.
        //var newUserProfile = new Organizer();
        //newUserProfile.email = req.body.email;
        //newUserProfile.name = req.body.name;
        //newUserProfile.contactPerson = req.body.contactPerson || {firstname: '', lastname: ''};
        //newUserProfile.type = req.body.type; // type of organization
        //newUserProfile.mission = req.body.type;
        //newUserProfile.address = req.body.address;
        //newUserProfile.phone = req.body.phone;
        //newUserProfile.createdSince = new Date();
        //newUserProfile.events = [];


        newUser.save(function (err, user) {
            if (err) return res.status(500).send({msg: 'can not create user'});
            user.generateToken(appSecret, function (err, token) {
                if (err) return res.status(500).send({msg: 'can not generate token'});
                res.json({token: token});
            });
        });
    });

    app.get('/sign_in', passport.authenticate('basic', {session: false}), function (req, res) {
        req.user.generateToken(appSecret, function (err, token) {
            if (err) return res.status(500).send({msg: 'could not generate token'});
            res.json({token: token});
        });
    });
};