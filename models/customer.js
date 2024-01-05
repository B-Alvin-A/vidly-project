const Joi = require('joi')
const mongoose  = require('mongoose')

const Customer = mongoose.model('customers', new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    isGold:{
        type: Boolean,
        default: false
    },
    phone:{
        type: String,
        required: true,
        minlength: 10
    }
}))

function validateCustomer(customer){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(50),
        isGold: Joi.boolean(),
        phone: Joi.string().required().min(10)
    })
    return schema.validate(customer)
}

exports.Customer = Customer
exports.validateCustomer = validateCustomer
