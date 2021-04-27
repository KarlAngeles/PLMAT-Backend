const express = require('express')
const mountRoutes = require('./routes/index')

const app = express()

app.use(express.json())
mountRoutes(app)

module.exports = app
