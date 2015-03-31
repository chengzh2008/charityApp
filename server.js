'use strict';

var express = require('express'),
    mongoose = require('mongoose'),
    path = require('path'),
    oganizerRoutes = require('./routes/organizer_routes'),
    userRoutes = require('./routes/users_routes'),
    eventRoutes = require('./routes/event_routes'),
    volunteerRoutes = require('./routes/volunteer_routes'),
    imageRoutes = require('./routes/image_routes'),
    app = express(),
    organizerRouter = express.Router(),
    userRouter = express.Router(),
    volunteerRouter = express.Router(),
    eventRouter = express.Router(),
    imageRouter = express.Router(),
    passport = require('passport'),
    passportStrategy = require('./lib/passport_strat');

module.exports = {
    startServer: function () {
        app.set('appSecret', process.env.SECRET || 'thisismyuniqueserversecret');
        mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/myApp_dev');
        app.use(passport.initialize());
        passportStrategy(passport);


        userRoutes(userRouter, passport, app.get('appSecret'));
        oganizerRoutes(organizerRouter, app.get('appSecret'));
        volunteerRoutes(volunteerRouter, app.get('appSecret'));
        eventRoutes(eventRouter, app.get('appSecret'));
        imageRoutes(imageRouter, app.get('appSecret'));

        // add routers
        app.use('/api/v1', userRouter);
        app.use('/api/v1', organizerRouter);
        app.use('/api/v1', volunteerRouter);
        app.use('/api/v1', eventRouter);
        app.use('/api/v1', imageRouter);
        app.use(express.static(path.join(__dirname, 'build')));
        app.listen(process.env.PORT || 3000, function () {
            console.log('Server is running on port ' + (process.env.PORT || 3000));
        });

    }
};


