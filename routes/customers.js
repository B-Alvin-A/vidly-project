const { Customer,validateCustomer } = require('../models/customer')
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/', auth, async (req,res) => {
    res.send(await Customer.find().sort('name'))
})

router.get('/:id', auth, async (req,res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer not found")
        res.send(customer)    
})

router.post('/', auth, async (req,res) => {
    const { error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)
    
    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    await customer.save()
    res.send(customer)   
})

router.put('/:id', auth, async (req,res) => {
    const{ error } = validateCustomer(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            isGold: req.body.isGold,
            phone: req.body.phone
        },
        { new: true }        
    )
    if(!customer) return res.status(404).send("Customer ID doesn't exist")
    res.send(customer)
})

router.delete('/:id', [ auth,admin ], async (req,res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if(!customer) return res.status(404).send("Customer ID doesn't exist")
    res.send(customer)
})

module.exports = router