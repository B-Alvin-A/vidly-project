const mongoose = require("mongoose");
const Joi = require('joi')
const passwordComplexity = require('joi-password-complexity')
const jwt = require('jsonwebtoken')
const config = require('config')

const userSchema = new mongoose.Schema({
    name: {
        type: String ,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email:{
        type: String,
        required: true,
        unique: true,
        maxlength: 255 
    },
    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 1024
    },
    isAdmin: Boolean
})

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({
        _id: this._id,
        isAdmin: this.isAdmin
    }, config.get('jwtPrivateKey'))
    return token
}

const User = new mongoose.model('users', userSchema)

const complexityOptions = {
    min: 6,
    max: 30,
    lowerCase: 1,
    upperCase: 1,
    numeric: 1,
    symbol: 1,
    requirementCount: 4
}

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        email: Joi.string().required().max(255).email(),
        password: passwordComplexity(complexityOptions).required().trim()
    })
    return schema.validate(user)
}

exports.User = User
exports.validateUser = validateUser