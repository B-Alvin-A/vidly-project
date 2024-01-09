const winston = require('winston')
const express = require('express')
const app = express()

winston.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
)

require('./startup/config')()
require('./startup/db')()
require('./startup/routes')(app)
require('./startup/clientDataValidation')()
require('./startup/prod')(app)

const port = process.env.PORT || 7500

const server = app.listen(port, () => console.log(`Listening on port ${port}...`))
module.exports = server