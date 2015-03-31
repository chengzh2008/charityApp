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
        processUser(Volunteer, req, res, appSecret);
    });

    app.post('/create_user_organizer', function (req, res) {
        processUser(Organizer, req, res, appSecret);
    });

    app.get('/sign_in', passport.authenticate('basic', {session: false}), function (req, res) {
        req.user.generateToken(appSecret, function (err, token) {
            if (err) {
                return res.status(500).send({msg: 'could not generate token'});
            }
            if (req.user.role === 'volunteer') {
                getSignedUser(Volunteer, req, res, token);
            } else {
                getSignedUser(Organizer, req, res, token);
            }
        });
    });
};


function getSignedUser(UserType, req, res, token) {
    UserType.findOne({email: req.user.basic.email}, function (err, profileInfo) {
        if (err) {
            return res.status(500).send({msg: 'can not login user'});
        }
        console.log('after signin', profileInfo);
        console.log('after signin', req.user._id);
        console.log('after signin token', token);

        res.json({
            token: token,
            userId: req.user._id,
            profileInfo: profileInfo
        });
    });
}

function processUser(UserType, req, res, appSecret) {
    //console.log('the info from request body....', req.body);
    var newUser = new User(req.body.credential);

    User.findOne({'basic.email': newUser.basic.email}, function (err, result) {
        if (err) {
            return res.status(500).send({msg: 'can not create user'});
        }
        if (result) {
            return res.status(500).send({msg: 'user exists'});
        }
        newUser.basic.password = newUser.generateHashedPassword(newUser.basic.password);
        newUser.save(function (err, user) {
            if (err) {
                return res.status(500).send({msg: 'can not create user'});
            }
            user.generateToken(appSecret, function (err, token) {
                if (err) {
                    return res.status(500).send({msg: 'can not generate token'});
                }
                if(!req.body.profileInfo) {
                    req.body.profileInfo = {
                        email: user.basic.email,
                        role: user.role
                    }
                }
                var newUserProfile = new UserType(req.body.profileInfo);
                newUserProfile.save(function (err, profile) {
                    if (err) {
                        return res.status(500).send({'msg': 'could not save ' + user.role});
                    }
                    res.json({
                        token: token,
                        userId: user._id,
                        profileInfo: profile
                    });
                });
            });
        });
    });
}
