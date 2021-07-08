const mongoose = require('mongoose')
const { Schema } = mongoose

const questionSchema = new Schema({
  text: String,
  choices: [String],
  correct_answer: String,
  subject: String,
  difficulty: String,
  fileUrl: String,
  date_created: { type: Date, default: Date.now },
})

const Question = mongoose.model('Question', questionSchema)

module.exports = { questionSchema, Question }
