'use strict';
var Chance = require('chance'),
    chance = new Chance();

module.exports = {
    getRandomOrganizerObject: function () {
        var typeOfOrganizer = ['animal', 'education', 'Christian', 'homelessness'];
        return {
            email: chance.string(5) + '@' + chance.string(3) + '.com',
            orgName: chance.string(15),
            firstname: chance.string(15),
            lastname: chance.string(15),
            type: typeOfOrganizer[chance.natural({min: 0, max: typeOfOrganizer.length - 1})], // type of organization
            mission: chance.paragraph({sentences: 3}),
            address: this.getRandomAddress(),
            city: chance.string(9),
            phone: chance.phone(),
            website: chance.url(),
            createdSince: new Date().toJSON(),
            events: [chance.string(15), chance.string(15)]
        }
    },

    getRandomAddress: function () {
        return chance.address() + ' ' + chance.state() + ' ' + chance.zip();
    },


    getRandomUser: function () {
        var types = ['volunteer', 'organizer'];
        return {
            basic: {
                email: chance.string(3) + '@' + chance.string(3) + '.com',
                password: chance.string(5)
            },
            role: types[chance.natural({min: 0, max: types.length - 1})]
        }
    },

    getRandomVolunteerAndProfile: function () {
        var user = this.getRandomUser();
        var profileInfo = this.getRandomVolunteerObject();
        user.role = 'volunteer';
        profileInfo.email = user.basic.email;
        return {
            credential: user,
            profileInfo: profileInfo
        }

    },


    getRandomOrganizerAndProfile: function () {
        var user = this.getRandomUser();
        var profileInfo = this.getRandomOrganizerObject();
        user.role = 'organizer';
        profileInfo.email = user.email;
        return {
            credential: user,
            profileInfo: profileInfo
        }

    },

    getRandomVolunteerObject: function () {
        var typeOfCauses = ['animal', 'education', 'Christian', 'homelessness'];
        return {
            email: chance.string(4) + '@' + chance.string(3) + '.com',
            name: {
                firstname: chance.string(15),
                lastname: chance.string(15)
            },
            age18: 'yes',
            address: this.getRandomAddress(),
            aboutme: chance.paragraph({sentences: 2}),
            causes: [typeOfCauses[chance.natural({min: 0, max: typeOfCauses.length - 1})]], // type of causes        skills: [chance.string(15)],
            skills: [chance.string(15)],
            events: [chance.string(15)]
        };
    },

    getRandomEvent: function () {
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
};

