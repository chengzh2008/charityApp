'use strict';

process.env.MONGO_URI = 'mongodb://localhost/volunteer_test';
require('../index.js');
var serverURL = 'localhost:3000/api/v1';
var mongoose = require('mongoose');
var chai = require('chai');
var chaihttp = require('chai-http');
var Chance = require('chance');
var chance = new Chance();
var expect = chai.expect;
chai.use(chaihttp);

function getRandomVolunteerObject() {
    var typeOfCauses = ['animal', 'education', 'Christian', 'homelessness'];
    return {
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        role: 'volunteer',
        name: {
            firstname: chance.string(15),
            lastname: chance.string(15)
        },
        ageReq: true,
        city: chance.city(),
        bio: chance.paragraph({sentences: 2}),
        causes: [typeOfCauses[chance.natural({min: 0, max: typeOfCauses.length - 1})]], // type of causes        skills: [chance.string(15)],
        skills: [chance.string(15)],
        events: [chance.string(15)]
    }
}


function getRandomUser() {
    var types = ['volunteer', 'organizer'];
    return {
        email: chance.string(10) + '@' + chance.string(5) + '.com',
        password: chance.string(30),
        role: 'volunteer' //types[chance.natural({min: 0, max: types.length-1})]
    };
}


describe('POST - Charity App, Volunteer route testing', function () {
    after(function (done) {
        mongoose.connection.db.dropDatabase(function () {
            done();
        });
    });

    var token = '';
    var userA = getRandomUser(),
        userB = getRandomUser(),
        userC = getRandomUser(),
        userD = getRandomUser(),
        userE = getRandomUser();


    var volunteerA = getRandomVolunteerObject(),
        volunteerB = getRandomVolunteerObject(),
        volunteerC = getRandomVolunteerObject(),
        volunteerD = getRandomVolunteerObject(),
        volunteerE = getRandomVolunteerObject();

    volunteerA.email = userA.email = 'ann@example.com';
    volunteerB.email = userB.email = 'bill@example.com';
    volunteerC.email = userC.email = 'cathy@example.com';
    volunteerD.email = userD.email = 'dana@example.com';
    volunteerE.email = userE.email = 'ellen@example.com';


    before(function (done) {
        chai.request(serverURL)
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

    it('POST - record value', function (done) {
        chai.request(serverURL)
            .post('/volunteer')
            .send(volunteerA)
            .set('token', token)
            .end(function (err, res) {
                expect(err).to.eql(null);
                delete res.body.__v;
                delete res.body._id;
                expect(res.body).to.eql(volunteerA);
                done();
            });
    });

    describe('PUT - Charity App, Volunteer route testing', function () {

        before(function (done) {
            chai.request(serverURL)   // create new user
                .post('/create_user')
                .send(userB)
                .end(function (err, res) {
                    token = res.body.token;

                });
            chai.request(serverURL)   // post data before updating it using PUT
                .post('/volunteer')
                .send(volunteerB)
                .set('token', token)
                .end(function (err, res) {
                    done();
                });
        });


        it('PUT - record value', function (done) {
            volunteerD.email = volunteerB.email;
            chai.request(serverURL)
                .put('/volunteer/' + volunteerB.email)
                .send(volunteerD)
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body).to.eql(volunteerD);
                    done();
                });
        });

    });


    describe('GET - Charity App, Volunteer route testing', function () {

        before(function (done) {
            chai.request(serverURL)   // create new user
                .post('/create_user')
                .send(userC)
                .end(function (err, res) {
                    token = res.body.token;

                });
            chai.request(serverURL)   // post data before updating it using PUT
                .post('/volunteer')
                .send(volunteerC)
                .set('token', token)
                .end(function (err, res) {
                    done();
                });

        });


        it('GET - record value', function (done) {
            chai.request(serverURL)
                .get('/volunteer/' + volunteerC.email)
                .set('token', token)
                .end(function (err, res) {
                    delete res.body._id;
                    delete res.body.__v;
                    expect(err).to.eql(null);
                    expect(res.body).to.eql(volunteerC);
                    done();
                });
        });

        it('GET - get other user details test ', function (done) {
            chai.request(serverURL)
                .get('/volunteer/' + volunteerA.email)
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body).to.eql({'msg': 'unauthorized request'});
                    done();
                });
        });

    });


    describe('DELETE - Charity App, Volunteer route testing', function () {

        before(function (done) {
            chai.request(serverURL)   // create new user
                .post('/create_user')
                .send(userE)
                .end(function (err, res) {
                    token = res.body.token;

                });
            chai.request(serverURL)   // post data before updating it using PUT
                .post('/volunteer')
                .send(volunteerE)
                .set('token', token)
                .end(function (err, res) {
                    done();
                });

        });


        it('DELETE - record value', function (done) {
            chai.request(serverURL)
                .delete('/volunteer/' + volunteerE.email)
                .set('token', token)
                .end(function (err, res) {
                    expect(err).to.eql(null);
                    expect(res.body[0]).to.be.undefined;
                    done();
                });
        });

    });

});
