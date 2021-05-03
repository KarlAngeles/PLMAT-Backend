const plmatRouter = require('express').Router()

plmatRouter.post('/login', async (req, res, next) => {
  console.log(req.body)
  res.json(200).end()
})

plmatRouter.get('/eligible', async (req, res, next) => {
  console.log(req)
  res.json({ eligible: false }).end()
})

module.exports = plmatRouter
