
# charityApp [![Build Status](https://travis-ci.org/chengzh2008/charityApp.svg?branch=heroku)](https://travis-ci.org/chengzh2008/charityApp)

Created by Melissa, Zhihong (back-end team) and Annemarie, David and Clint (iOS team). Great collaboration!

## A restful web service for iOS app:
An app for organizer and volunteer to find each other easier. For this app, there are two types of users: volunteer and organizer. Organizer can create events. User can search for events match their interest and skills. User can post messages regarding a particular event and organizer can response it (Not implemented yet).

## Stacks
The server created using NodeJs/ExpressJs. Authentication is done by passport basic strategy. Testing is done with Mocha/Chai-http framework. 

## Deployment
The server is deplyed to Heroku with Mongolab datastore. 

### Endpoint urls

1) USER

    To create new volunteer     : POST - http://outcharityiosapp.herokuapp.com/api/v1/create_user_volunteer
    To create new organizer     : POST - http://outcharityiosapp.herokuapp.com/api/v1/create_user_organizer
    To sign in:    GET - http://outcharityiosapp.herokuapp.com/api/v1/sign_in
2) Volunteer (:id = email id)

    To return volunteer details : GET - http://outcharityiosapp.herokuapp.com/api/v1/volunteers/:id
    To update volunteer details : PUT - http://outcharityiosapp.herokuapp.com/api/v1/volunteers/:id
    To delete volunteer details : DELETE - http://outcharityiosapp.herokuapp.com/api/v1/volunteers/:id
    
3) Organizer (:id = email id)

    To return organizer          : GET - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id
    To return update Organizer     : PUT - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id
    To delete Organizer         : DELETE - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id
    
### JSON object:
 
#### User: 
	{
    	basic: {
        	email: 'abc@abc.com',
        	password: '12345'
    	},
    	role: 'volunteer'
	}

#### Volunteer:
	{
	    email: String,
	    role: {
	        type: String,
	        default: 'volunteer'
	    },
	    name: {
	        firstname: String,
	        lastname: String
	    },
	    ageReq: Boolean,
	    city: String,
	    bio: String,
	    causes: {
	        type: [String]
	    },
	    skills: {
	        type: [String]
	    },
	    events: {
	        type: [String]
	    },
	    avatar: String
	}
	
#### Organizer:

	{
	    email: String,
	    role: {
	        type: String,
	        default: 'organizer'
	    },
	    orgName: String,
	    firstname: String,
	    lastname: String,
	    mission: String,
	    address: String,
	    city: String,
	    phone: String,
	    type: String,
	    website: String,
	    createdSince: {
	        type: Date,
	        default: Date.now
	    },
	    events: [String]
	}

#### Event:

	{
	    eventId: String,
	    organizerId: String,
	    volunteerId: String,
	    title: String,
	    date: Date,
	    time: Date,
	    location: String,
	    description: String,
	    volunteerJobs: [{
	        _id: false,
	        title: String,
	        skills: [String]
	    }],
	    messages: [{
	        _id: false,
	        username: String,
	        body: String,
	        date: Date
	    }],
	    createdSince: {
	        type: Date,
	        default: Date.now
	    },
	    closed: Boolean
	}

  
    
   
