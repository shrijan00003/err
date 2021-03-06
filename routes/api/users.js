const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');



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
    User.findOne({
        email: req.body.email
    })
        .then((user) => {
            if (user) {
                return res.status(400).json({
                    email: 'Email Already Exist'
                })
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', //size
                    r: 'g',//rating
                    d: 'mm'//default
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
    const email = req.body.email;
    const password = req.body.password;

    //find user by email

    User.findOne({ email })
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    email: 'User not found'
                });
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
                                    success : true,
                                    token :'Bearer '+ token 
                                })
                        });


                    } else {
                        return res.status(400).json({
                            password: 'Password Incorrect'
                        })
                    }
                })
        })
})

module.exports = router;