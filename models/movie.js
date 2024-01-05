const Joi = require('joi')
const mongoose  = require('mongoose')
const { genreSchema } = require('./genre')

const Movie = mongoose.model('movies', new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        maxlength: 255
    },
    genre:{
        type: genreSchema,
        required: true
    },
    numberInStock:{
        type: Number,
        required: true,
        default:0,
        min: 0,
        max: 255
    },
    dailyRentalRate:{
        type: Number,
        required: true,
        default:0,
        min: 0,
        max: 255
    }
}))

function validateMovie(movie){
    const schema = Joi.object({
        title: Joi.string().required().max(50),
        genreId: Joi.objectId().required().max(50),
        numberInStock: Joi.number().required().min(0),
        dailyRentalRate: Joi.number().required().min(0)
    })
    return schema.validate(movie)
}

exports.Movie = Movie
exports.validateMovie = validateMovie
