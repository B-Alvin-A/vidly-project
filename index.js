const winston = require('winston')
const express = require('express')
const app = express()

winston.exceptions.handle(new winston.transports.File({ filename: 'uncaughtExceptions.log' }))

require('./startup/routes')(app)
require('./startup/db')()
require('./startup/config')()
require('./startup/clientDataValidation')()

const port = process.env.PORT || 7500
app.listen(port, () => console.log(`Listening on port ${port}...`))