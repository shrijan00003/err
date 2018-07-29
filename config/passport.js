//we will create our strategy like GoogleAuth Jwt and many more

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = require('../config/keys'); //has our secrets

const opts =  {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
    passport.use(new JwtStrategy(opts, (jwt_payload,done)=>{
        // console.log(jwt_payload); //we will get user pay load of token provided
        User.findById(jwt_payload.id) 
            .then(user => {
                if(user){
                    return done(null,user); //first one is error and second one is error
                }
                return done(null, false); //if user not found
            })
            .catch(err => console.log(err));
    }))
}