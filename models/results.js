const mongoose = require('mongoose')
const { Schema } = mongoose

const resultSchema = new Schema({
  test_taker: {
    type: Schema.Types.ObjectId,
    ref: 'Test Taker'
  },
  math_score: String,
  science_score: String,
  english_score: String,
  filipino_score: String,
  abstract_score: String,
})

const Result = mongoose.model('Result', resultSchema)
module.exports = { resultSchema, Result }
