const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const router = require('./router/router');
const socket = require('./socketIo.js');
require('dotenv').config();
// const port = 8000;

const app = express();
app.use(express.json());
app.use(cookieParser());    // for reading cookies
const allowedOrigins = ['http://127.0.0.1:5173', 'https://blabber-alpha.vercel.app'];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

app.use(cors(corsOptions));


require("./config/db")();

app.use('/api', router);

const server = app.listen(process.env.PORT || 8000);

socket(server);