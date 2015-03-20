'use strict';
process.env.MONG_URI = 'mongodb://localhost/charityApp_test';
require('../index');

var chai = require('chai'),
    chaihttp = require('chai-http'),
    expect = chai.expect,
    serverUrl = 'localhost:3000/api/v1',
    mongoose = require('mongoose'),
    testDataGenerator = require('../lib/testDataGenerator');

chai.use(chaihttp);

describe('create volunteer user profile and login', function () {
    var token,
        volunteerA = testDataGenerator.getRandomVolunteerAndProfile();
    volunteerA.credential.basic.email = "abc@abc.com";
    volunteerA.profileInfo.email =  "abc@abc.com";
    volunteerA.credential.basic.password = '12345';


    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    it('should create a volunteer user and return a token', function (done) {

        chai.request(serverUrl)
            .post('/create_user_volunteer')
            .send(volunteerA)
            .end(function (err, res) {
                expect(err).to.eql(null);
                expect(res.body).to.have.property('token');
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                expect(returnInfo.profileInfo).to.deep.eql(volunteerA.profileInfo);
                done();
            });
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
            });
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
            });
    });
});


describe('create organizer user profile and login', function () {
    var token,
        userId,
        organizerA = testDataGenerator.getRandomOrganizerAndProfile();
    organizerA.credential.basic.email = "def@def.com";
    organizerA.profileInfo.email =  "def@def.com";
    organizerA.credential.basic.password = '12345';


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
                expect(res.body).to.have.property('token');
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                userId= returnInfo.userId;
                expect(returnInfo.profileInfo).to.deep.eql(organizerA.profileInfo);
                done();
            });
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
            });
    });

    it('should get a organizer user profile with token', function (done) {
        chai.request(serverUrl)
            .get('/organizers/' + userId)
            .send({token: token})
            .end(function (err, res) {
                console.log('orgnizer email', organizerA.profileInfo.email, userId);
                expect(err).to.eql(null);
                var returnInfo = res.body;
                console.log('return from the server', returnInfo.email);
                delete returnInfo._id;
                delete returnInfo.__v;
                expect(returnInfo).to.deep.eql(organizerA.profileInfo);
                done();
            });
    });
});


describe('create event by organizer user', function () {
    var token,
        eventA,
        eventB,
        organizerA = testDataGenerator.getRandomOrganizerAndProfile();
    organizerA.credential.basic.email = "def@def.com";
    organizerA.profileInfo.email =  "def@def.com";
    organizerA.credential.basic.password = '12345';

    eventA = testDataGenerator.getRandomEvent();
    eventA.organizerId = organizerA.profileInfo.email;
    eventB = testDataGenerator.getRandomEvent();
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
                expect(res.body).to.have.property('token');
                var returnInfo = res.body;
                delete returnInfo.profileInfo._id;
                delete returnInfo.profileInfo.__v;
                token = returnInfo.token;
                expect(returnInfo.profileInfo).to.deep.eql(organizerA.profileInfo);
                done();
            });
    });


    it('should create an event with this organizer', function (done) {
        //console.log(eventA);
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
            });
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
                //console.log(returnInfo);
                expect(returnInfo).to.deep.eql(eventB);
                done();
            });
    });
});
