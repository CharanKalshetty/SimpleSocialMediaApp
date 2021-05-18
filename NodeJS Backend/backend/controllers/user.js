const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.createUser = (req, res, next)=>{
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save().then(result=>{
            res.status(201).json({
                message: "user created", 
                result: result
            });
        }).catch(err=>{
            res.status(500).json({
                error: {
                    message: "Email already exists! Try to Login"
                }
            });
        });
    });
}

exports.userLogin = (req, res, next)=>{
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user=>{
        if (!user) {
            res.status(401).json({
                error: {
                    message: 'Invalid email/password'
                }
            });
            return;
        }
        fetchedUser=user;
        return bcrypt.compare(req.body.password, user.password);
    }).then(result=>{
        if (!result) {
            res.status(401).json({
                error: {
                    message: 'Invalid email/password'
                }
            });
            return;
        }
        const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
            process.env.JWT_KEY,
            { expiresIn: "1h" }
        );
        res.status(200).json({
            token: token,
            expiresIn: 3600,
            
            userId: fetchedUser._id
        });
    }).catch(err=>{
        res.status(401).json({
            error: {
                message: "Invalid authentication credentials"
            }
        });
    });
}