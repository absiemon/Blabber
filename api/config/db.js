const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.set("strictQuery", false);
function mongoConnect() {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
    }).then(() => {
        console.log('Connected to database')
    }).catch(err => {
        throw err;
    })
}

module.exports = mongoConnect;
