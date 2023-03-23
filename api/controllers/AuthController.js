const User = require("../models/User.js");
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const jwt_secret = process.env.JWT_SECRET;
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const {getUserDataFromToken} = require('../config/verify.js')

//register login
module.exports.register = async(req, res) => {
    const { username, email, mobile, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(password, salt);
        await User.create({ username, email, mobile, password: secPassword }).then((data) => {
            res.status(200).json({msg:"user created successfully"});
        }).catch((err) => {
            res.status(422).json(err);
        });
    }
    catch (err) {
        res.status(422).json(err);
    }
}

// login router
module.exports.login = async(req, res) => {
    const { username , password } = req.body;
    try {
        const user = await User.findOne({ username });
        if(user){
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (passwordCompare) {
                jwt.sign({ email: user.email, id: user._id, username: user.username, }, process.env.JWT_SECRET, {}, (err, token) => {
                    if (err) {
                        res.status(422).json(err);
                    }
                    const obj  = {
                        _id : user._id,
                        username : user.username,
                        email : user.email,
                        mobile : user.mobile
                    }
                    return res.cookie('token', token).json(obj);
                })
            }
            else {
                return res.status(400).json({ error: "Soory cannot login! please try loginin with correct credential" });
            }
        }
        else {
            return res.status(404).json({ error: "User not found" });
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
}

module.exports.getProfile = async(req, res) => {
    const { token } = req.cookies;
    try{
        if (token) {
            await getUserDataFromToken(token).then(async (data) => {
                await User.findById(data.id, { password: 0 }).then((user) => {
                    res.json(user);
                })
            }).catch((error) => {
                res.status(422).json(err);
            })
        }
        else {
            res.status(401).json(null);
        }
    }
    catch (err) {
        res.status(422).json(err);
    }
}

module.exports.getAllUsers = async(req, res) => {
    const keyword = req.query.search ? {
        $or: [
            {username: {$regex: req.query.search , $options: 'i'}},
            {email: {$regex: req.query.search, $options: 'i'}}
        ]
    }
    :{};
    try{
        const { token } = req.cookies;
        const userData = await getUserDataFromToken(token);
    
        const user = await User.find(keyword).find({ _id : {$ne: userData.id}}).select("-password");
        res.json(user);
    }
    catch(err){
        res.status(422).json(err);
    }

}

module.exports.logout = async(req, res) => {
    try {
        res.clearCookie('token');
        res.json(true);
    } catch (error) {
        res.status(422).json(err);
    }
}