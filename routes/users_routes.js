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
        var newUser = new User(req.body.credential);
        User.findOne({'basic.email': newUser.basic.email}, function(err, result) {
            if (err) {
                return res.status(500).send({msg: 'can not create user'});
            }
            if (result) {
                return res.status(500).send({msg: 'user exists'});
            }
            newUser.basic.password = newUser.generateHashedPassword(newUser.basic.password);
            newUser.save(function (err, user) {
                if (err) return res.status(500).send({msg: 'can not create user'});
                user.generateToken(appSecret, function (err, token) {
                    if (err) return res.status(500).send({msg: 'can not generate token'});

                    var newVolunteer = new Volunteer(req.body.profileInfo);
                        newVolunteer.save(function (err, volunteer) {
                            if (err) //throw err;
                                return res.status(500).send({'msg': 'could not save volunteer'});
                            res.json({
                                token: token,
                                profileInfo: volunteer
                            });
                        });
                });
            });

        });

    });

    app.get('/sign_in', passport.authenticate('basic', {session: false}), function (req, res) {
        req.user.generateToken(appSecret, function (err, token) {
            if (err) return res.status(500).send({msg: 'could not generate token'});
            if (req.user.role === 'volunteer') {
                Volunteer.findOne({email:req.user.basic.email}, function(err, volunteer){
                    if(err) {
                        return res.status(500).send({msg: 'can not login user'});
                    }
                   res.json({
                       token: token,
                       profileInfo: volunteer
                   });
                });
            }
        });
    });
};