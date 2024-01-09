const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const { Rental } = require('../models/rental')
const { Movie } = require('../models/movie')
const Joi = require('joi')
const validate = require('../middleware/validate')

router.post('/', [ auth,validate(validateReturn) ], async (req,res) => {
    const rental = await Rental.lookup( req.body.customerId, req.body.movieId ) 

    if (!rental) return res.status(404).send('No rental found for this customer/movie')
    if (rental.dateReturned) return res.status(400).send('Rental already processed')

    rental.return()
    await rental.save()

    const movie = await Movie.findById(rental.movie._id)
    if(!movie) return res.status(404).send('Movie for this rental not found.')
    movie.numberInStock++
    await movie.save()

    return res.send(rental)
})

function validateReturn(req){
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(req)
}

module.exports = router