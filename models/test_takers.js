const mongoose = require('mongoose')
const { Schema } = mongoose

const testTakerSchema = new Schema({
  username: String,
  password: String,
  name: String,
  passed: Boolean,
  has_taken_exam: Boolean,
  current_exam: Number,
  questionnaire_used: [{
    type: Schema.Types.ObjectId,
    ref: 'Questionnaire'
  }],
  record: {
    type: Schema.Types.ObjectId,
    ref: 'Record'
  }
})

const testTaker = mongoose.model('Test Taker', testTakerSchema)

module.exports = { testTakerSchema, testTaker }
