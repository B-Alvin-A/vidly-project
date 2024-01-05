const Joi = require('joi')
const mongoose  = require('mongoose')

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
})

const Genre = mongoose.model('genres', genreSchema)

function validateGenre(genre){
    const schema = Joi.object({
        name: Joi.string().required().min(5)
    })
    return schema.validate(genre)
}

exports.genreSchema = genreSchema
exports.Genre = Genre
exports.validateGenre = validateGenre