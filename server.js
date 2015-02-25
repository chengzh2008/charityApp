'use strict';

var express = require('express')
    , mongoose = require('mongoose')
    // requite routes
    , oganizerRoutes    = require('./routes/organizer_routes')
    , userRoutes        = require('./routes/users_routes')
    , volunteerRoutes   = require('./routes/volunteer_routes')
    , app               = express()
    , organizerRouter   = express.Router()
    , userRouter        = express.Router()
    , volunteerRouter   = express.Router()
    , passport          = require('passport')
    , passportStrategy  = require('./lib/passport_strat');

module.exports = {
    startServer: function () {
        app.set('appSecret', process.env.SECRET || 'thisismyuniqueserversecret');
        mongoose.connect(process.env.MONG_URI || 'mongodb://localhost/myApp_dev');
        app.use(passport.initialize());
        passportStrategy(passport);

        userRoutes(userRouter, passport, app.get('appSecret'));
        oganizerRoutes(organizerRouter, app.get('appSecret'));
        volunteerRoutes(volunteerRouter,app.get('appSecret'));

        // add routers
        app.use('/api/v1', userRouter);
        app.use('/api/v1', organizerRouter);
        app.use('/api/v1', volunteerRouter);


        app.listen(process.env.PORT || 3000, function () {
            console.log('Server is running on port ' + (process.env.PORT || 3000));
        });

    }
};


