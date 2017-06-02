'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const pattern = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        $regex: pattern,
        options: 'si',
        trim: true
    },
    password: {
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function (email, pass, callback) {
    User.findOne({emailAddress: email})
        .exec(function (error, user) {
            if (error) {
                return callback(error);
            } else if ( !user ) {
                const err = new Error('User not found');
                err.status = 401;
                return callback(err)
            }
            bcrypt.compare(pass, user.password, function (error, result) {
                if (result === true) {
                    return callback(null, user)
                } else {
                    return callback();
                }
            })
        });

};

UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt.hash(user.password, 10, function (err, hash) {
        if(err){
            return next(err)
        }
        user.password = hash;
        next();
    })
});

const User = mongoose.model("User", UserSchema);

module.exports = User;