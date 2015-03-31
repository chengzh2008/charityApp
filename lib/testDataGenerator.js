'use strict';
var Chance = require('chance'),
    chance = new Chance();

module.exports = {
    getRandomOrganizerObject: function () {
        var typeOfOrganizer = ['animal', 'education', 'Christian', 'homelessness'];
        return {
            email: chance.string({length: 5}) + '@' + chance.string({length: 3}) + '.com',
            role: 'organizer',
            orgName: chance.string({length: 5}),
            firstname: chance.string({length: 5}),
            lastname: chance.string({length: 5}),
            imgUrl: "http://google.com/help/hc/images/helpouts/helpouts_icon_full_color.png",
            type: typeOfOrganizer[chance.natural({min: 0, max: typeOfOrganizer.length - 1})], // type of organization
            mission: chance.paragraph({sentences: 3}),
            address: this.getRandomAddress(),
            city: chance.string({length: 5}),
            phone: chance.phone(),
            website: chance.url(),
            createdSince: new Date().toJSON(),
            events: [chance.string({length: 5}), chance.string({length: 5})]
        }
    },

    getRandomAddress: function () {
        return chance.address() + ' ' + chance.state() + ' ' + chance.zip();
    },


    getRandomUser: function () {
        var types = ['volunteer', 'organizer'];
        return {
            basic: {
                email: chance.string({length: 5}) + '@' + chance.string({length: 5}) + '.com',
                password: chance.string({length: 5})
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
            email: chance.string({length: 5}) + '@' + chance.string({length: 5}) + '.com',
            role: 'volunteer',
            name: {
                firstname: chance.string({length: 5}),
                lastname: chance.string({length: 5})
            },
            imgUrl: "http://google.com/help/hc/images/helpouts/helpouts_icon_full_color.png",
            ageReq: chance.bool(),
            city: chance.string({length:5}),
            bio: chance.paragraph({sentences:2}),
            causes: [typeOfCauses[chance.natural({min: 0, max: typeOfCauses.length - 1})]], // type of causes        skills: [chance.string(15)],
            skills: [chance.string({length: 5})],
            events: [chance.string({length: 5})]
        };
    },

    getRandomEvent: function () {
        return {
            eventId: chance.string({length: 15}),
            organizerId: chance.string({length: 15}),
            volunteerId: '',
            title: chance.paragraph({sentences: 1}),
            date: new Date().toJSON(),
            time: new Date().toJSON(),
            location: chance.string({length: 5}),
            description: chance.paragraph({sentences: 2}),
            volunteerJobs: [{
                title: chance.string(),
                skills: [chance.string({length: 5})]
            }, {
                title: chance.string(),
                skills: [chance.string({length: 5})]
            }],
            messages: [{
                username: chance.string({length: 5}),
                body: chance.paragraph({sentences: 1}),
                date: new Date().toJSON()
            }, {
                username: chance.string({length: 5}),
                body: chance.paragraph({sentences: 1}),
                date: new Date().toJSON()
            }],
            createdSince: new Date().toJSON(),
            closed: chance.bool()
        }
    }
};

