const jwt = require('jsonwebtoken')
const config = require('../../utils/config')
const adminRouter = require('express').Router()
const plmadminAuth = require('../../utils/middleware/plmadminAuth')

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

//adminRouter.get('/', plmadminAuth, async (req, res, next) => {
  //console.log(req.body)
  //res.status(200).end()
//})

//adminRouter.use('/question', require('./question'))
adminRouter.use('/generate_questionnaire', require('./generate_questionnaire'))
adminRouter.use('/checking', require('./checking'))
adminRouter.use('/generate_pdf', require('./generate_pdf'))

module.exports = adminRouter
