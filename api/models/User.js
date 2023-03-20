const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({

    username:{ type: 'string'},
    email:{ type: 'string', unique: true},
    mobile:{type: 'string'},
    password:{ type: 'string'},
}, {timestamps: true,})

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;