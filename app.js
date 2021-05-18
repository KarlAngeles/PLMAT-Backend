const express = require('express')
const mountRoutes = require('./routes/index')
const config = require('./utils/config')
const mongoose =  require('mongoose')

const uri = `mongodb+srv://dbUser:${config.DB_PW}@plmat.q0glb.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', function() {
  console.log('Connected to database')
})

const app = express()
app.use(express.json())
mountRoutes(app)

module.exports = app
