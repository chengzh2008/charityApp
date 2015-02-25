'use strict';

var bodyparser = require('body-parser'),
    User = require('../models/users'),
    Organizer = require('../models/organizers'),
    Volunteer = require('../models/volunteer'),
    logger = require('../lib/logger');


module.exports = function (app, passport, appSecret) {
    app.use(bodyparser.json());
    // middleware to log the request, should be placed before those request.
    app.use(logger());

    app.post('/create_user_volunteer', function (req, res) {
        // credential info from request
        var newUser = new User(req.body.credentialInfo);
        newUser.basic.email = req.body.email;
        newUser.basic.password = newUser.generateHashedPassword(req.body.password);
        newUser.role = req.body.role;

        newUser.save(function (err, user) {
            if (err) return res.status(500).send({msg: 'can not create user'});
            user.generateToken(appSecret, function (err, token) {
                if (err) return res.status(500).send({msg: 'can not generate token'});

                // profileInfo from request
                var newVolunteer = new Volunteer(req.body.profileInfo);
                newVolunteer.save(function (err, volunteer) {
                    if (err) //throw err;
                        return res.status(500).send({'msg': 'could not save volunteer'});
                    res.json({
                        profileInfo: profileInfo,
                        token: token
                    });
                });

            });
        });


    });

    app.post('/create_user_organizer', function (req, res) {
        var newUser = new User();
        newUser.basic.email = req.body.email;
        newUser.basic.password = newUser.generateHashedPassword(req.body.password);
        newUser.role = req.body.role;

        newUser.save(function (err, user) {
            if (err) return res.status(500).send({msg: 'can not create user'});
            user.generateToken(appSecret, function (err, token) {
                if (err) return res.status(500).send({msg: 'can not generate token'});

                    // profileInfo from request
                var newVolunteer = new Volunteer(req.body.profileInfo);
                newVolunteer.save(function (err, volunteer) {
                    if (err) //throw err;
                        return res.status(500).send({'msg': 'could not save volunteer'});
                    res.json({
                        profileInfo: profileInfo,
                        token: token
                    });
                });
            });
        });
    });

    app.get('/sign_in', passport.authenticate('basic', {session: false}), function (req, res) {
        req.user.generateToken(appSecret, function (err, token) {
            if (err) return res.status(500).send({msg: 'could not generate token'});
            var role = req.user.role;
            if (role === 'volunteer') {
                getSignedUser(Volunteer, req, res, token);
            } else {
                getSignedUser(Organizer, req, res, token);
            }
        });
    });
};

function getSignedUser(UserType, req, res, token) {
    UserType.findOne({email: req.user}, function (err, profileInfo) {
        if (err || !profileInfo) {
            return res.status(500).send({'msg': 'Could not find organizers'});
        }
        res.json({
            profileInfo: profileInfo,
            token: token
        });
    });
}