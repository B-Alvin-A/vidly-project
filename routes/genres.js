const { Genre,validateGenre } = require('../models/genre')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/', async(req,res) => {
    throw new Error('Could Not get Genres')

    res.send(await Genre.find().sort('name'))
})

router.get('/:id', async (req,res) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).send("Genre not found")
    res.send(genre)    
})

router.post('/', auth, async (req,res) => {
    const { error } = validateGenre(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const genre = new Genre({
        name:req.body.name
    })
    await genre.save()
    res.send(genre)
})

router.put('/:id', auth, async (req,res) => {
    const{ error } = validateGenre(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        {
            name:req.body.name
        },
        { new: true }        
    )
    if(!genre) return res.status(404).send("Genre ID doesn't exist")
    res.send(genre)
})

router.delete('/:id', [ auth,admin ], async (req,res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if(!genre) return res.status(404).send("Genre ID doesn't exist")
    res.send(genre)
})

module.exports = router