const express = require('express')
const mountRoutes = require('./routes/index')

const app = express()

// will add a util here that verifies if request contains
// access token given from this express server 
// needs to included with every request to this api

app.use(express.json())
mountRoutes(app)

module.exports = app
