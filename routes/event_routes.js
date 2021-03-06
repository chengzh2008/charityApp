'use strict';

var Event = require('../models/events'),
    bodyparser = require('body-parser'),
    eatAuth = require('../lib/eat_auth'),
    logger = require('../lib/logger');

module.exports = function (router, appSecret) {
    router.use(bodyparser.json());

    // middleware to log the request, should be placed before those request.
    router.use(logger());

    router.post('/events', eatAuth(appSecret), function (req, res) {
        var newEvent = new Event(req.body);
        console.log('event object coming form the front', newEvent);
        newEvent.save(function (err, event) {
            if (err) {
                return res.status(500).send({'msg': 'Could not save a blog'});
            }
            res.json(event);
        });
    });

    router.get('/events', eatAuth(appSecret), function (req, res) {

        Event.find({}, function (err, data) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(data);
        });
    });

    router.get('/events/byEventId/:eventId', eatAuth(appSecret), function (req, res) {

        Event.findOne({_id: req.params.eventId}, function (err, data) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }

            res.json(data);
        });
    });

    router.get('/events/organizer/:profileId', eatAuth(appSecret), function (req, res) {

        Event.find({organizerId: req.params.profileId}, function (err, data) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(data);
        });
    });

    router.put('/events/:eventId', eatAuth(appSecret), function (req, res) {
        var updatedEvent = req.body;

        Event.update({_id: req.params.eventId}, updatedEvent, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(updatedEvent);
        });
    });

    router.delete('/events/:eventId', eatAuth(appSecret), function (req, res) {
        Event.remove({_id: req.params.eventId}, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json({msg: 'Your doc has been removed: ID ' + req.params.id});
        });
    });
};
