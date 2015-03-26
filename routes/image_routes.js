'use strict';

var Event = require('../models/events'),
    bodyparser = require('body-parser'),
    eatAuth = require('../lib/eat_auth'),
    logger = require('../lib/logger'),
    fs = require('fs'),
    path = './public/images',
    Image = require('../models/images'),
    multiparty=require("multiparty");

module.exports = function (router, appSecret) {
    router.use(bodyparser.json());

    // middleware to log the request, should be placed before those request.
    router.use(logger());

    router.post('/images', eatAuth(appSecret), function (req, res) {
        var newImage = new Image();
        var form=new multiparty.Form();
        form.parse(req,function(err,fields,files){
            var imgE=files.image[0];
            newImage.email=req.user.basic.email;
            newImage.img.data = fs.readFileSync(imgE.path);
            newImage.img.contentType = mime.lookup(imgE.path);
            newImage.save(function (err, picture) {
                if (err) throw err;
            });
            res.redirect('/view');
        });




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

        if (req.user._id != req.params.id) {
            console.log('testing...image');
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        console.log('testing the image routes...');
        fs.readFile('./images/'+ req.params.id + '.png', function (data) {
            res.writeHead(200, {'Content-Type': 'image/png' });
            res.end(data, 'binary');
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
