'use strict';

var mongoose = require('mongoose'),
    bcript = require('bcrypt-nodejs'),
    eat = require('eat'),

    userSchema = new mongoose.Schema({
        basic: {
            email: String,
            password: String
        },
        role: {type: String, enum: ['volunteer', 'organizer']} // volunteer or organizer
    });

userSchema.methods.generateHashedPassword = function (password) {
    // input for genSaltsync, the bigger, the longer it takes
    // use Sync will block other request.
    return bcript.hashSync(password, bcript.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
    return bcript.compareSync(password, this.basic.password);
};

userSchema.methods.generateToken = function (appSecret, callback) {
    eat.encode({email: this.basic.email, timestamp: new Date()}, appSecret, callback);
};

module.exports = mongoose.model('User', userSchema);

