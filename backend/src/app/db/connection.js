const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
const  connect  = mongoose.connect(process.env.CONNECT_MONGODB);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {db, connect};