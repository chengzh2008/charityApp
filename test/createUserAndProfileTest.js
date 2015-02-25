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
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        password: chance.string(30),
        role: types[chance.natural({min: 0, max: types.length - 1})]
    }
}

function getRandomVolunteerAndProfile() {
    var user = getRandomUser();
    var profile = getRandomVolunteerObject();
    profile.email = user.email;
    return {
        credential: user,
        profile: profile
    }

}

function getRandomVolunteerObject() {
    var typeOfCauses = ['animal', 'education', 'Christian', 'homelessness'];
    return {
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        name: {
            firstname: chance.string(15),
            lastname: chance.string(15)
        },
        age18: 'yes',
        address: getRandomAddress(),
        aboutme: chance.paragraph({sentences: 2}),
        causes: [typeOfCauses[chance.natural({min: 0, max: typeOfCauses.length - 1})]], // type of causes        skills: [chance.string(15)],
        skills: [chance.string(15)],
        events: [chance.string(15)]
    };
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


        userObjectA = getRandomVolunteerAndProfile(),
        userObjectB = getRandomVolunteerAndProfile(),
        userObjectC = getRandomVolunteerAndProfile(),
        userObjectD = getRandomVolunteerAndProfile(),
        userObjectE = getRandomVolunteerAndProfile();


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
            .post('/create_user_volunteer')
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

    describe('delete test without and with token', function () {
        var id;
        before(function (done) {
            chai.request(serverUrl)
                .post('/organizers')
                .send(organizerC)
                .set('token', token)
                .end(function (err, res) {
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