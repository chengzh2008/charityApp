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
        email: chance.string(5) + '@' + chance.string(3) + '.com',
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
            email: chance.string(3) + '@' + chance.string(3) + '.com',
            password: chance.string(5)
        },
        role: types[chance.natural({min: 0, max: types.length - 1})]
    }
}

function getRandomVolunteerAndProfile() {
    var user = getRandomUser();
    var profileInfo = getRandomVolunteerObject();
    user.role = 'volunteer';
    profileInfo.email = user.basic.email;
    return {
        credential: user,
        profileInfo: profileInfo
    }

}


function getRandomOrganizerAndProfile() {
    var user = getRandomUser();
    var profileInfo = getRandomOrganizerObject();
    user.role = 'organizer';
    profileInfo.email = user.email;
    return {
        credential: user,
        profileInfo: profileInfo
    }

}

function getRandomVolunteerObject() {
    var typeOfCauses = ['animal', 'education', 'Christian', 'homelessness'];
    return {
        email: chance.string(4) + '@' + chance.string(3) + '.com',
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
        volunteerId: '',
        title: chance.paragraph({sentences: 1}),
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

describe('create volunteer user profile and login', function () {
    var token,
        volunteerA = getRandomVolunteerAndProfile();
    volunteerA.credential.basic.email = "abc@abc.com";
    volunteerA.profileInfo.email =  "abc@abc.com";
    volunteerA.credential.basic.password = '12345';


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    it('should create a volunteer user and return a token', function (done) {
        console.log(volunteerA);

        chai.request(serverUrl)
            .post('/create_user_volunteer')
            .send(volunteerA)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token')
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                expect(returnInfo.profileInfo).to.deep.eql(volunteerA.profileInfo);
                done();
            })
    });

    it('should login as the volunteer user and return a token', function (done) {
        chai.request(serverUrl)
            .get('/sign_in')
            .auth(volunteerA.credential.basic.email, volunteerA.credential.basic.password)
            .send()
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token');
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                expect(returnInfo.profileInfo).to.deep.eql(volunteerA.profileInfo);
                done();
            })
    });

    it('should get a volunter user profile with token', function (done) {
        chai.request(serverUrl)
            .get('/volunteers/' + volunteerA.credential.basic.email)
            .send({token: token})
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnInfo = res.body;
                delete returnInfo._id;
                delete returnInfo.__v;
                expect(returnInfo).to.deep.eql(volunteerA.profileInfo);
                done();
            })
    });
});


describe('create organizer user profile and login', function () {
    var token,
        organizerA = getRandomOrganizerAndProfile();
    organizerA.credential.basic.email = "def@def.com";
    organizerA.profileInfo.email =  "def@def.com";
    organizerA.credential.basic.password = '12345';


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    it('should create a organizer user and return a token', function (done) {
        console.log(organizerA);
        chai.request(serverUrl)
            .post('/create_user_organizer')
            .send(organizerA)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token')
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                expect(returnInfo.profileInfo).to.deep.eql(organizerA.profileInfo);
                done();
            })
    });

    it('should login as the organizer user and return a token', function (done) {
        chai.request(serverUrl)
            .get('/sign_in')
            .auth(organizerA.credential.basic.email, organizerA.credential.basic.password)
            .send()
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token');
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                expect(returnInfo.profileInfo).to.deep.eql(organizerA.profileInfo);
                done();
            })
    });

    it('should get a organizer user profile with token', function (done) {
        chai.request(serverUrl)
            .get('/organizers/' + organizerA.credential.basic.email)
            .send({token: token})
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnInfo = res.body;
                delete returnInfo._id;
                delete returnInfo.__v;
                expect(returnInfo).to.deep.eql(organizerA.profileInfo);
                done();
            })
    });
});


describe('create event by organizer user', function () {
    var token,
        organizerA = getRandomOrganizerAndProfile();
    organizerA.credential.basic.email = "def@def.com";
    organizerA.profileInfo.email =  "def@def.com";
    organizerA.credential.basic.password = '12345';

    var eventA = getRandomEvent();
    eventA.organizerId = organizerA.profileInfo.email;
    var eventB = getRandomEvent();
    eventB.organizerId = organizerA.profileInfo.email;

    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    it('should create a organizer user and return a token', function (done) {
        chai.request(serverUrl)
            .post('/create_user_organizer')
            .send(organizerA)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token')
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                expect(returnInfo.profileInfo).to.deep.eql(organizerA.profileInfo);
                done();
            })
    });


    it('should create an event with this organizer', function (done) {
        console.log(eventA);
        chai.request(serverUrl)
            .post('/events')
            .set('token', token)
            .send(eventA)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnInfo = res.body;
                delete returnInfo._id;
                delete returnInfo.__v;
                expect(returnInfo).to.deep.eql(eventA);
                done();
            })
    });

    it('should create an event with this organizer', function (done) {
        chai.request(serverUrl)
            .put('/events/' + eventA.organizerId)
            .set('token', token)
            .send(eventB)
            .end(function (err, res) {
                expect(err).to.eql(null);
                var returnInfo = res.body;
                delete returnInfo._id;
                delete returnInfo.__v;
                expect(returnInfo).to.deep.eql(eventB);
                done();
            })
    });
});