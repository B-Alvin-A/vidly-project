const { Rental,validateRental } = require('../models/rental')
const { Movie } = require('../models/movie')
const { Customer } = require('../models/customer')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const asyncMiddleware = require('../middleware/async')

router.get('/', auth, asyncMiddleware(
    async (req,res)=>{
        res.send(await Rental.find().sort('-dateOut'))
    }
))

router.get('/:id', auth, asyncMiddleware(
    async (req,res)=>{
        const rental = await Rental.findById(req.params.id)
        if(!rental) return res.status(404).send('The specified rental was not found.')
        res.send(rental)
    }
))

router.post('/', [ auth,admin ], asyncMiddleware(
    async (req,res) => {
        const { error } = validateRental(req.body)
        if(error) return res.status(400).send(error.details[0].message)
    
        const customer = await Customer.findById(req.body.customerId);
        if (!customer) return res.status(400).send('Invalid customer ID!!!');
    
        const movie = await Movie.findById(req.body.movieId);
        if (!movie) return res.status(400).send('Invalid movie ID !!!');
    
        if (movie.numberInStock === 0) return res.status(400).send('Movie Out Of Stock...')
    
        const rental = new Rental({
            customer: {
                _id: customer._id,
                name: customer.name, 
                phone: customer.phone
            },
            movie: {
                _id: movie._id,
                title: movie.title,
                dailyRentalRate: movie.dailyRentalRate
            }
        })
        await rental.save();
        movie.numberInStock--
        await movie.save()
        
        res.send(rental)
    }
))

module.exports = router