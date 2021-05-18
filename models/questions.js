const mongoose = require('mongoose')
const { Schema } = mongoose

const questionSchema = new Schema({
  text: String,
  choices: [String],
  subject: String,
  difficulty: String,
  date_created: { type: Date, default: Date.now },
})

//const Question = mongoose.model('question', questionSchema)

module.exports = mongoose.model('questions', questionSchema)
