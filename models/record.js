const mongoose = require('mongoose')
const { Schema } = mongoose

const recordSchema = new Schema({
  time_started: [String],
  time_ended: [String],
  math_score: String,
  science_score: String,
  english_score: String,
  filipino_score: String,
  abstract_score: String,
})

const Record = mongoose.model('Record', recordSchema)

module.exports = { recordSchema, Record }
