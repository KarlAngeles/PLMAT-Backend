const router = require('express').Router()
const plmatAuth = require('../../utils/middleware/plmatAuth')
const { Questionnaire } = require('../../models/questionnaires')
const { testTaker } = require('../../models/test_takers')
const { Record } = require('../../models/record')
const { Result } = require('../../models/results')
const mongoose = require('mongoose')

// Need to configure cors for this to OPTIONS request to go through and pass headers
router.post('/', async (req, res, next) => {

  try {
    const user = await testTaker.findOne({ username: req.body.data.username }).select('-password')
    const questionnaire = await Questionnaire.findById(mongoose.Types.ObjectId(req.body.data.questionnaire._id))
    const answers = req.body.data.answers
    const answers_list = new Array(questionnaire.questions.length).fill('')

    let index = 0
    for (let x in answers) {
      answers_list[index] = answers[x]
      index++
    }

    console.log(questionnaire.answer_list)
    console.log(answers_list)

    let score = 0
    for (let x = 0; x < answers_list.length; x++) {
      if (answers_list[x] == questionnaire.answer_list[x]) {
        score += 1
      }
    }

    const percentage = Math.floor((score / answers_list.length * 100))
    const scoreString = `${score}/${answers_list.length} - ${percentage}%`
    console.log(scoreString)

    const record = await Record.findById(mongoose.Types.ObjectId(user.record))

    switch (req.body.data.questionnaire.subject) {
      case "Mathematics":
        record.math_score = scoreString
        break
      case "Science":
        record.science_score = scoreString
        break
      case "English":
        record.english_score = scoreString
        break
      case "Filipino":
        record.filipino_score = scoreString
        break
      case "Abstract":
        record.abstract_score = scoreString
        break
    }

    if (record.abstract_score) {
      console.log('testing condition')
      const result = new Result({
        test_taker: user._id,
        math_score: record.math_score,
        science_score: record.science_score,
        english_score: record.english_score,
        filipino_score: record.filipino_score,
        abstract_score: record.abstract_score,
      })

      await result.save()
    }

    await record.save()

    let current = user.current_exam
    user.current_exam = current + 1
    
    await user.save()
    res.status(200).end()
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

module.exports = router
