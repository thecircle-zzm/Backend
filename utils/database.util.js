const config = require('../config/config.json')
const mongoose = require('mongoose')
const log = require('./logger.util')
const connection = process.env.MONGO || config.databases.mongo

// Connect to MongoDB
mongoose.connect(connection, {
    useNewUrlParser: true,
    useCreateIndex: true
})

// Error Handling
mongoose.connection.on('error', console.error.bind(console, 'Could not connect to ' + connection))

// Succesful connection
mongoose.connection.once('open', function () {
    log('collection' ,'Mongoose: ' + connection)
})