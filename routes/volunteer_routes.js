'use strict';
var Volunteer = require('../models/volunteer.js'),
    bodyparser = require('body-parser'),
    eat_auth = require('../lib/eat_auth');

module.exports = function (vol_router, appSecret) {

    vol_router.use(bodyparser.json());

    // PUT - replace existing object
    vol_router.put('/volunteers/:id', eat_auth(appSecret), function (req, res) {
        console.log(req.params.id);
        var updateVolunteer = req.body;
        if (req.user._id != req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        } else {
            Volunteer.update({email: req.user.basic.email}, updateVolunteer, function (err) {
                if (err) {
                    return res.status(500).send({'msg': 'could not save volunteer'});
                }
                res.json(updateVolunteer);
            });
        }
    });

    // GET
    vol_router.get('/volunteers/:id', eat_auth(appSecret), function (req, res) {
        console.log(req.params.id);
        if (req.user._id != req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Volunteer.findOne({email: req.user.basic.email}, function (err, volunteer) {
            if (err) {
                return res.status(500).send({'msg': 'could not retrieve volunteer'});
            }
            res.json(volunteer);
        });
    });

    // DELETE
    vol_router.delete('/volunteers/:id', eat_auth(appSecret), function (req, res) {
        var query = {'email': req.params.id};
        if (req.user.basic.email !== req.params.id) {
            return res.status(500).send({'msg': 'unauthorized request'});
        }
        Volunteer.remove(query, function (err) {
            if (err) {
                return res.status(500).send({'msg': 'could not delete volunteer'});
            } else {
                Volunteer.find(query, {'email': req.params.id, _id: 0}, function (err, data) {
                    if (err) {
                        return res.status(500).send({'msg': 'could not retrieve volunteer'});
                    }
                    res.json(data);
                });
            }
        });
    });
};
