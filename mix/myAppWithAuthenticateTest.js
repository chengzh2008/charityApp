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
        orgName: chance.string(15),
        firstname: chance.string(15),
        lastname: chance.string(15),
        type: typeOfOrganizer[chance.natural({min: 0, max: typeOfOrganizer.length - 1})], // type of organization
        mission: chance.paragraph({sentences: 3}),
        address: getRandomAddress(),
        city: chance.string(9),
        phone: chance.phone(),
        website: chance.url(),
        createdSince: new Date().toJSON(),
        events: [chance.string(15), chance.string(15)]
    };
}

function getRandomAddress() {
    return chance.address() + ' ' + chance.state() + ' ' + chance.zip();
}


function getRandomUser() {
    var types = ['volunteer', 'organizer'];
    return {
        basic: {
            email: chance.string(10) + '@' + chance.string(5) + '.com',
            password: chance.string(30)
        },
        role: types[chance.natural({min: 0, max: types.length - 1})]
    }
}



function getRandomEvent() {
    return {
        eventId: chance.string(20),
        organizerId: chance.string(15),
        volunteerId: chance.string(15),
        title: chance.string(50),
        date: new Date().toJSON(),
        time: new Date().toJSON(),
        location: chance.string(10),
        description: chance.paragraph({sentences: 2}),
        volunteerJobs: [{
            title: chance.string(),
            number: chance.integer(),
            skills: [chance.string(5)]
        }, {
            title: chance.string(),
            number: chance.integer(),
            skills: [chance.string(5)]
        }],
        messages: [{
            username: chance.string(5),
            body: chance.paragraph({sentences: 1}),
            date: new Date().toJSON()
        }, {
            username: chance.string(5),
            body: chance.paragraph({sentences: 1}),
            date: new Date().toJSON()
        }],
        createdSince: new Date().toJSON(),
        closed: chance.bool()
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
        userB = getRandomUser(),
        userC = getRandomUser(),
        userD = getRandomUser(),
        userE = getRandomUser();
    organizerA.email = userA.email = 'bill@example.com';
    organizerB.email = userB.email = 'bill@example.com';
    organizerC.email = userC.email = 'cathy@example.com';
    organizerD.email = userD.email = 'dana@example.com';
    organizerE.email = userE.email = 'ellen@example.com';

    before(function (done) {
        chai.request(serverUrl)
            .post('/create_user')
            .send(userA)
            .end(function (err, res) {
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
        organizerA.email = userA.email;
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
        organizerA.email = userA.email;
        chai.request(serverUrl)
            .get('/organizers/' + organizerA.email)
            .send()
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnedorganizer = res.body;
                delete returnedorganizer._id;
                delete returnedorganizer.__v;
                expect(returnedorganizer).to.eql(organizerA);
                done();
            });
    });

    it('should not respond to a get request', function (done) {
        chai.request(serverUrl)
            .get('/organizers/' + organizerA.email)
            .send()
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body.msg).to.eql("could not authenticate");
                done();
            });
    });

    describe('delete test without and with token', function () {
        var id;
        organizerC.email = organizerA.email;
        before(function (done) {
            chai.request(serverUrl)
                .post('/organizers')
                .send(organizerC)
                .set('token', token)
                .end(function (err, res) {
                    done();
                })
        });

        it('should not respond to a delete request without token', function (done) {
            chai.request(serverUrl)
                .delete('/organizers/' + organizerA.email)
                .send()
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("could not authenticate");
                    done();
                });
        });

        it('should get to the organizerA', function (done) {
            organizerC.email = organizerA.email;
            chai.request(serverUrl)
                .get('/organizers/' + organizerA.email)
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    var returnedorganizer = res.body;
                    delete returnedorganizer._id;
                    delete returnedorganizer.__v;
                    expect(returnedorganizer).to.eql(organizerC);
                    done();
                });
        });


        it('should respond to a delete request with token', function (done) {
            chai.request(serverUrl)
                .delete('/organizers/' + organizerA.email)
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("Your doc has been removed: ID " + id);
                    done();
                });
        });
    });
});

describe('events api end points', function () {
    var token,
        eventA = getRandomEvent(),
        eventB = getRandomEvent(),
        eventC = getRandomEvent(),
        eventD = getRandomEvent(),
        eventE = getRandomEvent(),

        userA = getRandomUser(),
        userB = getRandomUser();


    before(function (done) {
        chai.request(serverUrl)
            .post('/create_user')
            .send(userA)
            .end(function (err, res) {
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
            .post('/events')
            .send(eventA)
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnedOrganizer = res.body;
                delete returnedOrganizer._id;
                delete returnedOrganizer.__v;
                expect(returnedOrganizer).to.deep.eql(eventA);
                done();
            });
    });

    it('should respond to a get request', function (done) {
        chai.request(serverUrl)
            .get('/events')
            .send()
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnedorganizer = res.body[0];
                delete returnedorganizer._id;
                delete returnedorganizer.__v;
                expect(returnedorganizer).to.eql(eventA);
                done();
            });
    });

    it('should not respond to a get request', function (done) {
        chai.request(serverUrl)
            .get('/events')
            .send()
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body.msg).to.eql("could not authenticate");
                done();
            });
    });

    describe('delete test without and with token', function () {
        var id;
        before(function (done) {
            chai.request(serverUrl)
                .post('/events')
                .send(eventC)
                .set('token', token)
                .end(function (err, res) {
                    id = res.body._id;
                    done();
                })
        });

        it('should not respond to a delete request without token', function (done) {
            chai.request(serverUrl)
                .delete('/events/' + id)
                .send()
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("could not authenticate");
                    done();
                });
        });

        it('should get to the eventA', function (done) {
            chai.request(serverUrl)
                .get('/events')
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    var returnedEvent = res.body[1];
                    delete returnedEvent._id;
                    delete returnedEvent.__v;
                    expect(returnedEvent).to.eql(eventC);
                    done();
                });
        });

        it('should get 2 events', function (done) {
            chai.request(serverUrl)
                .get('/events')
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
                .delete('/events/' + id)
                .send()
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body.msg).to.eql("Your doc has been removed: ID " + id);
                    done();
                });
        });

        it('should get 1 event after delete request', function (done) {
            chai.request(serverUrl)
                .get('/events')
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