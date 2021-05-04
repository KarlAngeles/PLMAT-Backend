const jwt = require('jsonwebtoken')
const plmatRouter = require('express').Router()
const config = require('../utils/config')
const plmatAuth = require('../utils/middleware/plmatAuth')

const generateAccessToken = (username) => {
  return jwt.sign(username, config.TOKEN_SECRET, { expiresIn: '1800s' })
}

plmatRouter.get('/questions', plmatAuth, async (req, res, next) => {
  const content = {
    1: {
      prompt: 'what is your name?',
      choice1: 'foo',
      choice2: 'bar',
      choice3: 'baz',
      choice4: 'qurt'
    },
    2: {
      prompt: 'what is your age?',
      choice1: '10',
      choice2: '12',
      choice3: '14',
      choice4: '16'
    },
    3: {
      prompt: 'what is your hair color?',
      choice1: 'black',
      choice2: 'blue',
      choice3: 'yellow',
      choice4: 'red'
    }
  }
  res.json(content).end()
})

plmatRouter.post('/login', async (req, res, next) => {
  // does not include verification from database yet
  // and bcrypt etc.
  const token = generateAccessToken({ username: req.body.username })
  const userObject = {
    username: req.body.username,
    eligible: true,
    accessToken: token
  }

  res.json(userObject).end()
  //console.log(req.body)
  //res.json(200).end()
})

plmatRouter.get('/eligible', plmatAuth, async (req, res, next) => {
  //console.log(req.headers)
  //console.log(req.headers['authorization'])
  res.json({ eligible: true }).end()
})

module.exports = plmatRouter
