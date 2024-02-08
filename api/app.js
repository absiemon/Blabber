const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const router = require('./router/router');
const socket = require('./socketIo.js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cookieParser());    // for reading cookies
const allowedOrigins = ['https://blabber-alpha.vercel.app'];
const corsOptions = {
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type, Authorization, Cookie'
};

app.use(cors(corsOptions));


require("./config/db")();

// app.use('/', (req, res)=>{
//     return res.json({message: "Server working"})
// })
app.use('/api', router);
const port = process.env.PORT || 8000;

const server = app.listen(port);

socket(server);
