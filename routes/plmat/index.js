const jwt = require('jsonwebtoken')
const plmatRouter = require('express').Router()
const config = require('../../utils/config')
const plmatAuth = require('../../utils/middleware/plmatAuth')
const { Questionnaire } = require('../../models/questionnaires')
const { testTaker } = require('../../models/test_takers')

const generateAccessToken = (username) => {
  return jwt.sign(username, config.TOKEN_SECRET, { expiresIn: '86400s' }) // 1 day
}

plmatRouter.post('/login', async (req, res, next) => {
  try {
    // not properly setup as of now
    // lacking hashing with bcrypt
    const user = await testTaker.findOne({ username: req.body.username, password: req.body.password })

    if (user) {
      const token = generateAccessToken({ username: req.body.username })
      const userObject = {
        name: user.name,
        username: user.username,
        has_taken_exam: user.has_taken_exam,
        current_exam: user.current_exam,
        questionnaire: user.questionnaire_used,
        accessToken: token
      }
      res.json(userObject).end()
    } else {
      res.status(400).json({error: 'Incorrect credentials'})
    }

  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

// should change to update model
plmatRouter.get('/refresh', plmatAuth, async (req, res, next) => {
  try {
    const user = await testTaker.findOne({ username: req.body.username }).select('-password')
    const questionnaire_used = {
      questionnaire: user.questionnaire_used,
      current_exam: user.current_exam,
      has_taken_exam: user.has_taken_exam,
    }
    res.json(questionnaire_used).end()
  } catch (err) {
    console.log(err)
    res.status(400).json(err)
  }
})

plmatRouter.use('/get_questionnaire', require('./get_questionnaire'))
plmatRouter.use('/populate_questionnaire', require('./populate_questionnaire'))
plmatRouter.use('/check_questionnaire', require('./check_questionnaire'))
plmatRouter.use('/finished_exam', require('./finished_exam'))
plmatRouter.use('/record_time', require('./record_time'))

module.exports = plmatRouter
