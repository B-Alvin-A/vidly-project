const { Movie,validateMovie } = require('../models/movie')
const { Genre } = require('../models/genre')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const asyncMiddleware = require('../middleware/async')
const admin = require('../middleware/admin')

router.get('/', asyncMiddleware(
    async (req,res) => {
        res.send(await Movie.find().sort('title'))
    }
))

router.get('/:id', asyncMiddleware(
    async (req,res) => {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).send("Movie not found")
        res.send(movie)    
    }
))

router.post('/', auth, asyncMiddleware(
    async (req,res) => {
        const {error, value} = validateMovie(req.body)
        if(error) return res.status(400).send(error.details[0].message)
    
        const genre = await Genre.findById(req.body.genreId)
        if(!genre) return res.status(400).send('Invalid Genre!!!')
        
        const movie = new Movie({
            title: req.body.title,
            genre: {
                _id: genre._id,
                name: genre.name
            },
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        })
        await movie.save()
        res.send(movie)
    }
))

router.put('/:id', auth, asyncMiddleware(
    async (req,res) => {
        const{ error } = validateMovie(req.body)
        if(error) return res.status(400).send(error.details[0].message)
    
        const genre = await Genre.findById(req.body.genreId)
        if(!genre) return res.status(400).send('Invalid Genre!!!')
    
        const movie = await Movie.findByIdAndUpdate(
            req.params.id,
            {
                title: req.body.title,
                genre:{
                    _id:genre.id,
                    name: genre.name
                },
                numberInStock: req.body.numberInStock,
                dailyRentalRate: req.body.dailyRentalRate
            },
            { new: true }        
        )
        if(!movie) return res.status(404).send("Movie ID doesn't exist")
        res.send(movie)
    }
))

router.delete('/:id', [ auth,admin ], asyncMiddleware(
    async (req,res) => {
        const movie = await Movie.findByIdAndDelete(req.params.id)
        if(!movie) return res.status(404).send("Movie ID doesn't exist")   
        res.send(movie)
    }
))

module.exports = router
