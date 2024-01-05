require('express-async-errors')
require('winston-mongodb')
const winston = require('winston')
const config = require('config')
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const home = require('./routes/home')
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const error = require('./middleware/error')
const logger = require('./startup/logging')

process.on('uncaughtException', (ex) => {
    console.log("An exception was gotten outside the express framework...")
    logger.error({
        message:ex.message,
        stack: ex.stack,
        error: ex
    })
})

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined...')
    process.exit(1)
}

mongoose.connect('mongodb://127.0.0.1/vidlyDB')
    .then(() => console.log('Connection to Vidly Database established...'))
    .catch((err) => console.error('Connection to Vidly Database failed!!!'))

app.use(express.json())
app.use('/', home)
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)
app.use('/api/users', users)
app.use('/api/auth', auth)
app.use(error)

const port = process.env.PORT || 7500
app.listen(port, () => console.log(`Listening on port ${port}...`))