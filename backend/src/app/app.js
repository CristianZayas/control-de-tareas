const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./routers/router');
const app =  express();
require('dotenv').config();
const {db} = require('./db/connection');
const cookieParser = require('cookie-parser'); // Necesitarás este middleware en tu app Express

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

app.use(cors(
    {
        origin: ['http://localhost:4200', 'https://tudominio.com'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
      }
));
app.use(morgan('dev'));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser()); //  Usar cookieParser 
app.use('/api/v1', router);

module.exports = {app};