# charityApp

## A restful web service for iOS app:
An app for organizer and volunteer to find each other easier.

Endpoint urls

1) USER

    To create new volunteer     : POST - http://outcharityiosapp.herokuapp.com/api/v1/create_user_volunteer

    To create new Volunteer     : POST - http://outcharityiosapp.herokuapp.com/api/v1/create_user_organizer

    To sign in:    GET - http://outcharityiosapp.herokuapp.com/api/v1/sign_in

2) Volunteer (:id = email id)

    To return volunteer details : GET - http://outcharityiosapp.herokuapp.com/api/v1/volunteer/:id

    To update volunteer details : PUT - http://outcharityiosapp.herokuapp.com/api/v1/volunteer/:id

    To delete volunteer details : DELETE - http://outcharityiosapp.herokuapp.com/api/v1/volunteer/:id

3) Organizer (:id = email id)

    To return organizer          : GET - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id

    To return update Organizer     : PUT - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id

    To delete Organizer         : DELETE - http://outcharityiosapp.herokuapp.com/api/v1/organizers/:id