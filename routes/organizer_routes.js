'use strict';

var Organizer = require('../models/organizers'),
    bodyparser = require('body-parser'),
    eatAuth = require('../lib/eat_auth'),
    logger = require('../lib/logger');

module.exports = function (router, appSecret) {
    router.use(bodyparser.json());

    // middleware to log the request, should be placed before those request.
    router.use(logger());

    router.get('/organizers/:id', eatAuth(appSecret), function (req, res) {
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Organizer.findOne({email: req.params.id}, function (err, organizer) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find organizers'});
            }
            res.json(organizer);
        });
    });

    router.put('/organizers/:id', eatAuth(appSecret), function (req, res) {
        var updatedOrganizer = req.body;
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Organizer.update({email: req.params.id}, updatedOrganizer, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find organizers'});
            }
            res.json(updatedOrganizer);
        });
    });

    router.delete('/organizers/:id', eatAuth(appSecret), function (req, res) {
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Organizer.remove({email: req.params.id}, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find organizers'});
            }
            res.json({msg: 'Your doc has been removed: ID ' + req.params.id});
        });
    });


};
