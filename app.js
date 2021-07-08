const express = require('express')
const config = require('./utils/config')
const mongoose =  require('mongoose')
const cors = require('cors')

const uri = `mongodb+srv://dbUser:${config.DB_PW}@plmat.q0glb.mongodb.net/${config.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'Connection Error'))
db.once('open', function() {
  console.log('Connected to database')
})

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/plmat', require('./routes/plmat/index'))
app.use('/api/admin', require('./routes/admin/index'))

module.exports = app
