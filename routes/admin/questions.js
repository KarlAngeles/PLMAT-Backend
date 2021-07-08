const router = require('express').Router()
const plmadminAuth = require('../../utils/middleware/plmadminAuth')
const Question = require('../../models/questions')

// not adding admin auth for now for testing
router.get('/', plmadminAuth, async (req, res, next) => {

  try {
    const questions = await Question.find()
    res.json(questions)
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

router.post('/add', async (req, res, next) => {
  const text = req.body.text
  const choices = req.body.choices
  const subject = req.body.subject
  const difficulty = req.body.difficulty
  
  const testQuestion = new Question({
    text,
    choices,
    subject,
    difficulty
  })

  try {
    await testQuestion.save()
    res.json('Exercise added')
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }
})

module.exports = router
