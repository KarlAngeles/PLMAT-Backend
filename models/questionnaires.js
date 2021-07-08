const mongoose = require('mongoose')
const { Schema } = mongoose

const questionnaireSchema = new Schema({
  subject: String,
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question'
  }],
  report: {
    type: Schema.Types.ObjectId,
    ref: 'Report'
  },
  answer_list: [String],
  total_time: Number,
  total_questions: Number,
  date_created: { type: Date, default: Date.now }
})

const Questionnaire = mongoose.model('Questionnaire', questionnaireSchema)

module.exports = { questionnaireSchema, Questionnaire }
