const jwt = require('jsonwebtoken')
const config = require('../utils/config')
const adminRouter = require('express').Router()
const plmadminAuth = require('../utils/middleware/plmadminAuth')
const Question = require('../models/questions')

const generateAccessToken = (username) => {
  return jwt.sign(username, config.ADMIN_TOKEN_SECRET, { expiresIn: '1800s' })
}

adminRouter.post('/login', async (req, res, next) => {
  const token = generateAccessToken({ username: req.body.username })
  const userObject = {
    username: req.body.username,
    accessToken: token
  }

  res.json(userObject).end()
})

adminRouter.get('/', plmadminAuth, async (req, res, next) => {
  console.log(req.body)
  res.status(200).end()
})

// not adding admin auth for now for testing
adminRouter.get('/question', async (req, res, next) => {
  const testQuestion = new Question({
    text: 'Folic acid is the synthetic form of which vitamin',
    choices: [
      'Vitamin A',
      'Vitamin B',
      'Vitamin C',
      'Vitamin D'
    ],
    subject: 'Science',
    difficulty: 'Hard'
  })

  try {
    await testQuestion.save()
    res.json('Exercise added')
  } catch (err) {
    res.status(400).json('Error: ' + err)
  }

  //testQuestion.save()
    //.then(() => console.log('Question added'))
    //.catch(err => console.err('Error: ' + err))
})

module.exports = adminRouter


