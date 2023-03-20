var jwt = require('jsonwebtoken');
const jwt_secret = "$52isu23sdw2";
const { resolve } = require("path");
const { rejects } = require("assert");

const getUserDataFromToken = (token) => {
    return new Promise((resolve, rejects) => {
        jwt.verify(token, jwt_secret, {}, async (err, userData) => {
            if (err) {
                rejects('Error occurred while verifying user');
            }
            resolve(userData);
        })
    })
}

module.exports = {getUserDataFromToken};