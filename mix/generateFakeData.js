'use strict';

var dataGenerator = require('../lib/testDataGenerator');
var url = 'http://outcharityiosapp.herokuapp.com/api/v1/';

function generateVolueerCreateRequest(num) {
    var volunteers = [];
    for (var i = 0; i< num; i++) {
        volunteers.push(dataGenerator.getRandomVolunteerAndProfile());
        var postRequest = url + "create_user_volunteer post " + "'" + JSON.stringify(volunteers[i]) + "'";
        console.log(postRequest);
    }
    return volunteers;
}

function generateOrganizerCreateRequest(num) {
    var organizers = [];
    for (var i = 0; i< num; i++) {
        organizers.push(dataGenerator.getRandomOrganizerAndProfile());
        var postRequest = url + "create_user_organizer post " + "'" + JSON.stringify(organizers[i]) + "'";
        console.log(postRequest);
    }
    return organizers;
}

generateVolueerCreateRequest(2);
generateOrganizerCreateRequest(3);

