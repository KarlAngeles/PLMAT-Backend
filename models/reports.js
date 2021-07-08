const mongoose = require('mongoose')
const { Schema } = mongoose

const reportSchema = new Schema({
  benchmark: [String], 
  algorithm: String,
  total_questions: Number,
  questionnaire_quantity: Number,
  minutes_for_easy: Number,
  minutes_for_medium: Number,
  minutes_for_hard: Number,
  number_of_easy: Number,
  number_of_medium: Number,
  number_of_hard: Number,
  date_created: { type: Date, default: Date.now }
})

const Report = mongoose.model('Report', reportSchema)

module.exports = { reportSchema, Report }
