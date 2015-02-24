'use strict';
process.env.MONG_URI = 'mongodb://localhost/charityApp_test';
require('../index');

var chai = require('chai'),
    chaihttp = require('chai-http'),
    expect = chai.expect,
    Chance = require('chance'),
    chance = new Chance(),
    serverUrl = 'localhost:3000/api/v1',
    mongoose = require('mongoose');

chai.use(chaihttp);

function getRandomOrganizerObject() {

    var typeOfOrganizer = ['animal', 'education', 'Christian', 'homelessness'];
    return {
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        username: chance.string(15),
        contactPerson: {
            firstname: chance.string(15),
            lastname: chance.string(15)
        },
        type: typeOfOrganizer[chance.natural({min: 0, max: typeOfOrganizer.length-1})], // type of organization
        mission: chance.paragraph({sentences: 2}),
        address: {
            line: chance.address(),
            state: chance.state(),
            zip: chance.zip()
        },
        phone: chance.phone(),
        createdSince: new Date().toJSON(),
        events: []
    };
}


function getRandomUser() {
    var types = ['volunteer', 'organizer'];
    return {
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        password: chance.string(30),
        role: types[chance.natural({min: 0, max: types.length-1})]
    }
}

describe('organizers api end points', function () {
    var token,
        organizerA = getRandomOrganizerObject(),

        organizerB = getRandomOrganizerObject(),
        organizerC = getRandomOrganizerObject(),
        organizerD = getRandomOrganizerObject(),
        organizerE = getRandomOrganizerObject(),

        userA = getRandomUser(),
        userB = getRandomUser();


    before(function(done) {
        chai.request(serverUrl)
            .post('/create_user')
            .send(userA)
            .end(function(err, res) {
                token = res.body.token;
                done();
            });
    });


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    it('should create a user and return a token', function (done) {
        chai.request(serverUrl)
            .post('/create_user')
            .send(userB)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token');
                done();
            })
    })

    it('should respond to a post request', function (done) {
        chai.request(serverUrl)
            .post('/organizers')
            .send(organizerA)
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnedOrganizer = res.body;
                delete returnedOrganizer._id;
                delete returnedOrganizer.__v;
                expect(returnedOrganizer).to.deep.eql(organizerA);
                done();
            });
    });

    it('should respond to a get request', function (done) {
        chai.request(serverUrl)
            .get('/organizers')
            .send()
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnedorganizer = res.body[0];
                delete returnedorganizer._id;
                delete returnedorganizer.__v;
                expect(returnedorganizer).to.eql(organizerA);
                done();
            });
    });

    it('should not respond to a get request', function (done) {
        chai.request(serverUrl)
            .get('/organizers')
            .send()
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body.msg).to.eql("could not authenticate");
                done();
            });
    });

    describe('delete test without and with token', function() {
        var id;
        before(function (done) {
            chai.request(serverUrl)
                .post('/organizers')
                .send(organizerC)
                .set('token', token)
                .end(function(err, res) {
                    id = res.body._id;
                    done();
                })
        });

        it('should not respond to a delete request without token', function (done) {
            chai.request(serverUrl)
                .delete('/organizers/' + id)
                .send()
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("could not authenticate");
                    done();
                });
        });

        it('should get to the organizerA', function (done) {
            chai.request(serverUrl)
                .get('/organizers')
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    var returnedorganizer = res.body[1];
                    delete returnedorganizer._id;
                    delete returnedorganizer.__v;
                    expect(returnedorganizer).to.eql(organizerC);
                    done();
                });
        });

        it('should get 2 organizers', function (done) {
            chai.request(serverUrl)
                .get('/organizers')
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.length).to.eql(2);
                    done();
                });
        });

        it('should respond to a delete request with token', function (done) {
            chai.request(serverUrl)
                .delete('/organizers/' + id)
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("Your doc has been removed: ID " + id);
                    done();
                });
        });

        it('should get 1 organizer after delete request', function (done) {
            chai.request(serverUrl)
                .get('/organizers')
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.length).to.eql(1);
                    done();
                });
        });
    });



});
