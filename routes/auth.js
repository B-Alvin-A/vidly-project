const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const Joi = require('joi')
const bycrypt = require('bcrypt')

router.post('/',async (req,res) => {
    const { error } = validateUser(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    try {
        let user = await User.findOne({ email: req.body.email })
        if(!user) return res.status(400).send("Invalid Email address!!!")

        const validPassword = await bycrypt.compare(req.body.password, user.password)
        if(!validPassword) return res.status(400).send("Your Password is incorrect!!!")

        const token = user.generateAuthToken()
        res.send(token)
    } catch (error) {
        res.status(404).send(error.message)
    }
})

function validateUser(req){
    const schema = Joi.object({
        email: Joi.string().required().max(255).email(),
        password: Joi.string().required().trim()
    })
    return schema.validate(req)
}

module.exports = router