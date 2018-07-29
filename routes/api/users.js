const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

//load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//for protected route
const passport = require('passport');


//loading user model
const User = require('../../models/User');

/**
 * @route GET api/users/test
 * @description Test User Route
 * @access Public
 */
router.get('/test', (req, res) => {
    res.json({
        msg: "Users works"
    })
})

/**
 * @route GET api/users/register
 * @description Register Route
 * @access Public
 */

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    //check validataion
    if (!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    })
        .then((user) => {
            if (user) {
                errors.email = "Email already Exit";
                return res.status(400).json(errors)
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',   //size
                    r: 'g',     //rating
                    d: 'mm'     //default
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });

                //using bcrypt to hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                    })
                })//end of gendsat
            }//end of else
        })
})

/**
 * @route GET api/users/login
 * @description Login user  /Return JWT Token
 * @access Public
 */

router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);
    //check validataion
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    //find user by email

    User.findOne({ email })
        .then(user => {
            if (!user) {
                errors.email = "User not found"
                return res.status(404).json(errors);
            }

            //check password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if (isMatch) {

                        //user matched
                        //  res.json({msg: 'Success'})

                        //create payload = payload is the information used for creating hash password so that can be compared later for verifying it 

                        const payload = { id: user.id, name: user.name, avatar: user.avatar }

                        //sign Token

                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            { expiresIn: 3600 },
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token
                                })
                            });


                    } else {
                        errors.password= "Password Incorrect"; 
                        return res.status(400).json(errors)
                    }
                })
        })
})

/**
 * @route GET api/users/current
 * @description Return current user 
 * @access Private
 */

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    // res.json({msg: 'Success' }) //return success message is passport authentication passed

    // res.json(req.user); //return all data of user 

    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router;