'use strict';

var Event = require('../models/events'),
    bodyparser = require('body-parser'),
    eatAuth = require('../lib/eat_auth'),
    logger = require('../lib/logger'),
    fs = require('fs'),
    path = './public/images',
    Image = require('../models/images');

module.exports = function (router, appSecret) {
    router.use(bodyparser.json());

    // middleware to log the request, should be placed before those request.
    router.use(logger());

    router.post('/images', eatAuth(appSecret), function (req, res) {
        var newImage = new Image();
        newImage.email = req.body.email;
        newImage.imgUrl = __dirname + 'public/image/' + req.body.email + '.png';
        newImage.save(function (err, data) {
            if (err) {
                return res.status(500).send({'msg': 'Could not save a blog'});
            }

            res.json(data.email);
        });
    });

    router.get('/images/:id', eatAuth(appSecret), function (req, res) {
        Image.find({email: req.body.id}, function (err, image) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(image.imgUrl);
        });
    });

    router.put('/images/:id', eatAuth(appSecret), function (req, res) {
        var updatedImage = req.body;
        Image.update({email: req.params.id}, updatedImage, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json(updatedImage);
        });
    });

    router.delete('/images/:id', eatAuth(appSecret), function (req, res) {
        Image.remove({email: req.params.id}, function (err, result) {
            if (err) {
                return res.status(500).send({'msg': 'Could not find events'});
            }
            res.json({msg: 'Your doc has been removed: ID ' + req.params.id});
        });
    });
};
