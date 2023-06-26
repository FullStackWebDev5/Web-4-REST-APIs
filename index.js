const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('./public'))

app.set('view engine', 'ejs')

const Customer = mongoose.model('Customer', {
    firstName: String,
    lastName: String,
    email: String,
    phoneNumber: Number
})

app.get('/', (req, res) => {
    res.send({ message: 'All good!'})
})

app.get('/customers', (req, res) => {
    Customer.find().then((customers) => {
        res.send({ customers })
    }).catch((error) => {
        res.send({ error })
    })
})

app.post('/customers', (req, res) => {
    const { firstName, lastName, phoneNumber, email } = req.body
    const newCustomer = { firstName, lastName, phoneNumber, email }
    Customer.create(newCustomer).then(() => {
        res.send({ message: 'Customer added successfully'})
    }).catch((error) => {
        res.send({ error })
    })
})

app.patch('/customers/:id', (req, res) => {
    const { id } = req.params
    const { email } = req.body
    const updateData = { email }
    Customer.findByIdAndUpdate(id, updateData).then(() => {
        res.send({ message: 'Customer updated successfully'})
    }).catch((error) => {
        res.send({ error })
    })
})

app.delete('/customers/:id', (req, res) => {
    const { id } = req.params
    Customer.findByIdAndDelete(id).then(() => {
        res.send({ message: 'Customer deleted successfully'})
    }).catch((error) => {
        res.send({ error })
    })
})

app.listen(process.env.PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running on http://localhost:${process.env.PORT}`))
        .catch((error) => console.log(error))
})


/*
    REST: Representational State Transfer
    - Standardized representation of APIs
    - CRUD operations

    HTTP Methods:
    - GET: 'Read' data (R)
    - POST: 'Create' data (C)
    - PUT/PATCH: 'Update' data (U)
    - DELETE: 'Delete' data (D)

    ## Example for E-Commerce Website:
    - APIs for Customers 
        - R: GET /customers
        - C: POST /customers
        - U: PUT /customers/:id
        - D: DELETE /customers/:id
    - APIs for Sellers
        - R: GET /sellers
        - C: POST /sellers
        - U: PUT /sellers/:id
        - D: DELETE /sellers/:id
    - APIs for Products
        - R: GET /products
        - C: POST /products
        - U: PUT /products/:id
        - D: DELETE /products/:id
*/