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

    router.put('/events/:id', eatAuth(appSecret), function (req, res) {
        var updatedEvent = req.body;
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Event.update({organizerId: req.params.id}, updatedEvent, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(updatedEvent);
        });
    });

    router.delete('/events/:id', eatAuth(appSecret), function (req, res) {
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Event.remove({organizerId: req.params.id}, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json({msg: 'Your doc has been removed: ID ' + req.params.id});
        });
    });
};
